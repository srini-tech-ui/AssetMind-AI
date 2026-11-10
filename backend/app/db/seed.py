"""
Seed data for database initialization.

This module provides deterministic seed data for development and testing.
All data uses stable UUIDs for reproducibility.
"""
import uuid
from datetime import datetime, timedelta
from decimal import Decimal

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
)
from app.models.domain import (
    AssetTypeEnum,
    AssetStatusEnum,
    RiskCategoryEnum,
    RiskSeverityEnum,
    RiskLikelihoodEnum,
    RiskImpactEnum,
    RiskStatusEnum,
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
    WorkflowStepTypeEnum,
    WorkflowAssigneeTypeEnum,
    WorkflowTriggerTypeEnum,
    WorkflowInstanceStatusEnum,
    WorkflowInstanceStepStatusEnum,
    AuditEventSeverityEnum,
    ReconciliationStatusEnum,
    ApprovalStatusEnum,
    ApprovalTypeEnum,
    ApprovalPriorityEnum,
    ApprovalStepStatusEnum,
)

# Use stable namespace UUIDs for reproducibility
NAMESPACE_SEED = uuid.UUID("00000000-0000-5000-8000-000000000000")


def stable_uuid(name: str, namespace: uuid.UUID = NAMESPACE_SEED) -> uuid.UUID:
    """Generate a stable UUID from a string."""
    return uuid.uuid5(namespace, name)


