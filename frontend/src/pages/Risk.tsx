"use client";

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMockAssets, useMockRisks, useMockCompliance } from "@/mocks/mockAdapter";
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
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle,
  FileSearch,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Wrench,
} from "lucide-react";

// ---------- Severity helpers ----------
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

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical":
      return <ShieldAlert className="h-4 w-4 text-red-500" />;
    case "high":
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case "medium":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "low":
      return <Shield className="h-4 w-4 text-blue-500" />;
    default:
      return <Shield className="h-4 w-4 text-gray-400" />;
  }
};

// ---------- Risk status helpers ----------
const getRiskStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-red-100 text-red-800 border-red-200";
    case "in_progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "mitigated":
      return "bg-green-100 text-green-800 border-green-200";
    case "closed":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "accepted":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getRiskStatusLabel = (status: string) => {
  return status
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
};

// ---------- Compliance status helpers ----------
const getComplianceStatusColor = (status: string) => {
  switch (status) {
    case "compliant":
      return "bg-green-100 text-green-800 border-green-200";
    case "non_compliant":
      return "bg-red-100 text-red-800 border-red-200";
    case "partial":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "not_assessed":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getComplianceStatusIcon = (status: string) => {
  switch (status) {
    case "compliant":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "non_compliant":
      return <ShieldX className="h-4 w-4 text-red-500" />;
    case "partial":
      return <ShieldAlert className="h-4 w-4 text-yellow-500" />;
    case "not_assessed":
      return <Shield className="h-4 w-4 text-gray-400" />;
    default:
      return <Shield className="h-4 w-4 text-gray-400" />;
  }
};

const getComplianceStatusLabel = (status: string) => {
  return status
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
};

const getFrameworkLabel = (framework: string) => {
  switch (framework) {
    case "iso_27001":
      return "ISO 27001";
    case "gdpr":
      return "GDPR";
    case "pci_dss":
      return "PCI DSS";
    case "sox":
      return "SOX";
    case "hipaa":
      return "HIPAA";
    case "other":
      return "Other";
    default:
      return framework.toUpperCase();
  }
};

const Risk = () => {
  const { data: assets, isLoading: assetsLoading, error: assetsError } = useMockAssets();
  const { data: risks, isLoading: risksLoading, error: risksError } = useMockRisks();
  const { data: compliance, isLoading: complianceLoading, error: complianceError } = useMockCompliance();

  const [searchTerm, setSearchTerm] = useState("");
  const [riskSeverity, setRiskSeverity] = useState<string>("all");
  const [riskStatus, setRiskStatus] = useState<string>("all");
  const [complianceStatus, setComplianceStatus] = useState<string>("all");
  const [framework, setFramework] = useState<string>("all");

  const assetById = useMemo(() => {
    const m = new Map<string, string>();
    (assets ?? []).forEach((a) => m.set(a.id, a.name));
    return m;
  }, [assets]);

  // ---------- Summary metrics ----------
  const riskMetrics = useMemo(() => {
    const list = risks ?? [];
    const total = list.length;
    const open = list.filter((r) => r.status === "open" || r.status === "in_progress").length;
    const highCritical = list.filter((r) => r.severity === "high" || r.severity === "critical").length;
    const resolved = list.filter((r) => r.status === "mitigated" || r.status === "closed" || r.status === "accepted").length;
    const assetsAffected = new Set(list.map((r) => r.assetId)).size;
    return { total, open, highCritical, resolved, assetsAffected };
  }, [risks]);

  const complianceMetrics = useMemo(() => {
    const list = compliance ?? [];
    const total = list.length;
    const open = list.filter((c) => c.status === "non_compliant" || c.status === "partial" || c.status === "not_assessed").length;
    const nonCompliant = list.filter((c) => c.status === "non_compliant").length;
    const compliant = list.filter((c) => c.status === "compliant").length;
    const assetsAffected = new Set(list.map((c) => c.assetId)).size;
    return { total, open, nonCompliant, compliant, assetsAffected };
  }, [compliance]);

  // ---------- Unique filter options ----------
  const frameworks = useMemo(() => {
    const s = new Set((compliance ?? []).map((c) => c.framework));
    return Array.from(s);
  }, [compliance]);

  // ---------- Filtered risks ----------
  const filteredRisks = useMemo(() => {
    const list = risks ?? [];
    return list.filter((r) => {
      const assetName = assetById.get(r.assetId) ?? "";
      const matchesSearch =
        searchTerm === "" ||
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assetName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = riskSeverity === "all" || r.severity === riskSeverity;
      const matchesStatus = riskStatus === "all" || r.status === riskStatus;
      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [risks, searchTerm, riskSeverity, riskStatus, assetById]);

  // ---------- Filtered compliance ----------
  const filteredCompliance = useMemo(() => {
    const list = compliance ?? [];
    return list.filter((c) => {
      const assetName = assetById.get(c.assetId) ?? "";
      const matchesSearch =
        searchTerm === "" ||
        c.requirementTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.requirementId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.framework.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assetName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = complianceStatus === "all" || c.status === complianceStatus;
      const matchesFramework = framework === "all" || c.framework === framework;
      return matchesSearch && matchesStatus && matchesFramework;
    });
  }, [compliance, searchTerm, complianceStatus, framework, assetById]);

  const hasActiveFilters =
    searchTerm !== "" ||
    riskSeverity !== "all" ||
    riskStatus !== "all" ||
    complianceStatus !== "all" ||
    framework !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setRiskSeverity("all");
    setRiskStatus("all");
    setComplianceStatus("all");
    setFramework("all");
  };

  // ---------- Error / loading ----------
  const anyError = assetsError || risksError || complianceError;
  const anyLoading = assetsLoading || risksLoading || complianceLoading;

  if (anyError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Error Loading Risk & Compliance Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Unable to load records. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Risk & Compliance</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Visibility into asset risks, compliance findings, severity, status, and remediation or review needs.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Risks</CardTitle>
            <ShieldAlert className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riskMetrics.total}</div>
            <p className="text-xs text-gray-500 mt-1">
              {riskMetrics.open} open · {riskMetrics.resolved} resolved
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High / Critical Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{riskMetrics.highCritical}</div>
            <p className="text-xs text-gray-500 mt-1">Across {riskMetrics.assetsAffected} asset(s)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Findings</CardTitle>
            <ShieldCheck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceMetrics.total}</div>
            <p className="text-xs text-gray-500 mt-1">
              {complianceMetrics.compliant} compliant · {complianceMetrics.open} open
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non-Compliant Items</CardTitle>
            <ShieldX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{complianceMetrics.nonCompliant}</div>
            <p className="text-xs text-gray-500 mt-1">
              Across {complianceMetrics.assetsAffected} asset(s)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
          <CardDescription>Find risks and compliance records across the portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by asset, risk title, requirement, framework, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <Select value={riskSeverity} onValueChange={setRiskSeverity}>
                <SelectTrigger className="w-full md:w-[160px]">
                  <SelectValue placeholder="Risk Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={riskStatus} onValueChange={setRiskStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Risk Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="mitigated">Mitigated</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                </SelectContent>
              </Select>
              <Select value={complianceStatus} onValueChange={setComplianceStatus}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Compliance Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Compliance Status</SelectItem>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="not_assessed">Not Assessed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={framework} onValueChange={setFramework}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frameworks</SelectItem>
                  {frameworks.map((f) => (
                    <SelectItem key={f} value={f}>
                      {getFrameworkLabel(f)}
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

      {/* Risk Records */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            Risk Records ({filteredRisks.length})
          </CardTitle>
          <CardDescription>
            {filteredRisks.length === (risks?.length ?? 0)
              ? "Showing all risk records"
              : `Showing ${filteredRisks.length} of ${risks?.length ?? 0} risk records`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {anyLoading ? (
            <div className="flex items-center justify-center h-32 text-gray-500">Loading risk records...</div>
          ) : filteredRisks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32">
              <FileSearch className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500">No risk records match your search criteria</p>
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
                    <TableHead>Risk</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Identified</TableHead>
                    <TableHead>Target Resolution</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRisks.map((r) => (
                    <TableRow key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{r.title}</div>
                          {r.description && (
                            <div className="text-xs text-gray-500 line-clamp-1">{r.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                        {assetById.get(r.assetId) ?? r.assetId.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{r.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(r.severity)}
                          <Badge className={getSeverityColor(r.severity)} variant="outline">
                            {r.severity}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskStatusColor(r.status)} variant="outline">
                          {getRiskStatusLabel(r.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(r.identifiedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {r.targetResolutionDate ? new Date(r.targetResolutionDate).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          to={`/inventory/${r.assetId}`}
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

      {/* Compliance Records */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-500" />
            Compliance Records ({filteredCompliance.length})
          </CardTitle>
          <CardDescription>
            {filteredCompliance.length === (compliance?.length ?? 0)
              ? "Showing all compliance records"
              : `Showing ${filteredCompliance.length} of ${compliance?.length ?? 0} compliance records`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {anyLoading ? (
            <div className="flex items-center justify-center h-32 text-gray-500">Loading compliance records...</div>
          ) : filteredCompliance.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32">
              <FileSearch className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500">No compliance records match your search criteria</p>
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
                    <TableHead>Requirement</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Framework</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Assessed</TableHead>
                    <TableHead>Next Due</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompliance.map((c) => (
                    <TableRow key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{c.requirementTitle}</div>
                          <div className="text-xs text-gray-500 font-mono">{c.requirementId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                        {assetById.get(c.assetId) ?? c.assetId.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getFrameworkLabel(c.framework)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getComplianceStatusIcon(c.status)}
                          <Badge className={getComplianceStatusColor(c.status)} variant="outline">
                            {getComplianceStatusLabel(c.status)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(c.lastAssessed).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {c.nextAssessmentDue ? new Date(c.nextAssessmentDue).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400 max-w-[200px] truncate">
                        {c.notes ?? "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          to={`/inventory/${c.assetId}`}
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

      {/* Items Requiring Attention */}
      {(filteredRisks.some((r) => r.status === "open" || r.status === "in_progress") ||
        filteredCompliance.some((c) => c.status === "non_compliant" || c.status === "partial")) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wrench className="h-5 w-5 text-amber-500" />
              Items Requiring Attention
            </CardTitle>
            <CardDescription>Open risks and compliance gaps that need follow-up</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredRisks
                .filter((r) => r.status === "open" || r.status === "in_progress")
                .map((r) => (
                  <div
                    key={`risk-${r.id}`}
                    className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getSeverityIcon(r.severity)}
                        <p className="font-medium text-gray-900 dark:text-gray-100">{r.title}</p>
                        <Badge className={getSeverityColor(r.severity)} variant="outline">{r.severity}</Badge>
                        <Badge className={getRiskStatusColor(r.status)} variant="outline">
                          {getRiskStatusLabel(r.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {assetById.get(r.assetId) ?? r.assetId} · {r.category}
                      </p>
                      {r.mitigationPlan && (
                        <p className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">Plan:</span> {r.mitigationPlan}
                        </p>
                      )}
                    </div>
                    <Link to={`/inventory/${r.assetId}`}>
                      <Button variant="outline" size="sm">
                        Review <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                ))}
              {filteredCompliance
                .filter((c) => c.status === "non_compliant" || c.status === "partial")
                .map((c) => (
                  <div
                    key={`comp-${c.id}`}
                    className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getComplianceStatusIcon(c.status)}
                        <p className="font-medium text-gray-900 dark:text-gray-100">{c.requirementTitle}</p>
                        <Badge variant="outline">{getFrameworkLabel(c.framework)}</Badge>
                        <Badge className={getComplianceStatusColor(c.status)} variant="outline">
                          {getComplianceStatusLabel(c.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {assetById.get(c.assetId) ?? c.assetId} · {c.requirementId}
                      </p>
                      {c.notes && (
                        <p className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">Notes:</span> {c.notes}
                        </p>
                      )}
                    </div>
                    <Link to={`/inventory/${c.assetId}`}>
                      <Button variant="outline" size="sm">
                        Review <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Risk;