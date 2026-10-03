"""Модели БД EverArt Tattoo (SQLAlchemy 2.0)."""
from datetime import datetime
from sqlalchemy import (
    BigInteger, String, Text, Integer, DateTime, func
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class Work(Base):
    """Работа в портфолио."""
    __tablename__ = "works"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(128))
    size: Mapped[str] = mapped_column(String(64))
    placement: Mapped[str] = mapped_column(String(128))
    duration: Mapped[str] = mapped_column(String(64))
    price: Mapped[int] = mapped_column(Integer)
    photo_file_id: Mapped[str] = mapped_column(String(256))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

class Sketch(Base):
    """Эскиз со скидкой."""
    __tablename__ = "sketches"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(128))
    size: Mapped[str] = mapped_column(String(64))
    placement: Mapped[str] = mapped_column(String(128))
    old_price: Mapped[int] = mapped_column(Integer)
    new_price: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String(16), default="free")  # free | sold
    photo_file_id: Mapped[str] = mapped_column(String(256))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

class Booking(Base):
    """Заявка на сеанс."""
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(128))
    size: Mapped[str] = mapped_column(String(64))
    placement: Mapped[str] = mapped_column(String(128))
    dates: Mapped[str] = mapped_column(String(256))
    budget: Mapped[int] = mapped_column(Integer)
    photo_file_id: Mapped[str | None] = mapped_column(String(256), nullable=True)
    user_id: Mapped[str] = mapped_column(String(64))
    status: Mapped[str] = mapped_column(String(16), default="new")  # new | done
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )