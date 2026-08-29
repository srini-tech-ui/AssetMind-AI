"""
Structured logging middleware for request/response tracking.

Logs all HTTP requests and responses with correlation IDs.
"""
import logging
import time
from typing import Callable

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

logger = logging.getLogger("app.middleware.logging")


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware that logs HTTP requests and responses."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Log request and response."""
        # Get correlation ID if available
        correlation_id = getattr(request.state, "correlation_id", "unknown")

        # Log request
        logger.info(
            "request_received",
            extra={
                "correlation_id": correlation_id,
                "method": request.method,
                "path": request.url.path,
                "query": str(request.url.query) or None,
            },
        )

        # Measure time
        start_time = time.time()
        response = await call_next(request)
        duration = time.time() - start_time

        # Log response
        logger.info(
            "response_sent",
            extra={
                "correlation_id": correlation_id,
                "method": request.method,
                "path": request.url.path,
                "status": response.status_code,
                "duration_ms": duration * 1000,
            },
        )

        return response
