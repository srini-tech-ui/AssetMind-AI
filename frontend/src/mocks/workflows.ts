/**
 * Phase 2.1: Mock Workflow Data
 * 
 * Development/demo data only. No backend connected.
 */
import { Workflow, WorkflowInstance, WorkflowInstanceListItem } from "@/types/domain";

export const mockWorkflows: Workflow[] = [
  {
    id: "wf-001",
    name: "Asset Onboarding",
    description: "Standard workflow for onboarding new assets into the inventory.",
    type: "asset_onboarding",
    status: "active",
    version: "1.0",
    trigger: { type: "manual", config: {} },
    steps: [
      { id: "step-1", name: "Create Asset Record", type: "task", assigneeType: "role", assigneeId: "owner-001", config: {}, order: 0 },
      { id: "step-2", name: "Assign Owner", type: "task", assigneeType: "role", assigneeId: "owner-001", config: {}, order: 1 },
      { id: "step-3", name: "Initial Compliance Check", type: "approval", assigneeType: "role", assigneeId: "owner-001", config: {}, order: 2 },
    ],
    createdBy: "owner-001",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "wf-002",
    name: "Asset Offboarding",
    description: "Workflow for decommissioning and disposing of assets.",
    type: "asset_offboarding",
    status: "active",
    version: "1.0",
    trigger: { type: "manual", config: {} },
    steps: [
      { id: "step-4", name: "Request Offboarding", type: "task", assigneeType: "user", assigneeId: "owner-001", config: {}, order: 0 },
      { id: "step-5", name: "Data Wipe Approval", type: "approval", assigneeType: "role", assigneeId: "owner-001", config: {}, order: 1 },
      { id: "step-6", name: "Dispose Asset", type: "task", assigneeType: "role", assigneeId: "owner-001", config: {}, order: 2 },
    ],
    createdBy: "owner-001",
    createdAt: "2023-02-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "wf-003",
    name: "Security Compliance Check",
    description: "Automated compliance check workflow for security standards.",
    type: "compliance_check",
    status: "active",
    version: "2.1",
    trigger: { type: "scheduled", config: { cron: "0 9 * * 1" } },
    steps: [
      { id: "step-7", name: "Scan Vulnerabilities", type: "task", assigneeType: "system", config: {}, order: 0 },
      { id: "step-8", name: "Generate Compliance Report", type: "task", assigneeType: "system", config: {}, order: 1 },
      { id: "step-9", name: "Review Findings", type: "approval", assigneeType: "role", assigneeId: "owner-001", config: {}, order: 2 },
    ],
    createdBy: "owner-001",
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
];

export const mockWorkflowInstances: WorkflowInstance[] = [
  {
    id: "wfi-001",
    workflowId: "wf-001",
    workflowVersion: "1.0",
    status: "completed",
    currentStepId: "step-3",
    context: { assetId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
    startedAt: "2024-01-15T08:00:00Z",
    completedAt: "2024-01-20T17:00:00Z",
    startedBy: "owner-001",
    steps: [
      { stepId: "step-1", name: "Create Asset Record", status: "completed", startedAt: "2024-01-15T08:00:00Z", completedAt: "2024-01-15T10:00:00Z" },
      { stepId: "step-2", name: "Assign Owner", status: "completed", startedAt: "2024-01-15T10:00:00Z", completedAt: "2024-01-15T11:00:00Z" },
      { stepId: "step-3", name: "Initial Compliance Check", status: "completed", startedAt: "2024-01-15T11:00:00Z", completedAt: "2024-01-20T17:00:00Z" },
    ],
  },
  {
    id: "wfi-002",
    workflowId: "wf-003",
    workflowVersion: "2.1",
    status: "running",
    currentStepId: "step-8",
    context: { assetId: "c3d4e5f6-a7b8-9012-cdef-123456789012" },
    startedAt: "2024-12-02T09:00:00Z",
    steps: [
      { stepId: "step-7", name: "Scan Vulnerabilities", status: "completed", startedAt: "2024-12-02T09:00:00Z", completedAt: "2024-12-02T10:00:00Z" },
      { stepId: "step-8", name: "Generate Compliance Report", status: "in_progress", startedAt: "2024-12-02T10:00:00Z" },
    ],
  },
];

export function getWorkflowDefinitions(): Workflow[] {
  return mockWorkflows;
}

export function getWorkflowInstancesByWorkflow(workflowId: string): WorkflowInstance[] {
  return mockWorkflowInstances.filter((wi) => wi.workflowId === workflowId);
}

export function getWorkflowInstanceListItems(): WorkflowInstanceListItem[] {
  return mockWorkflowInstances.map(
    ({ id, workflowId, workflowVersion, status, currentStepId, startedAt, completedAt }) => ({
      id,
      workflowId,
      workflowVersion,
      status,
      currentStepId,
      startedAt,
      completedAt,
    })
  );
}