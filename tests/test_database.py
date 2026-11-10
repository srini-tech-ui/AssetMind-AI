"""
Database model tests for AI Asset Intelligence Platform.

Tests verify ORM model definitions, constraints, and relationships.
"""
import uuid
from datetime import datetime, timedelta
from decimal import Decimal

import pytest
import pytest_asyncio
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.db.base import Base
from app.db.seed import seed_database, stable_uuid
from app.models import (
    Asset,
    AssetOwner,
    Risk,
    ComplianceRecord,
    LifecycleEvent,
    CostEntry,
    Recommendation,
    Workflow,
    WorkflowStep,
    WorkflowInstance,
    WorkflowInstanceStep,
    AuditLog,
    ReconciliationRecord,
    Approval,
    ApprovalStep,
)
from app.models.domain import (
    AssetTypeEnum,
    AssetStatusEnum,
    RiskSeverityEnum,
    RiskStatusEnum,
    RiskCategoryEnum,
    RiskLikelihoodEnum,
    RiskImpactEnum,
    ComplianceFrameworkEnum,
    ComplianceStatusEnum,
    LifecycleEventTypeEnum,
    LifecycleStatusEnum,
    CostCategoryEnum,
    RecurrencePeriodEnum,
    RecommendationCategoryEnum,
    RecommendationPriorityEnum,
    RecommendationStatusEnum,
    WorkflowTypeEnum,
    WorkflowStatusEnum,
    WorkflowTriggerTypeEnum,
    AuditEventSeverityEnum,
    ReconciliationStatusEnum,
)


# Use in-memory SQLite for testing
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest_asyncio.fixture
async def db_engine():
    """Create test database engine."""
    engine = create_async_engine(
        TEST_DATABASE_URL,
        echo=False,
    )
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield engine
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    
    await engine.dispose()


