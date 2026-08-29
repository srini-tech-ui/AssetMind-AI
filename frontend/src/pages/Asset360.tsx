"use client";

import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  useMockAssets,
  useMockRisksByAsset,
  useMockLifecycleByAsset,
  useMockCostsByAsset,
  useMockRecommendationsByAsset,
  useMockAuditByResource,
} from "@/mocks/mockAdapter";
import { mockAssetOwners } from "@/mocks/owners";
import { mockRisks } from "@/mocks/risks";
import { mockLifecycleEvents } from "@/mocks/lifecycle";
import { mockCostEntries } from "@/mocks/costs";
import { mockAuditEvents } from "@/mocks/audit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Box,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  List,
  ShieldAlert,
  TrendingUp,
  User,
  Users,
  Wrench,
} from "lucide-react";

// Status helpers
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "inactive":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "maintenance":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "retired":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "disposed":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
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

const getRiskStatusIcon = (severity: string) => {
  switch (severity) {
    case "critical":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "high":
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case "medium":
      return <ShieldAlert className="h-4 w-4 text-yellow-500" />;
    default:
      return <ShieldAlert className="h-4 w-4 text-blue-500" />;
  }
};

const Asset360 = () => {
  const { data: assets, isLoading: assetsLoading } = useMockAssets();
  const owners = mockAssetOwners;
  const risks = mockRisks;
  const lifecycleEvents = mockLifecycleEvents;
  const costEntries = mockCostEntries;
  const auditEvents = mockAuditEvents;

  // Calculate asset statistics
  const assetStats = useMemo(() => {
    if (!assets) return { total: 0, active: 0, inactive: 0, maintenance: 0, retired: 0 };
    return {
      total: assets.length,
      active: assets.filter((a) => a.status === "active").length,
      inactive: assets.filter((a) => a.status === "inactive").length,
      maintenance: assets.filter((a) => a.status === "maintenance").length,
      retired: assets.filter((a) => a.status === "retired").length,
    };
  }, [assets]);

  // Calculate risk statistics
  const riskStats = useMemo(() => {
    return {
      total: risks.length,
      critical: risks.filter((r) => r.severity === "critical").length,
      high: risks.filter((r) => r.severity === "high").length,
      medium: risks.filter((r) => r.severity === "medium").length,
      open: risks.filter((r) => r.status === "open" || r.status === "in_progress").length,
    };
  }, [risks]);

  // Calculate lifecycle statistics
  const lifecycleStats = useMemo(() => {
    const byType: Record<string, number> = {};
    lifecycleEvents.forEach((event) => {
      byType[event.eventType] = (byType[event.eventType] || 0) + 1;
    });
    return byType;
  }, [lifecycleEvents]);

  // Calculate cost statistics
  const costStats = useMemo(() => {
    const total = costEntries.reduce((sum, c) => sum + c.amount, 0);
    const byCategory: Record<string, number> = {};
    costEntries.forEach((c) => {
      byCategory[c.category] = (byCategory[c.category] || 0) + c.amount;
    });
    const byAsset: Record<string, number> = {};
    costEntries.forEach((c) => {
      byAsset[c.assetId] = (byAsset[c.assetId] || 0) + c.amount;
    });
    return { total, byCategory, byAsset };
  }, [costEntries]);

  // Ownership distribution
  const ownershipStats = useMemo(() => {
    if (!assets) return { byOwner: {}, unassigned: 0 };
    const byOwner: Record<string, number> = {};
    let unassigned = 0;
    assets.forEach((asset) => {
      if (asset.ownerId) {
        byOwner[asset.ownerId] = (byOwner[asset.ownerId] || 0) + 1;
      } else {
        unassigned++;
      }
    });
    return { byOwner, unassigned };
  }, [assets]);

  // Recent activity (last 10 events)
  const recentActivity = useMemo(() => {
    return [...auditEvents]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }, [auditEvents]);

  // High risk assets
  const highRiskAssets = useMemo(() => {
    return risks
      .filter((r) => r.severity === "critical" || r.severity === "high")
      .map((r) => ({
        ...r,
        asset: assets?.find((a) => a.id === r.assetId),
      }))
      .filter((r) => r.asset);
  }, [risks, assets]);

  // Assets requiring attention (maintenance, high risk, open risks)
  const assetsRequiringAttention = useMemo(() => {
    if (!assets) return [];
    const riskAssetIds = new Set(risks.filter((r) => r.status === "open" || r.status === "in_progress").map((r) => r.assetId));
    return assets.filter(
      (a) => a.status === "maintenance" || a.status === "inactive" || riskAssetIds.has(a.id)
    );
  }, [assets, risks]);

  if (assetsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading Asset 360 data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Asset 360</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Comprehensive overview of your asset landscape, health, and risk posture
        </p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Box className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assetStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{assetStats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{riskStats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${costStats.total.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Health Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Asset Health
            </CardTitle>
            <CardDescription>Current status distribution across all assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor("active")}>{assetStats.active}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">In Maintenance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor("maintenance")}>{assetStats.maintenance}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Inactive</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor("inactive")}>{assetStats.inactive}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Retired</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor("retired")}>{assetStats.retired}</Badge>
                </div>
              </div>
            </div>
            <Link to="/inventory" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                View Asset Inventory <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Risk Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Risk Overview
            </CardTitle>
            <CardDescription>Current risk posture across all assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Critical Risks</span>
                </div>
                <Badge className={getSeverityColor("critical")}>{riskStats.critical}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">High Risks</span>
                </div>
                <Badge className={getSeverityColor("high")}>{riskStats.high}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Medium Risks</span>
                </div>
                <Badge className={getSeverityColor("medium")}>{riskStats.medium}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Total Risks</span>
                </div>
                <Badge variant="outline">{riskStats.total}</Badge>
              </div>
            </div>
            <Link to="/risk" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                View Risk Details <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Lifecycle Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Lifecycle Events
            </CardTitle>
            <CardDescription>Distribution of lifecycle event types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(lifecycleStats)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{type.replace("_", " ")}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
            </div>
            <Link to="/lifecycle" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                View Lifecycle Details <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Cost Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cost by Category
            </CardTitle>
            <CardDescription>Asset costs distributed by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(costStats.byCategory)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{category}</span>
                    <span className="text-sm font-medium">${amount.toLocaleString()}</span>
                  </div>
                ))}
            </div>
            <Link to="/cost" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                View Cost Details <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* High Risk Assets */}
      {highRiskAssets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              High Risk Assets
            </CardTitle>
            <CardDescription>Assets with critical or high severity risks</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {highRiskAssets.slice(0, 5).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.asset?.name || "Unknown"}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.title}</TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(item.severity)}>{item.severity}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/inventory/${item.assetId}`}>
                        <Button variant="ghost" size="sm">
                          View <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Assets Requiring Attention */}
      {assetsRequiringAttention.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wrench className="h-5 w-5 text-blue-500" />
              Assets Requiring Attention
            </CardTitle>
            <CardDescription>Assets in maintenance, inactive, or with open risks</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Count</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assetsRequiringAttention.slice(0, 5).map((asset) => {
                  const assetRiskCount = risks.filter(
                    (r) => r.assetId === asset.id && (r.status === "open" || r.status === "in_progress")
                  ).length;
                  return (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{asset.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(asset.status)}>{asset.status}</Badge>
                      </TableCell>
                      <TableCell>{assetRiskCount > 0 ? <Badge variant="destructive">{assetRiskCount}</Badge> : "-"}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/inventory/${asset.id}`}>
                          <Button variant="ghost" size="sm">
                            View <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Ownership Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Ownership Distribution
          </CardTitle>
          <CardDescription>Assets distributed by owner</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {owners
              .filter((owner) => ownershipStats.byOwner[owner.id])
              .sort((a, b) => (ownershipStats.byOwner[b.id] || 0) - (ownershipStats.byOwner[a.id] || 0))
              .slice(0, 5)
              .map((owner) => (
                <div key={owner.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{owner.name}</span>
                    <span className="text-xs text-gray-500">({owner.department})</span>
                  </div>
                  <Badge variant="outline">{ownershipStats.byOwner[owner.id] || 0}</Badge>
                </div>
              ))}
            {ownershipStats.unassigned > 0 && (
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-gray-500">Unassigned</span>
                <Badge variant="outline">{ownershipStats.unassigned}</Badge>
              </div>
            )}
          </div>
          <Link to="/ownership" className="block mt-4">
            <Button variant="outline" size="sm" className="w-full">
              View Ownership Details <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest asset-related events and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((event) => (
              <div key={event.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                <div className="flex-shrink-0 mt-1">
                  {event.eventType.includes("created") ? (
                    <Box className="h-4 w-4 text-green-500" />
                  ) : event.eventType.includes("deleted") ? (
                    <Box className="h-4 w-4 text-red-500" />
                  ) : event.eventType.includes("risk") ? (
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  ) : (
                    <Activity className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {event.eventType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </p>
                  <p className="text-xs text-gray-500">
                    {event.userName || "System"} • {new Date(event.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/audit" className="block mt-4">
            <Button variant="outline" size="sm" className="w-full">
              View Full Audit History <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Asset360;