"""Обо мне."""
from aiogram import Router, F
from aiogram.types import CallbackQuery
from app.keyboards import back_button
from app.texts import ABOUT_TEXT

router = Router()

@router.callback_query(F.data == "about")
async def show_about(callback: CallbackQuery):
    await callback.message.edit_text(
        ABOUT_TEXT, reply_markup=back_button(), parse_mode="HTML"
    )
    await callback.answer()