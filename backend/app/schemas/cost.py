"""
Pydantic schemas for Cost Entry APIs.

Defines request and response models for cost operations.
"""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.domain import (
    CostCategoryEnum,
    RecurrencePeriodEnum,
)


# ============================================
# COST ENTRY CREATE
# ============================================

class CostEntryCreate(BaseModel):
    """Schema for creating a cost entry."""

    asset_id: UUID

    category: CostCategoryEnum

    amount: Decimal = Field(
        ...,
        ge=0,
    )

    currency: str = Field(
        default="USD",
        min_length=3,
        max_length=3,
    )

    date: datetime

    description: str | None = Field(
        default=None,
        max_length=500,
    )

    vendor: str | None = Field(
        default=None,
        max_length=255,
    )

    invoice_number: str | None = Field(
        default=None,
        max_length=100,
    )

    cost_center: str | None = Field(
        default=None,
        max_length=100,
    )

    is_recurring: bool = False

    recurrence_period: RecurrencePeriodEnum | None = None

    tags: list[str] = Field(
        default_factory=list,
    )


# ============================================
# COST ENTRY UPDATE
# ============================================

class CostEntryUpdate(BaseModel):
    """Schema for updating a cost entry."""

    asset_id: UUID | None = None

    category: CostCategoryEnum | None = None

    amount: Decimal | None = Field(
        default=None,
        ge=0,
    )

    currency: str | None = Field(
        default=None,
        min_length=3,
        max_length=3,
    )

    date: datetime | None = None

    description: str | None = Field(
        default=None,
        max_length=500,
    )

    vendor: str | None = Field(
        default=None,
        max_length=255,
    )

    invoice_number: str | None = Field(
        default=None,
        max_length=100,
    )

    cost_center: str | None = Field(
        default=None,
        max_length=100,
    )

    is_recurring: bool | None = None

    recurrence_period: RecurrencePeriodEnum | None = None

    tags: list[str] | None = None


# ============================================
# COST ENTRY RESPONSE
# ============================================

class CostEntryResponse(BaseModel):
    """Schema returned by Cost Entry APIs."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID

    asset_id: UUID

    category: CostCategoryEnum

    amount: Decimal

    currency: str

    date: datetime

    description: str | None

    vendor: str | None

    invoice_number: str | None

    cost_center: str | None

    is_recurring: bool

    recurrence_period: RecurrencePeriodEnum | None

    tags: list[str]

    created_at: datetime

    updated_at: datetime