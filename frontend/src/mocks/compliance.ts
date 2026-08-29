/**
 * Phase 2.1: Mock Compliance Data
 * 
 * Development/demo data only. No backend connected.
 */
import { Compliance, ComplianceListItem } from "@/types/domain";

export const mockComplianceRecords: Compliance[] = [
  {
    id: "comp-001",
    assetId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    framework: "iso_27001",
    requirementId: "A.12.6.1",
    requirementTitle: "Technical vulnerability management",
    status: "compliant",
    evidence: ["evidence-comp-001-1"],
    lastAssessed: "2024-11-01T00:00:00Z",
    nextAssessmentDue: "2025-05-01T00:00:00Z",
    assessorId: "owner-001",
    notes: "All patches applied within SLA.",
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-12-01T08:00:00Z",
  },
  {
    id: "comp-002",
    assetId: "e5f6a7b8-c9d0-1234-efab-345678901234",
    framework: "gdpr",
    requirementId: "Art. 32",
    requirementTitle: "Security of processing",
    status: "non_compliant",
    evidence: ["evidence-comp-002-1"],
    lastAssessed: "2024-10-15T00:00:00Z",
    nextAssessmentDue: "2025-04-15T00:00:00Z",
    assessorId: "owner-001",
    notes: "Data residency controls need implementation.",
    createdAt: "2024-10-15T09:00:00Z",
    updatedAt: "2024-12-05T16:00:00Z",
  },
  {
    id: "comp-003",
    assetId: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    framework: "pci_dss",
    requirementId: "6.2",
    requirementTitle: "Vendor-supplied default settings",
    status: "compliant",
    evidence: ["evidence-comp-003-1"],
    lastAssessed: "2024-09-20T00:00:00Z",
    nextAssessmentDue: "2025-03-20T00:00:00Z",
    assessorId: "owner-003",
    notes: "All default passwords changed.",
    createdAt: "2024-09-20T10:00:00Z",
    updatedAt: "2024-10-15T11:00:00Z",
  },
  {
    id: "comp-004",
    assetId: "d4e5f6a7-b8c9-0123-defa-234567890123",
    framework: "sox",
    requirementId: "404",
    requirementTitle: "IT general controls",
    status: "partial",
    evidence: ["evidence-comp-004-1"],
    lastAssessed: "2024-11-15T00:00:00Z",
    nextAssessmentDue: "2025-05-15T00:00:00Z",
    assessorId: "owner-004",
    notes: "Access controls partially implemented. Backup verification pending.",
    createdAt: "2024-11-15T08:00:00Z",
    updatedAt: "2024-12-10T09:00:00Z",
  },
];

export function getComplianceByAsset(assetId: string): Compliance[] {
  return mockComplianceRecords.filter((c) => c.assetId === assetId);
}

export function getComplianceByFramework(framework: string): Compliance[] {
  return mockComplianceRecords.filter((c) => c.framework === framework);
}

export function getComplianceListItems(): ComplianceListItem[] {
  return mockComplianceRecords.map(
    ({ id, assetId, framework, requirementId, requirementTitle, status, lastAssessed, nextAssessmentDue }) => ({
      id,
      assetId,
      framework,
      requirementId,
      requirementTitle,
      status,
      lastAssessed,
      nextAssessmentDue,
    })
  );
}