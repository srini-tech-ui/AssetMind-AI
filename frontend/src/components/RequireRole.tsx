"use client";

import React from "react";
import { useAuthStore } from "@/lib/auth";

type RequireRoleProps = {
  role: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export const RequireRole: React.FC<RequireRoleProps> = ({ role, children, fallback }) => {
  const { user } = useAuthStore.getState();

  // In development, we have a placeholder user with roles
  // In production, this would come from the OIDC token
  const userRoles = user?.roles || [];

  const hasRole = userRoles.includes(role);

  if (!hasRole) {
    return fallback || (
      <div className="p-4 bg-destructive text-white">
        <h3 className="text-lg font-medium mb-2">Insufficient Permissions</h3>
        <p className="text-sm">
          You do not have the required role ("{role}") to access this content.
        </p>
      </div>
    );
  }

  return children;
};

export default RequireRole;