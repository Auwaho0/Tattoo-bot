"""Контакты."""
from aiogram import Router, F
from aiogram.types import CallbackQuery
from app.keyboards import back_button
from app.texts import CONTACTS_TEXT

router = Router()

@router.callback_query(F.data == "contacts")
async def show_contacts(callback: CallbackQuery):
    await callback.message.edit_text(
        CONTACTS_TEXT, reply_markup=back_button(), parse_mode="HTML"
    )
    await callback.answer()