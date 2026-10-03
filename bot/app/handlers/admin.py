"""
Админ-панель: загрузка, редактирование, удаление работ и эскизов, заявки.
Все изменения — только здесь (бэкенд их не принимает).
"""
from aiogram import Router, F
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import Message, CallbackQuery
from sqlalchemy import select

from app.config import ADMIN_ID
from app.database import async_session
from app.models import Work, Sketch, Booking
from app.keyboards import (
    admin_menu, works_list_kb, sketches_list_kb,
    work_manage_kb, sketch_manage_kb, confirm_delete_kb,
    cancel_kb, skip_kb, sketch_status_kb,
)
from app import texts as T

router = Router()


def is_admin(user_id: int) -> bool:
    return user_id == ADMIN_ID


# =========================================================
# FSM
# =========================================================
class WorkForm(StatesGroup):
    photo = State()
    title = State()
    size = State()
    placement = State()
    duration = State()
    price = State()
    description = State()


class SketchForm(StatesGroup):
    photo = State()
    title = State()
    size = State()
    placement = State()
    old_price = State()
    new_price = State()
    status = State()


class EditForm(StatesGroup):
    waiting_value = State()
    waiting_photo = State()


# =========================================================
# /admin и возврат в меню
# =========================================================
@router.message(Command("admin"))
async def cmd_admin(message: Message, state: FSMContext):
    if not is_admin(message.from_user.id):
        return
    await state.clear()
    await message.answer(T.ADMIN_GREET, reply_markup=admin_menu())


@router.callback_query(F.data == "admin_menu")
async def admin_menu_cb(callback: CallbackQuery, state: FSMContext):
    if not is_admin(callback.from_user.id):
        return
    await state.clear()
    try:
        await callback.message.edit_caption(
            caption=T.ADMIN_GREET, reply_markup=admin_menu()
        )
    except Exception:
        await callback.message.answer(T.ADMIN_GREET, reply_markup=admin_menu())
    await callback.answer()


@router.callback_query(F.data == "admin_cancel")
async def admin_cancel(callback: CallbackQuery, state: FSMContext):
    if not is_admin(callback.from_user.id):
        return
    await state.clear()
    try:
        await callback.message.edit_caption(caption=T.CANCEL, reply_markup=admin_menu())
    except Exception:
        await callback.message.answer(T.CANCEL, reply_markup=admin_menu())
    await callback.answer()


# =========================================================
# Добавление работы
# =========================================================
@router.callback_query(F.data == "admin_add_work")
async def add_work_start(callback: CallbackQuery, state: FSMContext):
    if not is_admin(callback.from_user.id):
        return
    await state.set_state(WorkForm.photo)
    await callback.message.edit_text(T.WORK_PHOTO, reply_markup=cancel_kb())
    await callback.answer()


@router.message(WorkForm.photo, F.photo)
async def w_photo(message: Message, state: FSMContext):
    if not is_admin(message.from_user.id):
        return
    await state.update_data(photo_file_id=message.photo[-1].file_id)
    await state.set_state(WorkForm.title)
    await message.answer(T.WORK_TITLE)


@router.message(WorkForm.title)
async def w_title(message: Message, state: FSMContext):
    await state.update_data(title=message.text.strip())
    await state.set_state(WorkForm.size)
    await message.answer(T.WORK_SIZE)


@router.message(WorkForm.size)
async def w_size(message: Message, state: FSMContext):
    await state.update_data(size=message.text.strip())
    await state.set_state(WorkForm.placement)
    await message.answer(T.WORK_PLACEMENT)


@router.message(WorkForm.placement)
async def w_placement(message: Message, state: FSMContext):
    await state.update_data(placement=message.text.strip())
    await state.set_state(WorkForm.duration)
    await message.answer(T.WORK_DURATION)


@router.message(WorkForm.duration)
async def w_duration(message: Message, state: FSMContext):
    await state.update_data(duration=message.text.strip())
    await state.set_state(WorkForm.price)
    await message.answer(T.WORK_PRICE)


