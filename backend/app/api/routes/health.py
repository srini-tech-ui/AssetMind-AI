"""
Health check endpoints.

Provides liveness and readiness probes.
"""
from fastapi import APIRouter

from app.config import get_settings

router = APIRouter(prefix="/health", tags=["health"])


@router.get("", response_model=dict)
async def health_check() -> dict:
    """
    Liveness probe.

    Returns basic health status without external dependencies.
    """
    settings = get_settings()
    return {
        "status": "ok",
        "service": "ai-asset-intelligence-backend",
        "version": settings.app_version,
    }


@router.get("/readiness", response_model=dict)
async def readiness_check() -> dict:
    """
    Readiness probe.

    In the future, this would check database connectivity.
    For Phase 4.0, it simply returns ready.
    """
    return {
        "status": "ready",
        "service": "ai-asset-intelligence-backend",
    }
