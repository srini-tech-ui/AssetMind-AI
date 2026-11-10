"""
Risk API routes.

Provides CRUD endpoints for Risk entities.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_session
from app.schemas.risk import (
    RiskCreate,
    RiskResponse,
    RiskUpdate,
)
from app.services.risk_service import (
    create_risk,
    delete_risk,
    get_risk,
    list_risks,
    update_risk,
)


router = APIRouter(
    prefix="/risks",
    tags=["risks"],
)


# ============================================
# LIST RISKS
# ============================================

@router.get(
    "",
    response_model=list[RiskResponse],
)
async def get_risks(
    session: AsyncSession = Depends(get_session),
) -> list[RiskResponse]:
    """Return all risks."""

    risks = await list_risks(session)

    return risks


# ============================================
# GET RISK BY ID
# ============================================

@router.get(
    "/{risk_id}",
    response_model=RiskResponse,
)
async def get_risk_by_id(
    risk_id: UUID,
    session: AsyncSession = Depends(get_session),
) -> RiskResponse:
    """Return a single risk by ID."""

    risk = await get_risk(
        session=session,
        risk_id=risk_id,
    )

    if risk is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Risk {risk_id} not found",
        )

    return risk


# ============================================
# CREATE RISK
# ============================================

@router.post(
    "",
    response_model=RiskResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_new_risk(
    risk_data: RiskCreate,
    session: AsyncSession = Depends(get_session),
) -> RiskResponse:
    """Create a new risk."""

    risk = await create_risk(
        session=session,
        risk_data=risk_data,
    )

    return risk


# ============================================
# UPDATE RISK
# ============================================

@router.put(
    "/{risk_id}",
    response_model=RiskResponse,
)
async def update_existing_risk(
    risk_id: UUID,
    risk_data: RiskUpdate,
    session: AsyncSession = Depends(get_session),
) -> RiskResponse:
    """Update an existing risk."""

    risk = await get_risk(
        session=session,
        risk_id=risk_id,
    )

    if risk is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Risk {risk_id} not found",
        )

    updated_risk = await update_risk(
        session=session,
        risk=risk,
        risk_data=risk_data,
    )

    return updated_risk


# ============================================
# DELETE RISK
# ============================================

@router.delete(
    "/{risk_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_existing_risk(
    risk_id: UUID,
    session: AsyncSession = Depends(get_session),
) -> None:
    """Delete an existing risk."""

    risk = await get_risk(
        session=session,
        risk_id=risk_id,
    )

    if risk is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Risk {risk_id} not found",
        )

    await delete_risk(
        session=session,
        risk=risk,
    )