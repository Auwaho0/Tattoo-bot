"""POST /api/note — приём заявки с фронта + пуш мастеру."""
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import Booking
from app.schemas import BookingCreate, BookingOut
from app.bot_client import notify_admin

router = APIRouter(prefix="/api", tags=["bookings"])


@router.post("/note", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
async def create_note(
    data: BookingCreate,
    session: AsyncSession = Depends(get_session),
):
    booking = Booking(**data.model_dump())
    session.add(booking)
    await session.commit()
    await session.refresh(booking)

    text = (
        f"🖤 <b>Новая заявка (Web) #{booking.id}</b>\n\n"
        f"👤 {booking.name}\n"
        f"📏 {booking.size}\n"
        f"📍 {booking.placement}\n"
        f"🗓 {booking.dates}\n"
        f"💰 {booking.budget} ₽\n"
        f"🆔 {booking.user_id}"
    )
    await notify_admin(text, booking.photo_file_id)
    return booking