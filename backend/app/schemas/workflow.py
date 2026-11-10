"""
Pydantic schemas for Workflow APIs.

Defines request and response models for workflows,
workflow steps, workflow instances, and instance steps.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.domain import (
    WorkflowAssigneeTypeEnum,
    WorkflowInstanceStatusEnum,
    WorkflowInstanceStepStatusEnum,
    WorkflowStatusEnum,
    WorkflowStepTypeEnum,
    WorkflowTriggerTypeEnum,
    WorkflowTypeEnum,
)


# ============================================
# WORKFLOW STEP SCHEMAS
# ============================================

class WorkflowStepCreate(BaseModel):
    """Schema for creating a workflow step."""

    id: str = Field(
        ...,
        min_length=1,
        max_length=100,
        examples=["step_1"],
    )

    name: str = Field(
        ...,
        min_length=1,
        max_length=500,
        examples=["Manager Approval"],
    )

    type: WorkflowStepTypeEnum

    assignee_type: WorkflowAssigneeTypeEnum

    assignee_id: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    config: dict = Field(
        default_factory=dict,
    )

    order: int = Field(
        ...,
        ge=0,
    )


class WorkflowStepUpdate(BaseModel):
    """Schema for partially updating a workflow step."""

    name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=500,
    )

    type: Optional[WorkflowStepTypeEnum] = None

    assignee_type: Optional[
        WorkflowAssigneeTypeEnum
    ] = None

    assignee_id: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    config: Optional[dict] = None

    order: Optional[int] = Field(
        default=None,
        ge=0,
    )


class WorkflowStepResponse(BaseModel):
    """Schema returned for workflow steps."""

    model_config = ConfigDict(
        from_attributes=True
    )

    id: str

    workflow_id: UUID

    name: str

    type: WorkflowStepTypeEnum

    assignee_type: WorkflowAssigneeTypeEnum

    assignee_id: Optional[str]

    config: dict

    order: int


# ============================================
# WORKFLOW SCHEMAS
# ============================================

class WorkflowCreate(BaseModel):
    """Schema for creating a workflow."""

    name: str = Field(
        ...,
        min_length=1,
        max_length=500,
        examples=["Asset Onboarding Workflow"],
    )

    description: Optional[str] = None

    type: WorkflowTypeEnum

    status: WorkflowStatusEnum = (
        WorkflowStatusEnum.draft
    )

    version: str = Field(
        default="1.0",
        max_length=20,
    )

    trigger_type: WorkflowTriggerTypeEnum

    trigger_config: dict = Field(
        default_factory=dict,
    )

    created_by: Optional[UUID] = None

    steps: list[WorkflowStepCreate] = Field(
        default_factory=list,
    )


class WorkflowUpdate(BaseModel):
    """Schema for partially updating a workflow."""

    name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=500,
    )

    description: Optional[str] = None

    type: Optional[WorkflowTypeEnum] = None

    status: Optional[WorkflowStatusEnum] = None

    version: Optional[str] = Field(
        default=None,
        max_length=20,
    )

    trigger_type: Optional[
        WorkflowTriggerTypeEnum
    ] = None

    trigger_config: Optional[dict] = None

    created_by: Optional[UUID] = None


class WorkflowResponse(BaseModel):
    """Schema returned by Workflow APIs."""

    model_config = ConfigDict(
        from_attributes=True
    )

    id: UUID

    name: str

    description: Optional[str]

    type: WorkflowTypeEnum

    status: WorkflowStatusEnum

    version: str

    trigger_type: WorkflowTriggerTypeEnum

    trigger_config: dict

    created_by: Optional[UUID]

    steps: list[WorkflowStepResponse]

    created_at: datetime

    updated_at: datetime


# ============================================
# WORKFLOW INSTANCE STEP SCHEMAS
# ============================================

class WorkflowInstanceStepCreate(BaseModel):
    """Schema for creating a workflow instance step."""

    step_id: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )

    name: str = Field(
        ...,
        min_length=1,
        max_length=500,
    )

    status: WorkflowInstanceStepStatusEnum = (
        WorkflowInstanceStepStatusEnum.pending
    )

    started_at: Optional[datetime] = None

    completed_at: Optional[datetime] = None

    assignee_id: Optional[UUID] = None

    notes: Optional[str] = None


class WorkflowInstanceStepUpdate(BaseModel):
    """Schema for updating a workflow instance step."""

    status: Optional[
        WorkflowInstanceStepStatusEnum
    ] = None

    started_at: Optional[datetime] = None

    completed_at: Optional[datetime] = None

    assignee_id: Optional[UUID] = None

    notes: Optional[str] = None


class WorkflowInstanceStepResponse(BaseModel):
    """Schema returned for workflow instance steps."""

    model_config = ConfigDict(
        from_attributes=True
    )

    id: UUID

    instance_id: UUID

    step_id: str

    name: str

    status: WorkflowInstanceStepStatusEnum

    started_at: Optional[datetime]

    completed_at: Optional[datetime]

    assignee_id: Optional[UUID]

    notes: Optional[str]


# ============================================
# WORKFLOW INSTANCE SCHEMAS
# ============================================

class WorkflowInstanceCreate(BaseModel):
    """Schema for creating a workflow instance."""

    workflow_id: UUID

    workflow_version: str = Field(
        ...,
        min_length=1,
        max_length=20,
    )

    status: WorkflowInstanceStatusEnum = (
        WorkflowInstanceStatusEnum.running
    )

    current_step_id: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    context: dict = Field(
        default_factory=dict,
    )

    started_by: Optional[UUID] = None

    steps: list[
        WorkflowInstanceStepCreate
    ] = Field(
        default_factory=list,
    )


class WorkflowInstanceUpdate(BaseModel):
    """Schema for partially updating a workflow instance."""

    status: Optional[
        WorkflowInstanceStatusEnum
    ] = None

    current_step_id: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    context: Optional[dict] = None

    completed_at: Optional[datetime] = None

    started_by: Optional[UUID] = None


class WorkflowInstanceResponse(BaseModel):
    """Schema returned by Workflow Instance APIs."""

    model_config = ConfigDict(
        from_attributes=True
    )

    id: UUID

    workflow_id: UUID

    workflow_version: str

    status: WorkflowInstanceStatusEnum

    current_step_id: Optional[str]

    context: dict

    started_at: datetime

    completed_at: Optional[datetime]

    started_by: Optional[UUID]

    steps: list[
        WorkflowInstanceStepResponse
    ]


# ============================================
# WORKFLOW EXECUTION SCHEMA
# ============================================

class WorkflowStartRequest(BaseModel):
    """
    Request for starting a workflow.

    The system automatically creates an instance
    using the workflow definition.
    """

    context: dict = Field(
        default_factory=dict,
    )

    started_by: Optional[UUID] = None