/**
 * Phase 2.1: Frontend Mock Data Foundation
 *
 * This module provides development/demo mock data for the AI Asset Intelligence
 * application. All data is clearly identified as mock/demo data.
 *
 * IMPORTANT: This data is for frontend development only.
 * - No backend is connected
 * - No authentication is implemented
 * - No security decisions are made from this data
 * - No production decisions should be based on this mock data
 */

export { mockAssets, getAssetById, getAssetsByStatus, getAssetsByType } from "./assets";
export { mockAssetOwners } from "./owners";
export { mockRisks, getRisksByAsset, getRisksBySeverity } from "./risks";
export { mockComplianceRecords, getComplianceByAsset, getComplianceByFramework } from "./compliance";
export { mockLifecycleEvents, getLifecycleByAsset, getLifecycleSummary } from "./lifecycle";
export { mockCostEntries, getCostsByAsset, getAssetCostSummary, getCostSummaryByPeriod } from "./costs";
export { mockRecommendations, getRecommendationsByAsset, getRecommendationsByStatus } from "./recommendations";
export { mockApprovals, getApprovalsByStatus, getApprovalsByType } from "./approvals";
export { mockWorkflows, mockWorkflowInstances, getWorkflowDefinitions } from "./workflows";
export { mockAuditEvents, getAuditEventsByResource, getAuditEventsByUser } from "./audit";
export { mockExplainabilityData, getExplainabilityForRecommendation } from "./explainability";
export { mockReconciliations, getReconciliationsByStatus, getReconciliationsByAsset } from "./reconciliation";

export * from "./mockAdapter";