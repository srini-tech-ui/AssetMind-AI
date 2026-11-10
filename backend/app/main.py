"""
FastAPI application factory and configuration.

Sets up the FastAPI app with middleware, exception handlers,
database lifecycle management, and API routes.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.db.session import close_engine

from app.middleware.correlation import CorrelationIDMiddleware
from app.middleware.logging import LoggingMiddleware


# ============================================
# API ROUTES
# ============================================

from app.api.routes import assets
from app.api.routes import audit
from app.api.routes import approvals
from app.api.routes import compliance
from app.api.routes import cost
from app.api.routes import health
from app.api.routes import lifecycle
from app.api.routes import recommendations
from app.api.routes import risks
from app.api.routes import workflows

# --------------------------------------------
# RAG APIs
# --------------------------------------------

from app.api.routes import rag


# ============================================
# LOGGING
# ============================================

logging.basicConfig(
    level=logging.INFO,
    format=(
        "%(asctime)s - "
        "%(name)s - "
        "%(levelname)s - "
        "%(message)s"
    ),
)

logger = logging.getLogger(__name__)


# ============================================
# STANDARD API ERROR RESPONSE
# ============================================

class APIErrorResponse:
    """Standard API error response format."""

    def __init__(
        self,
        code: str,
        message: str,
        correlation_id: str = "unknown",
    ):
        self.code = code
        self.message = message
        self.correlation_id = correlation_id

    def to_dict(self) -> dict:
        """Convert error response to dictionary."""

        return {
            "error": {
                "code": self.code,
                "message": self.message,
                "correlation_id": self.correlation_id,
            }
        }


# ============================================
# APPLICATION LIFESPAN
# ============================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    """

    # ----------------------------------------
    # STARTUP
    # ----------------------------------------

    logger.info(
        "AI Asset Intelligence Backend starting up"
    )

    yield

    # ----------------------------------------
    # SHUTDOWN
    # ----------------------------------------

    logger.info(
        "Closing database connections"
    )

    await close_engine()

    logger.info(
        "AI Asset Intelligence Backend shut down"
    )


# ============================================
# APPLICATION FACTORY
# ============================================

def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""

    settings = get_settings()

    # ========================================
    # CREATE FASTAPI APPLICATION
    # ========================================

    app = FastAPI(
        title=settings.api_title,
        version=settings.app_version,
        lifespan=lifespan,
    )

    # ========================================
    # MIDDLEWARE
    # ========================================

    # Correlation ID middleware
    app.add_middleware(
        CorrelationIDMiddleware
    )

    # Request and response logging middleware
    app.add_middleware(
        LoggingMiddleware
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=(
            settings.cors_allow_credentials
        ),
        allow_methods=(
            settings.cors_allow_methods
        ),
        allow_headers=(
            settings.cors_allow_headers
        ),
    )

    # ========================================
    # EXCEPTION HANDLERS
    # ========================================

    @app.exception_handler(Exception)
    async def general_exception_handler(
        request: Request,
        exc: Exception,
    ):
        """Handle unexpected application exceptions."""

        correlation_id = getattr(
            request.state,
            "correlation_id",
            "unknown",
        )

        logger.exception(
            "Unhandled exception",
            extra={
                "correlation_id": correlation_id,
            },
        )

        error = APIErrorResponse(
            code="INTERNAL_SERVER_ERROR",
            message=(
                "An unexpected error occurred"
            ),
            correlation_id=correlation_id,
        )

        return JSONResponse(
            status_code=500,
            content=error.to_dict(),
            headers={
                "X-Correlation-ID": correlation_id,
            },
        )

    # ========================================
    # HEALTH CHECK ROUTES
    # ========================================

    # Routes without API version prefix.
    #
    # GET /health
    # GET /health/readiness

    app.include_router(
        health.router
    )

    # ========================================
    # API VERSION 1 ROUTES
    # ========================================

    # ----------------------------------------
    # HEALTH APIs
    # ----------------------------------------
    #
    # GET /api/v1/health

    app.include_router(
        health.router,
        prefix=settings.api_prefix,
    )

    # ----------------------------------------
    # ASSET APIs
    # ----------------------------------------

    app.include_router(
        assets.router,
        prefix=settings.api_prefix,
    )

    # ----------------------------------------
    # RISK APIs
    # ----------------------------------------

    app.include_router(
        risks.router,
        prefix=settings.api_prefix,
    )

    # ----------------------------------------
    # COMPLIANCE APIs
    # ----------------------------------------

    app.include_router(
        compliance.router,
        prefix=settings.api_prefix,
    )

    # ----------------------------------------
    # LIFECYCLE APIs
    # ----------------------------------------

    app.include_router(
        lifecycle.router,
        prefix=settings.api_prefix,
    )

    # ----------------------------------------
    # COST APIs
    # ----------------------------------------

    app.include_router(
        cost.router,
        prefix=settings.api_prefix,
    )

    # ----------------------------------------
    # RECOMMENDATION APIs
    # ----------------------------------------

    app.include_router(
        recommendations.router,
        prefix=settings.api_prefix,
    )

    # ----------------------------------------
    # APPROVAL APIs
    # ----------------------------------------

    app.include_router(
        approvals.router,
        prefix=settings.api_prefix,
    )

    # ----------------------------------------
    # WORKFLOW APIs
    # ----------------------------------------

    app.include_router(
        workflows.router,
        prefix=settings.api_prefix,
    )

    # ----------------------------------------
    # AUDIT LOG APIs
    # ----------------------------------------

    app.include_router(
        audit.router,
        prefix=settings.api_prefix,
    )

    # ----------------------------------------
    # RAG KNOWLEDGE APIs
    # ----------------------------------------
    #
    # GET /api/v1/rag/search?q=...
    #
    # Searches approved enterprise knowledge
    # documents stored in ChromaDB.

    app.include_router(
        rag.router,
        prefix=settings.api_prefix,
    )

    # ========================================
    # CUSTOM OPENAPI CONFIGURATION
    # ========================================

    if settings.app_env == "development":

        def custom_openapi():
            """Generate custom OpenAPI schema."""

            if app.openapi_schema:
                return app.openapi_schema

            openapi_schema = get_openapi(
                title=settings.api_title,
                version=settings.app_version,
                description=(
                    "AI Asset Intelligence Platform - "
                    "FastAPI Backend"
                ),
                routes=app.routes,
            )

            app.openapi_schema = openapi_schema

            return app.openapi_schema

        app.openapi = custom_openapi

    return app


# ============================================
# APPLICATION INSTANCE
# ============================================

app = create_app()