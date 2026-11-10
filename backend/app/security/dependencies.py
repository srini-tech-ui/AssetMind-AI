from fastapi import Depends, HTTPException, status

from app.security.models import Permission, Role
from app.security.permissions import has_permission


class CurrentUser:
    """
    Development identity.

    Replace get_current_user() with JWT/OIDC
    authentication before production deployment.
    """

    def __init__(
        self,
        user_id: str = "local-dev-user",
        roles: list[Role] | None = None,
    ):
        self.user_id = user_id
        self.roles = (
            roles
            if roles is not None
            else [Role.ADMIN]
        )


async def get_current_user() -> CurrentUser:
    """
    Return the current development user.

    This is intentionally a local development
    implementation only.
    """

    return CurrentUser()


def require_permission(
    permission: Permission,
):
    """
    Create a FastAPI dependency that requires
    the specified permission.
    """

    async def dependency(
        user: CurrentUser = Depends(
            get_current_user
        ),
    ) -> CurrentUser:

        if not has_permission(
            user.roles,
            permission,
        ):
            raise HTTPException(
                status_code=(
                    status.HTTP_403_FORBIDDEN
                ),
                detail="Insufficient permissions",
            )

        return user

    return dependency