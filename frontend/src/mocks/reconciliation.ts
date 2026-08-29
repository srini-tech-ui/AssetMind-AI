/**
 * Phase 2.4: Mock Reconciliation Data
 *
 * Development/demo data only. No backend connected.
 * Reconciliation records track the comparison of asset data
 * across source systems to identify matches, mismatches,
 * and items requiring review.
 */
import { Reconciliation, ReconciliationListItem } from "@/types/domain";

export const mockReconciliations: Reconciliation[] = [
  {
    id: "recon-001",
    assetId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    assetName: "Web Server 01",
    sourceSystem: "CMDB",
    targetSystem: "Asset Management",
    expectedValue: "Web Server 01 / PowerEdge R750",
    actualValue: "Web Server 01 / PowerEdge R750",
    status: "matched",
    lastChecked: "2024-12-05T10:00:00Z",
    difference: null,
    notes: "All fields match across systems.",
    createdAt: "2024-12-01T08:00:00Z",
    updatedAt: "2024-12-05T10:00:00Z",
  },
  {
    id: "recon-002",
    assetId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    assetName: "Developer Laptop 03",
    sourceSystem: "CMDB",
    targetSystem: "Asset Management",
    expectedValue: "Engineering / San Francisco",
    actualValue: "Engineering / Remote",
    status: "unmatched",
    lastChecked: "2024-12-04T14:30:00Z",
    difference: "Location mismatch: expected San Francisco, found Remote",
    notes: "Owner relocated; needs location update in CMDB.",
    createdAt: "2024-11-28T09:00:00Z",
    updatedAt: "2024-12-04T14:30:00Z",
  },
  {
    id: "recon-003",
    assetId: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    assetName: "Network Switch Core",
    sourceSystem: "Active Directory",
    targetSystem: "Asset Management",
    expectedValue: "Catalyst 9300",
    actualValue: "Catalyst 9300",
    status: "matched",
    lastChecked: "2024-12-05T09:15:00Z",
    difference: null,
    notes: "Model and serial verified.",
    createdAt: "2024-12-02T08:00:00Z",
    updatedAt: "2024-12-05T09:15:00Z",
  },
  {
    id: "recon-004",
    assetId: "d4e5f6a7-b8c9-0123-defa-234567890123",
    assetName: "Storage Array Pro",
    sourceSystem: "CMDB",
    targetSystem: "Procurement System",
    expectedValue: "NetApp AFF A800",
    actualValue: "NetApp AFF A800",
    status: "needs_review",
    lastChecked: "2024-12-03T11:00:00Z",
    difference: "Warranty expiry date differs by 2 days",
    notes: "Warranty dates slightly off; verify with vendor.",
    createdAt: "2024-11-25T08:00:00Z",
    updatedAt: "2024-12-03T11:00:00Z",
  },
  {
    id: "recon-005",
    assetId: "e5f6a7b8-c9d0-1234-efab-345678901234",
    assetName: "Cloud Database Instance",
    sourceSystem: "AWS",
    targetSystem: "Asset Management",
    expectedValue: "db.r6g.2xlarge",
    actualValue: "db.r6g.2xlarge",
    status: "matched",
    lastChecked: "2024-12-05T16:30:00Z",
    difference: null,
    notes: "Instance type confirmed.",
    createdAt: "2024-12-01T12:00:00Z",
    updatedAt: "2024-12-05T16:30:00Z",
  },
  {
    id: "recon-006",
    assetId: "f6a7b8c9-d0e1-2345-fabc-456789012345",
    assetName: "Mobile Device 07",
    sourceSystem: "MDM",
    targetSystem: "Asset Management",
    expectedValue: "Active",
    actualValue: "Inactive",
    status: "unmatched",
    lastChecked: "2024-12-02T10:00:00Z",
    difference: "Status mismatch: MDM reports active, AM reports inactive",
    notes: "Device may have been returned; verify with owner.",
    createdAt: "2024-09-20T08:00:00Z",
    updatedAt: "2024-12-02T10:00:00Z",
  },
  {
    id: "recon-007",
    assetId: "a7b8c9d0-e1f2-3456-abcd-567890123456",
    assetName: "Software License - IDE",
    sourceSystem: "License Server",
    targetSystem: "Asset Management",
    expectedValue: "15 seats",
    actualValue: "12 seats",
    status: "unmatched",
    lastChecked: "2024-12-04T15:00:00Z",
    difference: "Seat count mismatch: expected 15, found 12",
    notes: "Three seats appear unused; reconcile against active developers.",
    createdAt: "2024-11-15T08:00:00Z",
    updatedAt: "2024-12-04T15:00:00Z",
  },
  {
    id: "recon-008",
    assetId: "b8c9d0e1-f2a3-4567-bcde-678901234567",
    assetName: "Backup Server 02",
    sourceSystem: "CMDB",
    targetSystem: "Asset Management",
    expectedValue: "Retired",
    actualValue: "Retired",
    status: "matched",
    lastChecked: "2024-07-01T08:00:00Z",
    difference: null,
    notes: "Decommission record confirmed.",
    createdAt: "2024-06-30T08:00:00Z",
    updatedAt: "2024-07-01T08:00:00Z",
  },
];

export function getReconciliationsByStatus(status: string): Reconciliation[] {
  return mockReconciliations.filter((r) => r.status === status);
}

export function getReconciliationsByAsset(assetId: string): Reconciliation[] {
  return mockReconciliations.filter((r) => r.assetId === assetId);
}

export function getReconciliationListItems(): ReconciliationListItem[] {
  return mockReconciliations.map(
    ({ id, assetId, assetName, sourceSystem, targetSystem, status, lastChecked }) => ({
      id,
      assetId,
      assetName,
      sourceSystem,
      targetSystem,
      status,
      lastChecked,
    })
  );
}