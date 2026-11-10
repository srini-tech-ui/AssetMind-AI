"""
Pydantic schemas for Approval APIs.

Defines request and response models for approval
and approval step operations.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.domain import (
    ApprovalPriorityEnum,
    ApprovalStatusEnum,
    ApprovalStepStatusEnum,
    ApprovalTypeEnum,
)


# ============================================
# APPROVAL STEP CREATE
# ============================================

class ApprovalStepCreate(BaseModel):
    """Schema for creating an approval step."""

    user_id: UUID

    role: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    status: ApprovalStepStatusEnum = (
        ApprovalStepStatusEnum.pending
    )

    decided_at: Optional[datetime] = None

    comment: Optional[str] = None


# ============================================
# APPROVAL STEP UPDATE
# ============================================

class ApprovalStepUpdate(BaseModel):
    """
    Schema for partially updating an approval step.

    Only explicitly supplied fields will be updated.
    """

    user_id: Optional[UUID] = None

    role: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    status: Optional[
        ApprovalStepStatusEnum
    ] = None

    decided_at: Optional[datetime] = None

    comment: Optional[str] = None


# ============================================
# APPROVAL STEP RESPONSE
# ============================================

class ApprovalStepResponse(BaseModel):
    """Schema returned for approval step APIs."""

    model_config = ConfigDict(
        from_attributes=True
    )

    id: UUID

    approval_id: UUID

    user_id: UUID

    role: Optional[str]

    status: ApprovalStepStatusEnum

    decided_at: Optional[datetime]

    comment: Optional[str]


# ============================================
# APPROVAL CREATE
# ============================================

class ApprovalCreate(BaseModel):
    """Schema for creating a new approval."""

    title: str = Field(
        ...,
        min_length=1,
        max_length=500,
        examples=[
            "Approve server CPU upgrade"
        ],
    )

    description: Optional[str] = None

    type: ApprovalTypeEnum

    resource_type: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )

    resource_id: UUID

    recommendation_id: Optional[UUID] = None

    requested_by: UUID

    requested_at: Optional[datetime] = None

    status: ApprovalStatusEnum = (
        ApprovalStatusEnum.pending
    )

    priority: ApprovalPriorityEnum = (
        ApprovalPriorityEnum.medium
    )

    current_approver_index: int = Field(
        default=0,
        ge=0,
    )

    due_date: Optional[datetime] = None

    decided_at: Optional[datetime] = None

    decided_by: Optional[UUID] = None

    decision_comment: Optional[str] = None

    extra_metadata: dict = Field(
        default_factory=dict,
    )

    approvers: list[ApprovalStepCreate] = Field(
        default_factory=list,
    )


# ============================================
# APPROVAL UPDATE
# ============================================

class ApprovalUpdate(BaseModel):
    """
    Schema for partially updating an approval.

    Only fields explicitly supplied in the request
    will be updated.
    """

    title: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=500,
    )

    description: Optional[str] = None

    type: Optional[ApprovalTypeEnum] = None

    resource_type: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    resource_id: Optional[UUID] = None

    recommendation_id: Optional[UUID] = None

    requested_by: Optional[UUID] = None

    requested_at: Optional[datetime] = None

    status: Optional[ApprovalStatusEnum] = None

    priority: Optional[
        ApprovalPriorityEnum
    ] = None

    current_approver_index: Optional[int] = Field(
        default=None,
        ge=0,
    )

    due_date: Optional[datetime] = None

    decided_at: Optional[datetime] = None

    decided_by: Optional[UUID] = None

    decision_comment: Optional[str] = None

    extra_metadata: Optional[dict] = None


# ============================================
# APPROVAL RESPONSE
# ============================================

class ApprovalResponse(BaseModel):
    """Schema returned by Approval APIs."""

    model_config = ConfigDict(
        from_attributes=True
    )

    id: UUID

    title: str

    description: Optional[str]

    type: ApprovalTypeEnum

    resource_type: str

    resource_id: UUID

    recommendation_id: Optional[UUID]

    requested_by: UUID

    requested_at: datetime

    status: ApprovalStatusEnum

    priority: ApprovalPriorityEnum

    current_approver_index: int

    due_date: Optional[datetime]

    decided_at: Optional[datetime]

    decided_by: Optional[UUID]

    decision_comment: Optional[str]

    extra_metadata: dict

    approvers: list[ApprovalStepResponse]

    created_at: datetime

    updated_at: datetime