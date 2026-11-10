"""
API routes for Approval operations.
"""

from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.schemas.approval import (
    ApprovalCreate,
    ApprovalResponse,
    ApprovalUpdate,
)
from app.services.approval_service import (
    create_approval,
    delete_approval,
    get_approval,
    list_approvals,
    update_approval,
)


# ============================================
# ROUTER
# ============================================

router = APIRouter(
    prefix="/approvals",
    tags=["Approvals"],
)


# ============================================
# LIST APPROVALS
# ============================================

@router.get(
    "",
    response_model=list[ApprovalResponse],
    summary="List all approvals",
)
async def get_all_approvals(
    session: AsyncSession = Depends(
        get_session
    ),
):
    """Return all approvals."""

    return await list_approvals(
        session=session
    )


# ============================================
# CREATE APPROVAL
# ============================================

@router.post(
    "",
    response_model=ApprovalResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create new approval",
)
async def create_new_approval(
    approval_data: ApprovalCreate,
    session: AsyncSession = Depends(
        get_session
    ),
):
    """Create a new approval."""

    return await create_approval(
        session=session,
        approval_data=approval_data,
    )


# ============================================
# GET APPROVAL BY ID
# ============================================

@router.get(
    "/{approval_id}",
    response_model=ApprovalResponse,
    summary="Get approval by ID",
)
async def get_approval_by_id(
    approval_id: UUID,
    session: AsyncSession = Depends(
        get_session
    ),
):
    """Return an approval by ID."""

    approval = await get_approval(
        session=session,
        approval_id=approval_id,
    )

    if approval is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Approval not found",
        )

    return approval


# ============================================
# UPDATE APPROVAL
# ============================================

@router.put(
    "/{approval_id}",
    response_model=ApprovalResponse,
    summary="Update existing approval",
)
async def update_existing_approval(
    approval_id: UUID,
    approval_data: ApprovalUpdate,
    session: AsyncSession = Depends(
        get_session
    ),
):
    """Update an existing approval."""

    approval = await get_approval(
        session=session,
        approval_id=approval_id,
    )

    if approval is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Approval not found",
        )

    return await update_approval(
        session=session,
        approval=approval,
        approval_data=approval_data,
    )


# ============================================
# DELETE APPROVAL
# ============================================

@router.delete(
    "/{approval_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete existing approval",
)
async def delete_existing_approval(
    approval_id: UUID,
    session: AsyncSession = Depends(
        get_session
    ),
):
    """Delete an approval."""

    approval = await get_approval(
        session=session,
        approval_id=approval_id,
    )

    if approval is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Approval not found",
        )

    await delete_approval(
        session=session,
        approval=approval,
    )

    return None