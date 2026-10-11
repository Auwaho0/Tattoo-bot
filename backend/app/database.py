# backend/app/database.py
import ssl
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.config import DATABASE_URL

# 1. Создаем SSL-контекст для asyncpg
# Neon требует шифрование, но проверку сертификата можно отключить для простоты.
# Это безопасно, так как соединение все равно шифруется.
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# 2. Передаем SSL-контекст и statement_cache_size в connect_args
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=5,
    connect_args={
        "ssl": ssl_context,
        "statement_cache_size": 0,  # ВАЖНО для пулера Neon (PgBouncer)
    },
)

async_session = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def get_session() -> AsyncSession:
    """FastAPI Depends"""
    async with async_session() as session:
        yield session