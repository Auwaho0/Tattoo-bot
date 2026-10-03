# EverArt Tattoo — Digital Grimoire

Telegram-бот + Mini App для тату-студии EverArt Tattoo.

## Стек
- **Bot**: Python 3.11, aiogram 3.x
- **Backend**: FastAPI, SQLAlchemy 2.0 (async), asyncpg
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui, Zustand, TanStack Query
- **DB**: PostgreSQL 16
- **Proxy**: nginx + Let's Encrypt (prod)

## Быстрый старт (Docker)

```bash
cp .env.example .env
# заполни BOT_TOKEN и ADMIN_ID
docker compose up -d --build
docker compose logs -f
```

- Bot: работает в контейнере `everart-bot`
- API: http://localhost:8000/api/health
- Mini App (dev): http://localhost:8080

## Локальная разработка без Docker

**Backend:**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Bot:**
```bash 
cd bot
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python -m app.main
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## HTTPS для Telegram Mini App

Telegram требует HTTPS для WebApp. Варианты:

1. **Production** — домен + nginx + Let's Encrypt (см. `nginx/nginx.conf`).
2. **Локально** — используй туннель:
   ```bash
   npx cloudflared tunnel --url http://localhost:5173
   ```
   Полученный `https://xxx.trycloudflare.com` укажи в BotFather → Menu Button.

## Деплой через GitHub Actions

Secrets репозитория: `BOT_TOKEN`, `ADMIN_ID`, `SERVER_HOST`, `SERVER_USER`, `SSH_PRIVATE_KEY`.

При push в `main` workflow собирает и деплоит на сервер.