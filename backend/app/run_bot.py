"""
Точка входа ТОЛЬКО для бота (GitHub Actions).
Никакого uvicorn — только aiogram polling.
"""
import asyncio
import logging

from app.bot.instance import bot
from app.bot.dispatcher import build_dispatcher
from app.database import engine

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("everart.bot")

async def main():
    dp = build_dispatcher()
    log.info("🦇 Бот EverArt запускается...")
    try:
        await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())
    finally:
        await bot.session.close()
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())