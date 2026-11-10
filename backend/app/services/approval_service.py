"""
Service layer for Approval operations.

Contains database CRUD operations for approvals
and their approval steps.
"""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.domain import Approval, ApprovalStep
from app.schemas.approval import (
    ApprovalCreate,
    ApprovalUpdate,
)


# ============================================
# LIST APPROVALS
# ============================================

async def list_approvals(
    session: AsyncSession,
) -> list[Approval]:
    """
    Return all approvals.

    Approval steps are loaded together with
    their parent approval.
    """

    result = await session.execute(
        select(Approval)
        .options(
            selectinload(Approval.approvers)
        )
        .order_by(
            Approval.created_at.desc()
        )
    )

    return list(
        result.scalars().all()
    )


# ============================================
# GET APPROVAL BY ID
# ============================================

async def get_approval(
    session: AsyncSession,
    approval_id: UUID,
) -> Approval | None:
    """
    Return a single approval by ID.

    Returns None if the approval does not exist.
    """

    result = await session.execute(
        select(Approval)
        .options(
            selectinload(Approval.approvers)
        )
        .where(
            Approval.id == approval_id
        )
    )

    return result.scalar_one_or_none()


# ============================================
# CREATE APPROVAL
# ============================================

async def create_approval(
    session: AsyncSession,
    approval_data: ApprovalCreate,
) -> Approval:
    """
    Create a new approval.

    Any approvers supplied in the request
    are created as ApprovalStep records.
    """

    approval_values = approval_data.model_dump(
        exclude={"approvers"},
        exclude_none=True,
    )

    approval = Approval(
        **approval_values
    )

    session.add(approval)

    # Flush first so approval.id is generated
    # before creating ApprovalStep records.
    await session.flush()

    for approver_data in approval_data.approvers:

        step_values = approver_data.model_dump(
            exclude_none=True
        )

        approval_step = ApprovalStep(
            approval_id=approval.id,
            **step_values,
        )

        session.add(approval_step)

    await session.commit()

    return await get_approval(
        session=session,
        approval_id=approval.id,
    )


# ============================================
# UPDATE APPROVAL
# ============================================

async def update_approval(
    session: AsyncSession,
    approval: Approval,
    approval_data: ApprovalUpdate,
) -> Approval:
    """
    Update an existing approval.

    Only fields explicitly supplied in the request
    are updated.
    """

    update_values = approval_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_values.items():

        setattr(
            approval,
            field,
            value,
        )

    await session.commit()

    return await get_approval(
        session=session,
        approval_id=approval.id,
    )


# ============================================
# DELETE APPROVAL
# ============================================

async def delete_approval(
    session: AsyncSession,
    approval: Approval,
) -> None:
    """
    Delete an approval.

    Associated ApprovalStep records are also
    deleted because of the cascade relationship.
    """

    await session.delete(
        approval
    )

    await session.commit()