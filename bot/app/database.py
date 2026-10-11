"""Подключение к БД (миграции — на бэкенде)."""
import ssl
from sqlalchemy.ext.asyncio import (
    create_async_engine, async_sessionmaker, AsyncSession
)
from app.config import DATABASE_URL

# asyncpg не понимает sslmode в URL. SSL передаём через connect_args.
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_size=3,
    max_overflow=2,
    connect_args={
        "ssl": ssl_context,
        "statement_cache_size": 0,   # обязательно для пулера Neon
    },
)

async_session = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)