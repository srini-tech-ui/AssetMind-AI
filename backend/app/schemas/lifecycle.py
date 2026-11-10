"""
Pydantic schemas for Lifecycle Event APIs.

Defines request and response models for lifecycle event operations.
"""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.domain import (
    LifecycleEventTypeEnum,
    LifecycleStatusEnum,
)


# ============================================
# LIFECYCLE EVENT CREATE
# ============================================

class LifecycleEventCreate(BaseModel):
    """Schema for creating a lifecycle event."""

    asset_id: UUID

    event_type: LifecycleEventTypeEnum

    title: str = Field(
        ...,
        min_length=1,
        max_length=500,
        examples=["Server Hardware Upgrade"],
    )

    description: str | None = None

    scheduled_date: datetime | None = None

    completed_date: datetime | None = None

    status: LifecycleStatusEnum = (
        LifecycleStatusEnum.planned
    )

    performed_by: UUID | None = None

    cost: Decimal | None = None

    vendor: str | None = Field(
        default=None,
        max_length=255,
    )

    notes: str | None = None

    attachments: list[str] = Field(
        default_factory=list,
    )


# ============================================
# LIFECYCLE EVENT UPDATE
# ============================================

class LifecycleEventUpdate(BaseModel):
    """Schema for updating a lifecycle event."""

    asset_id: UUID | None = None

    event_type: LifecycleEventTypeEnum | None = None

    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=500,
    )

    description: str | None = None

    scheduled_date: datetime | None = None

    completed_date: datetime | None = None

    status: LifecycleStatusEnum | None = None

    performed_by: UUID | None = None

    cost: Decimal | None = None

    vendor: str | None = Field(
        default=None,
        max_length=255,
    )

    notes: str | None = None

    attachments: list[str] | None = None


# ============================================
# LIFECYCLE EVENT RESPONSE
# ============================================

class LifecycleEventResponse(BaseModel):
    """Schema returned by Lifecycle Event APIs."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID

    asset_id: UUID

    event_type: LifecycleEventTypeEnum

    title: str

    description: str | None

    scheduled_date: datetime | None

    completed_date: datetime | None

    status: LifecycleStatusEnum

    performed_by: UUID | None

    cost: Decimal | None

    vendor: str | None

    notes: str | None

    attachments: list[str]

    created_at: datetime

    updated_at: datetime