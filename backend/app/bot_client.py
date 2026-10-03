"""Отправка уведомлений мастеру через Telegram Bot API (HTTP, без aiogram)."""
import logging
import aiohttp
from app.config import BOT_TOKEN, ADMIN_ID, TELEGRAM_API

log = logging.getLogger("everart.bot_client")


async def notify_admin(text: str, photo_file_id: str | None = None) -> None:
    """Шлёт сообщение мастеру. Не валит запрос при ошибке."""
    if not BOT_TOKEN or not ADMIN_ID:
        return
    try:
        timeout = aiohttp.ClientTimeout(total=8)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            if photo_file_id:
                url = f"{TELEGRAM_API}/sendPhoto"
                payload = {
                    "chat_id": ADMIN_ID,
                    "photo": photo_file_id,
                    "caption": text,
                    "parse_mode": "HTML",
                }
            else:
                url = f"{TELEGRAM_API}/sendMessage"
                payload = {
                    "chat_id": ADMIN_ID,
                    "text": text,
                    "parse_mode": "HTML",
                }
            async with session.post(url, json=payload) as resp:
                if resp.status != 200:
                    body = await resp.text()
                    log.warning("Telegram API %s: %s", resp.status, body)
    except Exception as e:
        log.warning("Не удалось отправить уведомление: %s", e)