# config.py
import os
from dotenv import load_dotenv

load_dotenv()  # загружает .env в переменные окружения

BOT_TOKEN = os.getenv("BOT_TOKEN")
ADMIN_ID = int(os.getenv("ADMIN_ID", 0))