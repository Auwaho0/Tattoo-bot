"""
Прокси фото из Telegram по file_id.

Проблема: Telegram CDN отдаёт файлы с Content-Type: application/octet-stream,
из-за чего браузер не отображает картинку в <img>, а пытается её скачать.

Решение: определяем MIME по расширению файла из file_path (Telegram всегда
возвращает путь вида photos/file_123.jpg), а не по заголовку ответа.
"""
import logging
import mimetypes
import time

import aiohttp
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.config import BOT_TOKEN, TELEGRAM_API

log = logging.getLogger("everart.photo")
router = APIRouter(prefix="/api", tags=["photo"])

# In-memory кэш: file_id -> (file_path, expires_at)
# file_path от Telegram живёт ~1 час. Кэшируем на 50 минут.
_path_cache: dict[str, tuple[str, float]] = {}
CACHE_TTL = 50 * 60

# Явный словарь MIME для популярных расширений Telegram.
# mimetypes.guess_type() на slim-образе Python может не знать про webp/heic.
_EXTRA_TYPES = {
    ".jpg":  "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png":  "image/png",
    ".webp": "image/webp",
    ".gif":  "image/gif",
    ".heic": "image/heic",
    ".heif": "image/heif",
}


def _guess_mime(file_path: str) -> str:
    """
    Определяет MIME-тип картинки по расширению из file_path.
    Пример: 'photos/file_123.jpg' -> 'image/jpeg'
    """
    lower = file_path.lower()

    # Сначала явный словарь
    for ext, mime in _EXTRA_TYPES.items():
        if lower.endswith(ext):
            return mime

    # Затем стандартный mimetypes — на случай нестандартных расширений
    guessed, _ = mimetypes.guess_type(file_path)
    if guessed and guessed.startswith("image/"):
        return guessed

    # Fallback: Telegram всегда отдаёт картинки, но если всё сломалось —
    # отдаём как jpeg, это безопаснее чем application/octet-stream.
    return "image/jpeg"


async def _get_file_path(session: aiohttp.ClientSession, file_id: str) -> str:
    """
    Возвращает file_path из Telegram getFile, с кэшем на 50 минут.
    file_path — временный URL-путь, живёт ~1 час.
    """
    now = time.time()
    cached = _path_cache.get(file_id)
    if cached and cached[1] > now:
        return cached[0]

    async with session.get(
        f"{TELEGRAM_API}/getFile",
        params={"file_id": file_id},
    ) as r:
        data = await r.json()

    if not data.get("ok"):
        desc = data.get("description", "файл не найден")
        log.warning("Telegram getFile failed for %s: %s", file_id[:30], desc)
        raise HTTPException(404, f"Telegram: {desc}")

    file_path = data["result"]["file_path"]
    _path_cache[file_id] = (file_path, now + CACHE_TTL)
    return file_path


@router.get("/photo/{file_id}")
async def get_photo(file_id: str):
    """
    Стримит картинку из Telegram браузеру.
    Корректный Content-Type + inline + суточный кэш.
    """
    timeout = aiohttp.ClientTimeout(total=15)

    async with aiohttp.ClientSession(timeout=timeout) as session:
        # 1. Получаем путь к файлу (с кэшем)
        file_path = await _get_file_path(session, file_id)
        file_url = f"https://api.telegram.org/file/bot{BOT_TOKEN}/{file_path}"

        # 2. Скачиваем и стримим клиенту
        async with session.get(file_url) as r:
            if r.status != 200:
                raise HTTPException(404, "Не удалось скачать файл из Telegram")

            content_type = _guess_mime(file_path)
            log.info("Serving %s as %s", file_path, content_type)

            return StreamingResponse(
                r.content.iter_chunked(64 * 1024),
                media_type=content_type,
                headers={
                    # Суточный кэш в браузере — Telegram-файл неизменен
                    "Cache-Control": "public, max-age=86400, immutable",
                    # «Показывай», а не «скачивай»
                    "Content-Disposition": "inline",
                },
            )