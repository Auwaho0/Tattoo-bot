"""FastAPI-приложение EverArt Tattoo: CORS + GZip + lifespan."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.config import CORS_ORIGINS
from app.database import engine
from app.api.routes import portfolio, sketches, bookings, photo


ALLOWED_ORIGINS = list({
    "http://localhost:5173",
    "http://localhost:3000",
    "https://everart-tattoo.web.app",
    "https://everart-tattoo.firebaseapp.com",
    *CORS_ORIGINS,
})


@asynccontextmanager
async def lifespan(app: FastAPI):
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

    # Порядок ВАЖЕН: последний добавленный middleware = внешний.
    # Сначала GZip (внутренний), потом CORS (внешний) — чтобы CORS-заголовки
    # оставались даже при ошибках сжатия.
    app.add_middleware(GZipMiddleware, minimum_size=1024)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_origin_regex=r"https://([a-z0-9-]+\.)*(telegram\.org|t\.me|web\.app|firebaseapp\.com)",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["ETag", "Content-Length"],
        max_age=86400,
    )

    app.include_router(portfolio.router)
    app.include_router(sketches.router)
    app.include_router(bookings.router)
    app.include_router(photo.router)

    @app.get("/health", tags=["service"])
    async def health():
        return {"status": "ok", "service": "everart-tattoo"}

    @app.get("/", tags=["service"])
    async def root():
        return {"service": "EverArt Tattoo API", "docs": "/docs"}

    return app


app = create_app()