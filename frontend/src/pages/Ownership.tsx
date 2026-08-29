"use client";

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMockAssets } from "@/mocks/mockAdapter";
import { mockAssetOwners } from "@/mocks/owners";
import { mockRisks } from "@/mocks/risks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  ArrowRight,
  User,
  Building,
  Box,
  Shield,
  FileSearch,
} from "lucide-react";

// Helper to get owner name by ID
const getOwnerName = (ownerId: string | undefined): string => {
  if (!ownerId) return "Unassigned";
  const owner = mockAssetOwners.find((o) => o.id === ownerId);
  return owner?.name || "Unknown";
};

// Helper to get owner details
const getOwnerDetails = (ownerId: string | undefined) => {
  if (!ownerId) return null;
  return mockAssetOwners.find((o) => o.id === ownerId) || null;
};

// Helper to get owner status
const getOwnerStatus = (ownerId: string | undefined) => {
  if (!ownerId) return "unassigned";
  const owner = mockAssetOwners.find((o) => o.id === ownerId);
  if (!owner) return "unknown";
  return owner.isActive ? "active" : "inactive";
};

// Helper to get risk count for an asset
const getRiskCount = (assetId: string) => {
  return mockRisks.filter((r) => r.assetId === assetId && (r.status === "open" || r.status === "in_progress")).length;
};

