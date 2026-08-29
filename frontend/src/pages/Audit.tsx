"use client";

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMockAuditEvents, useMockAssets } from "@/mocks/mockAdapter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  FileSearch,
  History,
  Info,
  Search,
  User,
  XCircle,
} from "lucide-react";

// ---------- Severity helpers ----------
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200";
    case "error":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "warning":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "info":
    default:
      return "bg-blue-100 text-blue-800 border-blue-200";
  }
};

const getSeverityLabel = (severity: string) => {
  return severity.charAt(0).toUpperCase() + severity.slice(1);
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "error":
      return <XCircle className="h-4 w-4 text-orange-500" />;
    case "warning":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "info":
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

// ---------- Event type helpers ----------
const getEventTypeColor = (eventType: string) => {
  switch (eventType) {
    case "asset_updated":
    case "asset_created":
    case "asset_deleted":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "risk_identified":
    case "risk_updated":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "approval_requested":
    case "approval_decided":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "recommendation_created":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "compliance_checked":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "lifecycle_event":
      return "bg-cyan-100 text-cyan-800 border-cyan-200";
    case "data_export":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatEventType = (eventType: string) => {
  return eventType
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
};

const formatValue = (value: unknown): string => {
  if (value === undefined) return "—";
  if (value === null) return "null";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.length === 0 ? "[]" : value.join(", ");
  return JSON.stringify(value);
};

const Audit = () => {
  const { data: auditEvents, isLoading: auditLoading, error: auditError } = useMockAuditEvents();
  const { data: assets } = useMockAssets();

  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ---------- Lookup maps ----------
  const assetById = useMemo(() => {
    const m = new Map<string, string>();
    (assets ?? []).forEach((a) => m.set(a.id, a.name));
    return m;
  }, [assets]);

  // ---------- Derived summary metrics ----------
  const metrics = useMemo(() => {
    const list = auditEvents ?? [];
    const total = list.length;
    const now = Date.now();
    const last7Days = list.filter((e) => {
      const t = new Date(e.timestamp).getTime();
      return now - t <= 7 * 24 * 60 * 60 * 1000;
    }).length;
    const assetChanges = list.filter((e) => e.resourceType === "asset").length;
    const decisions = list.filter(
      (e) => e.eventType === "approval_decided" || e.eventType === "approval_requested"
    ).length;
    const critical = list.filter(
      (e) => e.severity === "critical" || e.severity === "error"
    ).length;
    return { total, last7Days, assetChanges, decisions, critical };
  }, [auditEvents]);

  // ---------- Filtered events (chronological, newest first) ----------
  const filteredEvents = useMemo(() => {
    const list = (auditEvents ?? [])
      .slice()
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return list.filter((e) => {
      const assetName = assetById.get(e.resourceId) ?? "";
      const matchesSearch =
        searchTerm === "" ||
        e.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.resourceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.severity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (e.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.resourceId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEventType = eventTypeFilter === "all" || e.eventType === eventTypeFilter;
      const matchesSeverity = severityFilter === "all" || e.severity === severityFilter;

      return matchesSearch && matchesEventType && matchesSeverity;
    });
  }, [auditEvents, searchTerm, eventTypeFilter, severityFilter, assetById]);

  // ---------- Filter dropdown options (derived from actual data) ----------
  const eventTypes = useMemo(() => {
    const s = new Set((auditEvents ?? []).map((e) => e.eventType));
    return Array.from(s);
  }, [auditEvents]);

  const severities = useMemo(() => {
    const s = new Set((auditEvents ?? []).map((e) => e.severity));
    return Array.from(s);
  }, [auditEvents]);

  const hasActiveFilters = searchTerm !== "" || eventTypeFilter !== "all" || severityFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setEventTypeFilter("all");
    setSeverityFilter("all");
  };

  const toggleExpanded = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Format timestamp for display
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString();
  };

  // ---------- Error state ----------
  if (auditError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Error Loading Audit & History</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Unable to load audit records. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <History className="h-7 w-7 text-blue-600" />
          Audit & History
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Historical activity and audit visibility across the asset portfolio — track changes, decisions,
          approvals, risks, recommendations, compliance checks, and lifecycle events.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <History className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total}</div>
            <p className="text-xs text-gray-500 mt-1">All recorded audit events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent (7 days)</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.last7Days}</div>
            <p className="text-xs text-gray-500 mt-1">Activity in last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asset Changes</CardTitle>
            <CheckCircle className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{metrics.assetChanges}</div>
            <p className="text-xs text-gray-500 mt-1">Modifications tracked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approvals / Decisions</CardTitle>
            <User className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{metrics.decisions}</div>
            <p className="text-xs text-gray-500 mt-1">Requested or decided</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical / Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.critical}</div>
            <p className="text-xs text-gray-500 mt-1">Requiring attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
          <CardDescription>Find audit events by actor, asset, type, or severity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by event, actor, asset, or resource..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                <SelectTrigger className="w-full md:w-[220px]">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Event Types</SelectItem>
                  {eventTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {formatEventType(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  {severities.map((s) => (
                    <SelectItem key={s} value={s}>
                      {getSeverityLabel(s)}
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

      {/* Audit Events Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-blue-500" />
            Audit Events ({filteredEvents.length})
          </CardTitle>
          <CardDescription>
            {filteredEvents.length === (auditEvents?.length ?? 0)
              ? "Showing all audit events, newest first"
              : `Showing ${filteredEvents.length} of ${auditEvents?.length ?? 0} audit events`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {auditLoading ? (
            <div className="flex items-center justify-center h-32 text-gray-500">Loading audit events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32">
              <FileSearch className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500">
                {(auditEvents?.length ?? 0) === 0
                  ? "No audit events are currently available."
                  : "No audit events match your search criteria."}
              </p>
              {hasActiveFilters && (auditEvents?.length ?? 0) > 0 && (
                <Button variant="link" onClick={clearFilters} className="mt-2 text-sm text-blue-600 hover:underline">
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Related To</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => {
                    const isExpanded = expandedId === event.id;
                    const assetName = assetById.get(event.resourceId);
                    const showAssetLink = event.resourceType === "asset" && !!assetName;
                    return (
                      <React.Fragment key={event.id}>
                        <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell>
                            <button
                              onClick={() => toggleExpanded(event.id)}
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
                          <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                            <div>{formatDate(event.timestamp)}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(event.timestamp).toLocaleTimeString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {formatEventType(event.eventType)}
                            </div>
                            <div className="text-xs text-gray-500 font-mono">{event.id.slice(0, 8)}...</div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getEventTypeColor(event.eventType)} variant="outline">
                              {event.resourceType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getSeverityIcon(event.severity)}
                              <Badge className={getSeverityColor(event.severity)} variant="outline">
                                {getSeverityLabel(event.severity)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                            {event.userName ?? event.userId ?? "—"}
                          </TableCell>
                          <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                            {assetName ?? event.resourceId.slice(0, 8)}
                          </TableCell>
                          <TableCell className="text-right">
                            {showAssetLink ? (
                              <Link
                                to={`/inventory/${event.resourceId}`}
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
                              <AuditEventDetail event={event} />
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

// ---------- Audit Event Detail Panel ----------
const AuditEventDetail: React.FC<{
  event: NonNullable<ReturnType<typeof useMockAuditEvents>["data"]>[number];
}> = ({ event }) => {
  const changeEntries = Object.entries(event.changes ?? {});

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Event ID</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">{event.id}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Timestamp</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {new Date(event.timestamp).toLocaleString()}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Event Type</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{formatEventType(event.eventType)}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Resource Type</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{event.resourceType}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Resource ID</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">{event.resourceId}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Severity</h4>
          <Badge className={getSeverityColor(event.severity)} variant="outline">
            {getSeverityLabel(event.severity)}
          </Badge>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Actor</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {event.userName ?? "—"}
            {event.userId && (
              <span className="text-xs text-gray-500 font-mono ml-1">({event.userId})</span>
            )}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Actor Roles</h4>
          <div className="flex flex-wrap gap-1">
            {event.userRoles && event.userRoles.length > 0 ? (
              event.userRoles.map((role) => (
                <Badge key={role} variant="outline" className="text-xs">
                  {role}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-400">—</span>
            )}
          </div>
        </div>

        {/* Change details */}
        {changeEntries.length > 0 && (
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Change Details ({changeEntries.length})
            </h4>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Field</TableHead>
                    <TableHead className="w-1/4">Before</TableHead>
                    <TableHead>After</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {changeEntries.map(([field, change]) => (
                    <TableRow key={field}>
                      <TableCell className="font-mono text-xs text-gray-700 dark:text-gray-300">
                        {field}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                        {formatValue(change?.before)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                        {formatValue(change?.after)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Metadata */}
        {event.metadata && Object.keys(event.metadata).length > 0 && (
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Metadata</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(event.metadata).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 p-2 border rounded-lg bg-white dark:bg-gray-800"
                >
                  <span className="text-xs font-mono text-gray-500">{key}:</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{formatValue(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Audit;