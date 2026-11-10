from enum import StrEnum


class Role(StrEnum):
    ADMIN = "admin"
    ASSET_MANAGER = "asset_manager"
    SECURITY_ANALYST = "security_analyst"
    FINANCE_ANALYST = "finance_analyst"
    AUDITOR = "auditor"
    USER = "user"


class Permission(StrEnum):
    ASSET_READ = "asset:read"
    ASSET_WRITE = "asset:write"

    RISK_READ = "risk:read"
    RISK_WRITE = "risk:write"

    COST_READ = "cost:read"

    COMPLIANCE_READ = "compliance:read"

    LIFECYCLE_READ = "lifecycle:read"

    WORKFLOW_READ = "workflow:read"
    WORKFLOW_EXECUTE = "workflow:execute"

    APPROVAL_READ = "approval:read"
    APPROVAL_APPROVE = "approval:approve"

    RECOMMENDATION_READ = "recommendation:read"
    RECOMMENDATION_WRITE = "recommendation:write"

    RAG_READ = "rag:read"

    MCP_READ = "mcp:read"
    MCP_EXECUTE = "mcp:execute"

    AUDIT_READ = "audit:read"