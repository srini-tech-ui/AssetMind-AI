"use client";

import React, { useMemo, useState } from "react";
import {
  useMockAssets,
  useMockRisks,
  useMockApprovals,
  useMockRecommendations,
  useMockAuditEvents,
  useMockCompliance,
} from "@/mocks/mockAdapter";
import { mockAssetOwners } from "@/mocks/owners";
import { mockLifecycleEvents } from "@/mocks/lifecycle";
import { mockCostEntries } from "@/mocks/costs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  FileText,
  Download,
  CheckCircle,
  ShieldAlert,
  Lightbulb,
  Workflow,
  History,
  Boxes,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { showSuccess, showError } from "@/utils/toast";
import type { Recommendation } from "@/types/domain";

// ---------- Report types ----------
const REPORT_TYPES = [
  { value: "executive", label: "Executive Asset Intelligence Report" },
  { value: "portfolio", label: "Asset Portfolio Report" },
  { value: "risk", label: "Risk & Compliance Report" },
  { value: "recommendations", label: "Recommendations & Decisions Report" },
  { value: "audit", label: "Audit & History Report" },
] as const;

type ReportType = (typeof REPORT_TYPES)[number]["value"];

const DEFAULT_SECTIONS = [
  "executive_summary",
  "asset_portfolio",
  "ownership",
  "cost",
  "risks",
  "compliance",
  "recommendations",
  "approvals",
  "lifecycle",
  "audit",
] as const;

type SectionKey = (typeof DEFAULT_SECTIONS)[number];

const SECTION_LABELS: Record<SectionKey, string> = {
  executive_summary: "Executive Summary",
  asset_portfolio: "Asset Portfolio",
  ownership: "Ownership",
  cost: "Cost",
  risks: "Risks",
  compliance: "Compliance",
  recommendations: "Recommendations",
  approvals: "Approvals",
  lifecycle: "Lifecycle",
  audit: "Audit & History",
};

// ---------- Color helpers ----------
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "inactive":
      return "bg-yellow-100 text-yellow-800";
    case "maintenance":
      return "bg-blue-100 text-blue-800";
    case "retired":
      return "bg-gray-100 text-gray-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "proposed":
      return "bg-blue-100 text-blue-800";
    case "in_progress":
      return "bg-indigo-100 text-indigo-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "open":
      return "bg-red-100 text-red-800";
    case "non_compliant":
      return "bg-red-100 text-red-800";
    case "compliant":
      return "bg-green-100 text-green-800";
    case "partial":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// ---------- Format helpers ----------
const fmtCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString();
const fmtDateTime = (iso: string) => new Date(iso).toLocaleString();

// ============================================================
// REPORT PREVIEW SUB-SECTIONS
// ============================================================

const ExecutiveSummarySection: React.FC<{
  totalAssets: number;
  activeRisks: number;
  totalRecommendations: number;
  pendingApprovals: number;
  recentAuditEvents: number;
}> = ({ totalAssets, activeRisks, totalRecommendations, pendingApprovals, recentAuditEvents }) => (
  <div className="space-y-3">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Executive Summary</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      This report provides a comprehensive overview of the organization&apos;s IT asset portfolio. Key highlights
      include <strong>{totalAssets} total assets</strong> tracked across the portfolio, with{' '}
      <strong>{activeRisks} active risks</strong> currently requiring attention. The AI-powered
      recommendation engine has identified <strong>{totalRecommendations} recommendations</strong>,
      of which <strong>{pendingApprovals}</strong> are awaiting approval decisions. Recent audit
      activity shows <strong>{recentAuditEvents} events</strong> in the past 7 days, reflecting
      ongoing operational visibility across the asset lifecycle.
    </p>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-2">
      {[
        { label: "Total Assets", value: totalAssets, icon: <Boxes className="h-4 w-4" /> },
        { label: "Active Risks", value: activeRisks, icon: <ShieldAlert className="h-4 w-4 text-red-500" /> },
        { label: "Recommendations", value: totalRecommendations, icon: <Lightbulb className="h-4 w-4 text-amber-500" /> },
        { label: "Pending Approvals", value: pendingApprovals, icon: <Workflow className="h-4 w-4 text-blue-500" /> },
        { label: "Audit Events (7d)", value: recentAuditEvents, icon: <History className="h-4 w-4 text-purple-500" /> },
      ].map((item) => (
        <div key={item.label} className="p-3 border rounded-lg text-center">
          <div className="flex justify-center mb-1 text-gray-500">{item.icon}</div>
          <div className="text-xl font-bold">{item.value}</div>
          <div className="text-xs text-gray-500">{item.label}</div>
        </div>
      ))}
    </div>
  </div>
);

