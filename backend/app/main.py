"""
FastAPI application factory and configuration.

Sets up the FastAPI app with middleware, exception handlers, and routes.
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from app.config import get_settings
from app.db.session import close_engine
from app.middleware.correlation import CorrelationIDMiddleware
from app.middleware.logging import LoggingMiddleware
from app.api.routes import health

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


class APIErrorResponse:
    """Standard API error response format."""

    def __init__(
        self, code: str, message: str, correlation_id: str = "unknown"
    ):
        self.code = code
        self.message = message
        self.correlation_id = correlation_id

    def to_dict(self) -> dict:
        """Convert to dictionary for JSON response."""
        return {
            "error": {
                "code": self.code,
                "message": self.message,
                "correlation_id": self.correlation_id,
            }
        }


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.

    This is the modern FastAPI pattern (replaces @app.on_event).
    """
    # Startup
    logger.info("AI Asset Intelligence Backend starting up")
    yield
    # Shutdown
    logger.info("Closing database connections")
    await close_engine()
    logger.info("AI Asset Intelligence Backend shut down")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()

    # Create app instance
    app = FastAPI(
        title=settings.api_title,
        version=settings.app_version,
        lifespan=lifespan,
    )

    # ====== MIDDLEWARE ======
    # Order matters: first added is last executed

    # Correlation ID middleware (added last, executes first)
    app.add_middleware(CorrelationIDMiddleware)

    # Logging middleware
    app.add_middleware(LoggingMiddleware)

    # CORS middleware (added first, executes last)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=settings.cors_allow_credentials,
        allow_methods=settings.cors_allow_methods,
        allow_headers=settings.cors_allow_headers,
    )

    # ====== EXCEPTION HANDLERS ======

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        """Handle unexpected exceptions."""
        correlation_id = getattr(request.state, "correlation_id", "unknown")
        logger.exception(
            "Unhandled exception",
            extra={"correlation_id": correlation_id},
        )
        error = APIErrorResponse(
            code="INTERNAL_SERVER_ERROR",
            message="An unexpected error occurred",
            correlation_id=correlation_id,
        )
        return JSONResponse(
            status_code=500,
            content=error.to_dict(),
            headers={"X-Correlation-ID": correlation_id},
        )

    # ====== ROUTES ======

    # Health checks (no API prefix)
    app.include_router(health.router)

    # API v1 routes (with prefix)
    app.include_router(health.router, prefix=settings.api_prefix)

    # ====== CUSTOM OPENAPI (FOR DEVELOPMENT) ======
    if settings.app_env == "development":

        def custom_openapi():
            """Custom OpenAPI schema."""
            if app.openapi_schema:
                return app.openapi_schema

            openapi_schema = get_openapi(
                title=settings.api_title,
                version=settings.app_version,
                description="AI Asset Intelligence Platform - FastAPI Backend",
                routes=app.routes,
            )
            app.openapi_schema = openapi_schema
            return app.openapi_schema

        app.openapi = custom_openapi

    return app


# Application instance
app = create_app()
