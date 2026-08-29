/**
 * Phase 2.1: Mock Lifecycle Data
 * 
 * Development/demo data only. No backend connected.
 */
import { LifecycleEvent, LifecycleEventListItem, AssetLifecycleSummary } from "@/types/domain";

export const mockLifecycleEvents: LifecycleEvent[] = [
  {
    id: "le-001",
    assetId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    eventType: "procurement",
    title: "Procurement of Web Server 01",
    description: "Purchased Dell PowerEdge R750 for production web hosting.",
    scheduledDate: "2023-06-01T00:00:00Z",
    completedDate: "2023-06-15T00:00:00Z",
    status: "completed",
    performedBy: "owner-001",
    cost: 12000,
    vendor: "Dell Technologies",
    notes: "Standard procurement process.",
    attachments: [],
    createdAt: "2023-06-01T08:00:00Z",
    updatedAt: "2023-06-15T10:00:00Z",
  },
  {
    id: "le-002",
    assetId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    eventType: "deployment",
    title: "Deployment of Web Server 01",
    description: "Installed and configured web server software.",
    scheduledDate: "2023-06-16T00:00:00Z",
    completedDate: "2023-07-01T00:00:00Z",
    status: "completed",
    performedBy: "owner-001",
    cost: 500,
    vendor: "Internal IT",
    notes: "Deployed to Rack A1, U12.",
    attachments: [],
    createdAt: "2023-06-16T09:00:00Z",
    updatedAt: "2023-07-01T14:00:00Z",
  },
  {
    id: "le-003",
    assetId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    eventType: "maintenance",
    title: "Quarterly maintenance",
    description: "Routine maintenance and patch application.",
    scheduledDate: "2024-12-01T00:00:00Z",
    completedDate: "2024-12-05T00:00:00Z",
    status: "completed",
    performedBy: "owner-001",
    cost: 800,
    vendor: "Dell Support",
    notes: "Applied security patches and firmware updates.",
    attachments: [],
    createdAt: "2024-12-01T08:00:00Z",
    updatedAt: "2024-12-05T09:00:00Z",
  },
  {
    id: "le-004",
    assetId: "d4e5f6a7-b8c9-0123-defa-234567890123",
    eventType: "procurement",
    title: "Procurement of Storage Array Pro",
    description: "Purchased NetApp AFF A800 for SAN storage.",
    scheduledDate: "2022-10-01T00:00:00Z",
    completedDate: "2022-11-05T00:00:00Z",
    status: "completed",
    performedBy: "owner-004",
    cost: 85000,
    vendor: "NetApp",
    notes: "High-capacity SAN storage solution.",
    attachments: [],
    createdAt: "2022-10-01T08:00:00Z",
    updatedAt: "2022-11-05T07:00:00Z",
  },
  {
    id: "le-005",
    assetId: "d4e5f6a7-b8c9-0123-defa-234567890123",
    eventType: "maintenance",
    title: "Storage expansion planning",
    description: "Planning additional storage capacity expansion.",
    scheduledDate: "2025-03-01T00:00:00Z",
    status: "planned",
    performedBy: "owner-004",
    cost: 25000,
    vendor: "NetApp",
    notes: "Pending approval for expansion.",
    attachments: [],
    createdAt: "2024-12-10T09:00:00Z",
    updatedAt: "2024-12-10T09:00:00Z",
  },
  {
    id: "le-006",
    assetId: "b8c9d0e1-f2a3-4567-bcde-678901234567",
    eventType: "decommission",
    title: "Decommission of Backup Server 02",
    description: "Retired and disposed of legacy backup server.",
    scheduledDate: "2024-06-01T00:00:00Z",
    completedDate: "2024-06-30T00:00:00Z",
    status: "completed",
    performedBy: "owner-003",
    cost: 200,
    vendor: "Internal IT",
    notes: "Data migrated to new storage solution.",
    attachments: [],
    createdAt: "2024-06-01T08:00:00Z",
    updatedAt: "2024-06-30T17:00:00Z",
  },
];

export function getLifecycleByAsset(assetId: string): LifecycleEvent[] {
  return mockLifecycleEvents.filter((e) => e.assetId === assetId);
}

export function getLifecycleSummary(assetId: string): AssetLifecycleSummary | undefined {
  const events = mockLifecycleEvents.filter((e) => e.assetId === assetId);
  if (events.length === 0) return undefined;

  const asset = require("@/mocks/assets").mockAssets.find((a) => a.id === assetId);
  const currentPhase = asset?.status === "active" ? "operation" : asset?.status === "maintenance" ? "maintenance" : asset?.status === "retired" ? "retirement" : "planning";

  return {
    assetId,
    currentPhase: currentPhase as AssetLifecycleSummary["currentPhase"],
    phaseEnteredAt: events[0]?.createdAt || "2024-01-01T00:00:00Z",
    nextPlannedEvent: events.find((e) => e.status === "planned" || e.status === "in_progress"),
    totalEvents: events.length,
    overdueEvents: events.filter((e) => e.status === "overdue").length,
    totalCost: events.reduce((sum, e) => sum + (e.cost || 0), 0),
  };
}

export function getLifecycleEventListItems(): LifecycleEventListItem[] {
  return mockLifecycleEvents.map(
    ({ id, assetId, eventType, title, status, scheduledDate, completedDate }) => ({
      id,
      assetId,
      eventType,
      title,
      status,
      scheduledDate,
      completedDate,
    })
  );
}