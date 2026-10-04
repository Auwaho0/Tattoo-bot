"""GET /api/sketches с пагинацией."""
from fastapi import APIRouter, Depends, Query, Request, Response
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import Sketch
from app.schemas import SketchOut, SketchPage

router = APIRouter(prefix="/api", tags=["sketches"])


async def _sketches_version(session: AsyncSession) -> str:
    result = await session.execute(
        select(func.count(Sketch.id), func.max(Sketch.created_at))
    )
    count, latest = result.one()
    return f"{count}-{latest.isoformat() if latest else 'empty'}"


@router.get("/sketches", response_model=SketchPage)
async def get_sketches(
    request: Request,
    response: Response,
    limit: int = Query(12, ge=1, le=50),
    offset: int = Query(0, ge=0),
    status: str | None = Query(None, pattern="^(free|sold)$"),
    session: AsyncSession = Depends(get_session),
):
    version = await _sketches_version(session)
    etag = f'W/"{version}-{status}-{limit}-{offset}"'

    if request.headers.get("if-none-match") == etag:
        return Response(status_code=304, headers={"ETag": etag})

    base = select(Sketch)
    if status:
        base = base.where(Sketch.status == status)

    count_stmt = select(func.count()).select_from(Sketch)
    if status:
        count_stmt = count_stmt.where(Sketch.status == status)
    total = await session.scalar(count_stmt)

    result = await session.execute(
        base.order_by(Sketch.created_at.desc()).limit(limit).offset(offset)
    )
    items = result.scalars().all()

    response.headers["ETag"] = etag
    # Для эскизов короче — статус меняется чаще
    response.headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=300"

    return SketchPage(
        items=items, total=total, limit=limit, offset=offset,
        has_more=offset + len(items) < total,
    )