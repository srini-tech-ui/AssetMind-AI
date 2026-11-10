"""
Audit Log API routes.
"""

import uuid

from fastapi import (
    APIRouter,
    Depends,
    Response,
    status,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db

from app.schemas.audit import (
    AuditLogCreate,
    AuditLogResponse,
    AuditLogUpdate,
)

from app.services.audit_service import (
    create_audit_log,
    delete_audit_log,
    get_audit_log,
    list_audit_logs,
    update_audit_log,
)


# ============================================
# ROUTER
# ============================================

router = APIRouter(
    prefix="/audit",
    tags=["Audit Logs"],
)


# ============================================
# GET ALL
# ============================================

@router.get(
    "",
    response_model=list[AuditLogResponse],
    summary="List audit logs",
)
async def get_all_audit_logs(
    session: AsyncSession = Depends(get_db),
):
    """Return all audit logs."""

    return await list_audit_logs(
        session
    )


# ============================================
# GET BY ID
# ============================================

@router.get(
    "/{audit_id}",
    response_model=AuditLogResponse,
    summary="Get audit log by ID",
)
async def get_audit_log_by_id(
    audit_id: uuid.UUID,
    session: AsyncSession = Depends(get_db),
):
    """Return one audit log."""

    return await get_audit_log(
        audit_id,
        session,
    )


# ============================================
# CREATE
# ============================================

@router.post(
    "",
    response_model=AuditLogResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create audit log",
)
async def create_new_audit_log(
    audit_data: AuditLogCreate,
    session: AsyncSession = Depends(get_db),
):
    """Create a new audit log."""

    return await create_audit_log(
        audit_data,
        session,
    )


# ============================================
# UPDATE
# ============================================

@router.put(
    "/{audit_id}",
    response_model=AuditLogResponse,
    summary="Update audit log",
)
async def update_existing_audit_log(
    audit_id: uuid.UUID,
    audit_data: AuditLogUpdate,
    session: AsyncSession = Depends(get_db),
):
    """Update an existing audit log."""

    return await update_audit_log(
        audit_id,
        audit_data,
        session,
    )


# ============================================
# DELETE
# ============================================

@router.delete(
    "/{audit_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete audit log",
)
async def delete_existing_audit_log(
    audit_id: uuid.UUID,
    session: AsyncSession = Depends(get_db),
):
    """Delete an audit log."""

    await delete_audit_log(
        audit_id,
        session,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )