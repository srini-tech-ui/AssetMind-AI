"""
API routes for Recommendation operations.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.schemas.recommendation import (
    RecommendationCreate,
    RecommendationResponse,
    RecommendationUpdate,
)
from app.services.recommendation_service import (
    create_recommendation,
    delete_recommendation,
    get_recommendation,
    list_recommendations,
    update_recommendation,
)


router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"],
)


# ============================================
# LIST RECOMMENDATIONS
# ============================================

@router.get(
    "",
    response_model=list[RecommendationResponse],
)
async def get_all_recommendations(
    session: AsyncSession = Depends(get_session),
):
    """Return all recommendations."""

    return await list_recommendations(session)


# ============================================
# CREATE RECOMMENDATION
# ============================================

@router.post(
    "",
    response_model=RecommendationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_new_recommendation(
    recommendation_data: RecommendationCreate,
    session: AsyncSession = Depends(get_session),
):
    """Create a new recommendation."""

    return await create_recommendation(
        recommendation_data,
        session,
    )


# ============================================
# GET RECOMMENDATION BY ID
# ============================================

@router.get(
    "/{recommendation_id}",
    response_model=RecommendationResponse,
)
async def get_recommendation_by_id(
    recommendation_id: UUID,
    session: AsyncSession = Depends(get_session),
):
    """Return a recommendation by ID."""

    return await get_recommendation(
        recommendation_id,
        session,
    )


# ============================================
# UPDATE RECOMMENDATION
# ============================================

@router.put(
    "/{recommendation_id}",
    response_model=RecommendationResponse,
)
async def update_existing_recommendation(
    recommendation_id: UUID,
    recommendation_data: RecommendationUpdate,
    session: AsyncSession = Depends(get_session),
):
    """Update an existing recommendation."""

    return await update_recommendation(
        recommendation_id,
        recommendation_data,
        session,
    )


# ============================================
# DELETE RECOMMENDATION
# ============================================

@router.delete(
    "/{recommendation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_existing_recommendation(
    recommendation_id: UUID,
    session: AsyncSession = Depends(get_session),
):
    """Delete a recommendation."""

    await delete_recommendation(
        recommendation_id,
        session,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )