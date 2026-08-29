# AI Asset Intelligence Backend

FastAPI-based backend for the AI Asset Intelligence Platform.

**Phase 4.0 Foundation** — Configuration, database foundation, health checks, and middleware only.

## Requirements

- Python 3.11 or later
- PostgreSQL 13+ (for database, can be containerized)
- Windows, macOS, or Linux

## Setup (Windows PowerShell)

### 1. Create Virtual Environment

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1
```

If you encounter execution policy errors:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. Install Dependencies

```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Create Environment Configuration

```powershell
# Copy the example file
Copy-Item .env.example -Destination .env

# Edit .env with your database credentials
notepad .env
```

**Important:** Do NOT commit `.env` to Git. It will be gitignored.

Example `.env` for local development:
```
APP_ENV=development
DATABASE_URL=postgresql+asyncpg://asset_admin:your_password@localhost:5432/asset_intelligence
CORS_ORIGINS=["http://localhost:5173", "http://localhost:8080"]
```

### 4. Start Backend Server

```powershell
# From the backend directory with virtual environment activated
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The server will start on `http://127.0.0.1:8000`

### 5. Access API Documentation

Open your browser:
- **Swagger UI:** http://127.0.0.1:8000/docs
- **ReDoc:** http://127.0.0.1:8000/redoc
- **OpenAPI JSON:** http://127.0.0.1:8000/openapi.json

## Health Checks

### Liveness Probe
```
GET http://127.0.0.1:8000/health
```

Response:
```json
{
  "status": "ok",
  "service": "ai-asset-intelligence-backend",
  "version": "0.1.0"
}
```

### Readiness Probe
```
GET http://127.0.0.1:8000/api/v1/health/readiness
```

Response:
```json
{
  "status": "ready",
  "service": "ai-asset-intelligence-backend"
}
```

## Testing

### Run Tests

```powershell
pytest -v
```

### Run Tests with Coverage

```powershell
pytest --cov=app --cov-report=html
# Open htmlcov/index.html in your browser
```

### Run Specific Test

```powershell
pytest tests/test_health.py -v
```

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application factory
│   ├── config.py            # Configuration management
│   ├── dependencies.py      # Dependency injection
│   │
│   ├── api/
│   │   └── routes/
│   │       └── health.py    # Health check endpoints
│   │
│   ├── db/
│   │   ├── session.py       # Database session management
│   │   └── base.py          # SQLAlchemy declarative base
│   │
│   ├── models/              # SQLAlchemy ORM models (future)
│   ├── schemas/             # Pydantic request/response schemas (future)
│   ├── services/            # Business logic services (future)
│   ├── middleware/          # Custom middleware
│   └── utils/               # Utility functions
│
├── tests/
│   └── test_health.py       # Health endpoint tests
│
├── requirements.txt         # Python dependencies
├── conftest.py             # Pytest configuration
├── Dockerfile              # Docker image definition
├── .env.example            # Environment variable template
└── README.md               # This file
```

## Configuration

Configuration is managed via environment variables using Pydantic Settings.

See `.env.example` for all available options.

### Key Configuration Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `APP_ENV` | `development` | Application environment |
| `DATABASE_URL` | PostgreSQL async URL | Database connection string |
| `CORS_ORIGINS` | `["http://localhost:5173"]` | Allowed CORS origins |
| `API_PREFIX` | `/api/v1` | API route prefix |
| `LOG_LEVEL` | `INFO` | Logging level |

## Database

Database configuration is handled via `DATABASE_URL` environment variable.

### Example PostgreSQL Connection String

```
postgresql+asyncpg://user:password@localhost:5432/database_name
```

**Note:** Phase 4.0 does NOT include database models or migrations.

Database infrastructure will be implemented in Phase 4.1.

## Middleware

### Correlation ID Middleware
- Preserves `X-Correlation-ID` header from incoming requests
- Generates UUID if not present
- Adds to response headers
- Available in request state for logging

### Logging Middleware
- Logs all HTTP requests and responses
- Includes correlation ID, method, path, status, and duration
- Uses structured logging format

### CORS Middleware
- Configured via `CORS_ORIGINS` environment variable
- Supports credentials, multiple origins
- Properly handles OPTIONS preflight requests

## Error Handling

Standard API error response format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "correlation_id": "request-correlation-id"
  }
}
```

## Development

### Code Formatting

```powershell
black app/
```

### Linting

```powershell
ruff check app/
```

### Type Checking

Install mypy (not in base requirements):
```powershell
pip install mypy
mypy app/
```

## Docker

### Build Image

```bash
docker build -t ai-asset-intelligence-backend:latest .
```

### Run Container

```bash
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql+asyncpg://..." \
  ai-asset-intelligence-backend:latest
```

## Troubleshooting

### Import Errors
Ensure virtual environment is activated and backend directory is added to Python path.

```powershell
# Check Python path
python -c "import sys; print(sys.path)"
```

### Database Connection Errors
Verify PostgreSQL is running and connection string is correct:
```powershell
# Test connection
python -c "from sqlalchemy import create_engine; e = create_engine('your-url'); e.connect()"
```

### Port Already in Use
Change port in startup command:
```powershell
uvicorn app.main:app --port 8001
```

## Phase 4.0 Scope

This phase provides:
- ✅ FastAPI application structure
- ✅ Configuration management
- ✅ Database session infrastructure
- ✅ CORS and middleware setup
- ✅ Health check endpoints
- ✅ Correlation ID tracking
- ✅ Error handling framework
- ✅ Structured logging
- ✅ Docker support
- ✅ Basic test suite

This phase does NOT include:
- ❌ Database business models
- ❌ API endpoint implementations
- ❌ Authentication/Authorization
- ❌ RAG integration
- ❌ MCP implementations
- ❌ AI agents

## Next Steps (Phase 4.1+)

Phase 4.1 will add:
- Database business models
- API endpoints for asset management, risks, lifecycle, etc.
- Alembic migrations

Phase 4.2 and beyond:
- Authentication & Keycloak integration
- RAG system
- MCP layer
- AI agents

## Support

For issues or questions, refer to:
- Main project README: `../README.md`
- Architecture docs: `../docs/architecture.md`
- Frontend contracts: `../frontend/src/types/domain.ts`
