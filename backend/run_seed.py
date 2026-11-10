import asyncio

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

from app.db.session import get_engine, close_engine
from app.db.seed import seed_database


async def main():
    engine = await get_engine()

    async_session = sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False,
    )

    async with async_session() as session:
        await seed_database(session)
        print("DATABASE SEED: OK")

    await close_engine()


if __name__ == "__main__":
    asyncio.run(main())