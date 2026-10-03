"""Модели БД (совпадают с backend/app/models.py)."""
from datetime import datetime
from sqlalchemy import String, Text, Integer, DateTime, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class Work(Base):
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
    __tablename__ = "sketches"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(128))
    size: Mapped[str] = mapped_column(String(64))
    placement: Mapped[str] = mapped_column(String(128))
    old_price: Mapped[int] = mapped_column(Integer)
    new_price: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String(16), default="free")
    photo_file_id: Mapped[str] = mapped_column(String(256))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(128))
    size: Mapped[str] = mapped_column(String(64))
    placement: Mapped[str] = mapped_column(String(128))
    dates: Mapped[str] = mapped_column(String(256))
    budget: Mapped[int] = mapped_column(Integer)
    photo_file_id: Mapped[str | None] = mapped_column(String(256), nullable=True)
    user_id: Mapped[str] = mapped_column(String(64))
    status: Mapped[str] = mapped_column(String(16), default="new")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )