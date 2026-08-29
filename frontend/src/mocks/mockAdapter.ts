/**
 * Phase 2.1: Mock Service Adapter Layer
 *
 * This layer provides frontend service abstractions that return mock data
 * when VITE_USE_MOCKS=true, without ever calling fetch() or contacting
 * a backend.
 *
 * IMPORTANT: This data is for frontend development only.
 * - No backend is connected
 * - No authentication is implemented
 * - No security decisions are made from this data
 */
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  mockAssets,
  getAssetById,
  getAssetsByStatus,
  getAssetsByType,
  getAssetListItems,
} from "./assets";
import { mockAssetOwners, getOwnerById, getOwnerListItems } from "./owners";
import { mockRisks, getRisksByAsset, getRisksBySeverity, getRiskListItems } from "./risks";
import { mockComplianceRecords, getComplianceByAsset, getComplianceByFramework, getComplianceListItems } from "./compliance";
import { mockLifecycleEvents, getLifecycleByAsset, getLifecycleSummary, getLifecycleEventListItems } from "./lifecycle";
import { mockCostEntries, getCostsByAsset, getAssetCostSummary, getCostSummaryByPeriod, getCostEntryListItems } from "./costs";
import { mockRecommendations, getRecommendationsByAsset, getRecommendationsByStatus, getRecommendationListItems } from "./recommendations";
import { mockApprovals, getApprovalsByStatus, getApprovalsByType, getApprovalListItems } from "./approvals";
import { mockWorkflows, getWorkflowDefinitions, getWorkflowInstancesByWorkflow, getWorkflowInstanceListItems, mockWorkflowInstances } from "./workflows";
import { mockAuditEvents, getAuditEventsByResource, getAuditEventsByUser, getAuditEventListItems } from "./audit";
import { getExplainabilityForRecommendation, getAllExplainabilityEvidence } from "./explainability";
import {
  mockReconciliations,
  getReconciliationsByStatus,
  getReconciliationsByAsset,
  getReconciliationListItems,
} from "./reconciliation";
import { useMemo } from "react";

// Check if mocks are enabled
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

// Helper to create mock query data
function createMockQuery<T>(data: T) {
  return {
    data,
    isLoading: false,
    isFetching: false,
    error: null,
    status: "success" as const,
    refetch: async () => {},
  };
};

// Reconciliation services
export const reconciliationService = {
  getAll: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(mockReconciliations);
  },
  getByStatus: (status: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getReconciliationsByStatus(status));
  },
  getByAsset: (assetId: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getReconciliationsByAsset(assetId));
  },
  getListItems: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getReconciliationListItems());
  },
};

// TanStack Query hooks for reconciliation
export const useMockReconciliations = (options?: UseQueryOptions<typeof mockReconciliations>) => {
  return useQuery({
    queryKey: ["mockReconciliations"],
    queryFn: () => mockReconciliations,
    ...options,
  });
};

export const useMockReconciliationListItems = (options?: UseQueryOptions<ReturnType<typeof getReconciliationListItems>>) => {
  return useQuery({
    queryKey: ["mockReconciliationListItems"],
    queryFn: () => getReconciliationListItems(),
    ...options,
  });
};

// Asset services
export const assetService = {
  getAll: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(mockAssets);
  },
  getById: (id: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    const asset = getAssetById(id);
    return createMockQuery(asset);
  },
  getByStatus: (status: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getAssetsByStatus(status));
  },
  getByType: (type: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getAssetsByType(type));
  },
  getListItems: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getAssetListItems());
  },
};

// Owner services
export const ownerService = {
  getAll: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(mockAssetOwners);
  },
  getById: (id: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    const owner = getOwnerById(id);
    return createMockQuery(owner);
  },
  getListItems: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getOwnerListItems());
  },
};

// Risk services
export const riskService = {
  getAll: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(mockRisks);
  },
  getByAsset: (assetId: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getRisksByAsset(assetId));
  },
  getBySeverity: (severity: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getRisksBySeverity(severity));
  },
  getListItems: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getRiskListItems());
  },
};

// Compliance services
export const complianceService = {
  getAll: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(mockComplianceRecords);
  },
  getByAsset: (assetId: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getComplianceByAsset(assetId));
  },
  getByFramework: (framework: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getComplianceByFramework(framework));
  },
  getListItems: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getComplianceListItems());
  },
};

// Lifecycle services
export const lifecycleService = {
  getByAsset: (assetId: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getLifecycleByAsset(assetId));
  },
  getSummary: (assetId: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getLifecycleSummary(assetId));
  },
  getEventListItems: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getLifecycleEventListItems());
  },
};

// Cost services
export const costService = {
  getByAsset: (assetId: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getCostsByAsset(assetId));
  },
  getSummary: (assetId: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getAssetCostSummary(assetId));
  },
  getSummaryByPeriod: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getCostSummaryByPeriod());
  },
  getEntryListItems: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getCostEntryListItems());
  },
};

// Recommendation services
export const recommendationService = {
  getAll: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(mockRecommendations);
  },
  getByAsset: (assetId: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getRecommendationsByAsset(assetId));
  },
  getByStatus: (status: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getRecommendationsByStatus(status));
  },
  getListItems: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getRecommendationListItems());
  },
};

// Approval services
export const approvalService = {
  getAll: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(mockApprovals);
  },
  getByStatus: (status: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getApprovalsByStatus(status));
  },
  getByType: (type: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getApprovalsByType(type));
  },
  getListItems: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getApprovalListItems());
  },
};

// Workflow services
export const workflowService = {
  getDefinitions: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(mockWorkflows);
  },
  getInstancesByWorkflow: (workflowId: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getWorkflowInstancesByWorkflow(workflowId));
  },
  getInstanceListItems: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getWorkflowInstanceListItems());
  },
};

// Audit services
export const auditService = {
  getByResource: (resourceType: string, resourceId: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getAuditEventsByResource(resourceType, resourceId));
  },
  getByUser: (userId: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getAuditEventsByUser(userId));
  },
  getAll: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(mockAuditEvents);
  },
  getListItems: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getAuditEventListItems());
  },
};

// Explainability services
export const explainabilityService = {
  getForRecommendation: (recommendationId: string) => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getExplainabilityForRecommendation(recommendationId));
  },
  getAllEvidence: () => {
    if (!USE_MOCKS) throw new Error("Mock mode not enabled");
    return createMockQuery(getAllExplainabilityEvidence());
  },
};

// TanStack Query hooks for mock data
export const useMockAssets = (options?: UseQueryOptions<typeof mockAssets>) => {
  return useQuery({
    queryKey: ["mockAssets"],
    queryFn: () => mockAssets,
    ...options,
  });
};

export const useMockAssetById = (id: string, options?: UseQueryOptions<typeof mockAssets[0]>) => {
  return useQuery({
    queryKey: ["mockAsset", id],
    queryFn: () => getAssetById(id),
    enabled: !!id,
    ...options,
  });
};

export const useMockAssetListItems = (options?: UseQueryOptions<ReturnType<typeof getAssetListItems>>) => {
  return useQuery({
    queryKey: ["mockAssetListItems"],
    queryFn: () => getAssetListItems(),
    ...options,
  });
};

export const useMockRisks = (options?: UseQueryOptions<typeof mockRisks>) => {
  return useQuery({
    queryKey: ["mockRisks"],
    queryFn: () => mockRisks,
    ...options,
  });
};

export const useMockRiskListItems = (options?: UseQueryOptions<ReturnType<typeof getRiskListItems>>) => {
  return useQuery({
    queryKey: ["mockRiskListItems"],
    queryFn: () => getRiskListItems(),
    ...options,
  });
};

export const useMockCompliance = (options?: UseQueryOptions<typeof mockComplianceRecords>) => {
  return useQuery({
    queryKey: ["mockCompliance"],
    queryFn: () => mockComplianceRecords,
    ...options,
  });
};

export const useMockComplianceListItems = (options?: UseQueryOptions<ReturnType<typeof getComplianceListItems>>) => {
  return useQuery({
    queryKey: ["mockComplianceListItems"],
    queryFn: () => getComplianceListItems(),
    ...options,
  });
};

export const useMockRisksByAsset = (assetId: string, options?: UseQueryOptions<ReturnType<typeof getRisksByAsset>>) => {
  return useQuery({
    queryKey: ["mockRisks", assetId],
    queryFn: () => getRisksByAsset(assetId),
    enabled: !!assetId,
    ...options,
  });
};

export const useMockRecommendationsByAsset = (assetId: string, options?: UseQueryOptions<ReturnType<typeof getRecommendationsByAsset>>) => {
  return useQuery({
    queryKey: ["mockRecommendations", assetId],
    queryFn: () => getRecommendationsByAsset(assetId),
    enabled: !!assetId,
    ...options,
  });
};

export const useMockLifecycleByAsset = (assetId: string, options?: UseQueryOptions<ReturnType<typeof getLifecycleByAsset>>) => {
  return useQuery({
    queryKey: ["mockLifecycle", assetId],
    queryFn: () => getLifecycleByAsset(assetId),
    enabled: !!assetId,
    ...options,
  });
};

export const useMockCostsByAsset = (assetId: string, options?: UseQueryOptions<ReturnType<typeof getCostsByAsset>>) => {
  return useQuery({
    queryKey: ["mockCosts", assetId],
    queryFn: () => getCostsByAsset(assetId),
    enabled: !!assetId,
    ...options,
  });
};

export const useMockApprovalsByStatus = (status: string, options?: UseQueryOptions<ReturnType<typeof getApprovalsByStatus>>) => {
  return useQuery({
    queryKey: ["mockApprovals", status],
    queryFn: () => getApprovalsByStatus(status),
    enabled: !!status,
    ...options,
  });
};

export const useMockAuditByResource = (resourceType: string, resourceId: string, options?: UseQueryOptions<ReturnType<typeof getAuditEventsByResource>>) => {
  return useQuery({
    queryKey: ["mockAudit", resourceType, resourceId],
    queryFn: () => getAuditEventsByResource(resourceType, resourceId),
    enabled: !!resourceType && !!resourceId,
    ...options,
  });
};

export const useMockExplainability = (recommendationId: string, options?: UseQueryOptions<ReturnType<typeof getExplainabilityForRecommendation>>) => {
  return useQuery({
    queryKey: ["mockExplainability", recommendationId],
    queryFn: () => getExplainabilityForRecommendation(recommendationId),
    enabled: !!recommendationId,
    ...options,
  });
};

// Phase 3.2: Approval and Workflow hooks
export const useMockApprovals = (options?: UseQueryOptions<typeof mockApprovals>) => {
  return useQuery({
    queryKey: ["mockApprovals"],
    queryFn: () => mockApprovals,
    ...options,
  });
};

export const useMockWorkflows = (options?: UseQueryOptions<typeof mockWorkflows>) => {
  return useQuery({
    queryKey: ["mockWorkflows"],
    queryFn: () => mockWorkflows,
    ...options,
  });
};

export const useMockWorkflowInstances = (options?: UseQueryOptions<typeof mockWorkflowInstances>) => {
  return useQuery({
    queryKey: ["mockWorkflowInstances"],
    queryFn: () => mockWorkflowInstances,
    ...options,
  });
};

// Phase 3.3: Audit hook
export const useMockAuditEvents = (options?: UseQueryOptions<typeof mockAuditEvents>) => {
  return useQuery({
    queryKey: ["mockAuditEvents"],
    queryFn: () => mockAuditEvents,
    ...options,
  });
};

// Phase 3.1: Recommendations hook (restored after Phase 3.4 regression)
export const useMockRecommendations = (options?: UseQueryOptions<typeof mockRecommendations>) => {
  return useQuery({
    queryKey: ["mockRecommendations"],
    queryFn: () => mockRecommendations,
    ...options,
  });
};