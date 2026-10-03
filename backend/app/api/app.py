"""FastAPI-приложение EverArt Tattoo с lifespan."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
from app.database import engine
from app.api.routes import portfolio, sketches, bookings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: —. Shutdown: закрываем пул БД."""
    yield
    await engine.dispose()


def create_app() -> FastAPI:
    app = FastAPI(
        title="EverArt Tattoo API",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )

    app.include_router(portfolio.router)
    app.include_router(sketches.router)
    app.include_router(bookings.router)

    @app.get("/health", tags=["service"])
    async def health():
        return {"status": "ok", "service": "everart-tattoo"}

    @app.get("/", tags=["service"])
    async def root():
        return {"service": "EverArt Tattoo API", "docs": "/docs"}

    return app


app = create_app()