@router.message(WorkForm.price)
async def w_price(message: Message, state: FSMContext):
    if not message.text.isdigit():
        await message.answer("⚠️ Введи число.")
        return
    await state.update_data(price=int(message.text))
    await state.set_state(WorkForm.description)
    await message.answer(T.WORK_DESC, reply_markup=skip_kb())


@router.message(WorkForm.description)
async def w_desc(message: Message, state: FSMContext):
    desc = None if message.text.strip() == "—" else message.text.strip()
    await _save_work(message, state, desc)


@router.callback_query(WorkForm.description, F.data == "admin_skip")
async def w_skip(callback: CallbackQuery, state: FSMContext):
    await _save_work(callback.message, state, None, edit=True)
    await callback.answer()


async def _save_work(m: Message, state: FSMContext, description, edit: bool = False):
    data = await state.get_data()
    async with async_session() as session:
        work = Work(
            title=data["title"],
            size=data["size"],
            placement=data["placement"],
            duration=data["duration"],
            price=data["price"],
            photo_file_id=data["photo_file_id"],
            description=description,
        )
        session.add(work)
        await session.commit()
        await session.refresh(work)

    await state.clear()
    text = f"🖤 Работа <b>#{work.id}</b> «{work.title}» добавлена."
    if edit:
        await m.edit_text(text)
        await m.answer(T.ADMIN_GREET, reply_markup=admin_menu())
    else:
        await m.answer(text, reply_markup=admin_menu())


# =========================================================
# Добавление эскиза
# =========================================================
@router.callback_query(F.data == "admin_add_sketch")
async def add_sketch_start(callback: CallbackQuery, state: FSMContext):
    if not is_admin(callback.from_user.id):
        return
    await state.set_state(SketchForm.photo)
    await callback.message.edit_text(T.SK_PHOTO, reply_markup=cancel_kb())
    await callback.answer()


@router.message(SketchForm.photo, F.photo)
async def s_photo(message: Message, state: FSMContext):
    if not is_admin(message.from_user.id):
        return
    await state.update_data(photo_file_id=message.photo[-1].file_id)
    await state.set_state(SketchForm.title)
    await message.answer(T.SK_TITLE)


@router.message(SketchForm.title)
async def s_title(message: Message, state: FSMContext):
    await state.update_data(title=message.text.strip())
    await state.set_state(SketchForm.size)
    await message.answer(T.SK_SIZE)


@router.message(SketchForm.size)
async def s_size(message: Message, state: FSMContext):
    await state.update_data(size=message.text.strip())
    await state.set_state(SketchForm.placement)
    await message.answer(T.SK_PLACEMENT)


@router.message(SketchForm.placement)
async def s_placement(message: Message, state: FSMContext):
    await state.update_data(placement=message.text.strip())
    await state.set_state(SketchForm.old_price)
    await message.answer(T.SK_OLD)


@router.message(SketchForm.old_price)
async def s_old(message: Message, state: FSMContext):
    if not message.text.isdigit():
        await message.answer("⚠️ Введи число.")
        return
    await state.update_data(old_price=int(message.text))
    await state.set_state(SketchForm.new_price)
    await message.answer(T.SK_NEW)


@router.message(SketchForm.new_price)
async def s_new(message: Message, state: FSMContext):
    if not message.text.isdigit():
        await message.answer("⚠️ Введи число.")
        return
    await state.update_data(new_price=int(message.text))
    await state.set_state(SketchForm.status)
    await message.answer(T.SK_STATUS, reply_markup=sketch_status_kb())


