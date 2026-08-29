"""
Correlation ID middleware for request tracking.

Preserves or generates correlation IDs for distributed tracing.
"""
import uuid
from typing import Callable

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response


class CorrelationIDMiddleware(BaseHTTPMiddleware):
    """
    Middleware that:
    1. Extracts correlation ID from request headers if present
    2. Generates a new UUID if not present
    3. Adds it to response headers
    4. Makes it available via request.state for logging
    """

    def __init__(self, app, header_name: str = "X-Correlation-ID"):
        super().__init__(app)
        self.header_name = header_name

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Process the request and add correlation ID to response."""
        # Extract correlation ID from request or generate new one
        correlation_id = request.headers.get(self.header_name)
        if not correlation_id:
            correlation_id = str(uuid.uuid4())

        # Store in request state for access in route handlers and logging
        request.state.correlation_id = correlation_id

        # Call the next middleware/route
        response = await call_next(request)

        # Add correlation ID to response headers
        response.headers[self.header_name] = correlation_id

        return response
