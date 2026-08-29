"use client";

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMockApprovals, useMockWorkflows, useMockWorkflowInstances, useMockAssets } from "@/mocks/mockAdapter";
import { mockAssetOwners } from "@/mocks/owners";
import { mockRecommendations } from "@/mocks/recommendations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  FileSearch,
  Search,
  XCircle,
  Workflow,
} from "lucide-react";

// ---------- Status helpers ----------
const getApprovalStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "cancelled":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "expired":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getApprovalStatusLabel = (status: string) => {
  return status
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
};

const getApprovalStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "cancelled":
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
    case "expired":
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
};

// ---------- Approval type helpers ----------
const getApprovalTypeLabel = (type: string) => {
  return type
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
};

const getApprovalTypeColor = (type: string) => {
  switch (type) {
    case "budget":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "asset_creation":
      return "bg-green-100 text-green-800 border-green-200";
    case "asset_retirement":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "policy_exception":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "vendor_change":
      return "bg-cyan-100 text-cyan-800 border-cyan-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// ---------- Priority helpers ----------
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// ---------- Workflow helpers ----------
const getWorkflowStatusColor = (status: string) => {
  switch (status) {
    case "running":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "failed":
      return "bg-red-100 text-red-800 border-red-200";
    case "cancelled":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "paused":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getWorkflowStatusLabel = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const Approvals = () => {
  const { data: approvals, isLoading: approvalsLoading, error: approvalsError } = useMockApprovals();
  const { data: workflows } = useMockWorkflows();
  const { data: workflowInstances } = useMockWorkflowInstances();
  const { data: assets } = useMockAssets();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedApprovalId, setExpandedApprovalId] = useState<string | null>(null);

  // ---------- Lookup maps ----------
  const assetById = useMemo(() => {
    const m = new Map<string, string>();
    (assets ?? []).forEach((a) => m.set(a.id, a.name));
    return m;
  }, [assets]);

  const ownerNameById = useMemo(() => {
    const m = new Map<string, string>();
    mockAssetOwners.forEach((o) => m.set(o.id, o.name));
    return m;
  }, []);

  const workflowById = useMemo(() => {
    const m = new Map<string, string>();
    (workflows ?? []).forEach((w) => m.set(w.id, w.name));
    return m;
  }, [workflows]);

  const recommendationById = useMemo(() => {
    const m = new Map<string, string>();
    mockRecommendations.forEach((r) => m.set(r.id, r.title));
    return m;
  }, []);

  // Map recommendation ID → asset ID (for View Asset navigation)
  const recommendationAssetId = useMemo(() => {
    const m = new Map<string, string>();
    mockRecommendations.forEach((r) => m.set(r.id, r.assetId));
    return m;
  }, []);

  // ---------- Summary metrics ----------
  const metrics = useMemo(() => {
    const list = approvals ?? [];
    const total = list.length;
    const pending = list.filter((a) => a.status === "pending").length;
    const approved = list.filter((a) => a.status === "approved").length;
    const rejected = list.filter((a) => a.status === "rejected").length;
    const highPriority = list.filter((a) => a.priority === "high" || a.priority === "critical").length;
    return { total, pending, approved, rejected, highPriority };
  }, [approvals]);

  // ---------- Filtered approvals ----------
  const filteredApprovals = useMemo(() => {
    return (approvals ?? []).filter((a) => {
      const assetName = assetById.get(a.resourceId) ?? "";
      const recommendationTitle = a.resourceType === "recommendation" ? recommendationById.get(a.resourceId) ?? "" : "";
      const requesterName = ownerNameById.get(a.requestedBy) ?? "";
      const matchesSearch =
        searchTerm === "" ||
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        a.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recommendationTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        requesterName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === "all" || a.type === typeFilter;
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [approvals, searchTerm, typeFilter, statusFilter, assetById, ownerNameById, recommendationById]);

  // ---------- Items requiring attention ----------
  const attentionItems = useMemo(() => {
    const items: Array<{
      type: "approval" | "workflow";
      id: string;
      title: string;
      subtitle: string;
      status: string;
      priority?: string;
    }> = [];

    (approvals ?? [])
      .filter((a) => a.status === "pending")
      .forEach((a) => {
        items.push({
          type: "approval",
          id: a.id,
          title: a.title,
          subtitle: `${getApprovalTypeLabel(a.type)} · Requested by ${ownerNameById.get(a.requestedBy) ?? a.requestedBy}`,
          status: a.status,
          priority: a.priority,
        });
      });

    (workflowInstances ?? [])
      .filter((wi) => wi.status === "running" || wi.status === "paused")
      .forEach((wi) => {
        items.push({
          type: "workflow",
          id: wi.id,
          title: workflowById.get(wi.workflowId) ?? wi.workflowId,
          subtitle: `${wi.workflowVersion} · Instance ${wi.id.slice(0, 8)}`,
          status: wi.status,
        });
      });

    return items;
  }, [approvals, workflowInstances, ownerNameById, workflowById]);

  // ---------- Unique filter options ----------
  const approvalTypes = useMemo(() => {
    const s = new Set((approvals ?? []).map((a) => a.type));
    return Array.from(s);
  }, [approvals]);

  const approvalStatuses = useMemo(() => {
    const s = new Set((approvals ?? []).map((a) => a.status));
    return Array.from(s);
  }, [approvals]);

  const hasActiveFilters = searchTerm !== "" || typeFilter !== "all" || statusFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  const toggleExpanded = (id: string) => {
    setExpandedApprovalId((prev) => (prev === id ? null : id));
  };

  // ---------- Error state ----------
  if (approvalsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Error Loading Approvals & Workflows</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Unable to load approval and workflow records. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Workflow className="h-7 w-7 text-blue-600" />
          Approvals & Workflows
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Review pending decisions, approval requests, and workflow execution across the asset portfolio.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Approvals</CardTitle>
            <Workflow className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{metrics.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.rejected}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workflows</CardTitle>
            <Workflow className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows?.length ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Items Requiring Attention */}
      {attentionItems.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Items Requiring Attention ({attentionItems.length})
            </CardTitle>
            <CardDescription>Approvals and workflow instances that need your review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {attentionItems.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-amber-200"
                >
                  <div className="flex items-center gap-3">
                    {item.type === "approval" ? (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Workflow className="h-4 w-4 text-blue-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.priority && (
                      <Badge className={cn(getPriorityColor(item.priority), "text-xs")} variant="outline">
                        {item.priority}
                      </Badge>
                    )}
                    <Badge
                      className={cn(
                        item.type === "approval" ? getApprovalStatusColor(item.status) : getWorkflowStatusColor(item.status),
                        "text-xs"
                      )}
                      variant="outline"
                    >
                      {item.type === "approval" ? getApprovalStatusLabel(item.status) : getWorkflowStatusLabel(item.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
          <CardDescription>Find approvals by title, asset, requester, or type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search approvals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Approval Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {approvalTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {getApprovalTypeLabel(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {approvalStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {getApprovalStatusLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Approvals Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Workflow className="h-5 w-5 text-blue-500" />
            Approval Requests ({filteredApprovals.length})
          </CardTitle>
          <CardDescription>
            {filteredApprovals.length === (approvals?.length ?? 0)
              ? "Showing all approvals"
              : `Showing ${filteredApprovals.length} of ${approvals?.length ?? 0} approvals`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {approvalsLoading ? (
            <div className="flex items-center justify-center h-32 text-gray-500">Loading approvals...</div>
          ) : filteredApprovals.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32">
              <FileSearch className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500">
                {(approvals?.length ?? 0) === 0
                  ? "No approval requests are currently available."
                  : "No approvals match your search criteria."}
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-2 text-sm text-blue-600 hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Approval</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Related To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApprovals.map((approval) => {
                    const isExpanded = expandedApprovalId === approval.id;
                    const relatedName =
                      approval.resourceType === "recommendation"
                        ? recommendationById.get(approval.resourceId) ?? approval.resourceId.slice(0, 8)
                        : assetById.get(approval.resourceId) ?? approval.resourceId.slice(0, 8);

                    // Resolve the actual assetId for View Asset navigation:
                    // If the approval references a recommendation, look up the recommendation's assetId.
                    // Otherwise use the resourceId as-is (for future non-recommendation approval types).
                    const viewAssetId =
                      approval.resourceType === "recommendation"
                        ? recommendationAssetId.get(approval.resourceId) ?? approval.resourceId
                        : approval.resourceId;

                    return (
                      <React.Fragment key={approval.id}>
                        <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell>
                            <button
                              onClick={() => toggleExpanded(approval.id)}
                              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                              aria-label={isExpanded ? "Collapse" : "Expand"}
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100">{approval.title}</div>
                              {approval.description && (
                                <div className="text-xs text-gray-500 line-clamp-1 max-w-[240px]">
                                  {approval.description}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getApprovalTypeColor(approval.type)} variant="outline">
                              {getApprovalTypeLabel(approval.type)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                            <div>
                              <div className="text-xs text-gray-500">{approval.resourceType}</div>
                              <div>{relatedName}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getApprovalStatusIcon(approval.status)}
                              <Badge className={getApprovalStatusColor(approval.status)} variant="outline">
                                {getApprovalStatusLabel(approval.status)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(approval.priority)} variant="outline">
                              {approval.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(approval.requestedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {approval.resourceType === "recommendation" ? (
                              <Link
                                to={`/inventory/${viewAssetId}`}
                                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                              >
                                View Asset <ArrowRight className="h-4 w-4" />
                              </Link>
                            ) : null}
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow>
                            <TableCell colSpan={8} className="bg-gray-50 dark:bg-gray-900 p-0">
                              <ApprovalDetail approval={approval} assetName={relatedName} ownerName={ownerNameById.get(approval.requestedBy) ?? approval.requestedBy} />
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workflows Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Workflow className="h-5 w-5 text-blue-500" />
            Workflow Definitions ({workflows?.length ?? 0})
          </CardTitle>
          <CardDescription>
            Available workflow templates for asset management processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(workflows?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center justify-center h-24">
              <FileSearch className="h-6 w-6 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No workflow definitions available.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workflow</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Steps</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflows?.map((wf) => (
                    <TableRow key={wf.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="font-medium text-gray-900 dark:text-gray-100">{wf.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {wf.type.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400 max-w-[200px] truncate">
                        {wf.description ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={wf.status === "active" ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}
                          variant="outline"
                        >
                          {wf.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">v{wf.version}</TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">{wf.steps.length} step(s)</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workflow Instances */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Workflow Instances ({workflowInstances?.length ?? 0})
          </CardTitle>
          <CardDescription>Active and recent workflow executions</CardDescription>
        </CardHeader>
        <CardContent>
          {(workflowInstances?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center justify-center h-24">
              <FileSearch className="h-6 w-6 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No workflow instances found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Instance</TableHead>
                    <TableHead>Workflow</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Steps</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflowInstances?.map((wi) => (
                    <TableRow key={wi.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">{wi.id.slice(0, 8)}...</div>
                          <div className="text-xs text-gray-500 font-mono">{wi.id}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                        {workflowById.get(wi.workflowId) ?? wi.workflowId.slice(0, 8)} (v{wi.workflowVersion})
                      </TableCell>
                      <TableCell>
                        <Badge className={getWorkflowStatusColor(wi.status)} variant="outline">
                          {getWorkflowStatusLabel(wi.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(wi.startedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {wi.completedAt ? new Date(wi.completedAt).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {wi.steps.length} step(s)
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ---------- Approval Detail Panel ----------
const ApprovalDetail: React.FC<{
  approval: NonNullable<ReturnType<typeof useMockApprovals>["data"]>[number];
  assetName: string;
  ownerName: string;
}> = ({ approval, assetName, ownerName }) => {
  const getApproverStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case "rejected":
        return <XCircle className="h-3 w-3 text-red-500" />;
      default:
        return <Clock className="h-3 w-3 text-yellow-500" />;
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Description</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{approval.description ?? "—"}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Requested By</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{ownerName}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Requested At</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {new Date(approval.requestedAt).toLocaleDateString()}
          </p>
        </div>
        {approval.dueDate && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Due Date</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {new Date(approval.dueDate).toLocaleDateString()}
            </p>
          </div>
        )}
        {approval.decidedAt && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Decision Date</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {new Date(approval.decidedAt).toLocaleDateString()}
            </p>
          </div>
        )}
        {approval.decisionComment && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Decision Comment</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">{approval.decisionComment}</p>
          </div>
        )}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Approvers</h4>
          <div className="space-y-1">
            {approval.approvers.map((approver, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                {getApproverStatusIcon(approver.status)}
                <span className="text-gray-700 dark:text-gray-300">{approver.role ?? approver.userId}</span>
                <span className="text-gray-500 text-xs">— {getApprovalStatusLabel(approver.status)}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Current Approver</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Step {approval.currentApproverIndex + 1} of {approval.approvers.length}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Resource Type</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{approval.resourceType}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Related Record</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{assetName}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Created</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {new Date(approval.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Last Updated</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {new Date(approval.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Approvals;