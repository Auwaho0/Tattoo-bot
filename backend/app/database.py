"""Асинхронное подключение к БД."""
from sqlalchemy.ext.asyncio import (
    create_async_engine, async_sessionmaker, AsyncSession
)
from app.config import DATABASE_URL

# pool_pre_ping — чтобы Render не убивал «висящие» коннекты
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=5,
)

async_session = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def get_session() -> AsyncSession:
    """FastAPI Depends"""
    async with async_session() as session:
        yield session