@pytest_asyncio.fixture
async def db_session(db_engine):
    """Create test database session."""
    async_session = sessionmaker(
        db_engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with async_session() as session:
        yield session


class TestAssetOwner:
    """Test AssetOwner model."""
    
    async def test_create_asset_owner(self, db_session: AsyncSession):
        """Test creating an asset owner."""
        owner = AssetOwner(
            id=uuid.uuid4(),
            name="Test Owner",
            email="owner@example.com",
            department="IT",
            role="Manager",
            is_active=True,
        )
        db_session.add(owner)
        await db_session.commit()
        
        # Retrieve and verify
        result = await db_session.execute(
            select(AssetOwner).where(AssetOwner.email == "owner@example.com")
        )
        retrieved = result.scalar_one_or_none()
        assert retrieved is not None
        assert retrieved.name == "Test Owner"
        assert retrieved.is_active is True
    
    async def test_asset_owner_unique_email(self, db_session: AsyncSession):
        """Test that email must be unique."""
        owner1 = AssetOwner(
            id=uuid.uuid4(),
            name="Owner 1",
            email="duplicate@example.com",
        )
        owner2 = AssetOwner(
            id=uuid.uuid4(),
            name="Owner 2",
            email="duplicate@example.com",
        )
        
        db_session.add(owner1)
        await db_session.commit()
        
        db_session.add(owner2)
        with pytest.raises(IntegrityError):
            await db_session.commit()


class TestAsset:
    """Test Asset model."""
    
    async def test_create_asset(self, db_session: AsyncSession):
        """Test creating an asset."""
        owner = AssetOwner(
            id=uuid.uuid4(),
            name="Asset Owner",
            email="owner@example.com",
        )
        db_session.add(owner)
        await db_session.flush()
        
        asset = Asset(
            id=uuid.uuid4(),
            name="test-server-01",
            type=AssetTypeEnum.server,
            status=AssetStatusEnum.active,
            owner_id=owner.id,
            cost_center="CC-001",
        )
        db_session.add(asset)
        await db_session.commit()
        
        result = await db_session.execute(
            select(Asset).where(Asset.name == "test-server-01")
        )
        retrieved = result.scalar_one_or_none()
        assert retrieved is not None
        assert retrieved.type == AssetTypeEnum.server
        assert retrieved.owner_id == owner.id
    
    async def test_asset_unique_name(self, db_session: AsyncSession):
        """Test that asset name must be unique."""
        asset1 = Asset(
            id=uuid.uuid4(),
            name="duplicate-asset",
            type=AssetTypeEnum.server,
        )
        asset2 = Asset(
            id=uuid.uuid4(),
            name="duplicate-asset",
            type=AssetTypeEnum.server,
        )
        
        db_session.add(asset1)
        await db_session.commit()
        
        db_session.add(asset2)
        with pytest.raises(IntegrityError):
            await db_session.commit()


class TestRisk:
    """Test Risk model."""
    
    async def test_create_risk(self, db_session: AsyncSession):
        """Test creating a risk."""
        asset = Asset(
            id=uuid.uuid4(),
            name="test-asset",
            type=AssetTypeEnum.server,
        )
        db_session.add(asset)
        await db_session.flush()
        
        now = datetime.utcnow()
        risk = Risk(
            id=uuid.uuid4(),
            asset_id=asset.id,
            title="Test Risk",
            category=RiskCategoryEnum.security,
            severity=RiskSeverityEnum.high,
            likelihood=RiskLikelihoodEnum.medium,
            impact=RiskImpactEnum.high,
            status=RiskStatusEnum.open,
            identified_date=now,
        )
        db_session.add(risk)
        await db_session.commit()
        
        result = await db_session.execute(
            select(Risk).where(Risk.asset_id == asset.id)
        )
        retrieved = result.scalar_one_or_none()
        assert retrieved is not None
        assert retrieved.title == "Test Risk"
        assert retrieved.severity == RiskSeverityEnum.high


class TestCompliance:
    """Test ComplianceRecord model."""
    
    async def test_create_compliance_record(self, db_session: AsyncSession):
        """Test creating a compliance record."""
        asset = Asset(
            id=uuid.uuid4(),
            name="test-asset",
            type=AssetTypeEnum.server,
        )
        db_session.add(asset)
        await db_session.flush()
        
        now = datetime.utcnow()
        record = ComplianceRecord(
            id=uuid.uuid4(),
            asset_id=asset.id,
            framework=ComplianceFrameworkEnum.iso_27001,
            requirement_id="A.12.1",
            requirement_title="Test Requirement",
            status=ComplianceStatusEnum.compliant,
            last_assessed=now,
        )
        db_session.add(record)
        await db_session.commit()
        
        result = await db_session.execute(
            select(ComplianceRecord).where(ComplianceRecord.asset_id == asset.id)
        )
        retrieved = result.scalar_one_or_none()
        assert retrieved is not None
        assert retrieved.framework == ComplianceFrameworkEnum.iso_27001


class TestLifecycleEvent:
    """Test LifecycleEvent model."""
    
    async def test_create_lifecycle_event(self, db_session: AsyncSession):
        """Test creating a lifecycle event."""
        asset = Asset(
            id=uuid.uuid4(),
            name="test-asset",
            type=AssetTypeEnum.server,
        )
        db_session.add(asset)
        await db_session.flush()
        
        now = datetime.utcnow()
        event = LifecycleEvent(
            id=uuid.uuid4(),
            asset_id=asset.id,
            event_type=LifecycleEventTypeEnum.procurement,
            title="Asset Purchased",
            status=LifecycleStatusEnum.completed,
            scheduled_date=now,
            completed_date=now,
        )
        db_session.add(event)
        await db_session.commit()
        
        result = await db_session.execute(
            select(LifecycleEvent).where(LifecycleEvent.asset_id == asset.id)
        )
        retrieved = result.scalar_one_or_none()
        assert retrieved is not None
        assert retrieved.event_type == LifecycleEventTypeEnum.procurement


class TestCostEntry:
    """Test CostEntry model."""
    
    async def test_create_cost_entry(self, db_session: AsyncSession):
        """Test creating a cost entry."""
        asset = Asset(
            id=uuid.uuid4(),
            name="test-asset",
            type=AssetTypeEnum.server,
        )
        db_session.add(asset)
        await db_session.flush()
        
        entry = CostEntry(
            id=uuid.uuid4(),
            asset_id=asset.id,
            category=CostCategoryEnum.acquisition,
            amount=Decimal("10000.00"),
            currency="USD",
            date=datetime.utcnow(),
        )
        db_session.add(entry)
        await db_session.commit()
        
        result = await db_session.execute(
            select(CostEntry).where(CostEntry.asset_id == asset.id)
        )
        retrieved = result.scalar_one_or_none()
        assert retrieved is not None
        assert retrieved.amount == Decimal("10000.00")
        assert retrieved.category == CostCategoryEnum.acquisition


class TestRecommendation:
    """Test Recommendation model."""
    
    async def test_create_recommendation(self, db_session: AsyncSession):
        """Test creating a recommendation."""
        asset = Asset(
            id=uuid.uuid4(),
            name="test-asset",
            type=AssetTypeEnum.server,
        )
        db_session.add(asset)
        await db_session.flush()
        
        rec = Recommendation(
            id=uuid.uuid4(),
            asset_id=asset.id,
            title="Test Recommendation",
            category=RecommendationCategoryEnum.performance,
            priority=RecommendationPriorityEnum.high,
            status=RecommendationStatusEnum.proposed,
            confidence=0.85,
        )
        db_session.add(rec)
        await db_session.commit()
        
        result = await db_session.execute(
            select(Recommendation).where(Recommendation.asset_id == asset.id)
        )
        retrieved = result.scalar_one_or_none()
        assert retrieved is not None
        assert retrieved.title == "Test Recommendation"
        assert retrieved.confidence == 0.85


class TestWorkflow:
    """Test Workflow model."""
    
    async def test_create_workflow(self, db_session: AsyncSession):
        """Test creating a workflow."""
        workflow = Workflow(
            id=uuid.uuid4(),
            name="Test Workflow",
            type=WorkflowTypeEnum.asset_onboarding,
            status=WorkflowStatusEnum.draft,
            trigger_type=WorkflowTriggerTypeEnum.manual,
        )
        db_session.add(workflow)
        await db_session.commit()
        
        result = await db_session.execute(
            select(Workflow).where(Workflow.name == "Test Workflow")
        )
        retrieved = result.scalar_one_or_none()
        assert retrieved is not None
        assert retrieved.type == WorkflowTypeEnum.asset_onboarding
    
    async def test_workflow_with_steps(self, db_session: AsyncSession):
        """Test workflow with steps."""
        workflow = Workflow(
            id=uuid.uuid4(),
            name="Test Workflow with Steps",
            type=WorkflowTypeEnum.asset_onboarding,
            status=WorkflowStatusEnum.draft,
            trigger_type=WorkflowTriggerTypeEnum.manual,
        )
        db_session.add(workflow)
        await db_session.flush()
        
        step1 = WorkflowStep(
            id="step-1",
            workflow_id=workflow.id,
            name="Step 1",
            type="task",
            assignee_type="user",
            order=1,
        )
        step2 = WorkflowStep(
            id="step-2",
            workflow_id=workflow.id,
            name="Step 2",
            type="approval",
            assignee_type="role",
            order=2,
        )
        db_session.add_all([step1, step2])
        await db_session.commit()
        
        result = await db_session.execute(
            select(Workflow).where(Workflow.id == workflow.id)
        )
        retrieved = result.scalar_one_or_none()
        assert len(retrieved.steps) == 2


class TestAuditLog:
    """Test AuditLog model."""
    
    async def test_create_audit_log(self, db_session: AsyncSession):
        """Test creating an audit log."""
        asset_id = uuid.uuid4()
        log = AuditLog(
            id=uuid.uuid4(),
            timestamp=datetime.utcnow(),
            event_type="asset_created",
            resource_type="Asset",
            resource_id=asset_id,
            user_name="test_user",
            user_roles=["admin"],
            changes={"status": {"before": None, "after": "active"}},
            severity=AuditEventSeverityEnum.info,
        )
        db_session.add(log)
        await db_session.commit()
        
        result = await db_session.execute(
            select(AuditLog).where(AuditLog.event_type == "asset_created")
        )
        retrieved = result.scalar_one_or_none()
        assert retrieved is not None
        assert retrieved.event_type == "asset_created"


class TestReconciliationRecord:
    """Test ReconciliationRecord model."""
    
    async def test_create_reconciliation_record(self, db_session: AsyncSession):
        """Test creating a reconciliation record."""
        asset = Asset(
            id=uuid.uuid4(),
            name="test-asset",
            type=AssetTypeEnum.server,
        )
        db_session.add(asset)
        await db_session.flush()
        
        record = ReconciliationRecord(
            id=uuid.uuid4(),
            asset_id=asset.id,
            asset_name=asset.name,
            source_system="System A",
            target_system="System B",
            expected_value="value1",
            actual_value="value1",
            status=ReconciliationStatusEnum.matched,
            last_checked=datetime.utcnow(),
        )
        db_session.add(record)
        await db_session.commit()
        
        result = await db_session.execute(
            select(ReconciliationRecord).where(
                ReconciliationRecord.asset_id == asset.id
            )
        )
        retrieved = result.scalar_one_or_none()
        assert retrieved is not None
        assert retrieved.status == ReconciliationStatusEnum.matched


class TestSeedData:
    """Test database seeding."""
    
    async def test_seed_creates_all_entities(self, db_session: AsyncSession):
        """Test that seed data creates all expected entities."""
        await seed_database(db_session)
        
        # Verify counts
        owners_result = await db_session.execute(select(AssetOwner))
        owners = owners_result.scalars().all()
        assert len(owners) == 4
        
        assets_result = await db_session.execute(select(Asset))
        assets = assets_result.scalars().all()
        assert len(assets) == 4
        
        risks_result = await db_session.execute(select(Risk))
        risks = risks_result.scalars().all()
        assert len(risks) == 2
        
        recommendations_result = await db_session.execute(
            select(Recommendation)
        )
        recommendations = recommendations_result.scalars().all()
        assert len(recommendations) == 2
    
    async def test_seed_creates_relationships(self, db_session: AsyncSession):
        """Test that seed data maintains relationships."""
        await seed_database(db_session)
        
        # Get an asset with an owner
        asset_result = await db_session.execute(
            select(Asset).where(Asset.owner_id != None)  # noqa: E712
        )
        asset = asset_result.scalar_one_or_none()
        
        assert asset is not None
        assert asset.owner is not None
        assert asset.owner.name is not None


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
