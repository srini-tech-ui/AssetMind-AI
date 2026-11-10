"""
Pydantic schemas for Audit Log APIs.
"""

import uuid
from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.domain import AuditEventSeverityEnum


# ============================================
# AUDIT LOG BASE
# ============================================

class AuditLogBase(BaseModel):
    """Base schema for audit log data."""

    event_type: str = Field(
        ...,
        max_length=100,
        description="Type of event recorded",
    )

    resource_type: str = Field(
        ...,
        max_length=100,
        description="Type of resource affected",
    )

    resource_id: uuid.UUID = Field(
        ...,
        description="ID of the affected resource",
    )

    user_id: Optional[uuid.UUID] = Field(
        default=None,
        description="User who performed the action",
    )

    user_name: Optional[str] = Field(
        default=None,
        max_length=255,
        description="Name of the user",
    )

    user_roles: list[str] = Field(
        default_factory=list,
        description="Roles associated with the user",
    )

    changes: dict[str, Any] = Field(
        default_factory=dict,
        description="Changes recorded during the event",
    )

    extra_metadata: dict[str, Any] = Field(
        default_factory=dict,
        description="Additional audit metadata",
    )

    severity: AuditEventSeverityEnum = Field(
        default=AuditEventSeverityEnum.info,
        description="Severity of the audit event",
    )


# ============================================
# CREATE
# ============================================

class AuditLogCreate(AuditLogBase):
    """Schema for creating an audit log."""

    timestamp: Optional[datetime] = Field(
        default=None,
        description="Event timestamp",
    )


# ============================================
# UPDATE
# ============================================

class AuditLogUpdate(BaseModel):
    """Schema for updating an audit log."""

    event_type: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    resource_type: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    resource_id: Optional[uuid.UUID] = None

    user_id: Optional[uuid.UUID] = None

    user_name: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    user_roles: Optional[list[str]] = None

    changes: Optional[dict[str, Any]] = None

    extra_metadata: Optional[dict[str, Any]] = None

    severity: Optional[AuditEventSeverityEnum] = None


# ============================================
# RESPONSE
# ============================================

class AuditLogResponse(AuditLogBase):
    """Schema returned by Audit Log APIs."""

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: uuid.UUID

    timestamp: datetime