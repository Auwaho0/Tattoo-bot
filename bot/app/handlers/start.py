"""Обработчики команды /start и главного меню."""
from aiogram import Router, F
from aiogram.filters import CommandStart
from aiogram.types import Message, CallbackQuery

from app.keyboards import main_menu
from app.texts import MAIN_MENU
from app.config import ADMIN_ID

router = Router()

@router.message(CommandStart())
async def cmd_start(message: Message):
    
    text = ""
    if message.from_user.id == ADMIN_ID:
        text += "\n\n⚰️ Ты вошёл как <b>мастер</b>. /admin — панель."
    

    """Приветствие и главное меню."""
    await message.answer(
        f"🖤 Приветствую, {message.from_user.full_name}!\n\n" + MAIN_MENU + text,
        reply_markup=main_menu(),
        parse_mode="HTML"
    )

@router.callback_query(F.data == "main_menu")
async def back_to_main(callback: CallbackQuery):
    """Возврат в главное меню."""
    await callback.message.edit_text(
        MAIN_MENU,
        reply_markup=main_menu(),
        parse_mode="HTML"
    )
    await callback.answer()
    