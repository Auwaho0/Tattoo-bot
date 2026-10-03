"""
Экспортирует FastAPI-приложение как `app`.
Render запускает: uvicorn app.main:app --host 0.0.0.0 --port $PORT
"""
from app.api.app import app  # noqa: F401