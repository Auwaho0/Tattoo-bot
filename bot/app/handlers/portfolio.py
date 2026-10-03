"""Просмотр портфолио в боте."""
from aiogram import Router, F
from aiogram.types import CallbackQuery
from sqlalchemy import select

from app.database import async_session
from app.models import Work
from app.keyboards import main_menu

router = Router()


@router.callback_query(F.data == "portfolio")
async def show(callback: CallbackQuery):
    async with async_session() as session:
        works = (await session.execute(
            select(Work).order_by(Work.created_at.desc()).limit(10)
        )).scalars().all()

    if not works:
        await callback.message.edit_text(
            "📭 Портфолио пока пусто.", reply_markup=main_menu()
        )
        await callback.answer()
        return

    await callback.message.edit_text("📸 <b>Портфолио</b>")
    for w in works:
        caption = (
            f"<b>{w.title}</b>\n"
            f"📏 {w.size} | 📍 {w.placement}\n"
            f"⏱ {w.duration} | 💰 {w.price} ₽"
        )
        if w.description:
            caption += f"\n\n{w.description}"
        await callback.message.answer_photo(w.photo_file_id, caption=caption)

    await callback.message.answer("Выбери действие:", reply_markup=main_menu())
    await callback.answer()