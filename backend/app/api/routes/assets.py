"""
Asset API routes.

Provides CRUD endpoints for Asset entities.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_session
from app.schemas.asset import (
    AssetCreate,
    AssetResponse,
    AssetUpdate,
)
from app.services.asset_service import (
    create_asset,
    delete_asset,
    get_asset,
    list_assets,
    update_asset,
)


router = APIRouter(
    prefix="/assets",
    tags=["assets"],
)


# ============================================
# LIST ASSETS
# ============================================

@router.get(
    "",
    response_model=list[AssetResponse],
)
async def get_assets(
    session: AsyncSession = Depends(get_session),
) -> list[AssetResponse]:
    """Return all assets."""

    assets = await list_assets(session)

    return assets


# ============================================
# GET ASSET BY ID
# ============================================

@router.get(
    "/{asset_id}",
    response_model=AssetResponse,
)
async def get_asset_by_id(
    asset_id: UUID,
    session: AsyncSession = Depends(get_session),
) -> AssetResponse:
    """Return a single asset by ID."""

    asset = await get_asset(
        session=session,
        asset_id=asset_id,
    )

    if asset is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Asset {asset_id} not found",
        )

    return asset


# ============================================
# CREATE ASSET
# ============================================

@router.post(
    "",
    response_model=AssetResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_new_asset(
    asset_data: AssetCreate,
    session: AsyncSession = Depends(get_session),
) -> AssetResponse:
    """Create a new asset."""

    asset = await create_asset(
        session=session,
        asset_data=asset_data,
    )

    return asset


# ============================================
# UPDATE ASSET
# ============================================

@router.put(
    "/{asset_id}",
    response_model=AssetResponse,
)
async def update_existing_asset(
    asset_id: UUID,
    asset_data: AssetUpdate,
    session: AsyncSession = Depends(get_session),
) -> AssetResponse:
    """Update an existing asset."""

    asset = await get_asset(
        session=session,
        asset_id=asset_id,
    )

    if asset is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Asset {asset_id} not found",
        )

    updated_asset = await update_asset(
        session=session,
        asset=asset,
        asset_data=asset_data,
    )

    return updated_asset


# ============================================
# DELETE ASSET
# ============================================

@router.delete(
    "/{asset_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_existing_asset(
    asset_id: UUID,
    session: AsyncSession = Depends(get_session),
) -> None:
    """Delete an existing asset."""

    asset = await get_asset(
        session=session,
        asset_id=asset_id,
    )

    if asset is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Asset {asset_id} not found",
        )

    await delete_asset(
        session=session,
        asset=asset,
    )