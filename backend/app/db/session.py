"""
Database session management.

Async SQLAlchemy 2.x engine and session factory.
"""

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    create_async_engine,
)
from sqlalchemy.orm import sessionmaker

from app.config import get_settings


# ============================================
# GLOBAL ENGINE INSTANCE
# ============================================

_engine: AsyncEngine | None = None


# ============================================
# DATABASE ENGINE
# ============================================

async def get_engine() -> AsyncEngine:
    """Get or create the async database engine."""

    global _engine

    if _engine is None:

        settings = get_settings()

        _engine = create_async_engine(
            settings.database_url,
            echo=settings.app_env == "development",
            pool_pre_ping=True,
            pool_size=20,
            max_overflow=10,
        )

    return _engine


# ============================================
# DATABASE SESSION
# ============================================

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency for FastAPI routes to get a database session.

    Usage in routes:

        async def get_data(
            session: AsyncSession = Depends(get_session)
        ):
            ...
    """

    engine = await get_engine()

    async_session = sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False,
    )

    async with async_session() as session:

        try:

            yield session

        finally:

            await session.close()


# ============================================
# DATABASE DEPENDENCY ALIAS
# ============================================

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Compatibility alias for FastAPI route dependencies.

    This allows routes to use:

        session: AsyncSession = Depends(get_db)

    while preserving the existing get_session()
    implementation.
    """

    async for session in get_session():

        yield session


# ============================================
# DATABASE ENGINE SHUTDOWN
# ============================================

async def close_engine() -> None:
    """Close the database engine. Call this on application shutdown."""

    global _engine

    if _engine is not None:

        await _engine.dispose()

        _engine = None