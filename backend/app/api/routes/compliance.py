"""
Compliance API routes.

Provides CRUD endpoints for ComplianceRecord entities.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_session

from app.schemas.compliance import (
    ComplianceCreate,
    ComplianceResponse,
    ComplianceUpdate,
)

from app.services.compliance_service import (
    create_compliance_record,
    delete_compliance_record,
    get_compliance_record,
    list_compliance_records,
    update_compliance_record,
)


router = APIRouter(
    prefix="/compliance",
    tags=["compliance"],
)


# ============================================
# LIST COMPLIANCE RECORDS
# ============================================

@router.get(
    "",
    response_model=list[ComplianceResponse],
)
async def get_compliance_records(
    session: AsyncSession = Depends(get_session),
) -> list[ComplianceResponse]:
    """Return all compliance records."""

    compliance_records = await list_compliance_records(
        session
    )

    return compliance_records


# ============================================
# GET COMPLIANCE RECORD BY ID
# ============================================

@router.get(
    "/{compliance_id}",
    response_model=ComplianceResponse,
)
async def get_compliance_record_by_id(
    compliance_id: UUID,
    session: AsyncSession = Depends(get_session),
) -> ComplianceResponse:
    """Return a single compliance record by ID."""

    compliance_record = await get_compliance_record(
        session=session,
        compliance_id=compliance_id,
    )

    if compliance_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                f"Compliance record {compliance_id} not found"
            ),
        )

    return compliance_record


# ============================================
# CREATE COMPLIANCE RECORD
# ============================================

@router.post(
    "",
    response_model=ComplianceResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_new_compliance_record(
    compliance_data: ComplianceCreate,
    session: AsyncSession = Depends(get_session),
) -> ComplianceResponse:
    """Create a new compliance record."""

    compliance_record = await create_compliance_record(
        session=session,
        compliance_data=compliance_data,
    )

    return compliance_record


# ============================================
# UPDATE COMPLIANCE RECORD
# ============================================

@router.put(
    "/{compliance_id}",
    response_model=ComplianceResponse,
)
async def update_existing_compliance_record(
    compliance_id: UUID,
    compliance_data: ComplianceUpdate,
    session: AsyncSession = Depends(get_session),
) -> ComplianceResponse:
    """Update an existing compliance record."""

    compliance_record = await get_compliance_record(
        session=session,
        compliance_id=compliance_id,
    )

    if compliance_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                f"Compliance record {compliance_id} not found"
            ),
        )

    updated_compliance_record = (
        await update_compliance_record(
            session=session,
            compliance_record=compliance_record,
            compliance_data=compliance_data,
        )
    )

    return updated_compliance_record


# ============================================
# DELETE COMPLIANCE RECORD
# ============================================

@router.delete(
    "/{compliance_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_existing_compliance_record(
    compliance_id: UUID,
    session: AsyncSession = Depends(get_session),
) -> None:
    """Delete an existing compliance record."""

    compliance_record = await get_compliance_record(
        session=session,
        compliance_id=compliance_id,
    )

    if compliance_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                f"Compliance record {compliance_id} not found"
            ),
        )

    await delete_compliance_record(
        session=session,
        compliance_record=compliance_record,
    )