"""GET /api/sketches с пагинацией."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import Sketch
from app.schemas import SketchOut, SketchPage

router = APIRouter(prefix="/api", tags=["sketches"])


@router.get("/sketches", response_model=SketchPage)
async def get_sketches(
    limit: int = Query(12, ge=1, le=50, description="Сколько эскизов вернуть"),
    offset: int = Query(0, ge=0, description="Сколько пропустить"),
    status: str | None = Query(
        None, pattern="^(free|sold)$",
        description="Фильтр: free — только свободные, sold — только проданные",
    ),
    session: AsyncSession = Depends(get_session),
):
    """
    Страница эскизов + метаданные пагинации.
    Свежие — первыми. Опционально можно фильтровать по статусу.
    """
    # Базовый запрос
    base = select(Sketch)
    if status:
        base = base.where(Sketch.status == status)

    # Всего (с учётом фильтра)
    count_stmt = select(func.count()).select_from(Sketch)
    if status:
        count_stmt = count_stmt.where(Sketch.status == status)
    total = await session.scalar(count_stmt)

    # Страница
    result = await session.execute(
        base.order_by(Sketch.created_at.desc()).limit(limit).offset(offset)
    )
    items = result.scalars().all()

    return SketchPage(
        items=items,
        total=total,
        limit=limit,
        offset=offset,
        has_more=offset + len(items) < total,
    )