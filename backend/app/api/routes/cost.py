"""
Cost Entry API routes.

Provides CRUD endpoints for CostEntry entities.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_session

from app.schemas.cost import (
    CostEntryCreate,
    CostEntryResponse,
    CostEntryUpdate,
)

from app.services.cost_service import (
    create_cost_entry,
    delete_cost_entry,
    get_cost_entry,
    list_cost_entries,
    update_cost_entry,
)


router = APIRouter(
    prefix="/costs",
    tags=["costs"],
)


# ============================================
# LIST COST ENTRIES
# ============================================

@router.get(
    "",
    response_model=list[CostEntryResponse],
)
async def get_cost_entries(
    session: AsyncSession = Depends(get_session),
) -> list[CostEntryResponse]:
    """Return all cost entries."""

    cost_entries = await list_cost_entries(
        session
    )

    return cost_entries


# ============================================
# GET COST ENTRY BY ID
# ============================================

@router.get(
    "/{cost_entry_id}",
    response_model=CostEntryResponse,
)
async def get_cost_entry_by_id(
    cost_entry_id: UUID,
    session: AsyncSession = Depends(get_session),
) -> CostEntryResponse:
    """Return a single cost entry by ID."""

    cost_entry = await get_cost_entry(
        session=session,
        cost_entry_id=cost_entry_id,
    )

    if cost_entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cost entry {cost_entry_id} not found",
        )

    return cost_entry


# ============================================
# CREATE COST ENTRY
# ============================================

@router.post(
    "",
    response_model=CostEntryResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_new_cost_entry(
    cost_entry_data: CostEntryCreate,
    session: AsyncSession = Depends(get_session),
) -> CostEntryResponse:
    """Create a new cost entry."""

    cost_entry = await create_cost_entry(
        session=session,
        cost_entry_data=cost_entry_data,
    )

    return cost_entry


# ============================================
# UPDATE COST ENTRY
# ============================================

@router.put(
    "/{cost_entry_id}",
    response_model=CostEntryResponse,
)
async def update_existing_cost_entry(
    cost_entry_id: UUID,
    cost_entry_data: CostEntryUpdate,
    session: AsyncSession = Depends(get_session),
) -> CostEntryResponse:
    """Update an existing cost entry."""

    cost_entry = await get_cost_entry(
        session=session,
        cost_entry_id=cost_entry_id,
    )

    if cost_entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cost entry {cost_entry_id} not found",
        )

    updated_cost_entry = await update_cost_entry(
        session=session,
        cost_entry=cost_entry,
        cost_entry_data=cost_entry_data,
    )

    return updated_cost_entry


# ============================================
# DELETE COST ENTRY
# ============================================

@router.delete(
    "/{cost_entry_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_existing_cost_entry(
    cost_entry_id: UUID,
    session: AsyncSession = Depends(get_session),
) -> None:
    """Delete an existing cost entry."""

    cost_entry = await get_cost_entry(
        session=session,
        cost_entry_id=cost_entry_id,
    )

    if cost_entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cost entry {cost_entry_id} not found",
        )

    await delete_cost_entry(
        session=session,
        cost_entry=cost_entry,
    )