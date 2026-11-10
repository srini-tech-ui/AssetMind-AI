"""
Pydantic schemas for Compliance APIs.

Defines request and response models for compliance operations.
"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.domain import (
    ComplianceFrameworkEnum,
    ComplianceStatusEnum,
)


# ============================================
# COMPLIANCE CREATE
# ============================================

class ComplianceCreate(BaseModel):
    """Schema for creating a compliance record."""

    asset_id: UUID

    framework: ComplianceFrameworkEnum

    requirement_id: str = Field(
        ...,
        min_length=1,
        max_length=100,
        examples=["A.8.8"],
    )

    requirement_title: str = Field(
        ...,
        min_length=1,
        max_length=500,
        examples=["Management of Technical Vulnerabilities"],
    )

    status: ComplianceStatusEnum = (
        ComplianceStatusEnum.not_assessed
    )

    evidence: list[str] = Field(
        default_factory=list,
    )

    last_assessed: datetime

    next_assessment_due: datetime | None = None

    assessor_id: UUID | None = None

    notes: str | None = None


# ============================================
# COMPLIANCE UPDATE
# ============================================

class ComplianceUpdate(BaseModel):
    """Schema for updating a compliance record."""

    asset_id: UUID | None = None

    framework: ComplianceFrameworkEnum | None = None

    requirement_id: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    requirement_title: str | None = Field(
        default=None,
        min_length=1,
        max_length=500,
    )

    status: ComplianceStatusEnum | None = None

    evidence: list[str] | None = None

    last_assessed: datetime | None = None

    next_assessment_due: datetime | None = None

    assessor_id: UUID | None = None

    notes: str | None = None


# ============================================
# COMPLIANCE RESPONSE
# ============================================

class ComplianceResponse(BaseModel):
    """Schema returned by Compliance APIs."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID

    asset_id: UUID

    framework: ComplianceFrameworkEnum

    requirement_id: str

    requirement_title: str

    status: ComplianceStatusEnum

    evidence: list[str]

    last_assessed: datetime

    next_assessment_due: datetime | None

    assessor_id: UUID | None

    notes: str | None

    created_at: datetime

    updated_at: datetime