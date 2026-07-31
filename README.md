# AI Support Copilot for SMBs

Phase 1 sets up a Docker-based local development environment only. It includes a React 19 + Vite frontend, a Rails 8 API backend, and PostgreSQL 17.

## Prerequisites

Install Docker Desktop:

- macOS: download Docker Desktop from https://www.docker.com/products/docker-desktop/
- Windows: install Docker Desktop with WSL 2 enabled.
- Linux: install Docker Engine and the Docker Compose plugin from your distribution or Docker's official packages.

Verify Docker is running:

```sh
docker --version
docker compose version
docker info
```

## Start The Project

```sh
cp .env.example .env
docker compose up --build
```

The first run builds both app images, installs dependencies, creates the development database, and starts all services.

## Services

| Service | URL | Container Port |
| --- | --- | --- |
| Frontend | http://localhost:5173 | 5173 |
| Backend API | http://localhost:3000 | 3000 |
| PostgreSQL | localhost:5432 | 5432 |

Backend health check:

```sh
curl http://localhost:3000/health
```

Expected response:

```json
{"status":"ok"}
```

The Vite dev server proxies `/api/*` to the Rails container, so this also verifies frontend-to-backend Docker networking:

```sh
curl http://localhost:5173/api/health
```

## Useful Commands

```sh
docker compose up --build
docker compose down
docker compose down -v
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
docker compose exec backend bin/rails db:prepare
docker compose exec backend bin/rails runner 'puts ActiveRecord::Base.connection.execute("SELECT 1").first'
docker compose exec frontend npm run build
```

## Dependency Notes

- Frontend dependencies are managed with `npm` in `frontend/package.json`.
- Backend dependencies are managed with Bundler in `backend/Gemfile`.
- PostgreSQL data is persisted in the `postgres_data` Docker volume.
- Ruby gems and frontend `node_modules` are kept in Docker volumes for faster local restarts.
