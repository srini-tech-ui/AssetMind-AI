"use client";

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMockAssets } from "@/mocks/mockAdapter";
import { mockCostEntries } from "@/mocks/costs";
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
  DollarSign,
  FileSearch,
  Search,
  TrendingDown,
  Wallet,
  RefreshCcw,
  PiggyBank,
  Tag,
  Package,
} from "lucide-react";

// ---------- Category helpers ----------
const getCategoryColor = (cat: string) => {
  switch (cat) {
    case "acquisition":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "maintenance":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "support":
      return "bg-cyan-100 text-cyan-800 border-cyan-200";
    case "license":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "infrastructure":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "training":
      return "bg-green-100 text-green-800 border-green-200";
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

const Cost = () => {
  const { data: assets, error: assetsError } = useMockAssets();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

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

  // ---------- Per-asset cost summary (derived, not stored) ----------
  const assetCostMap = useMemo(() => {
    const map = new Map<string, number>();
    mockCostEntries.forEach((c) => {
      map.set(c.assetId, (map.get(c.assetId) ?? 0) + c.amount);
    });
    return map;
  }, []);

  // ---------- Summary metrics (derived from existing data) ----------
  const metrics = useMemo(() => {
    const totalCost = mockCostEntries.reduce((sum, c) => sum + c.amount, 0);
    const assetsWithCost = new Set(mockCostEntries.map((c) => c.assetId)).size;

    // Highest-cost asset
    let highestCost = 0;
    let highestAssetId = "";
    let highestAssetName = "";
    assetCostMap.forEach((cost, assetId) => {
      if (cost > highestCost) {
        highestCost = cost;
        highestAssetId = assetId;
        highestAssetName = assetById.get(assetId)?.name ?? assetId;
      }
    });

    // Potential savings from existing recommendations with cost-related category
    const savingsRecs = mockRecommendations.filter(
      (r) => r.estimatedSavings != null && r.estimatedSavings > 0
    );
    const potentialSavings = savingsRecs.reduce((sum, r) => sum + (r.estimatedSavings ?? 0), 0);

    // Recurring costs (monthly/quarterly/annually)
    const recurringEntries = mockCostEntries.filter((c) => c.isRecurring);
    const recurringAnnual = recurringEntries.reduce((sum, c) => {
      if (c.recurrencePeriod === "monthly") return sum + c.amount * 12;
      if (c.recurrencePeriod === "quarterly") return sum + c.amount * 4;
      if (c.recurrencePeriod === "annually") return sum + c.amount;
      return sum;
    }, 0);

    // Cost by category
    const byCategory: Record<string, number> = {};
    mockCostEntries.forEach((c) => {
      byCategory[c.category] = (byCategory[c.category] ?? 0) + c.amount;
    });

    return { totalCost, assetsWithCost, highestCost, highestAssetId, highestAssetName, potentialSavings, recurringAnnual, byCategory };
  }, [assetCostMap, assetById]);

  // ---------- Filtered asset rows ----------
  const assetRows = useMemo(() => {
    return Array.from(assetCostMap.entries())
      .map(([assetId, totalCost]) => {
        const asset = assetById.get(assetId);
        const ownerName = asset?.ownerId ? (ownerNameById.get(asset.ownerId) ?? null) : null;
        return { assetId, assetName: asset?.name ?? assetId, assetType: asset?.type ?? "unknown", ownerName };
      })
      .filter((row) => {
        const matchesSearch =
          searchTerm === "" ||
          row.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.assetType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (row.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

        // Category filter: show row if any cost entry for this asset matches the category
        const matchesCategory =
          categoryFilter === "all" ||
          mockCostEntries.some((c) => c.assetId === row.assetId && c.category === categoryFilter);

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => (assetCostMap.get(b.assetId) ?? 0) - (assetCostMap.get(a.assetId) ?? 0));
  }, [assetCostMap, assetById, ownerNameById, searchTerm, categoryFilter]);

  // ---------- Unique filter options (derived from data) ----------
  const categories = useMemo(() => {
    const s = new Set(mockCostEntries.map((c) => c.category));
    return Array.from(s);
  }, []);

  const hasActiveFilters = searchTerm !== "" || categoryFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
  };

  // ---------- Currency formatter ----------
  const fmtCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

  if (assetsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Error Loading Cost Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Unable to load cost records. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <TrendingDown className="h-7 w-7 text-blue-600" />
          Cost Optimization
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Identify cost drivers, optimization opportunities, and potential savings across the asset portfolio.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tracked Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fmtCurrency(metrics.totalCost)}</div>
            <p className="text-xs text-gray-500 mt-1">{metrics.assetsWithCost} asset(s) with cost data</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest-Cost Asset</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate" title={metrics.highestAssetName}>
              {metrics.highestAssetName || "—"}
            </div>
            <p className="text-xs text-gray-500 mt-1">{fmtCurrency(metrics.highestCost)} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Recurring Cost</CardTitle>
            <RefreshCcw className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fmtCurrency(metrics.recurringAnnual)}</div>
            <p className="text-xs text-gray-500 mt-1">
              {mockCostEntries.filter((c) => c.isRecurring).length} recurring cost entry(ies)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
            <PiggyBank className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{fmtCurrency(metrics.potentialSavings)}</div>
            <p className="text-xs text-gray-500 mt-1">
              From {mockRecommendations.filter((r) => r.estimatedSavings != null && r.estimatedSavings > 0).length} recommendation(s)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cost by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="h-5 w-5 text-gray-500" />
            Cost by Category
          </CardTitle>
          <CardDescription>Distribution of tracked costs across cost categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {Object.entries(metrics.byCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amount]) => (
                <div key={cat} className="p-3 border rounded-lg bg-white dark:bg-gray-800 text-center">
                  <Badge className={`${getCategoryColor(cat)} mb-1`}>{getCategoryLabel(cat)}</Badge>
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{fmtCurrency(amount)}</div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
          <CardDescription>Find cost records by asset, owner, or category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by asset, type, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {getCategoryLabel(cat)}
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

      {/* Asset Cost Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-500" />
            Asset Cost Summary ({assetRows.length})
          </CardTitle>
          <CardDescription>
            {assetRows.length === assetCostMap.size
              ? "Showing all assets with cost data, sorted by total cost"
              : `Showing ${assetRows.length} of ${assetCostMap.size} assets`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assetRows.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32">
              <FileSearch className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500">No cost records match your search criteria</p>
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
                    <TableHead>Asset</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetRows.map((row) => {
                    const totalCost = assetCostMap.get(row.assetId) ?? 0;
                    const entryCategories = mockCostEntries
                      .filter((c) => c.assetId === row.assetId)
                      .map((c) => c.category);
                    const uniqueCategories = [...new Set(entryCategories)];
                    return (
                      <TableRow key={row.assetId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">{row.assetName}</div>
                            <div className="text-xs text-gray-500 font-mono">{row.assetId.slice(0, 8)}...</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{row.assetType}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                          {row.ownerName ?? "—"}
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-gray-900 dark:text-gray-100">{fmtCurrency(totalCost)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {uniqueCategories.map((cat) => (
                              <Badge key={cat} className={`text-xs ${getCategoryColor(cat)}`}>
                                {getCategoryLabel(cat)}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link
                            to={`/inventory/${row.assetId}`}
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View Asset <ArrowRight className="h-4 w-4" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      {mockRecommendations.filter((r) => r.estimatedSavings != null && r.estimatedSavings > 0).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-green-500" />
              Cost Optimization Recommendations
            </CardTitle>
            <CardDescription>
              Existing recommendations with estimated cost savings derived from the portfolio data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRecommendations
                .filter((r) => r.estimatedSavings != null && r.estimatedSavings > 0)
                .map((rec) => {
                  const assetName = assetById.get(rec.assetId)?.name ?? rec.assetId;
                  return (
                    <div
                      key={rec.id}
                      className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100">{rec.title}</p>
                          <Badge variant="outline" className="capitalize">{rec.category.replace("_", " ")}</Badge>
                          <Badge variant="outline">{rec.priority} priority</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{rec.description}</p>
                        <p className="text-xs text-gray-500">
                          Asset: {assetName} · Confidence: {Math.round(rec.confidence * 100)}%
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-green-600">{fmtCurrency(rec.estimatedSavings ?? 0)}</div>
                        <div className="text-xs text-gray-500">potential savings</div>
                        {rec.estimatedCost != null && rec.estimatedCost > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Est. cost: {fmtCurrency(rec.estimatedCost)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cost Detail Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-gray-500" />
            Cost Detail Entries ({mockCostEntries.length})
          </CardTitle>
          <CardDescription>Individual cost entries across the portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Recurring</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCostEntries.map((entry) => {
                  const asset = assetById.get(entry.assetId);
                  return (
                    <TableRow key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                        {asset?.name ?? entry.assetId.slice(0, 8)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400 max-w-[200px] truncate">
                        {entry.description ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getCategoryColor(entry.category)}`}>
                          {getCategoryLabel(entry.category)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(entry.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {entry.vendor ?? "—"}
                      </TableCell>
                      <TableCell className="font-bold text-gray-900 dark:text-gray-100">
                        {fmtCurrency(entry.amount)}
                      </TableCell>
                      <TableCell>
                        {entry.isRecurring ? (
                          <Badge variant="outline" className="capitalize">
                            {entry.recurrencePeriod ?? "yes"}
                          </Badge>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cost;