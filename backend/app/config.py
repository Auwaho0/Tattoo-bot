"""Конфигурация бэкенда EverArt Tattoo (загрузка из .env)."""
import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN: str = os.getenv("BOT_TOKEN", "")
ADMIN_ID: int = int(os.getenv("ADMIN_ID", "0"))
DATABASE_URL: str = os.getenv("DATABASE_URL", "")
CORS_ORIGINS: list[str] = [
    o.strip() for o in os.getenv("CORS_ORIGINS", "*").split(",") if o.strip()
]

# Базовый URL Telegram Bot API (используется в bot_client.py)
TELEGRAM_API: str = f"https://api.telegram.org/bot{BOT_TOKEN}"

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL не задан")
if not BOT_TOKEN:
    raise RuntimeError("BOT_TOKEN не задан")
if not ADMIN_ID:
    raise RuntimeError("ADMIN_ID не задан")