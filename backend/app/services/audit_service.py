"""
Audit Log service layer.

Contains database operations for audit logs.
"""

import uuid
from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.domain import AuditLog
from app.schemas.audit import (
    AuditLogCreate,
    AuditLogUpdate,
)


# ============================================
# LIST AUDIT LOGS
# ============================================

async def list_audit_logs(
    session: AsyncSession,
) -> list[AuditLog]:
    """Return all audit log entries."""

    result = await session.execute(
        select(AuditLog).order_by(
            AuditLog.timestamp.desc()
        )
    )

    return list(
        result.scalars().all()
    )


# ============================================
# GET AUDIT LOG
# ============================================

async def get_audit_log(
    audit_id: uuid.UUID,
    session: AsyncSession,
) -> AuditLog:
    """Return one audit log by ID."""

    result = await session.execute(
        select(AuditLog).where(
            AuditLog.id == audit_id
        )
    )

    audit_log = result.scalar_one_or_none()

    if audit_log is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audit log not found",
        )

    return audit_log


# ============================================
# CREATE AUDIT LOG
# ============================================

async def create_audit_log(
    audit_data: AuditLogCreate,
    session: AsyncSession,
) -> AuditLog:
    """Create a new audit log."""

    data = audit_data.model_dump(
        exclude_unset=True
    )

    if data.get("timestamp") is None:
        data["timestamp"] = datetime.utcnow()

    audit_log = AuditLog(
        **data
    )

    session.add(
        audit_log
    )

    await session.commit()

    await session.refresh(
        audit_log
    )

    return audit_log


# ============================================
# UPDATE AUDIT LOG
# ============================================

async def update_audit_log(
    audit_id: uuid.UUID,
    audit_data: AuditLogUpdate,
    session: AsyncSession,
) -> AuditLog:
    """Update an existing audit log."""

    audit_log = await get_audit_log(
        audit_id,
        session,
    )

    update_data = audit_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():

        setattr(
            audit_log,
            field,
            value,
        )

    await session.commit()

    await session.refresh(
        audit_log
    )

    return audit_log


# ============================================
# DELETE AUDIT LOG
# ============================================

async def delete_audit_log(
    audit_id: uuid.UUID,
    session: AsyncSession,
) -> None:
    """Delete an audit log."""

    audit_log = await get_audit_log(
        audit_id,
        session,
    )

    await session.delete(
        audit_log
    )

    await session.commit()