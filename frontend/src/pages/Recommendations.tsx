"use client";

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMockAssets } from "@/mocks/mockAdapter";
import { mockRecommendations } from "@/mocks/recommendations";
import { mockAssetOwners } from "@/mocks/owners";
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
import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileSearch,
  Lightbulb,
  Search,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

// ---------- Category helpers ----------
const getCategoryColor = (cat: string) => {
  switch (cat) {
    case "performance":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "security":
      return "bg-red-100 text-red-800 border-red-200";
    case "cost_optimization":
      return "bg-green-100 text-green-800 border-green-200";
    case "compliance":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "lifecycle":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getCategoryLabel = (cat: string) => {
  return cat
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
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

// ---------- Status helpers ----------
const getStatusColor = (status: string) => {
  switch (status) {
    case "proposed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "under_review":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "in_progress":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "dismissed":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusLabel = (status: string) => {
  return status
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
};

const Recommendations = () => {
  const { data: assets, error: assetsError } = useMockAssets();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ---------- Lookup maps ----------
  const assetById = useMemo(() => {
    const m = new Map<string, { name: string; type: string; ownerId?: string }>();
    (assets ?? []).forEach((a) => m.set(a.id, { name: a.name, type: a.type, ownerId: a.ownerId }));
    return m;
  }, [assets]);

  const ownerNameById = useMemo(() => {
    const m = new Map<string, string>();
    mockAssetOwners.forEach((o) => m.set(o.id, o.name));
    return m;
  }, []);

  // ---------- Summary metrics (derived from existing data) ----------
  const metrics = useMemo(() => {
    const total = mockRecommendations.length;
    const highPriority = mockRecommendations.filter(
      (r) => r.priority === "high" || r.priority === "critical"
    ).length;
    const estimatedSavings = mockRecommendations.reduce(
      (sum, r) => sum + (r.estimatedSavings ?? 0),
      0
    );
    const requiringAttention = mockRecommendations.filter(
      (r) => r.status === "proposed" || r.status === "under_review"
    ).length;
    return { total, highPriority, estimatedSavings, requiringAttention };
  }, []);

  // ---------- Unique filter options (derived from data) ----------
  const categories = useMemo(() => {
    const s = new Set(mockRecommendations.map((r) => r.category));
    return Array.from(s);
  }, []);

  const priorities = useMemo(() => {
    const s = new Set(mockRecommendations.map((r) => r.priority));
    return Array.from(s);
  }, []);

  const statuses = useMemo(() => {
    const s = new Set(mockRecommendations.map((r) => r.status));
    return Array.from(s);
  }, []);

  // ---------- Filtered recommendations ----------
  const filteredRecommendations = useMemo(() => {
    return mockRecommendations.filter((rec) => {
      const assetName = assetById.get(rec.assetId)?.name ?? "";
      const ownerName = assetById.get(rec.assetId)?.ownerId
        ? ownerNameById.get(assetById.get(rec.assetId)!.ownerId!) ?? ""
        : "";

      const matchesSearch =
        searchTerm === "" ||
        rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rec.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (rec.reasoning?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        rec.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ownerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === "all" || rec.category === categoryFilter;
      const matchesPriority = priorityFilter === "all" || rec.priority === priorityFilter;
      const matchesStatus = statusFilter === "all" || rec.status === statusFilter;

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [searchTerm, categoryFilter, priorityFilter, statusFilter, assetById, ownerNameById]);

  const hasActiveFilters =
    searchTerm !== "" ||
    categoryFilter !== "all" ||
    priorityFilter !== "all" ||
    statusFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setPriorityFilter("all");
    setStatusFilter("all");
  };

  const toggleExpanded = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // ---------- Currency formatter ----------
  const fmtCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

  if (assetsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Error Loading Recommendations</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Unable to load recommendation data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Lightbulb className="h-7 w-7 text-amber-500" />
          Recommendations
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Actionable recommendations derived from the existing asset portfolio data to support cost, performance, security, compliance, and lifecycle decisions.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recommendations</CardTitle>
            <Lightbulb className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total}</div>
            <p className="text-xs text-gray-500 mt-1">Across all categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High / Critical Priority</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.highPriority}</div>
            <p className="text-xs text-gray-500 mt-1">Requiring prompt review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Potential Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{fmtCurrency(metrics.estimatedSavings)}</div>
            <p className="text-xs text-gray-500 mt-1">From {metrics.total} recommendation(s)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requiring Attention</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{metrics.requiringAttention}</div>
            <p className="text-xs text-gray-500 mt-1">Proposed or under review</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
          <CardDescription>Find recommendations by title, asset, owner, category, priority, or status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by recommendation, asset, owner, or reasoning..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {getCategoryLabel(c)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-[160px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
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
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {getStatusLabel(s)}
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
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Recommendations ({filteredRecommendations.length})
          </CardTitle>
          <CardDescription>
            {filteredRecommendations.length === mockRecommendations.length
              ? "Showing all recommendations"
              : `Showing ${filteredRecommendations.length} of ${mockRecommendations.length} recommendations`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRecommendations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32">
              <FileSearch className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500">
                {mockRecommendations.length === 0
                  ? "No recommendations are currently available."
                  : "No recommendations match your search criteria."}
              </p>
              {hasActiveFilters && mockRecommendations.length > 0 && (
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
                    <TableHead>Recommendation</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Est. Savings</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecommendations.map((rec) => {
                    const asset = assetById.get(rec.assetId);
                    const assetName = asset?.name ?? rec.assetId.slice(0, 8);
                    const isExpanded = expandedId === rec.id;
                    return (
                      <React.Fragment key={rec.id}>
                        <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell>
                            <button
                              onClick={() => toggleExpanded(rec.id)}
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
                              <div className="font-medium text-gray-900 dark:text-gray-100">{rec.title}</div>
                              {rec.description && (
                                <div className="text-xs text-gray-500 line-clamp-1 max-w-[320px]">
                                  {rec.description}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                            {assetName}
                          </TableCell>
                          <TableCell>
                            <Badge className={getCategoryColor(rec.category)} variant="outline">
                              {getCategoryLabel(rec.category)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(rec.priority)} variant="outline">
                              {rec.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(rec.status)} variant="outline">
                              {getStatusLabel(rec.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {rec.estimatedSavings != null && rec.estimatedSavings > 0
                              ? fmtCurrency(rec.estimatedSavings)
                              : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link
                              to={`/inventory/${rec.assetId}`}
                              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View Asset <ArrowRight className="h-4 w-4" />
                            </Link>
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow>
                            <TableCell colSpan={8} className="bg-gray-50 dark:bg-gray-900 p-0">
                              <RecommendationDetail rec={rec} assetName={assetName} />
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
    </div>
  );
};

// ---------- Recommendation Detail Panel ----------
const RecommendationDetail: React.FC<{
  rec: typeof mockRecommendations[number];
  assetName: string;
}> = ({ rec, assetName }) => {
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Description</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{rec.description ?? "—"}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Affected Asset</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <Link to={`/inventory/${rec.assetId}`} className="text-blue-600 hover:underline">
              {assetName}
            </Link>
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Rationale / Reasoning</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{rec.reasoning ?? "—"}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Confidence</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {Math.round(rec.confidence * 100)}%
          </p>
        </div>
        {rec.estimatedSavings != null && rec.estimatedSavings > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Estimated Savings</h4>
            <p className="text-sm font-medium text-green-600">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(rec.estimatedSavings)}
            </p>
          </div>
        )}
        {rec.estimatedCost != null && rec.estimatedCost > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Estimated Cost</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(rec.estimatedCost)}
            </p>
          </div>
        )}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Approval Required</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{rec.approvalRequired ? "Yes" : "No"}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Created</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {new Date(rec.createdAt).toLocaleDateString()}
          </p>
        </div>
        {rec.evidenceIds && rec.evidenceIds.length > 0 && (
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Evidence References</h4>
            <div className="flex flex-wrap gap-1">
              {rec.evidenceIds.map((id) => (
                <Badge key={id} variant="outline" className="text-xs font-mono">
                  {id}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;