"""Инлайн-клавиатуры бота EverArt Tattoo."""
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils.keyboard import InlineKeyboardBuilder


def main_menu() -> InlineKeyboardMarkup:
    """Главное меню бота."""
    keyboard = [
        [
            InlineKeyboardButton(text="📸 Портфолио", callback_data="portfolio"),
            InlineKeyboardButton(text="🖤 Эскизы со скидкой", callback_data="sketches"),
        ],
        [
            InlineKeyboardButton(text="👤 Обо мне", callback_data="about"),
            InlineKeyboardButton(text="📞 Контакты", callback_data="contacts"),
        ],
        [
            InlineKeyboardButton(text="📜 Уход за тату", callback_data="aftercare"),
            InlineKeyboardButton(text="🎨 Стили и цены", callback_data="prices"),
        ],
        [
            InlineKeyboardButton(text="✍️ Записаться", callback_data="booking"),
        ],
    ]
    return InlineKeyboardMarkup(inline_keyboard=keyboard)


def back_button() -> InlineKeyboardMarkup:
    """Кнопка «Назад» в главное меню."""
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🔙 Назад", callback_data="main_menu")]
    ])


def portfolio_styles() -> InlineKeyboardMarkup:
    """Выбор стиля в портфолио."""
    styles = ["Blackwork", "Gothic", "Ornamental", "Realism", "Dotwork", "Cover-up"]
    buttons = [
        [InlineKeyboardButton(text=style, callback_data=f"portfolio_{style.lower()}")]
        for style in styles
    ]
    buttons.append([InlineKeyboardButton(text="🔙 Назад", callback_data="main_menu")])
    return InlineKeyboardMarkup(inline_keyboard=buttons)


def work_actions(work_id: int) -> InlineKeyboardMarkup:
    """Кнопки под работой в портфолио."""
    return InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="❤️ В избранное", callback_data=f"fav_{work_id}"),
            InlineKeyboardButton(text="✍️ Хочу такую", callback_data=f"want_{work_id}"),
        ],
        [InlineKeyboardButton(text="🔙 Назад", callback_data="portfolio")],
    ])


def sketch_actions(sketch_id: int) -> InlineKeyboardMarkup:
    """Кнопки под эскизом со скидкой."""
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="💀 Забронировать", callback_data=f"book_sketch_{sketch_id}")],
        [InlineKeyboardButton(text="🔙 Назад", callback_data="sketches")],
    ])


def aftercare_menu() -> InlineKeyboardMarkup:
    """Меню ухода за тату."""
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🕐 В день после сеанса", callback_data="care_24h")],
        [InlineKeyboardButton(text="📅 День 2–7", callback_data="care_week1")],
        [InlineKeyboardButton(text="🗓 Неделя 2–4", callback_data="care_week2")],
        [InlineKeyboardButton(text="🚫 Что нельзя", callback_data="care_forbidden")],
        [InlineKeyboardButton(text="⚠️ Проблема?", callback_data="care_problem")],
        [InlineKeyboardButton(text="🔙 Назад", callback_data="main_menu")],
    ])


def admin_menu() -> InlineKeyboardMarkup:
    """Меню админ-панели мастера."""
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="➕ Добавить работу", callback_data="admin_add_work")],
        [InlineKeyboardButton(text="➕ Добавить эскиз", callback_data="admin_add_sketch")],
        [InlineKeyboardButton(text="🖼 Управление работами", callback_data="admin_manage_works")],
        [InlineKeyboardButton(text="🖤 Управление эскизами", callback_data="admin_manage_sketches")],
        [InlineKeyboardButton(text="📋 Заявки", callback_data="admin_bookings")],
        [InlineKeyboardButton(text="📢 Рассылка", callback_data="admin_broadcast")],
        [InlineKeyboardButton(text="📊 Статистика", callback_data="admin_stats")],
        [InlineKeyboardButton(text="🔙 В меню", callback_data="main_menu")],
    ])


def admin_menu() -> InlineKeyboardMarkup:
    kb = InlineKeyboardBuilder()
    kb.button(text="➕ Добавить работу", callback_data="admin_add_work")
    kb.button(text="➕ Добавить эскиз", callback_data="admin_add_sketch")
    kb.button(text="🖼 Управление работами", callback_data="admin_manage_works")
    kb.button(text="🖤 Управление эскизами", callback_data="admin_manage_sketches")
    kb.button(text="📋 Заявки", callback_data="admin_bookings")
    kb.adjust(1)
    return kb.as_markup()


