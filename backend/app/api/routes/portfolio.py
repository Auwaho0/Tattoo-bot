"""GET /api/portfolio с пагинацией, сортировкой и HTTP-кэшем."""
from typing import Literal

from fastapi import APIRouter, Depends, Query, Request, Response
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import Work
from app.schemas import WorkOut, WorkPage

router = APIRouter(prefix="/api", tags=["portfolio"])


async def _portfolio_version(session: AsyncSession) -> str:
    """
    Версия портфолио = максимальный created_at + количество работ.
    Меняется только когда мастер добавил/удалил работу.
    Используется как ETag.
    """
    result = await session.execute(
        select(func.count(Work.id), func.max(Work.created_at))
    )
    count, latest = result.one()
    return f"{count}-{latest.isoformat() if latest else 'empty'}"


@router.get("/portfolio", response_model=WorkPage)
async def get_portfolio(
    request: Request,
    response: Response,
    limit: int = Query(12, ge=1, le=50),
    offset: int = Query(0, ge=0),
    order: Literal["new", "old"] = Query("new"),
    session: AsyncSession = Depends(get_session),
):
    # Считаем ETag от состояния БД
    version = await _portfolio_version(session)
    etag = f'W/"{version}-{order}-{limit}-{offset}"'

    # Если клиент прислал тот же ETag — отдаём 304 без тела
    if request.headers.get("if-none-match") == etag:
        return Response(status_code=304, headers={"ETag": etag})

    order_by = Work.created_at.desc() if order == "new" else Work.created_at.asc()
    total = await session.scalar(select(func.count()).select_from(Work))
    result = await session.execute(
        select(Work).order_by(order_by).limit(limit).offset(offset)
    )
    items = result.scalars().all()

    response.headers["ETag"] = etag
    # max-age=300 — 5 минут браузер не спрашивает вообще
    # stale-while-revalidate=3600 — после 5 мин отдаёт из кэша, обновляя фоном
    response.headers["Cache-Control"] = "public, max-age=300, stale-while-revalidate=3600"

    return WorkPage(
        items=items, total=total, limit=limit, offset=offset,
        has_more=offset + len(items) < total,
    )