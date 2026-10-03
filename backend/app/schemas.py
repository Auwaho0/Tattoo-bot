"""Pydantic 2 схемы (только чтение + создание заявки)."""
from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, Field

# ---------- Work ----------
class WorkOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    size: str
    placement: str
    duration: str
    price: int
    photo_file_id: str
    description: Optional[str] = None
    created_at: datetime

# ---------- Sketch ----------
class SketchOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    size: str
    placement: str
    old_price: int
    new_price: int
    status: Literal["free", "sold"]
    photo_file_id: str
    created_at: datetime

# ---------- Booking ----------
class BookingCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=128)
    size: str = Field(..., min_length=1, max_length=64)
    placement: str = Field(..., min_length=1, max_length=128)
    dates: str = Field(..., min_length=1, max_length=256)
    budget: int = Field(..., ge=0)
    photo_file_id: Optional[str] = None
    user_id: str = Field(..., min_length=1, max_length=64)

class BookingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    size: str
    placement: str
    dates: str
    budget: int
    photo_file_id: Optional[str] = None
    user_id: str
    status: str
    created_at: datetime