const AssetPortfolioSection: React.FC<{
  assets: ReturnType<typeof useMockAssets>["data"];
  scope: "portfolio" | "asset";
  selectedAssetId: string | null;
}> = ({ assets, scope, selectedAssetId }) => {
  const displayAssets = scope === "asset" && selectedAssetId
    ? (assets ?? []).filter((a) => a.id === selectedAssetId)
    : (assets ?? []);

  if (displayAssets.length === 0) {
    return (
      <div className="py-4 text-sm text-gray-500">
        No assets available for the selected scope.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Asset Portfolio</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Manufacturer</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayAssets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell className="font-medium">{asset.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">{asset.type}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(asset.status)} capitalize text-xs`}>
                  {asset.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{asset.manufacturer ?? "—"}</TableCell>
              <TableCell className="text-sm">{asset.locationId ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const OwnershipSection: React.FC<{
  assets: ReturnType<typeof useMockAssets>["data"];
}> = ({ assets }) => {
  const byOwner = useMemo(() => {
    const map = new Map<string, number>();
    (assets ?? []).forEach((a) => {
      if (a.ownerId) {
        map.set(a.ownerId, (map.get(a.ownerId) ?? 0) + 1);
      }
    });
    return map;
  }, [assets]);

  const unassigned = (assets ?? []).filter((a) => !a.ownerId).length;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Ownership</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Owner</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Assets</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockAssetOwners
            .filter((o) => byOwner.has(o.id))
            .sort((a, b) => (byOwner.get(b.id) ?? 0) - (byOwner.get(a.id) ?? 0))
            .map((owner) => (
              <TableRow key={owner.id}>
                <TableCell className="font-medium">{owner.name}</TableCell>
                <TableCell className="text-sm">{owner.department ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant="outline">{byOwner.get(owner.id)}</Badge>
                </TableCell>
              </TableRow>
            ))}
          {unassigned > 0 && (
            <TableRow>
              <TableCell className="font-medium text-red-600">Unassigned</TableCell>
              <TableCell className="text-sm">—</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-red-600 border-red-200">{unassigned}</Badge>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const CostSection: React.FC<{
  scope: "portfolio" | "asset";
  selectedAssetId: string | null;
}> = ({ scope, selectedAssetId }) => {
  const entries = scope === "asset" && selectedAssetId
    ? mockCostEntries.filter((c) => c.assetId === selectedAssetId)
    : mockCostEntries;

  const total = entries.reduce((sum, c) => sum + c.amount, 0);

  const byCategory: Record<string, number> = {};
  entries.forEach((c) => {
    byCategory[c.category] = (byCategory[c.category] ?? 0) + c.amount;
  });

  if (entries.length === 0) {
    return (
      <div className="py-4 text-sm text-gray-500">
        No cost records available for the selected scope.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cost</h3>
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
        <div className="text-2xl font-bold">{fmtCurrency(total)}</div>
        <div className="text-sm text-gray-500">
          Total tracked cost{scope === "asset" ? " for selected asset" : " across portfolio"}
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(byCategory)
            .sort(([, a], [, b]) => b - a)
            .map(([cat, amount]) => (
              <TableRow key={cat}>
                <TableCell className="capitalize">{cat.replace("_", " ")}</TableCell>
                <TableCell className="text-right font-medium">{fmtCurrency(amount)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

const RisksSection: React.FC<{
  scope: "portfolio" | "asset";
  selectedAssetId: string | null;
}> = ({ scope, selectedAssetId }) => {
  const { data: risks } = useMockRisks();
  const filtered = scope === "asset" && selectedAssetId
    ? (risks ?? []).filter((r) => r.assetId === selectedAssetId)
    : (risks ?? []);

  if (filtered.length === 0) {
    return (
      <div className="py-4 text-sm text-gray-500">
        No risk records available for the selected scope.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Risks</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Risk</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.title}</TableCell>
              <TableCell className="capitalize">{r.category}</TableCell>
              <TableCell>
                <Badge className={`${getSeverityColor(r.severity)} text-xs capitalize`}>
                  {r.severity}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(r.status)} text-xs capitalize`}>
                  {r.status.replace("_", " ")}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const ComplianceSection: React.FC<{
  scope: "portfolio" | "asset";
  selectedAssetId: string | null;
}> = ({ scope, selectedAssetId }) => {
  const { data: compliance } = useMockCompliance();
  const filtered = scope === "asset" && selectedAssetId
    ? (compliance ?? []).filter((c) => c.assetId === selectedAssetId)
    : (compliance ?? []);

  if (filtered.length === 0) {
    return (
      <div className="py-4 text-sm text-gray-500">
        No compliance records available for the selected scope.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Compliance</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Requirement</TableHead>
            <TableHead>Framework</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Assessed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">
                <div>{c.requirementTitle}</div>
                <div className="text-xs text-gray-500 font-mono">{c.requirementId}</div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{c.framework.toUpperCase()}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(c.status)} text-xs capitalize`}>
                  {c.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{fmtDate(c.lastAssessed)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const RecommendationsSection: React.FC<{
  recommendations: Recommendation[] | undefined;
  scope: "portfolio" | "asset";
  selectedAssetId: string | null;
}> = ({ recommendations, scope, selectedAssetId }) => {
  const filtered = scope === "asset" && selectedAssetId
    ? (recommendations ?? []).filter((r) => r.assetId === selectedAssetId)
    : (recommendations ?? []);

  if (filtered.length === 0) {
    return (
      <div className="py-4 text-sm text-gray-500">
        No recommendations available for the selected scope.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recommendations</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Recommendation</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Est. Savings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.title}</TableCell>
              <TableCell className="capitalize">{r.category.replace("_", " ")}</TableCell>
              <TableCell>
                <Badge className={`${getSeverityColor(r.priority)} text-xs capitalize`}>
                  {r.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(r.status)} text-xs capitalize`}>
                  {r.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {r.estimatedSavings != null && r.estimatedSavings > 0
                  ? fmtCurrency(r.estimatedSavings)
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const ApprovalsSection: React.FC = () => {
  const { data: approvals } = useMockApprovals();
  if (!approvals || approvals.length === 0) {
    return (
      <div className="py-4 text-sm text-gray-500">
        No approval records available.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Approvals</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Requested</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {approvals.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="font-medium">{a.title}</TableCell>
              <TableCell className="capitalize">{a.type.replace("_", " ")}</TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(a.status)} text-xs capitalize`}>
                  {a.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={`${getSeverityColor(a.priority)} text-xs capitalize`}>
                  {a.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{fmtDate(a.requestedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const LifecycleSection: React.FC<{
  scope: "portfolio" | "asset";
  selectedAssetId: string | null;
}> = ({ scope, selectedAssetId }) => {
  const filtered = scope === "asset" && selectedAssetId
    ? mockLifecycleEvents.filter((e) => e.assetId === selectedAssetId)
    : mockLifecycleEvents;

  if (filtered.length === 0) {
    return (
      <div className="py-4 text-sm text-gray-500">
        No lifecycle events available for the selected scope.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Lifecycle</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Scheduled</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((e) => (
            <TableRow key={e.id}>
              <TableCell className="font-medium">{e.title}</TableCell>
              <TableCell className="capitalize">{e.eventType.replace("_", " ")}</TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(e.status)} text-xs capitalize`}>
                  {e.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                {e.scheduledDate ? fmtDate(e.scheduledDate) : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const AuditSection: React.FC = () => {
  const { data: events } = useMockAuditEvents();
  if (!events || events.length === 0) {
    return (
      <div className="py-4 text-sm text-gray-500">
        No audit events available.
      </div>
    );
  }

  const recent = [...events]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 20);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Audit & History</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Actor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recent.map((e) => (
            <TableRow key={e.id}>
              <TableCell className="text-sm whitespace-nowrap">{fmtDateTime(e.timestamp)}</TableCell>
              <TableCell className="font-medium text-sm">
                {e.eventType.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{e.resourceType}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={`${getSeverityColor(e.severity)} text-xs capitalize`}>
                  {e.severity}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{e.userName ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// ============================================================
// REPORT PREVIEW COMPONENT
// ============================================================
interface ReportPreviewProps {
  reportType: ReportType;
  scope: "portfolio" | "asset";
  selectedAssetId: string | null;
  selectedAssetName: string | null;
  selectedSections: SectionKey[];
  totalAssets: number;
  isLoading: boolean;
  activeRisks: number;
  totalRecommendations: number;
  recommendations: Recommendation[] | undefined;
  pendingApprovals: number;
  recentAuditEvents: number;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  reportType,
  scope,
  selectedAssetId,
  selectedAssetName,
  selectedSections,
  totalAssets,
  isLoading,
  activeRisks,
  totalRecommendations,
  recommendations,
  pendingApprovals,
  recentAuditEvents,
}) => {
  const { data: assets } = useMockAssets();

  const reportTypeLabel = REPORT_TYPES.find((r) => r.value === reportType)?.label ?? "Asset Intelligence Report";
  const generatedAt = new Date().toLocaleString();

  if (selectedSections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileText className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select at least one report section to preview the report.
        </h3>
        <p className="text-sm text-gray-500">
          Use the section checkboxes on the left to choose which content to include.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="border-b pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              AI Asset Intelligence — {reportTypeLabel}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Generated: {generatedAt}
            </p>
            <p className="text-sm text-gray-500">
              Scope: {scope === "portfolio" ? "Entire Portfolio" : `Asset: ${selectedAssetName ?? selectedAssetId ?? "—"}`}
            </p>
          </div>
          <div className="text-right text-sm text-gray-500">
            <div>{selectedSections.length} section{selectedSections.length !== 1 ? "s" : ""} included</div>
            <div>
              {isLoading ? "—" : (scope === "portfolio" ? totalAssets : (selectedAssetId ? 1 : 0))} asset
              {(scope === "asset" && totalAssets !== 1) || scope === "portfolio" ? "s" : ""} included
            </div>
          </div>
        </div>
      </div>

      {/* Section Content */}
      {selectedSections.map((section) => {
        switch (section) {
          case "executive_summary":
            return (
              <div key={section} className="border rounded-lg p-4">
                <ExecutiveSummarySection
                  totalAssets={isLoading ? 0 : totalAssets}
                  activeRisks={activeRisks}
                  totalRecommendations={totalRecommendations}
                  pendingApprovals={pendingApprovals}
                  recentAuditEvents={recentAuditEvents}
                />
              </div>
            );
          case "asset_portfolio":
            return (
              <div key={section} className="border rounded-lg p-4">
                <AssetPortfolioSection assets={assets} scope={scope} selectedAssetId={selectedAssetId} />
              </div>
            );
          case "ownership":
            return (
              <div key={section} className="border rounded-lg p-4">
                <OwnershipSection assets={assets} />
              </div>
            );
          case "cost":
            return (
              <div key={section} className="border rounded-lg p-4">
                <CostSection scope={scope} selectedAssetId={selectedAssetId} />
              </div>
            );
          case "risks":
            return (
              <div key={section} className="border rounded-lg p-4">
                <RisksSection scope={scope} selectedAssetId={selectedAssetId} />
              </div>
            );
          case "compliance":
            return (
              <div key={section} className="border rounded-lg p-4">
                <ComplianceSection scope={scope} selectedAssetId={selectedAssetId} />
              </div>
            );
          case "recommendations":
            return (
              <div key={section} className="border rounded-lg p-4">
                <RecommendationsSection
                  recommendations={recommendations}
                  scope={scope}
                  selectedAssetId={selectedAssetId}
                />
              </div>
            );
          case "approvals":
            return (
              <div key={section} className="border rounded-lg p-4">
                <ApprovalsSection />
              </div>
            );
          case "lifecycle":
            return (
              <div key={section} className="border rounded-lg p-4">
                <LifecycleSection scope={scope} selectedAssetId={selectedAssetId} />
              </div>
            );
          case "audit":
            return (
              <div key={section} className="border rounded-lg p-4">
                <AuditSection />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

// ============================================================
// MAIN REPORTING PAGE
// ============================================================
const Reporting = () => {
  const { data: assets, isLoading: assetsLoading } = useMockAssets();
  const { data: risks } = useMockRisks();
  const { data: approvals } = useMockApprovals();
  const { data: recommendations } = useMockRecommendations();
  const { data: auditEvents } = useMockAuditEvents();
  const { data: compliance } = useMockCompliance();

  const [reportType, setReportType] = useState<ReportType>("executive");
  const [scope, setScope] = useState<"portfolio" | "asset">("portfolio");
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedSections, setSelectedSections] = useState<SectionKey[]>([
    "executive_summary",
    "asset_portfolio",
    "risks",
    "recommendations",
  ]);
  const [isExporting, setIsExporting] = useState(false);

  // Derived metrics
  const totalAssets = (assets ?? []).length;
  const activeRisks = (risks ?? []).filter((r) => r.status === "open" || r.status === "in_progress").length;
  const totalRecommendations = (recommendations ?? []).length;
  const pendingApprovals = (approvals ?? []).filter((a) => a.status === "pending").length;
  const recentAuditEvents = useMemo(() => {
    const now = Date.now();
    return (auditEvents ?? []).filter((e) => {
      const t = new Date(e.timestamp).getTime();
      return now - t <= 7 * 24 * 60 * 60 * 1000;
    }).length;
  }, [auditEvents]);

  const selectedAssetName = useMemo(() => {
    if (!selectedAssetId) return null;
    return (assets ?? []).find((a) => a.id === selectedAssetId)?.name ?? null;
  }, [assets, selectedAssetId]);

  const toggleSection = (section: SectionKey) => {
    setSelectedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const selectAllSections = () => setSelectedSections([...DEFAULT_SECTIONS]);
  const clearAllSections = () => setSelectedSections([]);

  const selectedReportTypeLabel = REPORT_TYPES.find((r) => r.value === reportType)?.label ?? "";

  const handleScopeChange = (value: string) => {
    if (value === "portfolio") {
      setScope("portfolio");
      setSelectedAssetId(null);
    } else {
      setScope("asset");
    }
  };

  const displayAssetCount = assetsLoading
    ? "—"
    : (scope === "portfolio" ? totalAssets : (selectedAssetId ? 1 : 0));

  // ============================================================
  // PDF EXPORT
  // ============================================================
  const handleDownloadPdf = async () => {
    if (isExporting) return;
    if (selectedSections.length === 0) {
      showError("Select at least one report section before exporting.");
      return;
    }

    setIsExporting(true);
    try {
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;
      let cursorY = margin;

      const reportTypeLabel = REPORT_TYPES.find((r) => r.value === reportType)?.label ?? "Asset Intelligence Report";
      const generatedAt = new Date().toLocaleString();
      const scopeLabel = scope === "portfolio"
        ? "Entire Portfolio"
        : `Asset: ${selectedAssetName ?? selectedAssetId ?? "—"}`;
      const assetsIncluded = scope === "portfolio" ? totalAssets : (selectedAssetId ? 1 : 0);

      const ensureSpace = (requiredHeight: number) => {
        if (cursorY + requiredHeight > pageHeight - margin) {
          doc.addPage();
          cursorY = margin;
        }
      };

      // ---- Title ----
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("AI Asset Intelligence Report", margin, cursorY);
      cursorY += 24;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(reportTypeLabel, margin, cursorY);
      cursorY += 18;

      // ---- Metadata table ----
      autoTable(doc, {
        startY: cursorY,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 6 },
        head: [["Field", "Value"]],
        headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
        margin: { left: margin, right: margin },
        body: [
          ["Report Type", reportTypeLabel],
          ["Report Scope", scopeLabel],
          ["Generated At", generatedAt],
          ["Assets Included", String(assetsIncluded)],
          ["Sections Included", `${selectedSections.length} (${selectedSections.map((s) => SECTION_LABELS[s]).join(", ")})`],
        ],
      });
      // jspdf-autotable updates the cursor via lastAutoTable on the doc instance
      cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;

      const filteredAssets = scope === "asset" && selectedAssetId
        ? (assets ?? []).filter((a) => a.id === selectedAssetId)
        : (assets ?? []);

      const filteredRisks = scope === "asset" && selectedAssetId
        ? (risks ?? []).filter((r) => r.assetId === selectedAssetId)
        : (risks ?? []);

      const filteredCompliance = scope === "asset" && selectedAssetId
        ? (compliance ?? []).filter((c) => c.assetId === selectedAssetId)
        : (compliance ?? []);

      const filteredRecommendations = scope === "asset" && selectedAssetId
        ? (recommendations ?? []).filter((r) => r.assetId === selectedAssetId)
        : (recommendations ?? []);

      const filteredLifecycle = scope === "asset" && selectedAssetId
        ? mockLifecycleEvents.filter((e) => e.assetId === selectedAssetId)
        : mockLifecycleEvents;

      const filteredCosts = scope === "asset" && selectedAssetId
        ? mockCostEntries.filter((c) => c.assetId === selectedAssetId)
        : mockCostEntries;

      // ---- Section: Executive Summary ----
      if (selectedSections.includes("executive_summary")) {
        ensureSpace(120);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Executive Summary", margin, cursorY);
        cursorY += 18;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const summary = `This report provides a comprehensive overview of the organization's IT asset portfolio. Key highlights include ${totalAssets} total assets tracked across the portfolio, with ${activeRisks} active risks currently requiring attention. The AI-powered recommendation engine has identified ${totalRecommendations} recommendations, of which ${pendingApprovals} are awaiting approval decisions. Recent audit activity shows ${recentAuditEvents} events in the past 7 days, reflecting ongoing operational visibility across the asset lifecycle.`;
        const wrapped = doc.splitTextToSize(summary, pageWidth - margin * 2);
        doc.text(wrapped, margin, cursorY);
        cursorY += wrapped.length * 12 + 10;

        autoTable(doc, {
          startY: cursorY,
          theme: "grid",
          styles: { fontSize: 10, cellPadding: 6, halign: "center" },
          head: [["Total Assets", "Active Risks", "Recommendations", "Pending Approvals", "Audit Events (7d)"]],
          headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
          body: [[String(totalAssets), String(activeRisks), String(totalRecommendations), String(pendingApprovals), String(recentAuditEvents)]],
          margin: { left: margin, right: margin },
        });
        cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;
      }

      // ---- Section: Asset Portfolio ----
      if (selectedSections.includes("asset_portfolio")) {
        ensureSpace(60);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Asset Portfolio", margin, cursorY);
        cursorY += 18;

        if (filteredAssets.length === 0) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          doc.text("No assets available for the selected scope.", margin, cursorY);
          cursorY += 18;
        } else {
          autoTable(doc, {
            startY: cursorY,
            theme: "striped",
            styles: { fontSize: 9, cellPadding: 5 },
            head: [["Asset Name", "Type", "Status", "Manufacturer", "Location"]],
            headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
            body: filteredAssets.map((a) => [
              a.name,
              a.type,
              a.status,
              a.manufacturer ?? "—",
              a.locationId ?? "—",
            ]),
            margin: { left: margin, right: margin },
          });
          cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;
        }
      }

      // ---- Section: Ownership ----
      if (selectedSections.includes("ownership")) {
        ensureSpace(60);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Ownership", margin, cursorY);
        cursorY += 18;

        const byOwner = new Map<string, number>();
        (assets ?? []).forEach((a) => {
          if (a.ownerId) byOwner.set(a.ownerId, (byOwner.get(a.ownerId) ?? 0) + 1);
        });
        const ownerRows = mockAssetOwners
          .filter((o) => byOwner.has(o.id))
          .sort((a, b) => (byOwner.get(b.id) ?? 0) - (byOwner.get(a.id) ?? 0))
          .map((o) => [o.name, o.department ?? "—", String(byOwner.get(o.id) ?? 0)]);
        const unassigned = (assets ?? []).filter((a) => !a.ownerId).length;
        if (unassigned > 0) ownerRows.push(["Unassigned", "—", String(unassigned)]);

        if (ownerRows.length === 0) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          doc.text("No ownership data available.", margin, cursorY);
          cursorY += 18;
        } else {
          autoTable(doc, {
            startY: cursorY,
            theme: "striped",
            styles: { fontSize: 9, cellPadding: 5 },
            head: [["Owner", "Department", "Assets"]],
            headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
            body: ownerRows,
            margin: { left: margin, right: margin },
          });
          cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;
        }
      }

      // ---- Section: Cost ----
      if (selectedSections.includes("cost")) {
        ensureSpace(60);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Cost", margin, cursorY);
        cursorY += 18;

        if (filteredCosts.length === 0) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          doc.text("No cost records available for the selected scope.", margin, cursorY);
          cursorY += 18;
        } else {
          const total = filteredCosts.reduce((sum, c) => sum + c.amount, 0);
          const byCategory: Record<string, number> = {};
          filteredCosts.forEach((c) => {
            byCategory[c.category] = (byCategory[c.category] ?? 0) + c.amount;
          });

          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
          doc.text(`Total: ${fmtCurrency(total)}`, margin, cursorY);
          cursorY += 18;

          autoTable(doc, {
            startY: cursorY,
            theme: "striped",
            styles: { fontSize: 9, cellPadding: 5 },
            head: [["Category", "Amount"]],
            headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
            body: Object.entries(byCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amount]) => [cat.replace("_", " "), fmtCurrency(amount)]),
            columnStyles: { 1: { halign: "right" } },
            margin: { left: margin, right: margin },
          });
          cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;
        }
      }

      // ---- Section: Risks ----
      if (selectedSections.includes("risks")) {
        ensureSpace(60);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Risks", margin, cursorY);
        cursorY += 18;

        if (filteredRisks.length === 0) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          doc.text("No risk records available for the selected scope.", margin, cursorY);
          cursorY += 18;
        } else {
          autoTable(doc, {
            startY: cursorY,
            theme: "striped",
            styles: { fontSize: 9, cellPadding: 5 },
            head: [["Risk", "Category", "Severity", "Status"]],
            headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
            body: filteredRisks.map((r) => [r.title, r.category, r.severity, r.status.replace("_", " ")]),
            margin: { left: margin, right: margin },
          });
          cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;
        }
      }

      // ---- Section: Compliance ----
      if (selectedSections.includes("compliance")) {
        ensureSpace(60);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Compliance", margin, cursorY);
        cursorY += 18;

        if (filteredCompliance.length === 0) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          doc.text("No compliance records available for the selected scope.", margin, cursorY);
          cursorY += 18;
        } else {
          autoTable(doc, {
            startY: cursorY,
            theme: "striped",
            styles: { fontSize: 9, cellPadding: 5 },
            head: [["Requirement", "Framework", "Status", "Last Assessed"]],
            headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
            body: filteredCompliance.map((c) => [
              c.requirementTitle,
              c.framework.toUpperCase(),
              c.status.replace("_", " "),
              fmtDate(c.lastAssessed),
            ]),
            margin: { left: margin, right: margin },
          });
          cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;
        }
      }

      // ---- Section: Recommendations ----
      if (selectedSections.includes("recommendations")) {
        ensureSpace(60);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Recommendations", margin, cursorY);
        cursorY += 18;

        if (filteredRecommendations.length === 0) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          doc.text("No recommendations available for the selected scope.", margin, cursorY);
          cursorY += 18;
        } else {
          autoTable(doc, {
            startY: cursorY,
            theme: "striped",
            styles: { fontSize: 9, cellPadding: 5 },
            head: [["Recommendation", "Category", "Priority", "Status", "Est. Savings"]],
            headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
            body: filteredRecommendations.map((r) => [
              r.title,
              r.category.replace("_", " "),
              r.priority,
              r.status.replace("_", " "),
              r.estimatedSavings != null && r.estimatedSavings > 0 ? fmtCurrency(r.estimatedSavings) : "—",
            ]),
            columnStyles: { 4: { halign: "right" } },
            margin: { left: margin, right: margin },
          });
          cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;
        }
      }

      // ---- Section: Approvals ----
      if (selectedSections.includes("approvals")) {
        ensureSpace(60);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Approvals", margin, cursorY);
        cursorY += 18;

        if (!approvals || approvals.length === 0) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          doc.text("No approval records available.", margin, cursorY);
          cursorY += 18;
        } else {
          autoTable(doc, {
            startY: cursorY,
            theme: "striped",
            styles: { fontSize: 9, cellPadding: 5 },
            head: [["Request", "Type", "Status", "Priority", "Requested"]],
            headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
            body: approvals.map((a) => [
              a.title,
              a.type.replace("_", " "),
              a.status,
              a.priority,
              fmtDate(a.requestedAt),
            ]),
            margin: { left: margin, right: margin },
          });
          cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;
        }
      }

      // ---- Section: Lifecycle ----
      if (selectedSections.includes("lifecycle")) {
        ensureSpace(60);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Lifecycle", margin, cursorY);
        cursorY += 18;

        if (filteredLifecycle.length === 0) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          doc.text("No lifecycle events available for the selected scope.", margin, cursorY);
          cursorY += 18;
        } else {
          autoTable(doc, {
            startY: cursorY,
            theme: "striped",
            styles: { fontSize: 9, cellPadding: 5 },
            head: [["Event", "Type", "Status", "Scheduled"]],
            headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
            body: filteredLifecycle.map((e) => [
              e.title,
              e.eventType.replace("_", " "),
              e.status.replace("_", " "),
              e.scheduledDate ? fmtDate(e.scheduledDate) : "—",
            ]),
            margin: { left: margin, right: margin },
          });
          cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;
        }
      }

      // ---- Section: Audit & History ----
      if (selectedSections.includes("audit")) {
        ensureSpace(60);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Audit & History", margin, cursorY);
        cursorY += 18;

        if (!auditEvents || auditEvents.length === 0) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          doc.text("No audit events available.", margin, cursorY);
          cursorY += 18;
        } else {
          const recent = [...auditEvents]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 20);
          autoTable(doc, {
            startY: cursorY,
            theme: "striped",
            styles: { fontSize: 8, cellPadding: 4 },
            head: [["Timestamp", "Event", "Type", "Severity", "Actor"]],
            headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
            body: recent.map((e) => [
              fmtDateTime(e.timestamp),
              e.eventType.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
              e.resourceType,
              e.severity,
              e.userName ?? "—",
            ]),
            margin: { left: margin, right: margin },
          });
          cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;
        }
      }

      // ---- Filename & save ----
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const filename = `asset-intelligence-report-${yyyy}-${mm}-${dd}.pdf`;

      doc.save(filename);
      showSuccess(`Downloaded ${filename}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      showError(`PDF generation failed: ${message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <FileText className="h-7 w-7 text-blue-600" />
          Reporting
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Generate professional asset intelligence reports covering portfolio health, risks, recommendations,
          approvals, compliance, lifecycle, ownership, cost, and audit activity.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: "Total Assets", value: assetsLoading ? "—" : totalAssets, icon: <Boxes className="h-4 w-4" />, color: "text-gray-500" },
          { label: "Active Risks", value: activeRisks, icon: <ShieldAlert className="h-4 w-4 text-red-500" />, color: "text-red-600" },
          { label: "Recommendations", value: totalRecommendations, icon: <Lightbulb className="h-4 w-4 text-amber-500" />, color: "text-amber-600" },
          { label: "Pending Approvals", value: pendingApprovals, icon: <Workflow className="h-4 w-4 text-blue-500" />, color: "text-blue-600" },
          { label: "Audit Events (7d)", value: recentAuditEvents, icon: <History className="h-4 w-4 text-purple-500" />, color: "text-purple-600" },
        ].map((item) => (
          <Card key={item.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
              <span className={item.color}>{item.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Configuration + Preview side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Configuration */}
        <div className="space-y-6">
          {/* Report Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Report Configuration
              </CardTitle>
              <CardDescription>Select report type and scope</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Report Type */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Report Type</Label>
                <Select value={reportType} onValueChange={(v) => setReportType(v as ReportType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_TYPES.map((rt) => (
                      <SelectItem key={rt.value} value={rt.value}>
                        {rt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Scope */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Report Scope</Label>
                <Select value={scope} onValueChange={handleScopeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portfolio">Entire Portfolio</SelectItem>
                    <SelectItem value="asset">Selected Asset</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Asset Selector */}
              {scope === "asset" && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Select Asset</Label>
                  <Select
                    value={selectedAssetId ?? ""}
                    onValueChange={(v) => setSelectedAssetId(v || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an asset..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(assets ?? []).map((asset) => (
                        <SelectItem key={asset.id} value={asset.id}>
                          <div>
                            <div>{asset.name}</div>
                            <div className="text-xs text-gray-500">{asset.type} · {asset.status}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Separator />

              {/* Report Metadata */}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Report Type:</span>
                  <span className="font-medium text-right max-w-[180px] truncate" title={selectedReportTypeLabel}>
                    {selectedReportTypeLabel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Scope:</span>
                  <span className="font-medium">
                    {scope === "portfolio" ? "Entire Portfolio" : (selectedAssetName ?? "—")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Generated At:</span>
                  <span className="font-medium">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Assets Included:</span>
                  <span className="font-medium">{displayAssetCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Sections Included:</span>
                  <span className="font-medium">{selectedSections.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Sections */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Report Sections
              </CardTitle>
              <CardDescription>Select sections to include in the report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAllSections} className="text-xs">
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={clearAllSections} className="text-xs">
                  Clear All
                </Button>
              </div>
              <div className="space-y-2">
                {DEFAULT_SECTIONS.map((section) => (
                  <div key={section} className="flex items-center space-x-2">
                    <Checkbox
                      id={section}
                      checked={selectedSections.includes(section)}
                      onCheckedChange={() => toggleSection(section)}
                    />
                    <Label htmlFor={section} className="text-sm font-normal cursor-pointer">
                      {SECTION_LABELS[section]}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export PDF */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Export Report</CardTitle>
              <CardDescription>
                Download a PDF that reflects your current configuration and selected sections.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleDownloadPdf}
                disabled={isExporting || selectedSections.length === 0}
                className="w-full gap-2"
              >
                <Download className="h-4 w-4" />
                {isExporting ? "Generating PDF…" : "Download PDF"}
              </Button>
              {selectedSections.length === 0 && (
                <p className="text-xs text-gray-500 text-center">
                  Select at least one report section to enable export.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Report Preview */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Report Preview
              </CardTitle>
              <CardDescription>
                Live preview — updates automatically as you change settings above
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-320px)] pr-4">
                <ReportPreview
                  reportType={reportType}
                  scope={scope}
                  selectedAssetId={selectedAssetId}
                  selectedAssetName={selectedAssetName}
                  selectedSections={selectedSections}
                  totalAssets={totalAssets}
                  isLoading={assetsLoading}
                  activeRisks={activeRisks}
                  totalRecommendations={totalRecommendations}
                  recommendations={recommendations}
                  pendingApprovals={pendingApprovals}
                  recentAuditEvents={recentAuditEvents}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reporting;