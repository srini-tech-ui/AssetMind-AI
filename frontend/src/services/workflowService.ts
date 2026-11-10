import { apiClient } from "@/services/apiClient";
import { Workflow, WorkflowInstance } from "@/types/domain";

// =====================================================
// Backend API response interfaces
// =====================================================

interface BackendWorkflowStep {
  id: string;
  workflow_id: string;
  name: string;
  type: "task" | "approval" | "notification" | "system";
  assignee_type: "user" | "role" | "system";
  assignee_id?: string | null;
  config: Record<string, unknown>;
  order: number;
}

interface BackendWorkflow {
  id: string;
  name: string;
  description?: string | null;
  type:
    | "asset_onboarding"
    | "asset_offboarding"
    | "compliance_check"
    | "risk_mitigation"
    | "approval"
    | "other";
  status: "draft" | "active" | "inactive" | "archived";
  version: string;
  trigger_type: "manual" | "scheduled" | "event";
  trigger_config: Record<string, unknown>;
  created_by?: string | null;
  steps: BackendWorkflowStep[];
  created_at: string;
  updated_at: string;
}

// =====================================================
// Transform backend snake_case data into the existing
// frontend camelCase Workflow format
// =====================================================

const transformWorkflow = (workflow: BackendWorkflow): Workflow => {
  return {
    id: workflow.id,
    name: workflow.name,
    description: workflow.description ?? "",
    type: workflow.type,
    status: workflow.status,
    version: workflow.version,

    trigger: {
      type: workflow.trigger_type,
      config: workflow.trigger_config,
    },

    steps: workflow.steps.map((step) => ({
      id: step.id,
      name: step.name,
      type: step.type,
      assigneeType: step.assignee_type,
      assigneeId: step.assignee_id ?? undefined,
      config: step.config,
      order: step.order,
    })),

    createdBy: workflow.created_by ?? undefined,
    createdAt: workflow.created_at,
    updatedAt: workflow.updated_at,
  };
};

// =====================================================
// GET ALL WORKFLOWS
// =====================================================

export const getWorkflows = async (): Promise<Workflow[]> => {
  const workflows = await apiClient<BackendWorkflow[]>(
    "/api/v1/workflows"
  );

  return workflows.map(transformWorkflow);
};

// =====================================================
// GET WORKFLOW BY ID
// =====================================================

export const getWorkflowById = async (
  workflowId: string
): Promise<Workflow> => {
  const workflow = await apiClient<BackendWorkflow>(
    `/api/v1/workflows/${workflowId}`
  );

  return transformWorkflow(workflow);
};

// =====================================================
// START WORKFLOW
// =====================================================

export const startWorkflow = async (
  workflowId: string,
  context: Record<string, unknown> = {}
): Promise<WorkflowInstance> => {
  return apiClient<WorkflowInstance>(
    `/api/v1/workflows/${workflowId}/start`,
    {
      method: "POST",
      body: context as BodyInit,
    }
  );
};