@router.callback_query(SketchForm.status, F.data.startswith("sketch_status_"))
async def s_status(callback: CallbackQuery, state: FSMContext):
    status = "free" if callback.data.endswith("free") else "sold"
    data = await state.get_data()
    async with async_session() as session:
        sketch = Sketch(
            title=data["title"],
            size=data["size"],
            placement=data["placement"],
            old_price=data["old_price"],
            new_price=data["new_price"],
            status=status,
            photo_file_id=data["photo_file_id"],
        )
        session.add(sketch)
        await session.commit()
        await session.refresh(sketch)

    await state.clear()
    await callback.message.edit_text(
        f"🖤 Эскиз <b>#{sketch.id}</b> «{sketch.title}» добавлен ({status})."
    )
    await callback.message.answer(T.ADMIN_GREET, reply_markup=admin_menu())
    await callback.answer()


# =========================================================
# Списки
# =========================================================
@router.callback_query(F.data == "admin_manage_works")
async def manage_works(callback: CallbackQuery, state: FSMContext):
    if not is_admin(callback.from_user.id):
        return
    await state.clear()
    async with async_session() as session:
        works = (await session.execute(
            select(Work).order_by(Work.created_at.desc()).limit(30)
        )).scalars().all()

    if not works:
        try:
            await callback.message.edit_text("📭 Работ пока нет.", reply_markup=admin_menu())
        except Exception:
            await callback.message.answer("📭 Работ пока нет.", reply_markup=admin_menu())
        await callback.answer()
        return

    text = "🖼 <b>Выбери работу:</b>"
    try:
        await callback.message.edit_text(text, reply_markup=works_list_kb(works))
    except Exception:
        await callback.message.answer(text, reply_markup=works_list_kb(works))
    await callback.answer()


@router.callback_query(F.data == "admin_manage_sketches")
async def manage_sketches(callback: CallbackQuery, state: FSMContext):
    if not is_admin(callback.from_user.id):
        return
    await state.clear()
    async with async_session() as session:
        sketches = (await session.execute(
            select(Sketch).order_by(Sketch.created_at.desc()).limit(30)
        )).scalars().all()

    if not sketches:
        try:
            await callback.message.edit_text("📭 Эскизов пока нет.", reply_markup=admin_menu())
        except Exception:
            await callback.message.answer("📭 Эскизов пока нет.", reply_markup=admin_menu())
        await callback.answer()
        return

    text = "🖤 <b>Выбери эскиз:</b>"
    try:
        await callback.message.edit_text(text, reply_markup=sketches_list_kb(sketches))
    except Exception:
        await callback.message.answer(text, reply_markup=sketches_list_kb(sketches))
    await callback.answer()


# =========================================================
# Карточка работы
# =========================================================
@router.callback_query(F.data.startswith("admin_w_"))
async def open_work(callback: CallbackQuery, state: FSMContext):
    if not is_admin(callback.from_user.id):
        return
    await state.clear()
    work_id = int(callback.data.rsplit("_", 1)[1])

    async with async_session() as session:
        work = await session.get(Work, work_id)
    if not work:
        await callback.answer("Работа не найдена", show_alert=True)
        return

    text = (
        f"🖼 <b>#{work.id} · {work.title}</b>\n"
        f"📏 {work.size} | 📍 {work.placement}\n"
        f"⏱ {work.duration} | 💰 {work.price} ₽\n"
        f"📝 {work.description or '—'}"
    )
    try:
        await callback.message.delete()
    except Exception:
        pass
    await callback.message.answer_photo(
        work.photo_file_id, caption=text, reply_markup=work_manage_kb(work.id)
    )
    await callback.answer()


# =========================================================
# Карточка эскиза
# =========================================================
@router.callback_query(F.data.startswith("admin_s_"))
async def open_sketch(callback: CallbackQuery, state: FSMContext):
    if not is_admin(callback.from_user.id):
        return
    await state.clear()
    sketch_id = int(callback.data.rsplit("_", 1)[1])

    async with async_session() as session:
        sketch = await session.get(Sketch, sketch_id)
    if not sketch:
        await callback.answer("Эскиз не найден", show_alert=True)
        return

    icon = "🟢 Свободен" if sketch.status == "free" else "🔴 Продан"
    text = (
        f"🖤 <b>#{sketch.id} · {sketch.title}</b>\n"
        f"📏 {sketch.size} | 📍 {sketch.placement}\n"
        f"💰 {sketch.old_price} → {sketch.new_price} ₽\n{icon}"
    )
    try:
        await callback.message.delete()
    except Exception:
        pass
    await callback.message.answer_photo(
        sketch.photo_file_id, caption=text,
        reply_markup=sketch_manage_kb(sketch.id, sketch.status),
    )
    await callback.answer()


