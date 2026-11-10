"""
Risk service layer.

Contains database operations for Risk entities.
"""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.domain import Risk
from app.schemas.risk import RiskCreate, RiskUpdate


async def list_risks(
    session: AsyncSession,
) -> list[Risk]:
    """
    Return all risks ordered by creation date.
    """

    result = await session.execute(
        select(Risk).order_by(Risk.created_at.desc())
    )

    return list(result.scalars().all())


async def get_risk(
    session: AsyncSession,
    risk_id: UUID,
) -> Risk | None:
    """
    Return a risk by ID.

    Returns None when the risk does not exist.
    """

    result = await session.execute(
        select(Risk).where(Risk.id == risk_id)
    )

    return result.scalar_one_or_none()


async def create_risk(
    session: AsyncSession,
    risk_data: RiskCreate,
) -> Risk:
    """
    Create and persist a new risk.
    """

    data = risk_data.model_dump()

    risk = Risk(**data)

    session.add(risk)

    await session.commit()

    await session.refresh(risk)

    return risk


async def update_risk(
    session: AsyncSession,
    risk: Risk,
    risk_data: RiskUpdate,
) -> Risk:
    """
    Update an existing risk.

    Only fields explicitly supplied in the request are updated.
    """

    update_data = risk_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(risk, field, value)

    await session.commit()

    await session.refresh(risk)

    return risk


async def delete_risk(
    session: AsyncSession,
    risk: Risk,
) -> None:
    """
    Delete a risk.
    """

    await session.delete(risk)

    await session.commit()