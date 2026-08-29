import { z } from "zod";

// ============================================
// RECONCILIATION
// ============================================
export const ReconciliationSchema = z.object({
  id: z.string().uuid(),
  assetId: z.string().uuid(),
  assetName: z.string().min(1),
  sourceSystem: z.string().min(1),
  targetSystem: z.string().min(1),
  expectedValue: z.string(),
  actualValue: z.string(),
  status: z.enum(["matched", "unmatched", "needs_review"]),
  lastChecked: z.string().datetime(),
  difference: z.string().nullable().optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Reconciliation = z.infer<typeof ReconciliationSchema>;

export const ReconciliationListItemSchema = ReconciliationSchema.pick({
  id: true,
  assetId: true,
  assetName: true,
  sourceSystem: true,
  targetSystem: true,
  status: true,
  lastChecked: true,
});

export type ReconciliationListItem = z.infer<typeof ReconciliationListItemSchema>;

// ============================================
// ASSET
// ============================================
export const AssetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  type: z.enum(["server", "laptop", "mobile", "network", "storage", "software", "cloud", "other"]),
  status: z.enum(["active", "inactive", "maintenance", "retired", "disposed"]),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().datetime().optional(),
  warrantyExpiry: z.string().datetime().optional(),
  locationId: z.string().uuid().optional(),
  businessUnitId: z.string().uuid().optional(),
  ownerId: z.string().uuid().optional(),
  costCenter: z.string().optional(),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.unknown()).default({}),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Asset = z.infer<typeof AssetSchema>;

export const AssetListItemSchema = AssetSchema.pick({
  id: true,
  name: true,
  type: true,
  status: true,
  locationId: true,
  businessUnitId: true,
  ownerId: true,
  updatedAt: true,
});

export type AssetListItem = z.infer<typeof AssetListItemSchema>;

// ============================================
// ASSET OWNER
// ============================================
export const AssetOwnerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  department: z.string().optional(),
  role: z.string().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type AssetOwner = z.infer<typeof AssetOwnerSchema>;

export const AssetOwnerListItemSchema = AssetOwnerSchema.pick({
  id: true,
  name: true,
  email: true,
  department: true,
  isActive: true,
});

export type AssetOwnerListItem = z.infer<typeof AssetOwnerListItemSchema>;

// ============================================
// RISK
// ============================================
export const RiskSchema = z.object({
  id: z.string().uuid(),
  assetId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(["security", "operational", "compliance", "financial", "other"]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  likelihood: z.enum(["low", "medium", "high"]),
  impact: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["open", "in_progress", "mitigated", "closed", "accepted"]),
  identifiedDate: z.string().datetime(),
  targetResolutionDate: z.string().datetime().optional(),
  ownerId: z.string().uuid().optional(),
  mitigationPlan: z.string().optional(),
  evidence: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Risk = z.infer<typeof RiskSchema>;

export const RiskListItemSchema = RiskSchema.pick({
  id: true,
  assetId: true,
  title: true,
  category: true,
  severity: true,
  status: true,
  identifiedDate: true,
  targetResolutionDate: true,
});

export type RiskListItem = z.infer<typeof RiskListItemSchema>;

// ============================================
// COMPLIANCE
// ============================================
export const ComplianceSchema = z.object({
  id: z.string().uuid(),
  assetId: z.string().uuid(),
  framework: z.enum(["iso_27001", "gdpr", "pci_dss", "sox", "hipaa", "other"]),
  requirementId: z.string().min(1),
  requirementTitle: z.string().min(1),
  status: z.enum(["compliant", "non_compliant", "partial", "not_assessed"]),
  evidence: z.array(z.string()).default([]),
  lastAssessed: z.string().datetime(),
  nextAssessmentDue: z.string().datetime().optional(),
  assessorId: z.string().uuid().optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Compliance = z.infer<typeof ComplianceSchema>;

export const ComplianceListItemSchema = ComplianceSchema.pick({
  id: true,
  assetId: true,
  framework: true,
  requirementId: true,
  requirementTitle: true,
  status: true,
  lastAssessed: true,
  nextAssessmentDue: true,
});

export type ComplianceListItem = z.infer<typeof ComplianceListItemSchema>;

// ============================================
// LIFECYCLE
// ============================================
export const LifecycleEventSchema = z.object({
  id: z.string().uuid(),
  assetId: z.string().uuid(),
  eventType: z.enum(["procurement", "deployment", "maintenance", "upgrade", "decommission", "disposal", "renewal"]),
  title: z.string().min(1),
  description: z.string().optional(),
  scheduledDate: z.string().datetime().optional(),
  completedDate: z.string().datetime().optional(),
  status: z.enum(["planned", "in_progress", "completed", "overdue", "cancelled"]),
  performedBy: z.string().uuid().optional(),
  cost: z.number().optional(),
  vendor: z.string().optional(),
  notes: z.string().optional(),
  attachments: z.array(z.string()).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type LifecycleEvent = z.infer<typeof LifecycleEventSchema>;

export const LifecycleEventListItemSchema = LifecycleEventSchema.pick({
  id: true,
  assetId: true,
  eventType: true,
  title: true,
  status: true,
  scheduledDate: true,
  completedDate: true,
});

export type LifecycleEventListItem = z.infer<typeof LifecycleEventListItemSchema>;

export const AssetLifecycleSummarySchema = z.object({
  assetId: z.string().uuid(),
  currentPhase: z.enum(["planning", "procurement", "deployment", "operation", "maintenance", "retirement"]),
  phaseEnteredAt: z.string().datetime(),
  nextPlannedEvent: LifecycleEventSchema.optional(),
  totalEvents: z.number(),
  overdueEvents: z.number().default(0),
  totalCost: z.number().default(0),
});

export type AssetLifecycleSummary = z.infer<typeof AssetLifecycleSummarySchema>;

// ============================================
// COST
// ============================================
export const CostEntrySchema = z.object({
  id: z.string().uuid(),
  assetId: z.string().uuid(),
  category: z.enum(["acquisition", "maintenance", "support", "license", "infrastructure", "training", "other"]),
  amount: z.number(),
  currency: z.string().default("USD"),
  date: z.string().datetime(),
  description: z.string().optional(),
  vendor: z.string().optional(),
  invoiceNumber: z.string().optional(),
  costCenter: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurrencePeriod: z.enum(["monthly", "quarterly", "annually"]).optional(),
  tags: z.array(z.string()).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CostEntry = z.infer<typeof CostEntrySchema>;

export const CostEntryListItemSchema = CostEntrySchema.pick({
  id: true,
  assetId: true,
  category: true,
  amount: true,
  currency: true,
  date: true,
  isRecurring: true,
});

export type CostEntryListItem = z.infer<typeof CostEntryListItemSchema>;

export const AssetCostSummarySchema = z.object({
  assetId: z.string().uuid(),
  totalCost: z.number(),
  currency: z.string().default("USD"),
  byCategory: z.record(z.number()),
  recurringMonthly: z.number().default(0),
  recurringAnnual: z.number().default(0),
  lastUpdated: z.string().datetime(),
});

export type AssetCostSummary = z.infer<typeof AssetCostSummarySchema>;

// ============================================
// RECOMMENDATION
// ============================================
export const RecommendationSchema = z.object({
  id: z.string().uuid(),
  assetId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(["performance", "security", "cost_optimization", "compliance", "lifecycle", "other"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["proposed", "under_review", "approved", "rejected", "in_progress", "completed", "dismissed"]),
  estimatedSavings: z.number().optional(),
  estimatedCost: z.number().optional(),
  currency: z.string().default("USD"),
  confidence: z.number().min(0).max(1),
  reasoning: z.string().optional(),
  evidenceIds: z.array(z.string()).default([]),
  affectedAssets: z.array(z.string().uuid()).default([]),
  approvalRequired: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Recommendation = z.infer<typeof RecommendationSchema>;

export const RecommendationListItemSchema = RecommendationSchema.pick({
  id: true,
  assetId: true,
  title: true,
  category: true,
  priority: true,
  status: true,
  estimatedSavings: true,
  confidence: true,
  approvalRequired: true,
  createdAt: true,
});

export type RecommendationListItem = z.infer<typeof RecommendationListItemSchema>;

// ============================================
// APPROVAL
// ============================================
export const ApprovalSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["budget", "asset_creation", "asset_retirement", "policy_exception", "vendor_change", "other"]),
  resourceType: z.string().min(1),
  resourceId: z.string().uuid(),
  requestedBy: z.string().uuid(),
  requestedAt: z.string().datetime(),
  status: z.enum(["pending", "approved", "rejected", "cancelled", "expired"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  approvers: z.array(
    z.object({
      userId: z.string().uuid(),
      role: z.string().optional(),
      status: z.enum(["pending", "approved", "rejected"]),
      decidedAt: z.string().datetime().optional(),
      comment: z.string().optional(),
    })
  ),
  currentApproverIndex: z.number().default(0),
  dueDate: z.string().datetime().optional(),
  decidedAt: z.string().datetime().optional(),
  decidedBy: z.string().uuid().optional(),
  decisionComment: z.string().optional(),
  metadata: z.record(z.unknown()).default({}),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Approval = z.infer<typeof ApprovalSchema>;

export const ApprovalListItemSchema = ApprovalSchema.pick({
  id: true,
  title: true,
  type: true,
  resourceType: true,
  resourceId: true,
  requestedBy: true,
  requestedAt: true,
  status: true,
  priority: true,
  dueDate: true,
});

export type ApprovalListItem = z.infer<typeof ApprovalListItemSchema>;

// ============================================
// WORKFLOW
// ============================================
export const WorkflowStepSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.enum(["task", "approval", "notification", "system"]),
  assigneeType: z.enum(["user", "role", "system"]),
  assigneeId: z.string().optional(),
  config: z.record(z.unknown()).default({}),
  order: z.number(),
});

export type WorkflowStep = z.infer<typeof WorkflowStepSchema>;

export const WorkflowSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["asset_onboarding", "asset_offboarding", "compliance_check", "risk_mitigation", "approval", "other"]),
  status: z.enum(["draft", "active", "inactive", "archived"]),
  version: z.string().default("1.0"),
  trigger: z.object({
    type: z.enum(["manual", "scheduled", "event"]),
    config: z.record(z.unknown()).default({}),
  }),
  steps: z.array(WorkflowStepSchema),
  createdBy: z.string().uuid().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Workflow = z.infer<typeof WorkflowSchema>;

export const WorkflowInstanceStepSchema = z.object({
  stepId: z.string(),
  name: z.string().min(1),
  status: z.enum(["pending", "in_progress", "completed", "skipped", "failed"]),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  assigneeId: z.string().uuid().optional(),
  notes: z.string().optional(),
});

export type WorkflowInstanceStep = z.infer<typeof WorkflowInstanceStepSchema>;

export const WorkflowInstanceSchema = z.object({
  id: z.string().uuid(),
  workflowId: z.string().uuid(),
  workflowVersion: z.string(),
  status: z.enum(["running", "completed", "failed", "cancelled", "paused"]),
  currentStepId: z.string().optional(),
  context: z.record(z.unknown()).default({}),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  startedBy: z.string().uuid().optional(),
  steps: z.array(WorkflowInstanceStepSchema),
});

export type WorkflowInstance = z.infer<typeof WorkflowInstanceSchema>;

export const WorkflowInstanceListItemSchema = WorkflowInstanceSchema.pick({
  id: true,
  workflowId: true,
  workflowVersion: true,
  status: true,
  currentStepId: true,
  startedAt: true,
  completedAt: true,
});

export type WorkflowInstanceListItem = z.infer<typeof WorkflowInstanceListItemSchema>;

// ============================================
// AUDIT
// ============================================
export const AuditEventSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string().datetime(),
  eventType: z.string().min(1),
  resourceType: z.string().min(1),
  resourceId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  userName: z.string().optional(),
  userRoles: z.array(z.string()).default([]),
  changes: z.record(z.object({
    before: z.unknown(),
    after: z.unknown(),
  })),
  metadata: z.record(z.unknown()).default({}),
  severity: z.enum(["info", "warning", "error", "critical"]),
});

export type AuditEvent = z.infer<typeof AuditEventSchema>;

export const AuditEventListItemSchema = AuditEventSchema.pick({
  id: true,
  timestamp: true,
  eventType: true,
  resourceType: true,
  resourceId: true,
  userId: true,
  userName: true,
  severity: true,
});

export type AuditEventListItem = z.infer<typeof AuditEventListItemSchema>;