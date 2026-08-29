/**
 * Phase 2.1: Mock Audit/History Data
 * 
 * Development/demo data only. No backend connected.
 */
import { AuditEvent, AuditEventListItem } from "@/types/domain";

export const mockAuditEvents: AuditEvent[] = [
  {
    id: "audit-001",
    timestamp: "2024-12-05T16:20:00Z",
    eventType: "asset_updated",
    resourceType: "asset",
    resourceId: "e5f6a7b8-c9d0-1234-efab-345678901234",
    userId: "owner-001",
    userName: "Alice Chen",
    userRoles: ["IT Manager"],
    changes: {
      status: { before: "active", after: "active" },
      updated: { before: undefined, after: true },
    },
    metadata: {},
    severity: "info",
  },
  {
    id: "audit-002",
    timestamp: "2024-12-05T09:45:00Z",
    eventType: "risk_identified",
    resourceType: "risk",
    resourceId: "risk-003",
    userId: "owner-004",
    userName: "David Kim",
    userRoles: ["Storage Admin"],
    changes: {
      title: { before: undefined, after: "Storage capacity approaching limit" },
      severity: { before: undefined, after: "high" },
    },
    metadata: {},
    severity: "warning",
  },
  {
    id: "audit-003",
    timestamp: "2024-12-01T08:30:00Z",
    eventType: "asset_updated",
    resourceType: "asset",
    resourceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    userId: "owner-001",
    userName: "Alice Chen",
    userRoles: ["IT Manager"],
    changes: {
      tags: { before: ["production", "web"], after: ["production", "web", "critical"] },
    },
    metadata: {},
    severity: "info",
  },
  {
    id: "audit-004",
    timestamp: "2024-11-30T14:00:00Z",
    eventType: "approval_decided",
    resourceType: "approval",
    resourceId: "appr-002",
    userId: "owner-001",
    userName: "Alice Chen",
    userRoles: ["IT Manager"],
    changes: {
      status: { before: "pending", after: "approved" },
    },
    metadata: { comment: "Approved - significant cost savings." },
    severity: "info",
  },
  {
    id: "audit-005",
    timestamp: "2024-11-28T11:00:00Z",
    eventType: "recommendation_created",
    resourceType: "recommendation",
    resourceId: "rec-001",
    userId: "owner-001",
    userName: "Alice Chen",
    userRoles: ["IT Manager"],
    changes: {
      title: { before: undefined, after: "Upgrade to SSD storage for performance" },
    },
    metadata: {},
    severity: "info",
  },
  {
    id: "audit-006",
    timestamp: "2024-11-20T10:00:00Z",
    eventType: "approval_requested",
    resourceType: "approval",
    resourceId: "appr-001",
    userId: "owner-001",
    userName: "Alice Chen",
    userRoles: ["IT Manager"],
    changes: {
      title: { before: undefined, after: "SSD Storage Upgrade for Web Server 01" },
    },
    metadata: {},
    severity: "info",
  },
  {
    id: "audit-007",
    timestamp: "2024-11-15T09:00:00Z",
    eventType: "risk_updated",
    resourceType: "risk",
    resourceId: "risk-001",
    userId: "owner-001",
    userName: "Alice Chen",
    userRoles: ["IT Manager"],
    changes: {
      status: { before: "open", after: "in_progress" },
    },
    metadata: {},
    severity: "warning",
  },
  {
    id: "audit-008",
    timestamp: "2024-11-01T08:00:00Z",
    eventType: "compliance_checked",
    resourceType: "compliance",
    resourceId: "comp-002",
    userId: "owner-001",
    userName: "Alice Chen",
    userRoles: ["IT Manager"],
    changes: {
      status: { before: "compliant", after: "non_compliant" },
    },
    metadata: {},
    severity: "error",
  },
  {
    id: "audit-009",
    timestamp: "2024-10-15T11:00:00Z",
    eventType: "lifecycle_event",
    resourceType: "lifecycle_event",
    resourceId: "le-003",
    userId: "owner-001",
    userName: "Alice Chen",
    userRoles: ["IT Manager"],
    changes: {
      status: { before: "planned", after: "completed" },
    },
    metadata: {},
    severity: "info",
  },
  {
    id: "audit-010",
    timestamp: "2024-10-01T09:00:00Z",
    eventType: "data_export",
    resourceType: "report",
    resourceId: "report-001",
    userId: "owner-001",
    userName: "Alice Chen",
    userRoles: ["IT Manager"],
    changes: {
      format: { before: undefined, after: "csv" },
      records: { before: undefined, after: 150 },
    },
    metadata: {},
    severity: "info",
  },
];

export function getAuditEventsByResource(resourceType: string, resourceId: string): AuditEvent[] {
  return mockAuditEvents.filter(
    (e) => e.resourceType === resourceType && e.resourceId === resourceId
  );
}

export function getAuditEventsByUser(userId: string): AuditEvent[] {
  return mockAuditEvents.filter((e) => e.userId === userId);
}

export function getAuditEventListItems(): AuditEventListItem[] {
  return mockAuditEvents.map(
    ({ id, timestamp, eventType, resourceType, resourceId, userId, userName, severity }) => ({
      id,
      timestamp,
      eventType,
      resourceType,
      resourceId,
      userId,
      userName,
      severity,
    })
  );
}