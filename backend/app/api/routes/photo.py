"""Прокси фото из Telegram по file_id с корректным MIME."""
import logging
import mimetypes
import time

import aiohttp
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.config import BOT_TOKEN, TELEGRAM_API

log = logging.getLogger("everart.photo")
router = APIRouter(prefix="/api", tags=["photo"])

# Кэш: file_id -> (file_path, expires_at)
_path_cache: dict[str, tuple[str, float]] = {}
CACHE_TTL = 50 * 60   # 50 минут (Telegram держит file_path ~1 час)

_EXTRA_TYPES = {
    ".jpg":  "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png":  "image/png",
    ".webp": "image/webp",
    ".gif":  "image/gif",
    ".heic": "image/heic",
}


def _guess_mime(file_path: str) -> str:
    """Определяет MIME по расширению из file_path."""
    lower = file_path.lower()
    for ext, mime in _EXTRA_TYPES.items():
        if lower.endswith(ext):
            return mime
    guessed, _ = mimetypes.guess_type(file_path)
    return guessed or "image/jpeg"


async def _get_file_path(session: aiohttp.ClientSession, file_id: str) -> str:
    now = time.time()
    cached = _path_cache.get(file_id)
    if cached and cached[1] > now:
        return cached[0]

    async with session.get(
        f"{TELEGRAM_API}/getFile", params={"file_id": file_id}
    ) as r:
        data = await r.json()

    if not data.get("ok"):
        log.warning("Telegram getFile failed: %s", data.get("description"))
        raise HTTPException(
            404, f"Telegram: {data.get('description', 'файл не найден')}"
        )

    file_path = data["result"]["file_path"]
    _path_cache[file_id] = (file_path, now + CACHE_TTL)
    return file_path


@router.get("/photo/{file_id}")
async def get_photo(file_id: str):
    timeout = aiohttp.ClientTimeout(total=15)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        file_path = await _get_file_path(session, file_id)
        file_url = f"https://api.telegram.org/file/bot{BOT_TOKEN}/{file_path}"

        async with session.get(file_url) as r:
            if r.status != 200:
                raise HTTPException(404, "Не удалось скачать файл из Telegram")

            content_type = _guess_mime(file_path)

            return StreamingResponse(
                r.content.iter_chunked(64 * 1024),
                media_type=content_type,
                headers={
                    "Cache-Control": "public, max-age=86400, immutable",
                    "Content-Disposition": "inline",
                },
            )