"""Конфигурация бота."""
import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN: str = os.getenv("BOT_TOKEN", "")
ADMIN_ID: int = int(os.getenv("ADMIN_ID", "0"))
DATABASE_URL: str = os.getenv("DATABASE_URL", "")

if not BOT_TOKEN:
    raise RuntimeError("BOT_TOKEN не задан")
if not ADMIN_ID:
    raise RuntimeError("ADMIN_ID не задан")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL не задан")