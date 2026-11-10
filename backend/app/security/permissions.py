from app.security.models import Permission, Role


ROLE_PERMISSIONS: dict[Role, set[Permission]] = {
    Role.ADMIN: set(Permission),

    Role.ASSET_MANAGER: {
        Permission.ASSET_READ,
        Permission.ASSET_WRITE,

        Permission.RISK_READ,

        Permission.COST_READ,

        Permission.COMPLIANCE_READ,

        Permission.LIFECYCLE_READ,

        Permission.WORKFLOW_READ,
        Permission.WORKFLOW_EXECUTE,

        Permission.APPROVAL_READ,

        Permission.RECOMMENDATION_READ,
        Permission.RECOMMENDATION_WRITE,

        Permission.RAG_READ,

        Permission.MCP_READ,
        Permission.MCP_EXECUTE,

        Permission.AUDIT_READ,
    },

    Role.SECURITY_ANALYST: {
        Permission.ASSET_READ,

        Permission.RISK_READ,
        Permission.RISK_WRITE,

        Permission.COMPLIANCE_READ,

        Permission.LIFECYCLE_READ,

        Permission.RAG_READ,

        Permission.MCP_READ,
        Permission.MCP_EXECUTE,

        Permission.AUDIT_READ,
    },

    Role.FINANCE_ANALYST: {
        Permission.ASSET_READ,

        Permission.COST_READ,

        Permission.RECOMMENDATION_READ,

        Permission.RAG_READ,

        Permission.MCP_READ,
    },

    Role.AUDITOR: {
        Permission.ASSET_READ,

        Permission.RISK_READ,

        Permission.COST_READ,

        Permission.COMPLIANCE_READ,

        Permission.LIFECYCLE_READ,

        Permission.WORKFLOW_READ,

        Permission.APPROVAL_READ,

        Permission.RECOMMENDATION_READ,

        Permission.RAG_READ,

        Permission.AUDIT_READ,
    },

    Role.USER: {
        Permission.ASSET_READ,

        Permission.RECOMMENDATION_READ,

        Permission.RAG_READ,
    },
}


def has_permission(
    roles: list[Role],
    permission: Permission,
) -> bool:
    """
    Check whether at least one assigned role
    has the requested permission.
    """

    return any(
        permission in ROLE_PERMISSIONS.get(
            role,
            set(),
        )
        for role in roles
    )