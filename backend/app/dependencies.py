"""
Dependency injection setup for FastAPI routes.

Provides convenient access to sessions, configuration, etc.
"""
from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import Settings, get_settings
from app.db.session import get_session


async def get_correlation_id(request: Request) -> str:
    """Extract correlation ID from request state."""
    return getattr(request.state, "correlation_id", "unknown")


# Re-export commonly used dependencies
__all__ = [
    "get_settings",
    "get_session",
    "get_correlation_id",
]
