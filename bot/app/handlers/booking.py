"""FSM-запись клиента. По финалу — заявка в БД + пуш мастеру."""
from aiogram import Router, F
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import Message, CallbackQuery

from app.config import ADMIN_ID
from app.database import async_session
from app.models import Booking
from app.keyboards import main_menu, skip_kb
from app.texts import (
    BOOK_NAME, BOOK_SIZE, BOOK_PLACEMENT, BOOK_DATES,
    BOOK_BUDGET, BOOK_REF, BOOK_DONE, CANCEL,
)

router = Router()


class BookingForm(StatesGroup):
    name = State()
    size = State()
    placement = State()
    dates = State()
    budget = State()
    reference = State()


@router.callback_query(F.data == "booking")
async def start(callback: CallbackQuery, state: FSMContext):
    await state.set_state(BookingForm.name)
    await callback.message.edit_text(BOOK_NAME)
    await callback.answer()


@router.message(BookingForm.name)
async def step_name(m: Message, state: FSMContext):
    await state.update_data(name=m.text.strip())
    await state.set_state(BookingForm.size)
    await m.answer(BOOK_SIZE)


@router.message(BookingForm.size)
async def step_size(m: Message, state: FSMContext):
    await state.update_data(size=m.text.strip())
    await state.set_state(BookingForm.placement)
    await m.answer(BOOK_PLACEMENT)


@router.message(BookingForm.placement)
async def step_placement(m: Message, state: FSMContext):
    await state.update_data(placement=m.text.strip())
    await state.set_state(BookingForm.dates)
    await m.answer(BOOK_DATES)


@router.message(BookingForm.dates)
async def step_dates(m: Message, state: FSMContext):
    await state.update_data(dates=m.text.strip())
    await state.set_state(BookingForm.budget)
    await m.answer(BOOK_BUDGET)


@router.message(BookingForm.budget)
async def step_budget(m: Message, state: FSMContext):
    if not m.text.isdigit():
        await m.answer("⚠️ Введи число.")
        return
    await state.update_data(budget=int(m.text))
    await state.set_state(BookingForm.reference)
    await m.answer(BOOK_REF, reply_markup=skip_kb())


@router.message(BookingForm.reference, F.photo)
async def step_ref_photo(m: Message, state: FSMContext):
    await state.update_data(photo_file_id=m.photo[-1].file_id)
    await _finish(m, state)


@router.message(BookingForm.reference, F.text)
async def step_ref_text(m: Message, state: FSMContext):
    await state.update_data(photo_file_id=None)
    await _finish(m, state)


@router.callback_query(BookingForm.reference, F.data == "admin_skip")
async def step_ref_skip(callback: CallbackQuery, state: FSMContext):
    await state.update_data(photo_file_id=None)
    await callback.message.edit_text("Ок, без референса.")
    await _finish(callback.message, state, from_user=callback.from_user)
    await callback.answer()


@router.callback_query(BookingForm.reference, F.data == "admin_cancel")
async def booking_cancel(callback: CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.edit_text(CANCEL, reply_markup=main_menu())
    await callback.answer()


async def _finish(m: Message, state: FSMContext, from_user=None):
    data = await state.get_data()
    user = from_user or m.from_user

    async with async_session() as session:
        booking = Booking(
            name=data["name"],
            size=data["size"],
            placement=data["placement"],
            dates=data["dates"],
            budget=data["budget"],
            photo_file_id=data.get("photo_file_id"),
            user_id=str(user.id),
        )
        session.add(booking)
        await session.commit()
        await session.refresh(booking)

    text = (
        f"🖤 <b>Новая заявка #{booking.id}</b>\n\n"
        f"👤 {booking.name}\n"
        f"📏 {booking.size}\n"
        f"📍 {booking.placement}\n"
        f"🗓 {booking.dates}\n"
        f"💰 {booking.budget} ₽\n"
        f"🆔 @{user.username or 'нет'} ({user.id})"
    )
    try:
        if booking.photo_file_id:
            await m.bot.send_photo(ADMIN_ID, booking.photo_file_id, caption=text)
        else:
            await m.bot.send_message(ADMIN_ID, text)
    except Exception:
        pass

    await state.clear()
    await m.answer(BOOK_DONE, reply_markup=main_menu())