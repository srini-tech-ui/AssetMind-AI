"""
Pydantic schemas for Asset APIs.

Defines request and response models for asset operations.
"""

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.domain import AssetStatusEnum, AssetTypeEnum


# ============================================
# ASSET CREATE
# ============================================

class AssetCreate(BaseModel):
    """Schema for creating a new asset."""

    name: str = Field(
        ...,
        min_length=1,
        max_length=255,
        examples=["Production Database Server"],
    )

    type: AssetTypeEnum

    status: AssetStatusEnum = AssetStatusEnum.active

    manufacturer: str | None = Field(
        default=None,
        max_length=255,
    )

    model: str | None = Field(
        default=None,
        max_length=255,
    )

    serial_number: str | None = Field(
        default=None,
        max_length=255,
    )

    purchase_date: datetime | None = None

    warranty_expiry: datetime | None = None

    location_id: UUID | None = None

    business_unit_id: UUID | None = None

    owner_id: UUID | None = None

    cost_center: str | None = Field(
        default=None,
        max_length=100,
    )

    tags: list[str] = Field(
        default_factory=list,
    )

    metadata: dict[str, Any] = Field(
        default_factory=dict,
    )


# ============================================
# ASSET UPDATE
# ============================================

class AssetUpdate(BaseModel):
    """Schema for partially updating an asset."""

    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    type: AssetTypeEnum | None = None

    status: AssetStatusEnum | None = None

    manufacturer: str | None = Field(
        default=None,
        max_length=255,
    )

    model: str | None = Field(
        default=None,
        max_length=255,
    )

    serial_number: str | None = Field(
        default=None,
        max_length=255,
    )

    purchase_date: datetime | None = None

    warranty_expiry: datetime | None = None

    location_id: UUID | None = None

    business_unit_id: UUID | None = None

    owner_id: UUID | None = None

    cost_center: str | None = Field(
        default=None,
        max_length=100,
    )

    tags: list[str] | None = None

    metadata: dict[str, Any] | None = None


# ============================================
# ASSET RESPONSE
# ============================================

class AssetResponse(BaseModel):
    """Schema returned by Asset APIs."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID

    name: str

    type: AssetTypeEnum

    status: AssetStatusEnum

    manufacturer: str | None

    model: str | None

    serial_number: str | None

    purchase_date: datetime | None

    warranty_expiry: datetime | None

    location_id: UUID | None

    business_unit_id: UUID | None

    owner_id: UUID | None

    cost_center: str | None

    tags: list[str]

    metadata: dict[str, Any] = Field(
        validation_alias="extra_metadata"
    )

    created_at: datetime

    updated_at: datetime