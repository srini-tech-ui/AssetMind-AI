"""
Pydantic schemas for Risk APIs.

Defines request and response models for risk operations.
"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.domain import (
    RiskCategoryEnum,
    RiskImpactEnum,
    RiskLikelihoodEnum,
    RiskSeverityEnum,
    RiskStatusEnum,
)


# ============================================
# RISK CREATE
# ============================================

class RiskCreate(BaseModel):
    """Schema for creating a new risk."""

    asset_id: UUID

    title: str = Field(
        ...,
        min_length=1,
        max_length=500,
        examples=["Unpatched production server"],
    )

    description: str | None = None

    category: RiskCategoryEnum

    severity: RiskSeverityEnum

    likelihood: RiskLikelihoodEnum

    impact: RiskImpactEnum

    status: RiskStatusEnum = RiskStatusEnum.open

    identified_date: datetime

    target_resolution_date: datetime | None = None

    owner_id: UUID | None = None

    mitigation_plan: str | None = None

    evidence: list[str] = Field(
        default_factory=list,
    )

    tags: list[str] = Field(
        default_factory=list,
    )


# ============================================
# RISK UPDATE
# ============================================

class RiskUpdate(BaseModel):
    """Schema for updating a risk."""

    asset_id: UUID | None = None

    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=500,
    )

    description: str | None = None

    category: RiskCategoryEnum | None = None

    severity: RiskSeverityEnum | None = None

    likelihood: RiskLikelihoodEnum | None = None

    impact: RiskImpactEnum | None = None

    status: RiskStatusEnum | None = None

    identified_date: datetime | None = None

    target_resolution_date: datetime | None = None

    owner_id: UUID | None = None

    mitigation_plan: str | None = None

    evidence: list[str] | None = None

    tags: list[str] | None = None


# ============================================
# RISK RESPONSE
# ============================================

class RiskResponse(BaseModel):
    """Schema returned by Risk APIs."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID

    asset_id: UUID

    title: str

    description: str | None

    category: RiskCategoryEnum

    severity: RiskSeverityEnum

    likelihood: RiskLikelihoodEnum

    impact: RiskImpactEnum

    status: RiskStatusEnum

    identified_date: datetime

    target_resolution_date: datetime | None

    owner_id: UUID | None

    mitigation_plan: str | None

    evidence: list[str]

    tags: list[str]

    created_at: datetime

    updated_at: datetime