# =========================================================
# Изменение полей работы
# =========================================================
@router.callback_query(F.data.startswith("ew_"))
async def edit_work_field(callback: CallbackQuery, state: FSMContext):
    if not is_admin(callback.from_user.id):
        return
    parts = callback.data.split("_")
    field = parts[1]
    work_id = int(parts[-1])

    if field == "photo":
        await state.set_state(EditForm.waiting_photo)
        await state.update_data(kind="work", target_id=work_id)
        await callback.message.answer("🖼 Пришли новое фото работы.")
    else:
        await state.set_state(EditForm.waiting_value)
        await state.update_data(kind="work", target_id=work_id, field=field)
        label = T.FIELD_LABELS.get(field, field)
        await callback.message.answer(f"✏️ Введи новое значение: «{label}».")
    await callback.answer()


# =========================================================
# Изменение полей эскиза
# =========================================================
@router.callback_query(F.data.startswith("es_"))
async def edit_sketch_field(callback: CallbackQuery, state: FSMContext):
    if not is_admin(callback.from_user.id):
        return
    parts = callback.data.split("_")
    sub = parts[1]           # title | old | new
    sketch_id = int(parts[-1])

    field = {"title": "title", "old": "old_price", "new": "new_price"}[sub]
    await state.set_state(EditForm.waiting_value)
    await state.update_data(kind="sketch", target_id=sketch_id, field=field)
    label = T.FIELD_LABELS.get(field, field)
    await callback.message.answer(f"✏️ Введи новое значение: «{label}».")
    await callback.answer()


# =========================================================
# Универсальный обработчик EditForm.waiting_value
# =========================================================
@router.message(EditForm.waiting_value)
async def save_field(message: Message, state: FSMContext):
    if not is_admin(message.from_user.id):
        return
    data = await state.get_data()
    kind = data["kind"]
    target_id = data["target_id"]
    field = data["field"]
    raw = message.text.strip() if message.text else ""

    numeric = field in ("price", "old_price", "new_price")
    if numeric:
        if not raw.isdigit():
            await message.answer("⚠️ Введи число.")
            return
        value = int(raw)
    else:
        value = raw or None

    async with async_session() as session:
        if kind == "work":
            obj = await session.get(Work, target_id)
        else:
            obj = await session.get(Sketch, target_id)
        if not obj:
            await message.answer("Объект не найден.")
            await state.clear()
            return
        setattr(obj, field, value)
        await session.commit()

    await state.clear()
    label = T.FIELD_LABELS.get(field, field)
    await message.answer(f"✅ Поле «{label}» обновлено.", reply_markup=admin_menu())


# =========================================================
# Универсальный обработчик EditForm.waiting_photo
# =========================================================
@router.message(EditForm.waiting_photo, F.photo)
async def save_photo(message: Message, state: FSMContext):
    if not is_admin(message.from_user.id):
        return
    data = await state.get_data()
    target_id = data["target_id"]
    file_id = message.photo[-1].file_id

    async with async_session() as session:
        work = await session.get(Work, target_id)
        if not work:
            await message.answer("Работа не найдена.")
            await state.clear()
            return
        work.photo_file_id = file_id
        await session.commit()

    await state.clear()
    await message.answer("✅ Фото обновлено.", reply_markup=admin_menu())


