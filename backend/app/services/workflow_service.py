"""
Business logic for Workflow APIs.

Handles workflow definitions, workflow steps,
workflow instances, and workflow instance steps.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.domain import (
    Workflow,
    WorkflowInstance,
    WorkflowInstanceStatusEnum,
    WorkflowInstanceStep,
    WorkflowInstanceStepStatusEnum,
    WorkflowStep,
)
from app.schemas.workflow import (
    WorkflowCreate,
    WorkflowInstanceCreate,
    WorkflowInstanceStepUpdate,
    WorkflowInstanceUpdate,
    WorkflowStartRequest,
    WorkflowStepUpdate,
    WorkflowUpdate,
)


# ============================================
# WORKFLOW QUERIES
# ============================================

async def list_workflows(
    session: AsyncSession,
) -> list[Workflow]:
    """Return all workflows with their steps."""

    result = await session.execute(
        select(Workflow)
        .options(
            selectinload(Workflow.steps)
        )
        .order_by(
            Workflow.created_at.desc()
        )
    )

    return list(
        result.scalars().all()
    )


async def get_workflow(
    session: AsyncSession,
    workflow_id: UUID,
) -> Workflow:
    """Return a workflow by ID."""

    result = await session.execute(
        select(Workflow)
        .options(
            selectinload(Workflow.steps)
        )
        .where(
            Workflow.id == workflow_id
        )
    )

    workflow = result.scalar_one_or_none()

    if workflow is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found",
        )

    return workflow


# ============================================
# WORKFLOW CREATE
# ============================================

async def create_workflow(
    session: AsyncSession,
    workflow_data: WorkflowCreate,
) -> Workflow:
    """
    Create a workflow and its workflow steps.
    """

    workflow_values = workflow_data.model_dump(
        exclude={"steps"}
    )

    workflow = Workflow(
        **workflow_values
    )

    session.add(workflow)

    await session.flush()

    for step_data in workflow_data.steps:

        step = WorkflowStep(
            workflow_id=workflow.id,
            **step_data.model_dump(),
        )

        session.add(step)

    await session.commit()

    return await get_workflow(
        session=session,
        workflow_id=workflow.id,
    )


# ============================================
# WORKFLOW UPDATE
# ============================================

async def update_workflow(
    session: AsyncSession,
    workflow_id: UUID,
    workflow_data: WorkflowUpdate,
) -> Workflow:
    """Update an existing workflow."""

    workflow = await get_workflow(
        session=session,
        workflow_id=workflow_id,
    )

    update_data = workflow_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            workflow,
            field,
            value,
        )

    await session.commit()

    return await get_workflow(
        session=session,
        workflow_id=workflow.id,
    )


# ============================================
# WORKFLOW DELETE
# ============================================

async def delete_workflow(
    session: AsyncSession,
    workflow_id: UUID,
) -> None:
    """Delete a workflow."""

    workflow = await get_workflow(
        session=session,
        workflow_id=workflow_id,
    )

    await session.delete(workflow)

    await session.commit()


# ============================================
# WORKFLOW STEP QUERIES
# ============================================

async def get_workflow_step(
    session: AsyncSession,
    workflow_id: UUID,
    step_id: str,
) -> WorkflowStep:
    """Return a workflow step."""

    result = await session.execute(
        select(WorkflowStep)
        .where(
            WorkflowStep.workflow_id == workflow_id,
            WorkflowStep.id == step_id,
        )
    )

    workflow_step = result.scalar_one_or_none()

    if workflow_step is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow step not found",
        )

    return workflow_step


# ============================================
# WORKFLOW STEP UPDATE
# ============================================

async def update_workflow_step(
    session: AsyncSession,
    workflow_id: UUID,
    step_id: str,
    step_data: WorkflowStepUpdate,
) -> WorkflowStep:
    """Update an existing workflow step."""

    workflow_step = await get_workflow_step(
        session=session,
        workflow_id=workflow_id,
        step_id=step_id,
    )

    update_data = step_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            workflow_step,
            field,
            value,
        )

    await session.commit()

    await session.refresh(
        workflow_step
    )

    return workflow_step


# ============================================
# WORKFLOW INSTANCE QUERIES
# ============================================

async def list_workflow_instances(
    session: AsyncSession,
    workflow_id: Optional[UUID] = None,
) -> list[WorkflowInstance]:
    """
    Return workflow instances.

    Optionally filter by workflow ID.
    """

    query = (
        select(WorkflowInstance)
        .options(
            selectinload(
                WorkflowInstance.steps
            )
        )
        .order_by(
            WorkflowInstance.started_at.desc()
        )
    )

    if workflow_id is not None:
        query = query.where(
            WorkflowInstance.workflow_id
            == workflow_id
        )

    result = await session.execute(
        query
    )

    return list(
        result.scalars().all()
    )


async def get_workflow_instance(
    session: AsyncSession,
    instance_id: UUID,
) -> WorkflowInstance:
    """Return a workflow instance by ID."""

    result = await session.execute(
        select(WorkflowInstance)
        .options(
            selectinload(
                WorkflowInstance.steps
            )
        )
        .where(
            WorkflowInstance.id
            == instance_id
        )
    )

    workflow_instance = (
        result.scalar_one_or_none()
    )

    if workflow_instance is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow instance not found",
        )

    return workflow_instance


# ============================================
# CREATE WORKFLOW INSTANCE
# ============================================

async def create_workflow_instance(
    session: AsyncSession,
    instance_data: WorkflowInstanceCreate,
) -> WorkflowInstance:
    """
    Create a workflow instance manually.
    """

    instance_values = (
        instance_data.model_dump(
            exclude={"steps"}
        )
    )

    workflow_instance = WorkflowInstance(
        **instance_values
    )

    session.add(
        workflow_instance
    )

    await session.flush()

    for step_data in instance_data.steps:

        instance_step = (
            WorkflowInstanceStep(
                instance_id=workflow_instance.id,
                **step_data.model_dump(),
            )
        )

        session.add(
            instance_step
        )

    await session.commit()

    return await get_workflow_instance(
        session=session,
        instance_id=workflow_instance.id,
    )


# ============================================
# START WORKFLOW
# ============================================

async def start_workflow(
    session: AsyncSession,
    workflow_id: UUID,
    start_data: WorkflowStartRequest,
) -> WorkflowInstance:
    """
    Start a workflow.

    Creates a workflow instance and automatically
    copies workflow steps into instance steps.
    """

    workflow = await get_workflow(
        session=session,
        workflow_id=workflow_id,
    )

    if (
        workflow.status.value
        not in ("active", "draft")
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Workflow cannot be started "
                "because it is inactive or archived"
            ),
        )

    ordered_steps = sorted(
        workflow.steps,
        key=lambda step: step.order,
    )

    current_step_id = None

    if ordered_steps:
        current_step_id = (
            ordered_steps[0].id
        )

    workflow_instance = WorkflowInstance(
        workflow_id=workflow.id,
        workflow_version=workflow.version,
        status=WorkflowInstanceStatusEnum.running,
        current_step_id=current_step_id,
        context=start_data.context,
        started_by=start_data.started_by,
    )

    session.add(
        workflow_instance
    )

    await session.flush()

    for workflow_step in ordered_steps:

        instance_step = (
            WorkflowInstanceStep(
                instance_id=workflow_instance.id,
                step_id=workflow_step.id,
                name=workflow_step.name,
                status=(
                    WorkflowInstanceStepStatusEnum.pending
                ),
                assignee_id=None,
                notes=None,
            )
        )

        session.add(
            instance_step
        )

    await session.commit()

    return await get_workflow_instance(
        session=session,
        instance_id=workflow_instance.id,
    )


# ============================================
# UPDATE WORKFLOW INSTANCE
# ============================================

async def update_workflow_instance(
    session: AsyncSession,
    instance_id: UUID,
    instance_data: WorkflowInstanceUpdate,
) -> WorkflowInstance:
    """Update an existing workflow instance."""

    workflow_instance = (
        await get_workflow_instance(
            session=session,
            instance_id=instance_id,
        )
    )

    update_data = (
        instance_data.model_dump(
            exclude_unset=True
        )
    )

    for field, value in update_data.items():
        setattr(
            workflow_instance,
            field,
            value,
        )

    if (
        workflow_instance.status
        == WorkflowInstanceStatusEnum.completed
        and workflow_instance.completed_at
        is None
    ):
        workflow_instance.completed_at = (
            datetime.utcnow()
        )

    await session.commit()

    return await get_workflow_instance(
        session=session,
        instance_id=workflow_instance.id,
    )


# ============================================
# GET WORKFLOW INSTANCE STEP
# ============================================

async def get_workflow_instance_step(
    session: AsyncSession,
    instance_id: UUID,
    instance_step_id: UUID,
) -> WorkflowInstanceStep:
    """Return a workflow instance step."""

    result = await session.execute(
        select(WorkflowInstanceStep)
        .where(
            WorkflowInstanceStep.instance_id
            == instance_id,
            WorkflowInstanceStep.id
            == instance_step_id,
        )
    )

    instance_step = (
        result.scalar_one_or_none()
    )

    if instance_step is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "Workflow instance step "
                "not found"
            ),
        )

    return instance_step


# ============================================
# UPDATE WORKFLOW INSTANCE STEP
# ============================================

async def update_workflow_instance_step(
    session: AsyncSession,
    instance_id: UUID,
    instance_step_id: UUID,
    step_data: WorkflowInstanceStepUpdate,
) -> WorkflowInstanceStep:
    """
    Update a workflow instance step.
    """

    instance_step = (
        await get_workflow_instance_step(
            session=session,
            instance_id=instance_id,
            instance_step_id=instance_step_id,
        )
    )

    update_data = step_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            instance_step,
            field,
            value,
        )

    if (
        instance_step.status
        == WorkflowInstanceStepStatusEnum.in_progress
        and instance_step.started_at
        is None
    ):
        instance_step.started_at = (
            datetime.utcnow()
        )

    if (
        instance_step.status
        == WorkflowInstanceStepStatusEnum.completed
        and instance_step.completed_at
        is None
    ):
        instance_step.completed_at = (
            datetime.utcnow()
        )

    await session.commit()

    await session.refresh(
        instance_step
    )

    return instance_step