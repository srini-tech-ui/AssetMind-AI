/**
 * Phase 2.1: Mock Recommendation Data
 * 
 * Development/demo data only. No backend connected.
 */
import { Recommendation, RecommendationListItem } from "@/types/domain";

export const mockRecommendations: Recommendation[] = [
  {
    id: "rec-001",
    assetId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    title: "Upgrade to SSD storage for performance",
    description: "Migrate Web Server 01 from HDD to SSD to improve I/O performance by an estimated 40%.",
    category: "performance",
    priority: "high",
    status: "proposed",
    estimatedSavings: 5000,
    estimatedCost: 3000,
    currency: "USD",
    confidence: 0.85,
    reasoning: "Current HDD storage is a bottleneck for web serving workloads. SSD migration will reduce latency and improve user experience.",
    evidenceIds: ["evidence-rec-001-1"],
    affectedAssets: ["a1b2c3d4-e5f6-7890-abcd-ef1234567890"],
    approvalRequired: true,
    createdAt: "2024-11-15T10:00:00Z",
    updatedAt: "2024-12-01T08:00:00Z",
  },
  {
    id: "rec-002",
    assetId: "d4e5f6a7-b8c9-0123-defa-234567890123",
    title: "Implement data tiering for cost optimization",
    description: "Move infrequently accessed data to cheaper storage tiers to reduce annual storage costs.",
    category: "cost_optimization",
    priority: "medium",
    status: "under_review",
    estimatedSavings: 12000,
    estimatedCost: 2000,
    currency: "USD",
    confidence: 0.72,
    reasoning: "Analysis shows 35% of stored data has not been accessed in over 90 days. Tiering this data could save significant costs.",
    evidenceIds: ["evidence-rec-002-1", "evidence-rec-002-2"],
    affectedAssets: ["d4e5f6a7-b8c9-0123-defa-234567890123"],
    approvalRequired: true,
    createdAt: "2024-10-20T09:00:00Z",
    updatedAt: "2024-11-15T14:00:00Z",
  },
  {
    id: "rec-003",
    assetId: "e5f6a7b8-c9d0-1234-efab-345678901234",
    title: "Migrate to reserved instances for cost savings",
    description: "Switch cloud database from on-demand to reserved instances for an estimated 30% annual savings.",
    category: "cost_optimization",
    priority: "high",
    status: "proposed",
    estimatedSavings: 5400,
    estimatedCost: 0,
    currency: "USD",
    confidence: 0.9,
    reasoning: "Cloud database has been running on-demand for 10 months. Reserved instances offer significant savings with predictable usage patterns.",
    evidenceIds: ["evidence-rec-003-1"],
    affectedAssets: ["e5f6a7b8-c9d0-1234-efab-345678901234"],
    approvalRequired: true,
    createdAt: "2024-11-01T08:00:00Z",
    updatedAt: "2024-12-05T16:00:00Z",
  },
  {
    id: "rec-004",
    assetId: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    title: "Upgrade network switch firmware",
    description: "Update firmware to latest version to close known security vulnerabilities.",
    category: "security",
    priority: "critical",
    status: "approved",
    estimatedSavings: 0,
    estimatedCost: 500,
    currency: "USD",
    confidence: 0.95,
    reasoning: "Firmware version 17.2 has 3 known CVEs. Upgrade to version 17.4 resolves all known vulnerabilities.",
    evidenceIds: ["evidence-rec-004-1"],
    affectedAssets: ["c3d4e5f6-a7b8-9012-cdef-123456789012"],
    approvalRequired: false,
    createdAt: "2024-10-20T09:00:00Z",
    updatedAt: "2024-11-01T11:00:00Z",
  },
  {
    id: "rec-005",
    assetId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    title: "Enable full-disk encryption",
    description: "Enable BitLocker encryption on Developer Laptop 03 to comply with security policy.",
    category: "security",
    priority: "medium",
    status: "proposed",
    estimatedSavings: 0,
    estimatedCost: 0,
    currency: "USD",
    confidence: 0.88,
    reasoning: "Security audit identified missing encryption on mobile devices. Enabling BitLocker is a quick win with zero cost.",
    evidenceIds: ["evidence-rec-005-1"],
    affectedAssets: ["b2c3d4e5-f6a7-8901-bcde-f12345678901"],
    approvalRequired: false,
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-11-15T13:00:00Z",
  },
];

export function getRecommendationsByAsset(assetId: string): Recommendation[] {
  return mockRecommendations.filter((r) => r.assetId === assetId);
}

export function getRecommendationsByStatus(status: string): Recommendation[] {
  return mockRecommendations.filter((r) => r.status === status);
}

export function getRecommendationListItems(): RecommendationListItem[] {
  return mockRecommendations.map(
    ({ id, assetId, title, category, priority, status, estimatedSavings, confidence, approvalRequired, createdAt }) => ({
      id,
      assetId,
      title,
      category,
      priority,
      status,
      estimatedSavings,
      confidence,
      approvalRequired,
      createdAt,
    })
  );
}