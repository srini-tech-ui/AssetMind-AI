"""
Service layer for Recommendation operations.

Contains database business logic for creating, retrieving,
updating, and deleting recommendations.
"""

from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.domain import Recommendation
from app.schemas.recommendation import (
    RecommendationCreate,
    RecommendationUpdate,
)


# ============================================
# LIST RECOMMENDATIONS
# ============================================

async def list_recommendations(
    db: AsyncSession,
) -> list[Recommendation]:
    """Return all recommendations."""

    result = await db.execute(
        select(Recommendation).order_by(
            Recommendation.created_at.desc()
        )
    )

    return list(result.scalars().all())


# ============================================
# GET RECOMMENDATION
# ============================================

async def get_recommendation(
    recommendation_id: UUID,
    db: AsyncSession,
) -> Recommendation:
    """Return a recommendation by ID."""

    result = await db.execute(
        select(Recommendation).where(
            Recommendation.id == recommendation_id
        )
    )

    recommendation = result.scalar_one_or_none()

    if recommendation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recommendation not found",
        )

    return recommendation


# ============================================
# CREATE RECOMMENDATION
# ============================================

async def create_recommendation(
    recommendation_data: RecommendationCreate,
    db: AsyncSession,
) -> Recommendation:
    """Create a new recommendation."""

    recommendation = Recommendation(
        **recommendation_data.model_dump()
    )

    db.add(recommendation)

    await db.commit()

    await db.refresh(recommendation)

    return recommendation


# ============================================
# UPDATE RECOMMENDATION
# ============================================

async def update_recommendation(
    recommendation_id: UUID,
    recommendation_data: RecommendationUpdate,
    db: AsyncSession,
) -> Recommendation:
    """Update an existing recommendation."""

    recommendation = await get_recommendation(
        recommendation_id,
        db,
    )

    update_data = recommendation_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            recommendation,
            field,
            value,
        )

    await db.commit()

    await db.refresh(recommendation)

    return recommendation


# ============================================
# DELETE RECOMMENDATION
# ============================================

async def delete_recommendation(
    recommendation_id: UUID,
    db: AsyncSession,
) -> None:
    """Delete a recommendation."""

    recommendation = await get_recommendation(
        recommendation_id,
        db,
    )

    await db.delete(recommendation)

    await db.commit()