async def seed_database(session) -> None:
    """Seed database with initial data.
    
    Args:
        session: AsyncSession for database operations
    """
    now = datetime.utcnow()
    
    # ============================================
    # ASSET OWNERS
    # ============================================
    owners = [
        AssetOwner(
            id=stable_uuid("owner-alice"),
            name="Alice Johnson",
            email="alice.johnson@example.com",
            department="IT Operations",
            role="Senior IT Manager",
            phone="+1-555-0001",
            avatar_url="https://example.com/avatars/alice.jpg",
            is_active=True,
            created_at=now,
            updated_at=now,
        ),
        AssetOwner(
            id=stable_uuid("owner-bob"),
            name="Bob Smith",
            email="bob.smith@example.com",
            department="Infrastructure",
            role="Infrastructure Engineer",
            phone="+1-555-0002",
            avatar_url="https://example.com/avatars/bob.jpg",
            is_active=True,
            created_at=now,
            updated_at=now,
        ),
        AssetOwner(
            id=stable_uuid("owner-carol"),
            name="Carol White",
            email="carol.white@example.com",
            department="Security",
            role="Security Officer",
            phone="+1-555-0003",
            avatar_url="https://example.com/avatars/carol.jpg",
            is_active=True,
            created_at=now,
            updated_at=now,
        ),
        AssetOwner(
            id=stable_uuid("owner-david"),
            name="David Brown",
            email="david.brown@example.com",
            department="Compliance",
            role="Compliance Manager",
            phone="+1-555-0004",
            is_active=True,
            created_at=now,
            updated_at=now,
        ),
    ]
    session.add_all(owners)
    await session.flush()
    
    # ============================================
    # ASSETS
    # ============================================
    assets = [
        Asset(
            id=stable_uuid("asset-server-1"),
            name="prod-server-01",
            type=AssetTypeEnum.server,
            status=AssetStatusEnum.active,
            manufacturer="Dell",
            model="PowerEdge R750",
            serial_number="SN123456789",
            purchase_date=now - timedelta(days=730),
            warranty_expiry=now + timedelta(days=365),
            location_id=stable_uuid("location-dc1"),
            business_unit_id=stable_uuid("bu-operations"),
            owner_id=owners[0].id,
            cost_center="CC-001",
            tags=["production", "critical", "virtualization"],
            metadata={"rack": "A10", "power_consumption": "2.5kW"},
            created_at=now,
            updated_at=now,
        ),
        Asset(
            id=stable_uuid("asset-laptop-1"),
            name="laptop-alice-001",
            type=AssetTypeEnum.laptop,
            status=AssetStatusEnum.active,
            manufacturer="Apple",
            model="MacBook Pro 16",
            serial_number="C02ABC123DEF",
            purchase_date=now - timedelta(days=365),
            warranty_expiry=now + timedelta(days=365),
            location_id=stable_uuid("location-office-1"),
            business_unit_id=stable_uuid("bu-engineering"),
            owner_id=owners[0].id,
            cost_center="CC-002",
            tags=["employee-device", "development"],
            metadata={"memory_gb": 32, "storage_gb": 1024},
            created_at=now,
            updated_at=now,
        ),
        Asset(
            id=stable_uuid("asset-network-1"),
            name="core-switch-01",
            type=AssetTypeEnum.network,
            status=AssetStatusEnum.active,
            manufacturer="Cisco",
            model="Catalyst 9400",
            serial_number="FOC2451A1234",
            purchase_date=now - timedelta(days=1095),
            warranty_expiry=now + timedelta(days=180),
            location_id=stable_uuid("location-dc1"),
            business_unit_id=stable_uuid("bu-operations"),
            owner_id=owners[1].id,
            cost_center="CC-001",
            tags=["network", "critical", "core-infrastructure"],
            metadata={"ports": 48, "redundancy": "active-active"},
            created_at=now,
            updated_at=now,
        ),
        Asset(
            id=stable_uuid("asset-storage-1"),
            name="nas-storage-01",
            type=AssetTypeEnum.storage,
            status=AssetStatusEnum.active,
            manufacturer="NetApp",
            model="A800",
            serial_number="NET123ABC",
            purchase_date=now - timedelta(days=730),
            warranty_expiry=now + timedelta(days=730),
            location_id=stable_uuid("location-dc1"),
            business_unit_id=stable_uuid("bu-operations"),
            owner_id=owners[1].id,
            cost_center="CC-001",
            tags=["storage", "critical", "backup"],
            metadata={"capacity_tb": 100, "raid_type": "RAID-DP"},
            created_at=now,
            updated_at=now,
        ),
    ]
    session.add_all(assets)
    await session.flush()
    
    # ============================================
    # RISKS
    # ============================================
    risks = [
        Risk(
            id=stable_uuid("risk-1"),
            asset_id=assets[0].id,
            title="Server CPU running at high utilization",
            description="Production server frequently experiencing high CPU usage during business hours",
            category=RiskCategoryEnum.operational,
            severity=RiskSeverityEnum.high,
            likelihood=RiskLikelihoodEnum.high,
            impact=RiskImpactEnum.high,
            status=RiskStatusEnum.open,
            identified_date=now - timedelta(days=30),
            target_resolution_date=now + timedelta(days=30),
            owner_id=owners[0].id,
            mitigation_plan="Upgrade CPU or implement load balancing",
            evidence=["cpu_monitoring_dashboard", "performance_alert_logs"],
            tags=["cpu", "performance"],
            created_at=now,
            updated_at=now,
        ),
        Risk(
            id=stable_uuid("risk-2"),
            asset_id=assets[2].id,
            title="Network switch firmware outdated",
            description="Core network switch running firmware version from 2021, latest version available",
            category=RiskCategoryEnum.security,
            severity=RiskSeverityEnum.critical,
            likelihood=RiskLikelihoodEnum.medium,
            impact=RiskImpactEnum.critical,
            status=RiskStatusEnum.in_progress,
            identified_date=now - timedelta(days=60),
            target_resolution_date=now + timedelta(days=7),
            owner_id=owners[1].id,
            mitigation_plan="Schedule maintenance window to upgrade firmware",
            evidence=["cve_database_report"],
            tags=["security", "firmware", "network"],
            created_at=now,
            updated_at=now,
        ),
    ]
    session.add_all(risks)
    await session.flush()
    
    # ============================================
    # COMPLIANCE RECORDS
    # ============================================
    compliance_records = [
        ComplianceRecord(
            id=stable_uuid("compliance-1"),
            asset_id=assets[0].id,
            framework=ComplianceFrameworkEnum.iso_27001,
            requirement_id="A.12.2.1",
            requirement_title="Access Control to Production Systems",
            status=ComplianceStatusEnum.compliant,
            evidence=["access_control_policy_v3.pdf", "audit_log_2024.csv"],
            last_assessed=now - timedelta(days=30),
            next_assessment_due=now + timedelta(days=150),
            assessor_id=owners[3].id,
            notes="Server properly configured with role-based access control",
            created_at=now,
            updated_at=now,
        ),
        ComplianceRecord(
            id=stable_uuid("compliance-2"),
            asset_id=assets[2].id,
            framework=ComplianceFrameworkEnum.pci_dss,
            requirement_id="6.2",
            requirement_title="Security Patches and Firmware Updates",
            status=ComplianceStatusEnum.partial,
            evidence=["patch_management_report.pdf"],
            last_assessed=now - timedelta(days=10),
            next_assessment_due=now + timedelta(days=170),
            assessor_id=owners[3].id,
            notes="Firmware requires urgent update. Other security patches current.",
            created_at=now,
            updated_at=now,
        ),
    ]
    session.add_all(compliance_records)
    await session.flush()
    
    # ============================================
    # LIFECYCLE EVENTS
    # ============================================
    lifecycle_events = [
        LifecycleEvent(
            id=stable_uuid("lifecycle-1"),
            asset_id=assets[0].id,
            event_type=LifecycleEventTypeEnum.procurement,
            title="Server purchase from Dell",
            description="Initial procurement of production server",
            scheduled_date=now - timedelta(days=730),
            completed_date=now - timedelta(days=720),
            status=LifecycleStatusEnum.completed,
            performed_by=owners[1].id,
            cost=Decimal("15000.00"),
            vendor="Dell",
            notes="Delivered on schedule, all tests passed",
            attachments=["purchase_order_dell_123456.pdf"],
            created_at=now,
            updated_at=now,
        ),
        LifecycleEvent(
            id=stable_uuid("lifecycle-2"),
            asset_id=assets[0].id,
            event_type=LifecycleEventTypeEnum.maintenance,
            title="Quarterly maintenance check",
            description="Routine hardware inspection and cleaning",
            scheduled_date=now + timedelta(days=30),
            completed_date=None,
            status=LifecycleStatusEnum.planned,
            performed_by=None,
            cost=Decimal("500.00"),
            vendor="Internal IT",
            notes="Preventive maintenance",
            attachments=[],
            created_at=now,
            updated_at=now,
        ),
    ]
    session.add_all(lifecycle_events)
    await session.flush()
    
    # ============================================
    # COST ENTRIES
    # ============================================
    cost_entries = [
        CostEntry(
            id=stable_uuid("cost-1"),
            asset_id=assets[0].id,
            category=CostCategoryEnum.acquisition,
            amount=Decimal("15000.00"),
            currency="USD",
            date=now - timedelta(days=730),
            description="Initial server purchase",
            vendor="Dell",
            invoice_number="INV-2022-001234",
            cost_center="CC-001",
            is_recurring=False,
            tags=["capital-expenditure"],
            created_at=now,
            updated_at=now,
        ),
        CostEntry(
            id=stable_uuid("cost-2"),
            asset_id=assets[0].id,
            category=CostCategoryEnum.maintenance,
            amount=Decimal("500.00"),
            currency="USD",
            date=now,
            description="Annual maintenance contract",
            vendor="Dell",
            invoice_number="INV-2024-005678",
            cost_center="CC-001",
            is_recurring=True,
            recurrence_period=RecurrencePeriodEnum.annually,
            tags=["support", "warranty"],
            created_at=now,
            updated_at=now,
        ),
    ]
    session.add_all(cost_entries)
    await session.flush()
    
    # ============================================
    # RECOMMENDATIONS
    # ============================================
    recommendations = [
        Recommendation(
            id=stable_uuid("recommendation-1"),
            asset_id=assets[0].id,
            title="Upgrade server CPU to reduce bottleneck",
            description="CPU upgrade from Xeon Platinum 8380 to 8490H will improve performance by estimated 40%",
            category=RecommendationCategoryEnum.performance,
            priority=RecommendationPriorityEnum.high,
            status=RecommendationStatusEnum.under_review,
            estimated_savings=Decimal("50000.00"),
            estimated_cost=Decimal("8000.00"),
            currency="USD",
            confidence=0.85,
            reasoning="Historical analysis shows CPU is primary bottleneck for 65% of load",
            evidence_ids=["perf_analysis_report_123", "monitoring_data_2024"],
            affected_assets=[assets[0].id],
            approval_required=True,
            created_at=now,
            updated_at=now,
        ),
        Recommendation(
            id=stable_uuid("recommendation-2"),
            asset_id=assets[2].id,
            title="Update network switch firmware",
            description="Install latest firmware v17.03.06 for security and stability improvements",
            category=RecommendationCategoryEnum.security,
            priority=RecommendationPriorityEnum.critical,
            status=RecommendationStatusEnum.proposed,
            estimated_savings=Decimal("0.00"),
            estimated_cost=Decimal("0.00"),
            currency="USD",
            confidence=1.0,
            reasoning="Multiple CVEs addressed in latest firmware version",
            evidence_ids=["cve_analysis_CVE-2024-1234", "cve_analysis_CVE-2024-1235"],
            affected_assets=[assets[2].id],
            approval_required=True,
            created_at=now,
            updated_at=now,
        ),
    ]
    session.add_all(recommendations)
    await session.flush()
    
    # ============================================
    # WORKFLOWS
    # ============================================
    workflows = [
        Workflow(
            id=stable_uuid("workflow-1"),
            name="Asset Onboarding Workflow",
            description="Standard workflow for onboarding new IT assets into the system",
            type=WorkflowTypeEnum.asset_onboarding,
            status=WorkflowStatusEnum.active,
            version="1.0",
            trigger_type=WorkflowTriggerTypeEnum.manual,
            trigger_config={"manual_trigger": True},
            created_by=owners[0].id,
            created_at=now,
            updated_at=now,
        ),
    ]
    session.add_all(workflows)
    await session.flush()
    
    # ============================================
    # WORKFLOW STEPS
    # ============================================
    workflow_steps = [
        WorkflowStep(
            id=f"{workflows[0].id}-step-1",
            workflow_id=workflows[0].id,
            name="Gather asset information",
            type=WorkflowStepTypeEnum.task,
            assignee_type=WorkflowAssigneeTypeEnum.role,
            assignee_id="asset-manager",
            config={"required_fields": ["name", "type", "owner"]},
            order=1,
        ),
        WorkflowStep(
            id=f"{workflows[0].id}-step-2",
            workflow_id=workflows[0].id,
            name="Manager approval",
            type=WorkflowStepTypeEnum.approval,
            assignee_type=WorkflowAssigneeTypeEnum.role,
            assignee_id="manager",
            config={"approval_threshold": 1},
            order=2,
        ),
        WorkflowStep(
            id=f"{workflows[0].id}-step-3",
            workflow_id=workflows[0].id,
            name="Register in asset database",
            type=WorkflowStepTypeEnum.system,
            assignee_type=WorkflowAssigneeTypeEnum.system,
            assignee_id="asset-system",
            config={"action": "register_asset"},
            order=3,
        ),
    ]
    session.add_all(workflow_steps)
    await session.flush()
    
    # ============================================
    # WORKFLOW INSTANCES
    # ============================================
    workflow_instances = [
        WorkflowInstance(
            id=stable_uuid("workflow-instance-1"),
            workflow_id=workflows[0].id,
            workflow_version="1.0",
            status=WorkflowInstanceStatusEnum.running,
            current_step_id=f"{workflows[0].id}-step-1",
            context={
                "asset_name": "new-server-01",
                "asset_type": "server",
                "requested_by": str(owners[0].id),
            },
            started_at=now - timedelta(days=2),
            completed_at=None,
            started_by=owners[0].id,
        ),
    ]
    session.add_all(workflow_instances)
    await session.flush()
    
    # ============================================
    # WORKFLOW INSTANCE STEPS
    # ============================================
    instance_steps = [
        WorkflowInstanceStep(
            id=stable_uuid("instance-step-1"),
            instance_id=workflow_instances[0].id,
            step_id=f"{workflows[0].id}-step-1",
            name="Gather asset information",
            status=WorkflowInstanceStepStatusEnum.in_progress,
            started_at=now - timedelta(days=2),
            completed_at=None,
            assignee_id=owners[0].id,
            notes="Waiting for asset details submission",
        ),
    ]
    session.add_all(instance_steps)
    await session.flush()
    
    # ============================================
    # AUDIT LOGS
    # ============================================
    audit_logs = [
        AuditLog(
            id=stable_uuid("audit-1"),
            timestamp=now - timedelta(days=1),
            event_type="asset_created",
            resource_type="Asset",
            resource_id=assets[0].id,
            user_id=owners[0].id,
            user_name=owners[0].name,
            user_roles=["admin", "asset-manager"],
            changes={
                "name": {"before": None, "after": "prod-server-01"},
                "status": {"before": None, "after": "active"},
            },
            metadata={"ip_address": "192.168.1.100", "request_id": "req-12345"},
            severity=AuditEventSeverityEnum.info,
        ),
        AuditLog(
            id=stable_uuid("audit-2"),
            timestamp=now - timedelta(hours=12),
            event_type="risk_updated",
            resource_type="Risk",
            resource_id=risks[0].id,
            user_id=owners[3].id,
            user_name=owners[3].name,
            user_roles=["compliance", "auditor"],
            changes={
                "status": {"before": "open", "after": "in_progress"},
                "owner_id": {"before": None, "after": str(owners[0].id)},
            },
            metadata={"priority_updated": True},
            severity=AuditEventSeverityEnum.warning,
        ),
    ]
    session.add_all(audit_logs)
    await session.flush()
    
    # ============================================
    # RECONCILIATION RECORDS
    # ============================================
    reconciliation_records = [
        ReconciliationRecord(
            id=stable_uuid("reconciliation-1"),
            asset_id=assets[0].id,
            asset_name=assets[0].name,
            source_system="ServiceNow CMDB",
            target_system="VMware vCenter",
            source_record_id="INC0012345",
            expected_value="prod-server-01.prod.example.com",
            actual_value="prod-server-01.prod.example.com",
            status=ReconciliationStatusEnum.matched,
            last_checked=now - timedelta(hours=6),
            created_at=now,
            updated_at=now,
        ),
        ReconciliationRecord(
            id=stable_uuid("reconciliation-2"),
            asset_id=assets[2].id,
            asset_name=assets[2].name,
            source_system="Network Management System",
            target_system="Cisco IOS XE Config",
            source_record_id="NET-CORE-SW-01",
            expected_value="Catalyst 9400",
            actual_value="Catalyst 9400",
            status=ReconciliationStatusEnum.matched,
            last_checked=now - timedelta(hours=3),
            created_at=now,
            updated_at=now,
        ),
        ReconciliationRecord(
            id=stable_uuid("reconciliation-3"),
            asset_id=assets[3].id,
            asset_name=assets[3].name,
            source_system="Storage Capacity Planning DB",
            target_system="NetApp System Manager",
            source_record_id="NAS-STOR-001",
            expected_value="100 TB allocated",
            actual_value="95 TB allocated",
            status=ReconciliationStatusEnum.unmatched,
            difference="5 TB discrepancy",
            notes="Investigating storage allocation mismatch",
            last_checked=now - timedelta(hours=2),
            created_at=now,
            updated_at=now,
        ),
    ]
    session.add_all(reconciliation_records)
    
    # Commit all changes
    await session.commit()


if __name__ == "__main__":
    # This allows running the seed directly for testing
    import asyncio
    from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
    from sqlalchemy.orm import sessionmaker
    
    from app.config import get_settings
    
    async def main():
        settings = get_settings()
        engine = create_async_engine(
            settings.database_url,
            echo=settings.app_env == "development",
        )
        
        async_session = sessionmaker(
            engine, class_=AsyncSession, expire_on_commit=False
        )
        
        async with async_session() as session:
            await seed_database(session)
            print("✓ Database seeded successfully")
        
        await engine.dispose()
    
    asyncio.run(main())
