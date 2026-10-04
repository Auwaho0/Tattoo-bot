"""GET /api/portfolio с пагинацией и сортировкой."""
from typing import Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import Work
from app.schemas import WorkOut, WorkPage

router = APIRouter(prefix="/api", tags=["portfolio"])


@router.get("/portfolio", response_model=WorkPage)
async def get_portfolio(
    limit: int = Query(12, ge=1, le=50, description="Сколько работ вернуть"),
    offset: int = Query(0, ge=0, description="Сколько пропустить"),
    order: Literal["new", "old"] = Query(
        "new", description="new — свежие первыми, old — старые первыми"
    ),
    session: AsyncSession = Depends(get_session),
):
    """
    Страница работ + метаданные пагинации.
    Сортировка по created_at — направление задаётся параметром order.
    """
    # Направление сортировки
    order_by = Work.created_at.desc() if order == "new" else Work.created_at.asc()

    # Всего работ — для has_more и счётчика в UI
    total = await session.scalar(select(func.count()).select_from(Work))

    # Сама страница
    result = await session.execute(
        select(Work).order_by(order_by).limit(limit).offset(offset)
    )
    items = result.scalars().all()

    return WorkPage(
        items=items,
        total=total,
        limit=limit,
        offset=offset,
        has_more=offset + len(items) < total,
    )