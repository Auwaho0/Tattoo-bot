# --- Бот EverArt Tattoo (aiogram 3, polling) ---
FROM python:3.11-slim

WORKDIR /app

# gcc нужен для сборки asyncpg (если нет wheel под платформу)
RUN apt-get update && apt-get install -y --no-install-recommends \
  gcc libpq-dev \
  && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd -m -r botuser && chown -R botuser:botuser /app
USER botuser

# Никаких портов — бот работает через long-polling
CMD ["python", "-m", "app.main"]