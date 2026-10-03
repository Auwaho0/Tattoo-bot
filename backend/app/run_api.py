"""Точка входа ТОЛЬКО для API (локально). На Render — uvicorn CLI."""
import uvicorn
from app.config import API_HOST, API_PORT

if __name__ == "__main__":
    uvicorn.run(
        "app.api.app:app",
        host=API_HOST,
        port=API_PORT,
        reload=False,
        log_level="info",
    )