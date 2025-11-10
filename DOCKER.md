# Docker Setup for TestGenie

This document provides instructions for running TestGenie using Docker containers.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

### 1. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode (background)
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/docs

## Individual Service Commands

### Backend Only

```bash
# Build backend image
docker build -f backend/Dockerfile -t testgenie-backend .

# Run backend container
docker run -p 5000:5000 -v $(pwd)/backend:/app testgenie-backend
```

### Frontend Only

```bash
# Build frontend image
docker build -f frontend/Dockerfile -t testgenie-frontend .

# Run frontend container
docker run -p 3000:3000 testgenie-frontend
```

## Development Mode

For development with hot reloading:

```bash
# Backend with volume mounting for live code changes
docker run -p 5000:5000 -v $(pwd)/backend:/app testgenie-backend

# Frontend with volume mounting
docker run -p 3000:3000 -v $(pwd)/frontend:/app -v /app/node_modules testgenie-frontend
```

## Docker Compose Services

### Backend Service
- **Image**: Built from `backend/Dockerfile`
- **Port**: 5000
- **Health Check**: GET /api/health
- **Volume**: Database file mounted for persistence

### Frontend Service
- **Image**: Built from `frontend/Dockerfile`
- **Port**: 3000
- **Health Check**: GET /
- **Dependencies**: Waits for backend to be healthy

## Environment Variables

### Backend
- `PYTHONPATH`: Set to `/app`
- `DATABASE_URL`: SQLite database path

### Frontend
- `NODE_ENV`: Set to `production`
- `NEXT_PUBLIC_API_URL`: Backend API URL

## Database Persistence

The SQLite database file is mounted as a volume to persist data between container restarts:

```yaml
volumes:
  - ./backend/testgenie.db:/app/testgenie.db
```

## Troubleshooting

### Port Conflicts
If ports 3000 or 5000 are already in use:

```bash
# Kill processes using these ports
npm run kill:ports

# Or manually find and kill processes
netstat -ano | findstr :3000
netstat -ano | findstr :5000
```

### Container Issues

```bash
# View container logs
docker-compose logs backend
docker-compose logs frontend

# Restart specific service
docker-compose restart backend

# Rebuild specific service
docker-compose up --build backend
```

### Clean Up

```bash
# Remove containers and networks
docker-compose down

# Remove containers, networks, and volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

## Production Deployment

For production deployment:

1. Update environment variables in `docker-compose.yml`
2. Use production database (PostgreSQL/MySQL) instead of SQLite
3. Configure reverse proxy (nginx) for SSL termination
4. Use Docker secrets for sensitive data

## Docker Commands Reference

```bash
# Build all services
docker-compose build

# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs

# Execute command in running container
docker-compose exec backend python --version
docker-compose exec frontend npm --version

# Scale services (if needed)
docker-compose up --scale backend=2
```
