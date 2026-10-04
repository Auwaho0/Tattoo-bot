"""
Прокси фото из Telegram по file_id.
Фронт зовёт GET /api/photo/{file_id} — получает картинку байтами.
BOT_TOKEN наружу не утекает.
"""
import logging
import time

import aiohttp
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.config import BOT_TOKEN, TELEGRAM_API

log = logging.getLogger("everart.photo")
router = APIRouter(prefix="/api", tags=["photo"])

# Простой кэш: file_id -> (file_path, expires_at)
# file_path от Telegram живёт ~1 час. Кэшируем на 50 минут.
_path_cache: dict[str, tuple[str, float]] = {}
CACHE_TTL = 50 * 60   # 50 минут


async def _get_file_path(session: aiohttp.ClientSession, file_id: str) -> str:
    """Возвращает file_path из Telegram, с кэшем."""
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
        raise HTTPException(404, f"Telegram: {data.get('description', 'файл не найден')}")

    file_path = data["result"]["file_path"]
    _path_cache[file_id] = (file_path, now + CACHE_TTL)
    return file_path


@router.get("/photo/{file_id}")
async def get_photo(file_id: str):
    """Стримит картинку из Telegram, с кэшем в браузере на сутки."""
    timeout = aiohttp.ClientTimeout(total=15)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        file_path = await _get_file_path(session, file_id)
        file_url = f"https://api.telegram.org/file/bot{BOT_TOKEN}/{file_path}"

        async with session.get(file_url) as r:
            if r.status != 200:
                raise HTTPException(404, "Не удалось скачать файл из Telegram")

            content_type = r.headers.get("Content-Type", "image/jpeg")

            return StreamingResponse(
                r.content.iter_chunked(64 * 1024),
                media_type=content_type,
                headers={
                    # Суточный кэш в браузере — Telegram сам кэширует файл на CDN
                    "Cache-Control": "public, max-age=86400, immutable",
                },
            )