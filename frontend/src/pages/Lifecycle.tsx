"use client";

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMockAssets } from "@/mocks/mockAdapter";
import { mockLifecycleEvents } from "@/mocks/lifecycle";
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
  Calendar,
  CheckCircle,
  Clock,
  FileSearch,
  Package,
  Repeat,
  Search,
  User,
  Wrench,
} from "lucide-react";
import type { LifecycleEvent } from "@/types/domain";

// ---------- Event type helpers ----------
const getEventTypeLabel = (t: string) => {
  return t
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
};

const getEventTypeColor = (t: string) => {
  switch (t) {
    case "procurement":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "deployment":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "maintenance":
      return "bg-cyan-100 text-cyan-800 border-cyan-200";
    case "upgrade":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "decommission":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "disposal":
      return "bg-red-100 text-red-800 border-red-200";
    case "renewal":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getEventTypeIcon = (t: string) => {
  switch (t) {
    case "procurement":
      return <Package className="h-4 w-4 text-indigo-500" />;
    case "deployment":
      return <Wrench className="h-4 w-4 text-blue-500" />;
    case "maintenance":
      return <Wrench className="h-4 w-4 text-cyan-500" />;
    case "upgrade":
      return <Repeat className="h-4 w-4 text-purple-500" />;
    case "decommission":
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    case "disposal":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "renewal":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <Repeat className="h-4 w-4 text-gray-400" />;
  }
};

// ---------- Status helpers ----------
const getStatusColor = (status: string) => {
  switch (status) {
    case "planned":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "in_progress":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "overdue":
      return "bg-red-100 text-red-800 border-red-200";
    case "cancelled":
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

const Lifecycle = () => {
  const { data: assets, error: assetsError } = useMockAssets();

  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Build lookup maps from existing data
  const assetById = useMemo(() => {
    const m = new Map<string, { name: string; status: string }>();
    (assets ?? []).forEach((a) => m.set(a.id, { name: a.name, status: a.status }));
    return m;
  }, [assets]);

  const ownerNameById = useMemo(() => {
    const m = new Map<string, string>();
    mockAssetOwners.forEach((o) => m.set(o.id, o.name));
    return m;
  }, []);

  // ---------- Summary metrics (derived, not hard-coded) ----------
  const metrics = useMemo(() => {
    const events = mockLifecycleEvents;
    const assetsWithLifecycle = new Set(events.map((e) => e.assetId)).size;
    const totalEvents = events.length;
    const planned = events.filter((e) => e.status === "planned" || e.status === "in_progress").length;
    const completed = events.filter((e) => e.status === "completed").length;
    const overdue = events.filter((e) => e.status === "overdue").length;
    const totalCost = events.reduce((sum, e) => sum + (e.cost ?? 0), 0);
    return { assetsWithLifecycle, totalEvents, planned, completed, overdue, totalCost };
  }, []);

  // ---------- Filtered events ----------
  const filteredEvents = useMemo(() => {
    return mockLifecycleEvents.filter((ev) => {
      const assetName = assetById.get(ev.assetId)?.name ?? "";
      const ownerName = ev.performedBy ? ownerNameById.get(ev.performedBy) ?? "" : "";
      const matchesSearch =
        searchTerm === "" ||
        ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ev.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        ev.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ownerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = eventTypeFilter === "all" || ev.eventType === eventTypeFilter;
      const matchesStatus = statusFilter === "all" || ev.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, eventTypeFilter, statusFilter, assetById, ownerNameById]);

  // ---------- Event history (completed) ----------
  const completedEvents = useMemo(
    () =>
      mockLifecycleEvents
        .filter((e) => e.status === "completed")
        .sort((a, b) => new Date(b.completedDate ?? b.updatedAt).getTime() - new Date(a.completedDate ?? a.updatedAt).getTime()),
    []
  );

  // ---------- Upcoming / attention ----------
  const upcomingEvents = useMemo(
    () =>
      mockLifecycleEvents
        .filter((e) => e.status === "planned" || e.status === "in_progress" || e.status === "overdue")
        .sort((a, b) => {
          const aDate = a.scheduledDate ? new Date(a.scheduledDate).getTime() : Number.POSITIVE_INFINITY;
          const bDate = b.scheduledDate ? new Date(b.scheduledDate).getTime() : Number.POSITIVE_INFINITY;
          return aDate - bDate;
        }),
    []
  );

  // ---------- Filter dropdown options (derived from data, no hard-coded values) ----------
  const eventTypes = useMemo(() => {
    const s = new Set(mockLifecycleEvents.map((e) => e.eventType));
    return Array.from(s);
  }, []);

  const statuses = useMemo(() => {
    const s = new Set(mockLifecycleEvents.map((e) => e.status));
    return Array.from(s);
  }, []);

  const hasActiveFilters = searchTerm !== "" || eventTypeFilter !== "all" || statusFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setEventTypeFilter("all");
    setStatusFilter("all");
  };

  if (assetsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Error Loading Lifecycle Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Unable to load lifecycle records. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Repeat className="h-7 w-7 text-blue-600" />
          Lifecycle
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Visibility into asset lifecycle stages, events, milestones, and upcoming lifecycle actions.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assets with Lifecycle Data</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.assetsWithLifecycle}</div>
            <p className="text-xs text-gray-500 mt-1">{metrics.totalEvents} total events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.planned}</div>
            <p className="text-xs text-gray-500 mt-1">Planned or in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Events</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.completed}</div>
            <p className="text-xs text-gray-500 mt-1">Across the portfolio</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Events</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.overdue}</div>
            <p className="text-xs text-gray-500 mt-1">
              ${metrics.totalCost.toLocaleString()} total tracked cost
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
          <CardDescription>Find lifecycle events by asset, owner, type, or status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by asset, event, type, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Event Types</SelectItem>
                {eventTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {getEventTypeLabel(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
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
        </CardContent>
      </Card>

      {/* Lifecycle Records */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Repeat className="h-5 w-5 text-blue-500" />
            Lifecycle Records ({filteredEvents.length})
          </CardTitle>
          <CardDescription>
            {filteredEvents.length === mockLifecycleEvents.length
              ? "Showing all lifecycle records"
              : `Showing ${filteredEvents.length} of ${mockLifecycleEvents.length} lifecycle records`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32">
              <FileSearch className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500">No lifecycle records match your search criteria</p>
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
                    <TableHead>Event</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((ev) => {
                    const asset = assetById.get(ev.assetId);
                    const ownerName = ev.performedBy ? ownerNameById.get(ev.performedBy) : null;
                    return (
                      <TableRow key={ev.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">{ev.title}</div>
                            {ev.description && (
                              <div className="text-xs text-gray-500 line-clamp-1">{ev.description}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                          {asset?.name ?? ev.assetId.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getEventTypeIcon(ev.eventType)}
                            <Badge className={getEventTypeColor(ev.eventType)} variant="outline">
                              {getEventTypeLabel(ev.eventType)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(ev.status)} variant="outline">
                            {getStatusLabel(ev.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                          {ev.scheduledDate ? new Date(ev.scheduledDate).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                          {ev.completedDate ? new Date(ev.completedDate).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                          {ownerName ?? (ev.performedBy ? ev.performedBy.slice(0, 8) : "—")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link
                            to={`/inventory/${ev.assetId}`}
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

      {/* Upcoming / Items Requiring Attention */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Upcoming & Items Requiring Attention ({upcomingEvents.length})
          </CardTitle>
          <CardDescription>
            Planned, in-progress, and overdue lifecycle events sorted by scheduled date
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 text-center">
              <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">No upcoming lifecycle items require attention.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((ev) => {
                const asset = assetById.get(ev.assetId);
                return (
                  <div
                    key={ev.id}
                    className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getEventTypeIcon(ev.eventType)}
                        <p className="font-medium text-gray-900 dark:text-gray-100">{ev.title}</p>
                        <Badge className={getEventTypeColor(ev.eventType)} variant="outline">
                          {getEventTypeLabel(ev.eventType)}
                        </Badge>
                        <Badge className={getStatusColor(ev.status)} variant="outline">
                          {getStatusLabel(ev.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <span>{asset?.name ?? ev.assetId.slice(0, 8)}</span>
                        {ev.scheduledDate && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(ev.scheduledDate).toLocaleDateString()}
                            </span>
                          </>
                        )}
                        {ev.vendor && (
                          <>
                            <span>·</span>
                            <span>{ev.vendor}</span>
                          </>
                        )}
                      </p>
                      {ev.notes && (
                        <p className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">Notes:</span> {ev.notes}
                        </p>
                      )}
                    </div>
                    <Link to={`/inventory/${ev.assetId}`}>
                      <Button variant="outline" size="sm">
                        Review <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Lifecycle Event History ({completedEvents.length})
          </CardTitle>
          <CardDescription>Completed lifecycle events across the portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          {completedEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 text-center">
              <FileSearch className="h-6 w-6 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">No completed lifecycle events yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedEvents.map((ev) => {
                const asset = assetById.get(ev.assetId);
                return (
                  <div
                    key={ev.id}
                    className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getEventTypeIcon(ev.eventType)}
                        <p className="font-medium text-gray-900 dark:text-gray-100">{ev.title}</p>
                        <Badge className={getEventTypeColor(ev.eventType)} variant="outline">
                          {getEventTypeLabel(ev.eventType)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <span>{asset?.name ?? ev.assetId.slice(0, 8)}</span>
                        {ev.completedDate && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(ev.completedDate).toLocaleDateString()}
                            </span>
                          </>
                        )}
                        {ev.vendor && (
                          <>
                            <span>·</span>
                            <span>{ev.vendor}</span>
                          </>
                        )}
                        {ev.cost != null && (
                          <>
                            <span>·</span>
                            <span>${ev.cost.toLocaleString()}</span>
                          </>
                        )}
                      </p>
                      {ev.description && (
                        <p className="text-xs text-gray-500 mt-1">{ev.description}</p>
                      )}
                    </div>
                    <Link to={`/inventory/${ev.assetId}`}>
                      <Button variant="outline" size="sm">
                        View Asset <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Lifecycle;