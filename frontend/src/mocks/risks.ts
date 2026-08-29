/**
 * Phase 2.1: Mock Risk Data
 * 
 * Development/demo data only. No backend connected.
 */
import { Risk, RiskListItem } from "@/types/domain";

export const mockRisks: Risk[] = [
  {
    id: "risk-001",
    assetId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    title: "Unpatched OS vulnerability",
    description: "Web Server 01 has not been patched with the latest security updates.",
    category: "security",
    severity: "high",
    likelihood: "high",
    impact: "critical",
    status: "in_progress",
    identifiedDate: "2024-11-15T00:00:00Z",
    targetResolutionDate: "2025-01-15T00:00:00Z",
    ownerId: "owner-001",
    mitigationPlan: "Apply security patches and restart server during maintenance window.",
    evidence: ["evidence-risk-001-1"],
    tags: ["security", "patching"],
    createdAt: "2024-11-15T10:00:00Z",
    updatedAt: "2024-12-01T08:00:00Z",
  },
  {
    id: "risk-002",
    assetId: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    title: "Firmware outdated on core switch",
    description: "Network Switch Core is running firmware version 17.2 which has known vulnerabilities.",
    category: "security",
    severity: "medium",
    likelihood: "medium",
    impact: "high",
    status: "open",
    identifiedDate: "2024-10-20T00:00:00Z",
    targetResolutionDate: "2025-02-28T00:00:00Z",
    ownerId: "owner-003",
    mitigationPlan: "Schedule firmware upgrade during next maintenance window.",
    evidence: ["evidence-risk-002-1"],
    tags: ["network", "firmware"],
    createdAt: "2024-10-20T09:00:00Z",
    updatedAt: "2024-11-01T11:00:00Z",
  },
  {
    id: "risk-003",
    assetId: "d4e5f6a7-b8c9-0123-defa-234567890123",
    title: "Storage capacity approaching limit",
    description: "Storage Array Pro is at 85% capacity with projected full utilization in 3 months.",
    category: "operational",
    severity: "high",
    likelihood: "high",
    impact: "high",
    status: "open",
    identifiedDate: "2024-12-01T00:00:00Z",
    targetResolutionDate: "2025-03-01T00:00:00Z",
    ownerId: "owner-004",
    mitigationPlan: "Procure additional storage or implement data archiving strategy.",
    evidence: ["evidence-risk-003-1"],
    tags: ["capacity", "storage"],
    createdAt: "2024-12-01T14:00:00Z",
    updatedAt: "2024-12-10T09:00:00Z",
  },
  {
    id: "risk-004",
    assetId: "e5f6a7b8-c9d0-1234-efab-345678901234",
    title: "GDPR compliance gap",
    description: "Cloud database instance lacks proper data residency controls for EU customers.",
    category: "compliance",
    severity: "critical",
    likelihood: "medium",
    impact: "critical",
    status: "in_progress",
    identifiedDate: "2024-09-01T00:00:00Z",
    targetResolutionDate: "2025-01-31T00:00:00Z",
    ownerId: "owner-001",
    mitigationPlan: "Implement EU data residency controls and update data processing agreements.",
    evidence: ["evidence-risk-004-1", "evidence-risk-004-2"],
    tags: ["gdpr", "compliance"],
    createdAt: "2024-09-01T08:00:00Z",
    updatedAt: "2024-12-05T16:00:00Z",
  },
  {
    id: "risk-005",
    assetId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    title: "Laptop encryption not enabled",
    description: "Developer Laptop 03 does not have full-disk encryption enabled.",
    category: "security",
    severity: "medium",
    likelihood: "low",
    impact: "medium",
    status: "open",
    identifiedDate: "2024-11-01T00:00:00Z",
    targetResolutionDate: "2025-01-31T00:00:00Z",
    ownerId: "owner-002",
    mitigationPlan: "Enable BitLocker full-disk encryption on the device.",
    evidence: ["evidence-risk-005-1"],
    tags: ["encryption", "security"],
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-11-15T13:00:00Z",
  },
];

export function getRisksByAsset(assetId: string): Risk[] {
  return mockRisks.filter((r) => r.assetId === assetId);
}

export function getRisksBySeverity(severity: string): Risk[] {
  return mockRisks.filter((r) => r.severity === severity);
}

export function getRiskListItems(): RiskListItem[] {
  return mockRisks.map(
    ({ id, assetId, title, category, severity, status, identifiedDate, targetResolutionDate }) => ({
      id,
      assetId,
      title,
      category,
      severity,
      status,
      identifiedDate,
      targetResolutionDate,
    })
  );
}