"""
Cost Entry service layer.

Contains database operations for CostEntry entities.
"""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.domain import CostEntry

from app.schemas.cost import (
    CostEntryCreate,
    CostEntryUpdate,
)


async def list_cost_entries(
    session: AsyncSession,
) -> list[CostEntry]:
    """
    Return all cost entries ordered by date.
    """

    result = await session.execute(
        select(CostEntry).order_by(
            CostEntry.date.desc()
        )
    )

    return list(result.scalars().all())


async def get_cost_entry(
    session: AsyncSession,
    cost_entry_id: UUID,
) -> CostEntry | None:
    """
    Return a cost entry by ID.

    Returns None when the cost entry does not exist.
    """

    result = await session.execute(
        select(CostEntry).where(
            CostEntry.id == cost_entry_id
        )
    )

    return result.scalar_one_or_none()


async def create_cost_entry(
    session: AsyncSession,
    cost_entry_data: CostEntryCreate,
) -> CostEntry:
    """
    Create and persist a new cost entry.
    """

    data = cost_entry_data.model_dump()

    cost_entry = CostEntry(**data)

    session.add(cost_entry)

    await session.commit()

    await session.refresh(cost_entry)

    return cost_entry


async def update_cost_entry(
    session: AsyncSession,
    cost_entry: CostEntry,
    cost_entry_data: CostEntryUpdate,
) -> CostEntry:
    """
    Update an existing cost entry.

    Only fields explicitly supplied in the request are updated.
    """

    update_data = cost_entry_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(cost_entry, field, value)

    await session.commit()

    await session.refresh(cost_entry)

    return cost_entry


async def delete_cost_entry(
    session: AsyncSession,
    cost_entry: CostEntry,
) -> None:
    """
    Delete a cost entry.
    """

    await session.delete(cost_entry)

    await session.commit()