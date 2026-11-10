"""
Lifecycle Event API routes.

Provides CRUD endpoints for LifecycleEvent entities.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_session

from app.schemas.lifecycle import (
    LifecycleEventCreate,
    LifecycleEventResponse,
    LifecycleEventUpdate,
)

from app.services.lifecycle_service import (
    create_lifecycle_event,
    delete_lifecycle_event,
    get_lifecycle_event,
    list_lifecycle_events,
    update_lifecycle_event,
)


router = APIRouter(
    prefix="/lifecycle",
    tags=["lifecycle"],
)


# ============================================
# LIST LIFECYCLE EVENTS
# ============================================

@router.get(
    "",
    response_model=list[LifecycleEventResponse],
)
async def get_lifecycle_events(
    session: AsyncSession = Depends(get_session),
) -> list[LifecycleEventResponse]:
    """Return all lifecycle events."""

    lifecycle_events = await list_lifecycle_events(
        session
    )

    return lifecycle_events


# ============================================
# GET LIFECYCLE EVENT BY ID
# ============================================

@router.get(
    "/{lifecycle_event_id}",
    response_model=LifecycleEventResponse,
)
async def get_lifecycle_event_by_id(
    lifecycle_event_id: UUID,
    session: AsyncSession = Depends(get_session),
) -> LifecycleEventResponse:
    """Return a single lifecycle event by ID."""

    lifecycle_event = await get_lifecycle_event(
        session=session,
        lifecycle_event_id=lifecycle_event_id,
    )

    if lifecycle_event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                f"Lifecycle event {lifecycle_event_id} not found"
            ),
        )

    return lifecycle_event


# ============================================
# CREATE LIFECYCLE EVENT
# ============================================

@router.post(
    "",
    response_model=LifecycleEventResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_new_lifecycle_event(
    lifecycle_event_data: LifecycleEventCreate,
    session: AsyncSession = Depends(get_session),
) -> LifecycleEventResponse:
    """Create a new lifecycle event."""

    lifecycle_event = await create_lifecycle_event(
        session=session,
        lifecycle_event_data=lifecycle_event_data,
    )

    return lifecycle_event


# ============================================
# UPDATE LIFECYCLE EVENT
# ============================================

@router.put(
    "/{lifecycle_event_id}",
    response_model=LifecycleEventResponse,
)
async def update_existing_lifecycle_event(
    lifecycle_event_id: UUID,
    lifecycle_event_data: LifecycleEventUpdate,
    session: AsyncSession = Depends(get_session),
) -> LifecycleEventResponse:
    """Update an existing lifecycle event."""

    lifecycle_event = await get_lifecycle_event(
        session=session,
        lifecycle_event_id=lifecycle_event_id,
    )

    if lifecycle_event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                f"Lifecycle event {lifecycle_event_id} not found"
            ),
        )

    updated_lifecycle_event = (
        await update_lifecycle_event(
            session=session,
            lifecycle_event=lifecycle_event,
            lifecycle_event_data=lifecycle_event_data,
        )
    )

    return updated_lifecycle_event


# ============================================
# DELETE LIFECYCLE EVENT
# ============================================

@router.delete(
    "/{lifecycle_event_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_existing_lifecycle_event(
    lifecycle_event_id: UUID,
    session: AsyncSession = Depends(get_session),
) -> None:
    """Delete an existing lifecycle event."""

    lifecycle_event = await get_lifecycle_event(
        session=session,
        lifecycle_event_id=lifecycle_event_id,
    )

    if lifecycle_event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                f"Lifecycle event {lifecycle_event_id} not found"
            ),
        )

    await delete_lifecycle_event(
        session=session,
        lifecycle_event=lifecycle_event,
    )