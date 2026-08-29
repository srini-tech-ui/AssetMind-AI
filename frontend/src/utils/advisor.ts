/**
 * Phase 2.6: Deterministic Advisor Insights
 *
 * Derives advisory insights and recommendations from the existing
 * Phase 2.1 mock-data foundation. No external AI is used.
 */
import { Asset, Risk, Compliance, Reconciliation, LifecycleEvent, CostEntry, Recommendation, AssetOwner } from "@/types/domain";

export type AdvisorPriority = "high" | "medium" | "low" | "info";

export interface AdvisorRecommendation {
  id: string;
  priority: AdvisorPriority;
  category: "risk" | "ownership" | "lifecycle" | "cost" | "compliance" | "reconciliation";
  title: string;
  finding: string;
  whyItMatters: string;
  recommendedAction: string;
  assetId?: string;
  assetName?: string;
  route?: string;
  routeLabel?: string;
  evidenceCount: number;
}

// Helper: priority from severity
function severityToPriority(severity: Risk["severity"]): AdvisorPriority {
  if (severity === "critical") return "high";
  if (severity === "high") return "high";
  if (severity === "medium") return "medium";
  return "low";
}

function isWarrantyNearExpiry(warrantyExpiry: string | undefined, thresholdDays = 90): boolean {
  if (!warrantyExpiry) return false;
  const expiry = new Date(warrantyExpiry).getTime();
  const now = Date.now();
  const days = (expiry - now) / (1000 * 60 * 60 * 24);
  return days > 0 && days <= thresholdDays;
}

function isAssetAged(purchaseDate: string | undefined, years = 3): boolean {
  if (!purchaseDate) return false;
  const purchased = new Date(purchaseDate).getTime();
  const now = Date.now();
  const yearsDiff = (now - purchased) / (1000 * 60 * 60 * 24 * 365.25);
  return yearsDiff >= years;
}

export interface AdvisorContext {
  assets: Asset[];
  owners: AssetOwner[];
  risks: Risk[];
  lifecycle: LifecycleEvent[];
  costs: CostEntry[];
  compliance: Compliance[];
  reconciliations: Reconciliation[];
  recommendations: Recommendation[];
}

