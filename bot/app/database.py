"""Подключение к БД (миграции — на бэкенде)."""
from sqlalchemy.ext.asyncio import (
    create_async_engine, async_sessionmaker, AsyncSession
)
from app.config import DATABASE_URL

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_size=3,
    max_overflow=2,
)

async_session = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)