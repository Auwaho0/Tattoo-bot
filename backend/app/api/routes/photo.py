"""
Прокси фото из Telegram по file_id.
Читаем файл в память — так надёжнее, чем StreamingResponse + aiohttp.
"""
import logging
import mimetypes
import time

import aiohttp
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from app.config import BOT_TOKEN, TELEGRAM_API

log = logging.getLogger("everart.photo")
router = APIRouter(prefix="/api", tags=["photo"])

# In-memory кэш: file_id -> (file_path, expires_at)
_path_cache: dict[str, tuple[str, float]] = {}
CACHE_TTL = 50 * 60

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
    lower = file_path.lower()
    for ext, mime in _EXTRA_TYPES.items():
        if lower.endswith(ext):
            return mime
    guessed, _ = mimetypes.guess_type(file_path)
    if guessed and guessed.startswith("image/"):
        return guessed
    return "image/jpeg"


async def _get_file_path(session: aiohttp.ClientSession, file_id: str) -> str:
    now = time.time()
    cached = _path_cache.get(file_id)
    if cached and cached[1] > now:
        return cached[0]

    url = f"{TELEGRAM_API}/getFile"
    async with session.get(url, params={"file_id": file_id}) as r:
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
    Скачивает фото из Telegram и отдаёт браузеру.
    Файл целиком в памяти — фото тату < 5 МБ, это ок.
    """
    timeout = aiohttp.ClientTimeout(total=20)

    try:
        async with aiohttp.ClientSession(timeout=timeout) as session:
            file_path = await _get_file_path(session, file_id)
            file_url = f"https://api.telegram.org/file/bot{BOT_TOKEN}/{file_path}"

            async with session.get(file_url) as r:
                if r.status != 200:
                    body = await r.text()
                    log.warning("Telegram file download failed %s: %s", r.status, body[:200])
                    raise HTTPException(
                        502, f"Telegram вернул {r.status}"
                    )

                # Читаем содержимое в память — сессия закроется после
                content = await r.read()
                content_type = _guess_mime(file_path)
                log.info("Serving %s (%d bytes) as %s", file_path, len(content), content_type)

    except aiohttp.ClientError as e:
        log.exception("aiohttp error for file_id=%s", file_id[:30])
        raise HTTPException(502, f"Ошибка сети: {type(e).__name__}")
    except HTTPException:
        raise
    except Exception as e:
        log.exception("Unexpected error for file_id=%s", file_id[:30])
        raise HTTPException(500, f"Внутренняя ошибка: {type(e).__name__}")

    return Response(
        content=content,
        media_type=content_type,
        headers={
            "Cache-Control": "public, max-age=86400, immutable",
            "Content-Disposition": "inline",
        },
    )