"""
API routes for Workflow operations.

Provides endpoints for workflow definitions,
workflow steps, workflow execution, and
workflow instance management.
"""

from typing import Optional
from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    Response,
    status,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session

from app.schemas.workflow import (
    WorkflowCreate,
    WorkflowInstanceResponse,
    WorkflowInstanceStepResponse,
    WorkflowInstanceStepUpdate,
    WorkflowInstanceUpdate,
    WorkflowResponse,
    WorkflowStartRequest,
    WorkflowStepResponse,
    WorkflowStepUpdate,
    WorkflowUpdate,
)

from app.services.workflow_service import (
    create_workflow,
    delete_workflow,
    get_workflow,
    get_workflow_instance,
    get_workflow_step,
    list_workflow_instances,
    list_workflows,
    start_workflow,
    update_workflow,
    update_workflow_instance,
    update_workflow_instance_step,
    update_workflow_step,
)


# ============================================
# ROUTER
# ============================================

router = APIRouter(
    prefix="/workflows",
    tags=["Workflows"],
)


# ============================================
# WORKFLOW CRUD
# ============================================

@router.get(
    "",
    response_model=list[WorkflowResponse],
    summary="List workflows",
)
async def get_all_workflows(
    session: AsyncSession = Depends(
        get_session
    ),
):
    """Return all workflow definitions."""

    return await list_workflows(
        session=session
    )


@router.post(
    "",
    response_model=WorkflowResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create workflow",
)
async def create_new_workflow(
    workflow_data: WorkflowCreate,
    session: AsyncSession = Depends(
        get_session
    ),
):
    """Create a new workflow."""

    return await create_workflow(
        session=session,
        workflow_data=workflow_data,
    )


@router.get(
    "/{workflow_id}",
    response_model=WorkflowResponse,
    summary="Get workflow by ID",
)
async def get_workflow_by_id(
    workflow_id: UUID,
    session: AsyncSession = Depends(
        get_session
    ),
):
    """Return a workflow by ID."""

    return await get_workflow(
        session=session,
        workflow_id=workflow_id,
    )


@router.put(
    "/{workflow_id}",
    response_model=WorkflowResponse,
    summary="Update workflow",
)
async def update_existing_workflow(
    workflow_id: UUID,
    workflow_data: WorkflowUpdate,
    session: AsyncSession = Depends(
        get_session
    ),
):
    """Update an existing workflow."""

    return await update_workflow(
        session=session,
        workflow_id=workflow_id,
        workflow_data=workflow_data,
    )


@router.delete(
    "/{workflow_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete workflow",
)
async def delete_existing_workflow(
    workflow_id: UUID,
    session: AsyncSession = Depends(
        get_session
    ),
):
    """Delete an existing workflow."""

    await delete_workflow(
        session=session,
        workflow_id=workflow_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )


# ============================================
# WORKFLOW STEPS
# ============================================

@router.get(
    "/{workflow_id}/steps/{step_id}",
    response_model=WorkflowStepResponse,
    summary="Get workflow step",
)
async def get_workflow_step_by_id(
    workflow_id: UUID,
    step_id: str,
    session: AsyncSession = Depends(
        get_session
    ),
):
    """Return a workflow step."""

    return await get_workflow_step(
        session=session,
        workflow_id=workflow_id,
        step_id=step_id,
    )


@router.put(
    "/{workflow_id}/steps/{step_id}",
    response_model=WorkflowStepResponse,
    summary="Update workflow step",
)
async def update_existing_workflow_step(
    workflow_id: UUID,
    step_id: str,
    step_data: WorkflowStepUpdate,
    session: AsyncSession = Depends(
        get_session
    ),
):
    """Update an existing workflow step."""

    return await update_workflow_step(
        session=session,
        workflow_id=workflow_id,
        step_id=step_id,
        step_data=step_data,
    )


# ============================================
# WORKFLOW EXECUTION
# ============================================

@router.post(
    "/{workflow_id}/start",
    response_model=WorkflowInstanceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Start workflow",
)
async def start_existing_workflow(
    workflow_id: UUID,
    start_data: WorkflowStartRequest,
    session: AsyncSession = Depends(
        get_session
    ),
):
    """
    Start a workflow and create a new
    workflow execution instance.
    """

    return await start_workflow(
        session=session,
        workflow_id=workflow_id,
        start_data=start_data,
    )


# ============================================
# WORKFLOW INSTANCES
# ============================================

@router.get(
    "/instances/all",
    response_model=list[WorkflowInstanceResponse],
    summary="List workflow instances",
)
async def get_all_workflow_instances(
    workflow_id: Optional[UUID] = None,
    session: AsyncSession = Depends(
        get_session
    ),
):
    """
    Return workflow instances.

    Optionally filter by workflow ID.
    """

    return await list_workflow_instances(
        session=session,
        workflow_id=workflow_id,
    )


@router.get(
    "/instances/{instance_id}",
    response_model=WorkflowInstanceResponse,
    summary="Get workflow instance",
)
async def get_workflow_instance_by_id(
    instance_id: UUID,
    session: AsyncSession = Depends(
        get_session
    ),
):
    """Return a workflow instance."""

    return await get_workflow_instance(
        session=session,
        instance_id=instance_id,
    )


@router.put(
    "/instances/{instance_id}",
    response_model=WorkflowInstanceResponse,
    summary="Update workflow instance",
)
async def update_existing_workflow_instance(
    instance_id: UUID,
    instance_data: WorkflowInstanceUpdate,
    session: AsyncSession = Depends(
        get_session
    ),
):
    """Update a workflow instance."""

    return await update_workflow_instance(
        session=session,
        instance_id=instance_id,
        instance_data=instance_data,
    )


# ============================================
# WORKFLOW INSTANCE STEPS
# ============================================

@router.put(
    "/instances/{instance_id}/steps/{instance_step_id}",
    response_model=WorkflowInstanceStepResponse,
    summary="Update workflow instance step",
)
async def update_existing_workflow_instance_step(
    instance_id: UUID,
    instance_step_id: UUID,
    step_data: WorkflowInstanceStepUpdate,
    session: AsyncSession = Depends(
        get_session
    ),
):
    """Update a workflow instance step."""

    return await update_workflow_instance_step(
        session=session,
        instance_id=instance_id,
        instance_step_id=instance_step_id,
        step_data=step_data,
    )