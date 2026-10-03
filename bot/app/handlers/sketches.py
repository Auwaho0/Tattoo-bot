"""Просмотр эскизов со скидкой в боте."""
from aiogram import Router, F
from aiogram.types import CallbackQuery
from sqlalchemy import select

from app.database import async_session
from app.models import Sketch
from app.keyboards import main_menu

router = Router()


@router.callback_query(F.data == "sketches")
async def show(callback: CallbackQuery):
    async with async_session() as session:
        sketches = (await session.execute(
            select(Sketch).order_by(Sketch.created_at.desc()).limit(10)
        )).scalars().all()

    if not sketches:
        await callback.message.edit_text(
            "📭 Эскизов пока нет.", reply_markup=main_menu()
        )
        await callback.answer()
        return

    await callback.message.edit_text("🖤 <b>Эскизы со скидкой</b>")
    for s in sketches:
        icon = "🟢" if s.status == "free" else "🔴"
        caption = (
            f"<b>{s.title}</b>\n"
            f"📏 {s.size} | 📍 {s.placement}\n"
            f"💰 <s>{s.old_price} ₽</s> → <b>{s.new_price} ₽</b>\n"
            f"{icon} {s.status}"
        )
        await callback.message.answer_photo(s.photo_file_id, caption=caption)

    await callback.message.answer("Выбери действие:", reply_markup=main_menu())
    await callback.answer()