// Helper to get highest risk severity for an asset
const getHighestRiskSeverity = (assetId: string) => {
  const assetRisks = mockRisks.filter((r) => r.assetId === assetId && (r.status === "open" || r.status === "in_progress"));
  if (assetRisks.length === 0) return null;
  const severities = ["critical", "high", "medium", "low"] as const;
  for (const severity of severities) {
    if (assetRisks.some((r) => r.severity === severity)) return severity;
  }
  return null;
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
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getOwnershipStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800 border-green-200">Assigned</Badge>;
    case "inactive":
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Inactive Owner</Badge>;
    case "unassigned":
      return <Badge className="bg-red-100 text-red-800 border-red-200">Unassigned</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

interface OwnershipRecord {
  assetId: string;
  assetName: string;
  ownerId: string | undefined;
  ownerName: string;
  ownerDepartment: string | undefined;
  ownerStatus: string;
  businessUnit: string | undefined;
  assetStatus: string;
  assetType: string;
  riskCount: number;
  highestRisk: string | null;
  lastUpdated: string;
}

const Ownership = () => {
  const { data: assets, isLoading, error } = useMockAssets();
  const [searchTerm, setSearchTerm] = useState("");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [businessUnitFilter, setBusinessUnitFilter] = useState<string>("all");

  // Build ownership records from assets + owners
  const ownershipRecords = useMemo<OwnershipRecord[]>(() => {
    if (!assets) return [];
    return assets.map((asset) => {
      const ownerDetails = getOwnerDetails(asset.ownerId);
      return {
        assetId: asset.id,
        assetName: asset.name,
        ownerId: asset.ownerId,
        ownerName: getOwnerName(asset.ownerId),
        ownerDepartment: ownerDetails?.department,
        ownerStatus: getOwnerStatus(asset.ownerId),
        businessUnit: asset.businessUnitId,
        assetStatus: asset.status,
        assetType: asset.type,
        riskCount: getRiskCount(asset.id),
        highestRisk: getHighestRiskSeverity(asset.id),
        lastUpdated: asset.updatedAt,
      };
    });
  }, [assets]);

  // Summary metrics
  const metrics = useMemo(() => {
    if (!ownershipRecords.length) {
      return { total: 0, assigned: 0, unassigned: 0, uniqueOwners: 0, inactiveOwners: 0, highRisk: 0 };
    }
    const assigned = ownershipRecords.filter((r) => r.ownerId).length;
    const unassigned = ownershipRecords.filter((r) => !r.ownerId).length;
    const uniqueOwnerIds = new Set(ownershipRecords.filter((r) => r.ownerId).map((r) => r.ownerId));
    const inactiveOwners = mockAssetOwners.filter((o) => !o.isActive).length;
    const highRisk = ownershipRecords.filter(
      (r) => r.highestRisk === "critical" || r.highestRisk === "high"
    ).length;
    return {
      total: ownershipRecords.length,
      assigned,
      unassigned,
      uniqueOwners: uniqueOwnerIds.size,
      inactiveOwners,
      highRisk,
    };
  }, [ownershipRecords]);

  // Get unique values for filters
  const uniqueOwners = useMemo(() => {
    return mockAssetOwners.map((o) => ({ id: o.id, name: o.name }));
  }, []);

  const uniqueBusinessUnits = useMemo(() => {
    const units = new Set(ownershipRecords.map((r) => r.businessUnit).filter(Boolean));
    return Array.from(units) as string[];
  }, [ownershipRecords]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return ownershipRecords.filter((record) => {
      const matchesSearch =
        searchTerm === "" ||
        record.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.ownerDepartment?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesOwner = ownerFilter === "all" || record.ownerId === ownerFilter;
      const matchesStatus = statusFilter === "all" || record.ownerStatus === statusFilter;
      const matchesBusinessUnit = businessUnitFilter === "all" || record.businessUnit === businessUnitFilter;

      return matchesSearch && matchesOwner && matchesStatus && matchesBusinessUnit;
    });
  }, [ownershipRecords, searchTerm, ownerFilter, statusFilter, businessUnitFilter]);

  const hasActiveFilters = searchTerm !== "" || ownerFilter !== "all" || statusFilter !== "all" || businessUnitFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setOwnerFilter("all");
    setStatusFilter("all");
    setBusinessUnitFilter("all");
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Error Loading Ownership Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Unable to load ownership data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Ownership & Governance</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage ownership, stewardship, and governance visibility across your asset portfolio
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Box className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.assigned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.unassigned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Owners</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.uniqueOwners}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Owners</CardTitle>
            <User className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{metrics.inactiveOwners}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.highRisk}</div>
          </CardContent>
        </Card>
      </div>

      {/* Governance Alerts */}
      {(metrics.unassigned > 0 || metrics.inactiveOwners > 0 || metrics.highRisk > 0) && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-600" />
              Governance Visibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {metrics.unassigned > 0 && (
                <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                  <UserX className="h-4 w-4" />
                  <span className="text-sm font-medium">{metrics.unassigned} unassigned asset{metrics.unassigned !== 1 ? "s" : ""}</span>
                </div>
              )}
              {metrics.inactiveOwners > 0 && (
                <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{metrics.inactiveOwners} owner{metrics.inactiveOwners !== 1 ? "s" : ""} inactive</span>
                </div>
              )}
              {metrics.highRisk > 0 && (
                <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">{metrics.highRisk} high-risk asset{metrics.highRisk !== 1 ? "s" : ""}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
          <CardDescription>Find assets by owner, business unit, or status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by asset, owner, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={ownerFilter} onValueChange={setOwnerFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Owners</SelectItem>
                {uniqueOwners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>
                    {owner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Ownership Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Assigned</SelectItem>
                <SelectItem value="inactive">Inactive Owner</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={businessUnitFilter} onValueChange={setBusinessUnitFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Business Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Units</SelectItem>
                {uniqueBusinessUnits.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
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

      {/* Ownership Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ownership Records ({filteredRecords.length})</CardTitle>
          <CardDescription>
            {filteredRecords.length === ownershipRecords.length
              ? "Showing all ownership records"
              : `Showing ${filteredRecords.length} of ${ownershipRecords.length} records`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">Loading ownership data...</div>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32">
              <FileSearch className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500">No ownership records match your search criteria</p>
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
                    <TableHead>Owner</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Ownership Status</TableHead>
                    <TableHead>Business Unit</TableHead>
                    <TableHead>Asset Status</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.assetId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{record.assetName}</div>
                          <div className="text-xs text-gray-500 font-mono">{record.assetId.slice(0, 8)}...</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{record.ownerName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {record.ownerDepartment || "-"}
                      </TableCell>
                      <TableCell>{getOwnershipStatusBadge(record.ownerStatus)}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3 text-gray-400" />
                          {record.businessUnit || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.assetStatus)} variant="outline">
                          {record.assetStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.highestRisk ? (
                          <Badge className={getSeverityColor(record.highestRisk)} variant="outline">
                            {record.highestRisk} ({record.riskCount})
                          </Badge>
                        ) : (
                          <span className="text-sm text-gray-400">None</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(record.lastUpdated).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          to={`/inventory/${record.assetId}`}
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Asset <ArrowRight className="h-4 w-4" />
                        </Link>
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

export default Ownership;