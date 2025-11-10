# Docker Setup for TestGenie

This document provides comprehensive instructions for running TestGenie using Docker.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Docker Compose (included with Docker Desktop)
- At least 4GB of available RAM
- At least 2GB of available disk space

## Quick Start

### 1. Environment Configuration

**Required for Superwise AI integration:**

Follow the environment setup steps in the main [README.md Getting Started section](../README.md#-getting-started) to create your `.env` file with Superwise API credentials.

**Quick Reference:**
```bash
# Copy the example file
cp .env.example .env

# Edit with your Superwise API credentials
SUPERWISE_API_URL=https://api.superwise.ai/v1/app-worker
SUPERWISE_AGENT_ID=YOUR_SUPERWISE_AGENT_ID
```

**Note**: The Superwise agent configuration is required for AI features to work properly.

### 2. Using Docker Compose

```bash
# Build and start the application
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

## Docker Commands Reference

### Basic Operations

```bash
# Build the image
docker-compose build

# Start services
docker-compose up

# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend    # Backend service logs
docker-compose logs -f frontend    # Frontend service logs
```

### Development Commands

```bash
# Rebuild and restart (useful during development)
docker-compose up --build --force-recreate

# Access container shell
docker-compose exec backend /bin/bash    # Access backend container
docker-compose exec frontend /bin/sh     # Access frontend container

# View running containers
docker-compose ps

# View resource usage
docker stats
```

### Cleanup Commands

```bash
# Stop and remove containers
docker-compose down

# Stop and remove containers, volumes
docker-compose down --volumes

# Remove all unused containers, images
docker system prune -f

# Remove specific images
docker rmi testgenie-backend testgenie-frontend
# Or using docker-compose
docker-compose down --rmi all
```

## Configuration

### Port Configuration

Default port mapping:
- **Frontend**: `localhost:3000` (Next.js application)
- **Backend API**: `localhost:5000` (FastAPI backend)
- **API Documentation**: `localhost:5000/docs` (Swagger/OpenAPI docs)

## Production Deployment

### Using Production Compose File

```bash
# Use production configuration
docker-compose -f docker-compose.prod.yml up -d

# Build production image
docker-compose -f docker-compose.prod.yml build

# Stop production services
docker-compose -f docker-compose.prod.yml down
```

### Production Features

The production configuration can include:
- **Nginx reverse proxy** with SSL support
- **Resource limits** and health checks
- **Security headers** and rate limiting
- **Database and cache services** (if needed)

### SSL Configuration

1. Place SSL certificates in `nginx/ssl/`:
   ```
   nginx/ssl/
   ├── cert.pem
   └── key.pem
   ```

2. Uncomment HTTPS configuration in `nginx/nginx.conf`

3. Update `docker-compose.prod.yml` to redirect HTTP to HTTPS

## Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Check what's using ports 3000 or 5000
netstat -ano | findstr :3000  # Windows - Frontend port
netstat -ano | findstr :5000  # Windows - Backend port
lsof -i :3000                  # Linux/Mac - Frontend port
lsof -i :5000                  # Linux/Mac - Backend port

# Change ports in docker-compose.yml
# For frontend:
ports:
  - "3001:3000"
# For backend:
ports:
  - "5001:5000"
```

**Container Won't Start:**
```bash
# Check logs
docker-compose logs backend    # Backend service
docker-compose logs frontend   # Frontend service

# Check container status
docker-compose ps

# Rebuild images
docker-compose build --no-cache backend   # Rebuild backend
docker-compose build --no-cache frontend  # Rebuild frontend
docker-compose build --no-cache           # Rebuild all
```

**Permission Issues:**
```bash
# On Linux/Mac, ensure proper file permissions
chmod -R 755 .

# Or run with sudo (not recommended for production)
sudo docker-compose up
```

**Out of Memory:**
```bash
# Increase Docker memory limit in Docker Desktop settings
# Or add memory limits in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 2G
```

### Debugging

**Access Container Shell:**
```bash
docker-compose exec backend /bin/bash     # Backend container
docker-compose exec frontend /bin/sh      # Frontend container
```

**View Container Logs:**
```bash
docker-compose logs -f backend            # Backend logs
docker-compose logs -f frontend           # Frontend logs
docker-compose logs -f                    # All logs
```

**Check Container Resources:**
```bash
docker stats testgenie-backend            # Backend container
docker stats testgenie-frontend           # Frontend container
docker stats                              # All containers
```

**Inspect Container:**
```bash
docker inspect testgenie-backend         # Backend container
docker inspect testgenie-frontend        # Frontend container
```

## Performance Optimization

### Resource Limits

```yaml
deploy:
  resources:
    limits:
      memory: 1G
      cpus: '1.0'
    reservations:
      memory: 512M
      cpus: '0.5'
```

### Volume Mounts

For development, source code and database are mounted as volumes:
```yaml
volumes:
  - ./backend:/app                    # Backend source code
  - ./backend/testgenie.db:/app/testgenie.db  # Database file
  - ./logs:/app/logs                  # Application logs
```

For production, remove volume mounts and use built image. Database should use a named volume or external database service.

### Health Checks

The application includes health checks for both services:

**Backend Health Check:**
```yaml
healthcheck:
  test: ["CMD", "python", "-c", "import requests; requests.get('http://localhost:5000/api/health')"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

**Frontend Health Check:**
```yaml
healthcheck:
  test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

**Manual Health Check:**
```bash
# Check backend health
curl http://localhost:5000/api/health

# Check frontend (should return HTTP 200)
curl http://localhost:3000
```

## Security Considerations

### Production Security

1. **Use production compose file** with proper security settings
2. **Enable HTTPS** with valid SSL certificates
3. **Use environment variables** for sensitive configuration
4. **Regular security updates** of base images
5. **Set strong passwords** for any additional services (if added)

### Network Security

The application uses a custom bridge network for service isolation:

```yaml
networks:
  testgenie-network:
    driver: bridge
    # All services (backend, frontend) connect to this network
```

Both backend and frontend services communicate through this network. For production, consider:
- Network policies and segmentation
- Firewall rules between services
- VPN or private network configuration

### User Permissions

Both containers run as non-root users for security:

**Backend Container:**
```dockerfile
RUN adduser --disabled-password --gecos '' appuser && \
    chown -R appuser:appuser /app
USER appuser
```

**Frontend Container:**
Runs as a non-root user (configured in Next.js Dockerfile)

This reduces security risks by running containers with minimal privileges.

## Monitoring and Logging

### Log Management

```bash
# View application logs
docker-compose logs -f backend          # Backend logs
docker-compose logs -f frontend         # Frontend logs

# View all service logs
docker-compose logs -f

# Export logs to file
docker-compose logs > app.log           # All logs
docker-compose logs backend > backend.log    # Backend only
docker-compose logs frontend > frontend.log  # Frontend only

# View logs with timestamps
docker-compose logs -f -t backend
docker-compose logs -f -t frontend

# View last 100 lines
docker-compose logs --tail=100 backend
```

**Persistent Logs:**
Logs are also persisted to the `logs/` directory on the host:
- `logs/app.log` - Application logs
- `logs/error.log` - Error logs

### Health Monitoring

```bash
# Check service health status
docker-compose ps

# Check backend health endpoint
curl http://localhost:5000/api/health
# Expected response: {"status": "OK", "message": "TestGenie API is running", "timestamp": "..."}

# Check frontend accessibility
curl http://localhost:3000

# View detailed health information
docker inspect --format='{{json .State.Health}}' testgenie-backend | jq
docker inspect --format='{{json .State.Health}}' testgenie-frontend | jq

# Monitor health in real-time
watch -n 5 'docker-compose ps'
```

## Support

For Docker-related issues:

1. Check this documentation
2. Review Docker logs: `docker-compose logs`
3. Check container status: `docker-compose ps`
4. Verify Docker installation: `docker --version`
5. Check Docker Desktop status

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Streamlit Docker Guide](https://docs.streamlit.io/knowledge-base/deploy/deploy-streamlit-using-docker)
