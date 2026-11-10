"""
Pydantic schemas for Recommendation APIs.

Defines request and response models for recommendation operations.
"""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.domain import (
    RecommendationCategoryEnum,
    RecommendationPriorityEnum,
    RecommendationStatusEnum,
)


# ============================================
# RECOMMENDATION CREATE
# ============================================

class RecommendationCreate(BaseModel):
    """Schema for creating a new recommendation."""

    asset_id: UUID

    title: str = Field(
        ...,
        min_length=1,
        max_length=500,
        examples=[
            "Upgrade network switch firmware"
        ],
    )

    description: str | None = None

    category: RecommendationCategoryEnum

    priority: RecommendationPriorityEnum

    status: RecommendationStatusEnum = (
        RecommendationStatusEnum.proposed
    )

    estimated_savings: Decimal | None = Field(
        default=None,
        ge=0,
    )

    estimated_cost: Decimal | None = Field(
        default=None,
        ge=0,
    )

    currency: str = Field(
        default="USD",
        min_length=3,
        max_length=3,
    )

    confidence: float = Field(
        ...,
        ge=0,
        le=1,
        examples=[0.92],
    )

    reasoning: str | None = None

    evidence_ids: list[str] = Field(
        default_factory=list,
    )

    affected_assets: list[UUID] = Field(
        default_factory=list,
    )

    approval_required: bool = False


# ============================================
# RECOMMENDATION UPDATE
# ============================================

class RecommendationUpdate(BaseModel):
    """
    Schema for partially updating a recommendation.

    Only fields explicitly supplied in the request
    will be updated.
    """

    asset_id: UUID | None = None

    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=500,
    )

    description: str | None = None

    category: RecommendationCategoryEnum | None = None

    priority: RecommendationPriorityEnum | None = None

    status: RecommendationStatusEnum | None = None

    estimated_savings: Decimal | None = Field(
        default=None,
        ge=0,
    )

    estimated_cost: Decimal | None = Field(
        default=None,
        ge=0,
    )

    currency: str | None = Field(
        default=None,
        min_length=3,
        max_length=3,
    )

    confidence: float | None = Field(
        default=None,
        ge=0,
        le=1,
    )

    reasoning: str | None = None

    evidence_ids: list[str] | None = None

    affected_assets: list[UUID] | None = None

    approval_required: bool | None = None


# ============================================
# RECOMMENDATION RESPONSE
# ============================================

class RecommendationResponse(BaseModel):
    """Schema returned by Recommendation APIs."""

    model_config = ConfigDict(
        from_attributes=True
    )

    id: UUID

    asset_id: UUID

    title: str

    description: str | None

    category: RecommendationCategoryEnum

    priority: RecommendationPriorityEnum

    status: RecommendationStatusEnum

    estimated_savings: Decimal | None

    estimated_cost: Decimal | None

    currency: str

    confidence: float

    reasoning: str | None

    evidence_ids: list[str]

    affected_assets: list[UUID]

    approval_required: bool

    created_at: datetime

    updated_at: datetime