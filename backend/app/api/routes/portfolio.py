"""GET /api/portfolio — только чтение."""
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import Work
from app.schemas import WorkOut

router = APIRouter(prefix="/api", tags=["portfolio"])


@router.get("/portfolio", response_model=list[WorkOut])
async def get_portfolio(session: AsyncSession = Depends(get_session)):
    """Возвращает все работы портфолио (свежие — первыми)."""
    result = await session.execute(select(Work).order_by(Work.created_at.desc()))
    return result.scalars().all()