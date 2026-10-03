"""Стили и цены."""
from aiogram import Router, F
from aiogram.types import CallbackQuery
from app.keyboards import back_button
from app.texts import PRICES_TEXT

router = Router()

@router.callback_query(F.data == "prices")
async def show_prices(callback: CallbackQuery):
    await callback.message.edit_text(
        PRICES_TEXT, reply_markup=back_button(), parse_mode="HTML"
    )
    await callback.answer()