def works_list_kb(works: list) -> InlineKeyboardMarkup:
    kb = InlineKeyboardBuilder()
    for w in works:
        kb.button(text=f"#{w.id} · {w.title}", callback_data=f"admin_w_{w.id}")
    kb.button(text="🔙 В админ-меню", callback_data="admin_menu")
    kb.adjust(1)
    return kb.as_markup()


def sketches_list_kb(sketches: list) -> InlineKeyboardMarkup:
    kb = InlineKeyboardBuilder()
    for s in sketches:
        icon = "🟢" if s.status == "free" else "🔴"
        kb.button(text=f"{icon} #{s.id} · {s.title}", callback_data=f"admin_s_{s.id}")
    kb.button(text="🔙 В админ-меню", callback_data="admin_menu")
    kb.adjust(1)
    return kb.as_markup()


def work_manage_kb(work_id: int) -> InlineKeyboardMarkup:
    kb = InlineKeyboardBuilder()
    kb.button(text="✏️ Название", callback_data=f"ew_title_{work_id}")
    kb.button(text="📏 Размер", callback_data=f"ew_size_{work_id}")
    kb.button(text="📍 Место", callback_data=f"ew_placement_{work_id}")
    kb.button(text="⏱ Длительность", callback_data=f"ew_duration_{work_id}")
    kb.button(text="💰 Цена", callback_data=f"ew_price_{work_id}")
    kb.button(text="📝 Описание", callback_data=f"ew_description_{work_id}")
    kb.button(text="🖼 Заменить фото", callback_data=f"ew_photo_{work_id}")
    kb.button(text="🗑 Удалить работу", callback_data=f"dw_{work_id}")
    kb.button(text="🔙 К списку", callback_data="admin_manage_works")
    kb.adjust(2, 2, 2, 1, 1)
    return kb.as_markup()


def sketch_manage_kb(sketch_id: int, current_status: str) -> InlineKeyboardMarkup:
    kb = InlineKeyboardBuilder()
    toggle = (
        "🔴 Пометить проданным"
        if current_status == "free"
        else "🟢 Вернуть в продажу"
    )
    kb.button(text=toggle, callback_data=f"ts_{sketch_id}")
    kb.button(text="✏️ Название", callback_data=f"es_title_{sketch_id}")
    kb.button(text="💰 Старая цена", callback_data=f"es_old_{sketch_id}")
    kb.button(text="💸 Новая цена", callback_data=f"es_new_{sketch_id}")
    kb.button(text="🗑 Удалить эскиз", callback_data=f"ds_{sketch_id}")
    kb.button(text="🔙 К списку", callback_data="admin_manage_sketches")
    kb.adjust(1, 3, 1, 1)
    return kb.as_markup()


def confirm_delete_kb(kind: str, obj_id: int) -> InlineKeyboardMarkup:
    back = f"admin_{'w' if kind == 'work' else 's'}_{obj_id}"
    kb = InlineKeyboardBuilder()
    kb.button(text="💀 Да, удалить", callback_data=f"confirm_del_{kind}_{obj_id}")
    kb.button(text="↩️ Отмена", callback_data=back)
    kb.adjust(2)
    return kb.as_markup()


def cancel_kb() -> InlineKeyboardMarkup:
    kb = InlineKeyboardBuilder()
    kb.button(text="❌ Отмена", callback_data="admin_cancel")
    return kb.as_markup()


def skip_kb() -> InlineKeyboardMarkup:
    kb = InlineKeyboardBuilder()
    kb.button(text="⏭ Пропустить", callback_data="admin_skip")
    kb.button(text="❌ Отмена", callback_data="admin_cancel")
    kb.adjust(2)
    return kb.as_markup()


def sketch_status_kb() -> InlineKeyboardMarkup:
    kb = InlineKeyboardBuilder()
    kb.button(text="🟢 Свободен", callback_data="sketch_status_free")
    kb.button(text="🔴 Продан", callback_data="sketch_status_sold")
    kb.adjust(2)
    return kb.as_markup()