export function buildAdvisorRecommendations(ctx: AdvisorContext): AdvisorRecommendation[] {
  const recs: AdvisorRecommendation[] = [];
  const ownerById = new Map(ctx.owners.map((o) => [o.id, o]));
  const assetById = new Map(ctx.assets.map((a) => [a.id, a]));

  // RISK insights
  for (const risk of ctx.risks) {
    if (risk.status === "mitigated" || risk.status === "closed" || risk.status === "accepted") continue;
    const asset = assetById.get(risk.assetId);
    const owner = asset?.ownerId ? ownerById.get(asset.ownerId) : undefined;
    const priority = severityToPriority(risk.severity);
    recs.push({
      id: `risk-${risk.id}`,
      priority,
      category: "risk",
      title: risk.title,
      finding: `${risk.severity.toUpperCase()} severity ${risk.category} risk on "${asset?.name ?? "Unknown asset"}" is currently ${risk.status.replace("_", " ")}.`,
      whyItMatters:
        risk.severity === "critical" || risk.severity === "high"
          ? `Critical or high-severity risks can cause service disruption, compliance exposure, or data loss. The asset is owned by ${owner?.name ?? "an unassigned steward"}.`
          : `Medium-severity risks should be tracked to prevent escalation. Owned by ${owner?.name ?? "an unassigned steward"}.`,
      recommendedAction: risk.mitigationPlan ?? "Review the risk record, validate the mitigation plan, and update status as work progresses.",
      assetId: risk.assetId,
      assetName: asset?.name,
      route: risk.assetId ? `/inventory/${risk.assetId}` : undefined,
      routeLabel: "View Asset",
      evidenceCount: risk.evidence?.length ?? 0,
    });
  }

  // OWNERSHIP insights
  for (const asset of ctx.assets) {
    if (!asset.ownerId) {
      recs.push({
        id: `owner-unassigned-${asset.id}`,
        priority: "medium",
        category: "ownership",
        title: `Unassigned asset: ${asset.name}`,
        finding: `"${asset.name}" (${asset.type}) has no owner assigned.`,
        whyItMatters: "Unassigned assets lack a clear steward for risk acceptance, lifecycle decisions, and cost accountability.",
        recommendedAction: "Assign an owner with a matching department and confirm they accept stewardship responsibilities.",
        assetId: asset.id,
        assetName: asset.name,
        route: `/inventory/${asset.id}`,
        routeLabel: "View Asset",
        evidenceCount: 0,
      });
    } else {
      const owner = ownerById.get(asset.ownerId);
      if (owner && !owner.isActive) {
        recs.push({
          id: `owner-inactive-${asset.id}`,
          priority: "medium",
          category: "ownership",
          title: `Inactive owner on ${asset.name}`,
          finding: `"${asset.name}" is assigned to ${owner.name}, whose owner record is marked inactive.`,
          whyItMatters: "Inactive owners may not be available to respond to incidents, approvals, or lifecycle events.",
          recommendedAction: "Reassign the asset to an active owner, or reactivate the existing owner record if appropriate.",
          assetId: asset.id,
          assetName: asset.name,
          route: `/ownership`,
          routeLabel: "Review Ownership",
          evidenceCount: 0,
        });
      }
    }
  }

  // LIFECYCLE insights
  for (const asset of ctx.assets) {
    if (isWarrantyNearExpiry(asset.warrantyExpiry)) {
      recs.push({
        id: `lifecycle-warranty-${asset.id}`,
        priority: "medium",
        category: "lifecycle",
        title: `Warranty expiring soon: ${asset.name}`,
        finding: `Warranty for "${asset.name}" expires on ${new Date(asset.warrantyExpiry!).toLocaleDateString()}.`,
        whyItMatters: "Expiring warranty exposes the organization to unplanned support costs and replacement risk.",
        recommendedAction: "Plan renewal or replacement, and confirm vendor support options before the expiry date.",
        assetId: asset.id,
        assetName: asset.name,
        route: `/inventory/${asset.id}`,
        routeLabel: "View Asset",
        evidenceCount: 0,
      });
    }
    if (isAssetAged(asset.purchaseDate)) {
      const years = asset.purchaseDate
        ? Math.floor((Date.now() - new Date(asset.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
        : 0;
      recs.push({
        id: `lifecycle-aged-${asset.id}`,
        priority: "low",
        category: "lifecycle",
        title: `Aging asset: ${asset.name}`,
        finding: `"${asset.name}" was purchased approximately ${years} year(s) ago.`,
        whyItMatters: "Aging hardware typically has higher failure rates, reduced vendor support, and increased operating costs.",
        recommendedAction: "Evaluate replacement, refresh, or extended support options during the next planning cycle.",
        assetId: asset.id,
        assetName: asset.name,
        route: `/inventory/${asset.id}`,
        routeLabel: "View Asset",
        evidenceCount: 0,
      });
    }
  }

  // Planned lifecycle events
  for (const ev of ctx.lifecycle) {
    if (ev.status === "planned" || ev.status === "in_progress") {
      const asset = assetById.get(ev.assetId);
      recs.push({
        id: `lifecycle-event-${ev.id}`,
        priority: "info",
        category: "lifecycle",
        title: ev.title,
        finding: `Lifecycle event "${ev.title}" for "${asset?.name ?? "Unknown asset"}" is ${ev.status.replace("_", " ")}.`,
        whyItMatters: "Tracked lifecycle events keep deployment, maintenance, and retirement schedules on plan.",
        recommendedAction: "Review the scheduled event, confirm stakeholders, and update the status as it progresses.",
        assetId: ev.assetId,
        assetName: asset?.name,
        route: ev.assetId ? `/inventory/${ev.assetId}` : undefined,
        routeLabel: "View Asset",
        evidenceCount: 0,
      });
    }
  }

  // COST insights
  const totalCostByAsset = new Map<string, number>();
  for (const c of ctx.costs) {
    totalCostByAsset.set(c.assetId, (totalCostByAsset.get(c.assetId) ?? 0) + c.amount);
  }
  const sortedByCost = [...totalCostByAsset.entries()].sort((a, b) => b[1] - a[1]);
  if (sortedByCost.length > 0) {
    const [topId, topAmount] = sortedByCost[0];
    const topAsset = assetById.get(topId);
    if (topAsset && topAmount >= 10000) {
      recs.push({
        id: `cost-top-${topId}`,
        priority: topAmount >= 50000 ? "high" : "medium",
        category: "cost",
        title: `High total cost: ${topAsset.name}`,
        finding: `"${topAsset.name}" has accumulated $${topAmount.toLocaleString()} in tracked costs, the highest in the portfolio.`,
        whyItMatters: "Concentrated cost on a single asset warrants verification that the spend is justified and optimized.",
        recommendedAction: "Review cost entries for this asset, validate active contracts, and evaluate optimization opportunities.",
        assetId: topId,
        assetName: topAsset.name,
        route: `/inventory/${topId}`,
        routeLabel: "View Asset",
        evidenceCount: ctx.costs.filter((c) => c.assetId === topId).length,
      });
    }
  }

  // COMPLIANCE insights
  for (const c of ctx.compliance) {
    if (c.status === "non_compliant" || c.status === "partial") {
      const asset = assetById.get(c.assetId);
      recs.push({
        id: `compliance-${c.id}`,
        priority: c.status === "non_compliant" ? "high" : "medium",
        category: "compliance",
        title: `${c.framework.toUpperCase()} gap: ${c.requirementTitle}`,
        finding: `${c.framework} requirement ${c.requirementId} for "${asset?.name ?? "Unknown asset"}" is ${c.status.replace("_", " ")}.`,
        whyItMatters: "Compliance gaps can result in audit findings, regulatory exposure, and security risk.",
        recommendedAction: c.notes ?? "Review the compliance record, address the gap, and reassess.",
        assetId: c.assetId,
        assetName: asset?.name,
        route: c.assetId ? `/inventory/${c.assetId}` : undefined,
        routeLabel: "View Asset",
        evidenceCount: c.evidence?.length ?? 0,
      });
    }
  }

  // RECONCILIATION insights
  for (const r of ctx.reconciliations) {
    if (r.status === "unmatched" || r.status === "needs_review") {
      const asset = assetById.get(r.assetId);
      recs.push({
        id: `recon-${r.id}`,
        priority: r.status === "unmatched" ? "medium" : "low",
        category: "reconciliation",
        title: `${r.status === "unmatched" ? "Unmatched" : "Needs review"}: ${r.assetName}`,
        finding: `${r.sourceSystem} → ${r.targetSystem}: expected "${r.expectedValue}", actual "${r.actualValue}".`,
        whyItMatters: r.difference ?? "Reconciliation mismatches indicate data drift between source systems.",
        recommendedAction: r.notes ?? "Investigate the mismatch and update the source of truth.",
        assetId: r.assetId,
        assetName: r.assetName,
        route: `/inventory/${r.assetId}`,
        routeLabel: "View Asset",
        evidenceCount: 0,
      });
    }
  }

  // EXISTING AI recommendations (proposed/under_review) — surface as advisor items
  for (const rec of ctx.recommendations) {
    if (rec.status === "proposed" || rec.status === "under_review") {
      const asset = assetById.get(rec.assetId);
      recs.push({
        id: `rec-${rec.id}`,
        priority: rec.priority === "critical" ? "high" : rec.priority,
        category: rec.category === "cost_optimization" ? "cost" : (rec.category as AdvisorRecommendation["category"]),
        title: rec.title,
        finding: rec.description ?? `Existing recommendation on "${asset?.name ?? "an asset"}" awaiting decision.`,
        whyItMatters: rec.reasoning ?? "The existing recommendation captures an actionable improvement based on available evidence.",
        recommendedAction: "Review the recommendation and decide whether to approve, reject, or defer.",
        assetId: rec.assetId,
        assetName: asset?.name,
        route: rec.assetId ? `/inventory/${rec.assetId}` : undefined,
        routeLabel: "View Asset",
        evidenceCount: rec.evidenceIds?.length ?? 0,
      });
    }
  }

  // Sort: high → medium → low → info
  const order: Record<AdvisorPriority, number> = { high: 0, medium: 1, low: 2, info: 3 };
  recs.sort((a, b) => order[a.priority] - order[b.priority]);

  return recs;
}

export interface AdvisorSignalCounts {
  risk: number;
  ownership: number;
  lifecycle: number;
  cost: number;
  compliance: number;
  reconciliation: number;
}

export function summarizeSignals(recs: AdvisorRecommendation[]): AdvisorSignalCounts {
  const counts: AdvisorSignalCounts = {
    risk: 0,
    ownership: 0,
    lifecycle: 0,
    cost: 0,
    compliance: 0,
    reconciliation: 0,
  };
  for (const r of recs) counts[r.category]++;
  return counts;
}