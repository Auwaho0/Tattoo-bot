"""GET /api/sketches — только чтение."""
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import Sketch
from app.schemas import SketchOut

router = APIRouter(prefix="/api", tags=["sketches"])


@router.get("/sketches", response_model=list[SketchOut])
async def get_sketches(session: AsyncSession = Depends(get_session)):
    """Возвращает все эскизы (свежие — первыми)."""
    result = await session.execute(select(Sketch).order_by(Sketch.created_at.desc()))
    return result.scalars().all()