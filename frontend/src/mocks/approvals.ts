/**
 * Phase 2.1: Mock Approval Data
 * 
 * Development/demo data only. No backend connected.
 */
import { Approval, ApprovalListItem } from "@/types/domain";

export const mockApprovals: Approval[] = [
  {
    id: "appr-001",
    title: "SSD Storage Upgrade for Web Server 01",
    description: "Approve $3,000 budget for SSD storage upgrade on Web Server 01.",
    type: "budget",
    resourceType: "recommendation",
    resourceId: "rec-001",
    requestedBy: "owner-001",
    requestedAt: "2024-11-20T00:00:00Z",
    status: "pending",
    priority: "high",
    approvers: [
      { userId: "owner-001", role: "IT Manager", status: "pending" },
      { userId: "owner-003", role: "Network Engineer", status: "pending" },
    ],
    currentApproverIndex: 0,
    dueDate: "2025-01-15T00:00:00Z",
    metadata: {},
    createdAt: "2024-11-20T10:00:00Z",
    updatedAt: "2024-11-20T10:00:00Z",
  },
  {
    id: "appr-002",
    title: "Cloud Database Reserved Instance Migration",
    description: "Approve migration of AWS RDS to reserved instances for cost savings.",
    type: "budget",
    resourceType: "recommendation",
    resourceId: "rec-003",
    requestedBy: "owner-001",
    requestedAt: "2024-11-15T00:00:00Z",
    status: "approved",
    priority: "high",
    approvers: [
      { userId: "owner-001", role: "IT Manager", status: "approved", decidedAt: "2024-11-16T00:00:00Z", comment: "Approved - significant cost savings." },
    ],
    currentApproverIndex: 0,
    dueDate: "2025-01-31T00:00:00Z",
    decidedAt: "2024-11-16T00:00:00Z",
    decidedBy: "owner-001",
    decisionComment: "Approved - significant cost savings.",
    metadata: {},
    createdAt: "2024-11-15T08:00:00Z",
    updatedAt: "2024-11-16T00:00:00Z",
  },
  {
    id: "appr-003",
    title: "Data Tiering Implementation",
    description: "Approve $2,000 budget for data tiering implementation on Storage Array Pro.",
    type: "budget",
    resourceType: "recommendation",
    resourceId: "rec-002",
    requestedBy: "owner-004",
    requestedAt: "2024-11-01T00:00:00Z",
    status: "pending",
    priority: "medium",
    approvers: [
      { userId: "owner-004", role: "Storage Admin", status: "pending" },
      { userId: "owner-001", role: "IT Manager", status: "pending" },
    ],
    currentApproverIndex: 0,
    dueDate: "2025-02-28T00:00:00Z",
    metadata: {},
    createdAt: "2024-11-01T09:00:00Z",
    updatedAt: "2024-11-01T09:00:00Z",
  },
  {
    id: "appr-004",
    title: "Network Switch Firmware Upgrade",
    description: "Approve firmware upgrade for Cisco Catalyst 9300.",
    type: "asset_creation",
    resourceType: "recommendation",
    resourceId: "rec-004",
    requestedBy: "owner-003",
    requestedAt: "2024-10-25T00:00:00Z",
    status: "approved",
    priority: "critical",
    approvers: [
      { userId: "owner-003", role: "Network Engineer", status: "approved", decidedAt: "2024-10-26T00:00:00Z", comment: "Critical security fix - approved immediately." },
    ],
    currentApproverIndex: 0,
    dueDate: "2024-11-15T00:00:00Z",
    decidedAt: "2024-10-26T00:00:00Z",
    decidedBy: "owner-003",
    decisionComment: "Critical security fix - approved immediately.",
    metadata: {},
    createdAt: "2024-10-25T08:00:00Z",
    updatedAt: "2024-10-26T00:00:00Z",
  },
];

export function getApprovalsByStatus(status: string): Approval[] {
  return mockApprovals.filter((a) => a.status === status);
}

export function getApprovalsByType(type: string): Approval[] {
  return mockApprovals.filter((a) => a.type === type);
}

export function getApprovalListItems(): ApprovalListItem[] {
  return mockApprovals.map(
    ({ id, title, type, resourceType, resourceId, requestedBy, requestedAt, status, priority, dueDate }) => ({
      id,
      title,
      type,
      resourceType,
      resourceId,
      requestedBy,
      requestedAt,
      status,
      priority,
      dueDate,
    })
  );
}