# =========================================================
# Toggle статуса эскиза
# =========================================================
@router.callback_query(F.data.startswith("ts_"))
async def toggle_sketch_status(callback: CallbackQuery):
    if not is_admin(callback.from_user.id):
        return
    sketch_id = int(callback.data.rsplit("_", 1)[1])

    async with async_session() as session:
        sketch = await session.get(Sketch, sketch_id)
        if not sketch:
            await callback.answer("Эскиз не найден", show_alert=True)
            return
        sketch.status = "sold" if sketch.status == "free" else "free"
        new_status = sketch.status
        title, size, placement = sketch.title, sketch.size, sketch.placement
        old_price, new_price = sketch.old_price, sketch.new_price
        await session.commit()

    icon = "🟢 Свободен" if new_status == "free" else "🔴 Продан"
    await callback.message.edit_caption(
        caption=(
            f"🖤 <b>#{sketch_id} · {title}</b>\n"
            f"📏 {size} | 📍 {placement}\n"
            f"💰 {old_price} → {new_price} ₽\n{icon}"
        ),
        reply_markup=sketch_manage_kb(sketch_id, new_status),
    )
    await callback.answer("Статус обновлён")


# =========================================================
# Удаление работы
# =========================================================
@router.callback_query(F.data.startswith("dw_"))
async def ask_delete_work(callback: CallbackQuery):
    if not is_admin(callback.from_user.id):
        return
    work_id = int(callback.data.rsplit("_", 1)[1])
    await callback.message.edit_caption(
        caption="💀 Точно удалить работу? Это необратимо.",
        reply_markup=confirm_delete_kb("work", work_id),
    )
    await callback.answer()


# =========================================================
# Удаление эскиза
# =========================================================
@router.callback_query(F.data.startswith("ds_"))
async def ask_delete_sketch(callback: CallbackQuery):
    if not is_admin(callback.from_user.id):
        return
    sketch_id = int(callback.data.rsplit("_", 1)[1])
    await callback.message.edit_caption(
        caption="💀 Точно удалить эскиз? Это необратимо.",
        reply_markup=confirm_delete_kb("sketch", sketch_id),
    )
    await callback.answer()


@router.callback_query(F.data.startswith("confirm_del_"))
async def do_delete(callback: CallbackQuery):
    if not is_admin(callback.from_user.id):
        return
    # confirm_del_<kind>_<id>
    parts = callback.data.split("_")
    kind = parts[2]
    obj_id = int(parts[3])

    async with async_session() as session:
        if kind == "work":
            obj = await session.get(Work, obj_id)
        else:
            obj = await session.get(Sketch, obj_id)
        if obj:
            await session.delete(obj)
            await session.commit()

    await callback.message.edit_caption(caption=f"🗑 Удалено (#{obj_id}).")
    await callback.message.answer(T.ADMIN_GREET, reply_markup=admin_menu())
    await callback.answer()


# =========================================================
# Заявки
# =========================================================
@router.callback_query(F.data == "admin_bookings")
async def list_bookings(callback: CallbackQuery):
    if not is_admin(callback.from_user.id):
        return
    async with async_session() as session:
        bookings = (await session.execute(
            select(Booking).order_by(Booking.created_at.desc()).limit(20)
        )).scalars().all()

    if not bookings:
        try:
            await callback.message.edit_text("📭 Заявок пока нет.", reply_markup=admin_menu())
        except Exception:
            await callback.message.answer("📭 Заявок пока нет.", reply_markup=admin_menu())
        await callback.answer()
        return

    lines = ["📋 <b>Последние заявки:</b>\n"]
    for b in bookings:
        lines.append(
            f"<b>#{b.id}</b> — {b.name} | {b.size} | {b.placement}\n"
            f"  🗓 {b.dates} | 💰 {b.budget} ₽ | 👤 {b.user_id}\n"
        )
    text = "\n".join(lines)
    try:
        await callback.message.edit_text(text, reply_markup=admin_menu())
    except Exception:
        await callback.message.answer(text, reply_markup=admin_menu())
    await callback.answer()