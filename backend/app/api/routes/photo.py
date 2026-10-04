"""Проксирование фото из Telegram по file_id."""
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import aiohttp
from app.config import BOT_TOKEN, TELEGRAM_API

router = APIRouter(prefix="/api", tags=["photo"])


@router.get("/photo/{file_id}")
async def get_photo(file_id: str):
    """Получает файл из Telegram и стримит браузеру."""
    timeout = aiohttp.ClientTimeout(total=15)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        # 1. Узнаём путь к файлу
        async with session.get(f"{TELEGRAM_API}/getFile", params={"file_id": file_id}) as r:
            data = await r.json()
        if not data.get("ok"):
            raise HTTPException(404, "Файл не найден в Telegram")

        file_path = data["result"]["file_path"]
        file_url = f"https://api.telegram.org/file/bot{BOT_TOKEN}/{file_path}"

        # 2. Стримим сам файл
        async with session.get(file_url) as r:
            if r.status != 200:
                raise HTTPException(404, "Не удалось скачать файл")
            return StreamingResponse(
                r.content.iter_chunked(64 * 1024),
                media_type=r.headers.get("Content-Type", "image/jpeg"),
                headers={"Cache-Control": "public, max-age=86400"},
            ) 