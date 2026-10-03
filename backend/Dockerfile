# --- Бэкенд EverArt Tattoo (FastAPI + Alembic) ---
FROM python:3.11-slim

WORKDIR /app

# Системные зависимости: gcc + libpq-dev нужны asyncpg/alembic на этапе сборки
RUN apt-get update && apt-get install -y --no-install-recommends \
  gcc libpq-dev \
  && rm -rf /var/lib/apt/lists/*

# Сначала зависимости — чтобы кэш слоёв работал при изменении кода
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Затем код
COPY . .

# Непривилегированный пользователь
RUN useradd -m -r appuser && chown -R appuser:appuser /app
USER appuser

# Render сам подставит $PORT
EXPOSE 8000

# При старте прогоняем миграции и поднимаем uvicorn
CMD alembic upgrade head && \
  uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}