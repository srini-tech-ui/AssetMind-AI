"""
Compliance service layer.

Contains database operations for ComplianceRecord entities.
"""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.domain import ComplianceRecord
from app.schemas.compliance import (
    ComplianceCreate,
    ComplianceUpdate,
)


async def list_compliance_records(
    session: AsyncSession,
) -> list[ComplianceRecord]:
    """
    Return all compliance records ordered by creation date.
    """

    result = await session.execute(
        select(ComplianceRecord).order_by(
            ComplianceRecord.created_at.desc()
        )
    )

    return list(result.scalars().all())


async def get_compliance_record(
    session: AsyncSession,
    compliance_id: UUID,
) -> ComplianceRecord | None:
    """
    Return a compliance record by ID.

    Returns None when the record does not exist.
    """

    result = await session.execute(
        select(ComplianceRecord).where(
            ComplianceRecord.id == compliance_id
        )
    )

    return result.scalar_one_or_none()


async def create_compliance_record(
    session: AsyncSession,
    compliance_data: ComplianceCreate,
) -> ComplianceRecord:
    """
    Create and persist a new compliance record.
    """

    data = compliance_data.model_dump()

    compliance_record = ComplianceRecord(**data)

    session.add(compliance_record)

    await session.commit()

    await session.refresh(compliance_record)

    return compliance_record


async def update_compliance_record(
    session: AsyncSession,
    compliance_record: ComplianceRecord,
    compliance_data: ComplianceUpdate,
) -> ComplianceRecord:
    """
    Update an existing compliance record.

    Only fields explicitly supplied in the request are updated.
    """

    update_data = compliance_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(compliance_record, field, value)

    await session.commit()

    await session.refresh(compliance_record)

    return compliance_record


async def delete_compliance_record(
    session: AsyncSession,
    compliance_record: ComplianceRecord,
) -> None:
    """
    Delete a compliance record.
    """

    await session.delete(compliance_record)

    await session.commit()