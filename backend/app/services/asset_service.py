"""
Asset service layer.

Contains database operations for Asset entities.
"""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.domain import Asset
from app.schemas.asset import AssetCreate, AssetUpdate


async def list_assets(
    session: AsyncSession,
) -> list[Asset]:
    """
    Return all assets ordered by creation date.
    """

    result = await session.execute(
        select(Asset).order_by(Asset.created_at.desc())
    )

    return list(result.scalars().all())


async def get_asset(
    session: AsyncSession,
    asset_id: UUID,
) -> Asset | None:
    """
    Return an asset by ID.

    Returns None when the asset does not exist.
    """

    result = await session.execute(
        select(Asset).where(Asset.id == asset_id)
    )

    return result.scalar_one_or_none()


async def create_asset(
    session: AsyncSession,
    asset_data: AssetCreate,
) -> Asset:
    """
    Create and persist a new asset.
    """

    data = asset_data.model_dump()

    # SQLAlchemy model uses extra_metadata internally,
    # while the API exposes the field as metadata.
    data["extra_metadata"] = data.pop("metadata")

    asset = Asset(**data)

    session.add(asset)

    await session.commit()

    await session.refresh(asset)

    return asset


async def update_asset(
    session: AsyncSession,
    asset: Asset,
    asset_data: AssetUpdate,
) -> Asset:
    """
    Update an existing asset.

    Only fields explicitly supplied in the request are updated.
    """

    update_data = asset_data.model_dump(
        exclude_unset=True
    )

    # Convert API metadata field to ORM field.
    if "metadata" in update_data:
        update_data["extra_metadata"] = update_data.pop(
            "metadata"
        )

    for field, value in update_data.items():
        setattr(asset, field, value)

    await session.commit()

    await session.refresh(asset)

    return asset


async def delete_asset(
    session: AsyncSession,
    asset: Asset,
) -> None:
    """
    Delete an asset.
    """

    await session.delete(asset)

    await session.commit()