"""Обработчики раздела «Уход за тату»."""
from mailbox import Message

from aiogram import Router, F
from aiogram.types import CallbackQuery
from aiogram.filters import Command

from app.keyboards import aftercare_menu
from app.texts import (
    AFTERCARE_24H, AFTERCARE_WEEK1, AFTERCARE_WEEK2,
    AFTERCARE_FORBIDDEN, AFTERCARE_PROBLEM
)

router = Router()

@router.callback_query(F.data == "aftercare")
async def show_aftercare(callback: CallbackQuery):
    """Меню ухода."""
    await callback.message.edit_text(
        "📜 <b>Уход за тату</b>\n\nВыберите этап:",
        reply_markup=aftercare_menu(),
        parse_mode="HTML"
    )
    await callback.answer()

@router.callback_query(F.data == "care_24h")
async def care_24h(callback: CallbackQuery):
    await callback.message.edit_text(
        AFTERCARE_24H,
        reply_markup=aftercare_menu(),
        parse_mode="HTML"
    )
    await callback.answer()

@router.callback_query(F.data == "care_week1")
async def care_week1(callback: CallbackQuery):
    await callback.message.edit_text(
        AFTERCARE_WEEK1,
        reply_markup=aftercare_menu(),
        parse_mode="HTML"
    )
    await callback.answer()

@router.callback_query(F.data == "care_week2")
async def care_week2(callback: CallbackQuery):
    await callback.message.edit_text(
        AFTERCARE_WEEK2,
        reply_markup=aftercare_menu(),
        parse_mode="HTML"
    )
    await callback.answer()

@router.callback_query(F.data == "care_forbidden" )
async def care_forbidden(callback: CallbackQuery):
    await callback.message.edit_text(
        AFTERCARE_FORBIDDEN,
        reply_markup=aftercare_menu(),
        parse_mode="HTML"
    )
    await callback.answer()

@router.callback_query(F.data == "care_problem")
async def care_problem(callback: CallbackQuery):
    await callback.message.edit_text(
        AFTERCARE_PROBLEM,
        reply_markup=aftercare_menu(),
        parse_mode="HTML"
    )
    await callback.answer()




# ============ КОМАНДЫ (Message) ============

@router.message(Command("care"))
async def care_cmd(message: Message):
    """Отправляет шпаргалку по команде /care."""
    await message.answer(
        AFTERCARE_FORBIDDEN,
        reply_markup=aftercare_menu(),
        parse_mode="HTML"
    )


@router.message(Command("care24"))
async def care_24_cmd(message: Message):
    """Отправляет шпаргалку за первые 24 часа."""
    from app.texts import AFTERCARE_24H
    await message.answer(AFTERCARE_24H, parse_mode="HTML")


@router.message(Command("care_help"))
async def care_help(message: Message):
    """Список доступных команд ухода."""
    await message.answer(
        "📜 <b>Команды ухода за тату</b>\n\n"
        "/care — что нельзя делать\n"
        "/care24 — первые 24 часа\n"
        "/care_help — этот список",
        parse_mode="HTML"
    )