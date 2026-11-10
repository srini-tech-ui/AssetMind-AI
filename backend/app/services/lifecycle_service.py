"""
Lifecycle Event service layer.

Contains database operations for LifecycleEvent entities.
"""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.domain import LifecycleEvent

from app.schemas.lifecycle import (
    LifecycleEventCreate,
    LifecycleEventUpdate,
)


async def list_lifecycle_events(
    session: AsyncSession,
) -> list[LifecycleEvent]:
    """
    Return all lifecycle events ordered by creation date.
    """

    result = await session.execute(
        select(LifecycleEvent).order_by(
            LifecycleEvent.created_at.desc()
        )
    )

    return list(result.scalars().all())


async def get_lifecycle_event(
    session: AsyncSession,
    lifecycle_event_id: UUID,
) -> LifecycleEvent | None:
    """
    Return a lifecycle event by ID.

    Returns None when the event does not exist.
    """

    result = await session.execute(
        select(LifecycleEvent).where(
            LifecycleEvent.id == lifecycle_event_id
        )
    )

    return result.scalar_one_or_none()


async def create_lifecycle_event(
    session: AsyncSession,
    lifecycle_event_data: LifecycleEventCreate,
) -> LifecycleEvent:
    """
    Create and persist a new lifecycle event.
    """

    data = lifecycle_event_data.model_dump()

    lifecycle_event = LifecycleEvent(**data)

    session.add(lifecycle_event)

    await session.commit()

    await session.refresh(lifecycle_event)

    return lifecycle_event


async def update_lifecycle_event(
    session: AsyncSession,
    lifecycle_event: LifecycleEvent,
    lifecycle_event_data: LifecycleEventUpdate,
) -> LifecycleEvent:
    """
    Update an existing lifecycle event.

    Only fields explicitly supplied in the request are updated.
    """

    update_data = lifecycle_event_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(lifecycle_event, field, value)

    await session.commit()

    await session.refresh(lifecycle_event)

    return lifecycle_event


async def delete_lifecycle_event(
    session: AsyncSession,
    lifecycle_event: LifecycleEvent,
) -> None:
    """
    Delete a lifecycle event.
    """

    await session.delete(lifecycle_event)

    await session.commit()