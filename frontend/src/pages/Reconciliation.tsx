"use client";

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMockReconciliations } from "@/mocks/mockAdapter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, AlertCircle, CheckCircle, Eye, GitCompare, Clock, ArrowRight, FileSearch } from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "matched":
      return "bg-green-100 text-green-800 border-green-200";
    case "unmatched":
      return "bg-red-100 text-red-800 border-red-200";
    case "needs_review":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "matched":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "unmatched":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "needs_review":
      return <Eye className="h-4 w-4 text-yellow-500" />;
    default:
      return <FileSearch className="h-4 w-4 text-gray-400" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "matched":
      return "Matched";
    case "unmatched":
      return "Unmatched";
    case "needs_review":
      return "Needs Review";
    default:
      return status;
  }
};

const Reconciliation = () => {
  const { data: reconciliations, isLoading, error } = useMockReconciliations();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredReconciliations = useMemo(() => {
    if (!reconciliations) return [];
    return reconciliations.filter((recon) => {
      const matchesSearch =
        searchTerm === "" ||
        recon.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recon.sourceSystem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recon.targetSystem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (recon.difference?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesStatus = statusFilter === "all" || recon.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reconciliations, searchTerm, statusFilter]);

  const summary = useMemo(() => {
    if (!reconciliations) {
      return { total: 0, matched: 0, unmatched: 0, needsReview: 0 };
    }
    return {
      total: reconciliations.length,
      matched: reconciliations.filter((r) => r.status === "matched").length,
      unmatched: reconciliations.filter((r) => r.status === "unmatched").length,
      needsReview: reconciliations.filter((r) => r.status === "needs_review").length,
    };
  }, [reconciliations]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Error Loading Reconciliation Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Unable to load reconciliation records. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Reconciliation</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Compare asset records across systems to identify matches, mismatches, and items requiring review
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <GitCompare className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matched</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary.matched}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unmatched</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.unmatched}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Review</CardTitle>
            <Eye className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{summary.needsReview}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
          <CardDescription>Find reconciliation records by asset, system, or difference</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by asset, system, or difference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="matched">Matched</SelectItem>
                <SelectItem value="unmatched">Unmatched</SelectItem>
                <SelectItem value="needs_review">Needs Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reconciliation Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reconciliation Records ({filteredReconciliations.length})</CardTitle>
          <CardDescription>
            {filteredReconciliations.length === (reconciliations?.length || 0)
              ? "Showing all records"
              : `Showing ${filteredReconciliations.length} of ${reconciliations?.length || 0} records`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">Loading reconciliation records...</div>
            </div>
          ) : filteredReconciliations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32">
              <FileSearch className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500">No reconciliation records match your search criteria</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Source System</TableHead>
                    <TableHead>Target System</TableHead>
                    <TableHead>Expected</TableHead>
                    <TableHead>Actual</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Checked</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReconciliations.map((recon) => (
                    <TableRow key={recon.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{recon.assetName}</div>
                          <div className="text-xs text-gray-500 font-mono">{recon.assetId.slice(0, 8)}...</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{recon.sourceSystem}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{recon.targetSystem}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                        {recon.expectedValue}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                        {recon.actualValue}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(recon.status)}
                          <Badge className={getStatusColor(recon.status)} variant="outline">
                            {getStatusLabel(recon.status)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(recon.lastChecked).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          to={`/inventory/${recon.assetId}`}
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

      {/* Difference Details for Items Needing Attention */}
      {filteredReconciliations.some((r) => r.difference) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Differences Detected
            </CardTitle>
            <CardDescription>Details of mismatches and items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredReconciliations
                .filter((r) => r.difference)
                .map((recon) => (
                  <div
                    key={recon.id}
                    className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(recon.status)}
                        <p className="font-medium text-gray-900 dark:text-gray-100">{recon.assetName}</p>
                        <Badge className={getStatusColor(recon.status)} variant="outline">
                          {getStatusLabel(recon.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                        <span className="font-medium">Difference:</span> {recon.difference}
                      </p>
                      {recon.notes && (
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Notes:</span> {recon.notes}
                        </p>
                      )}
                    </div>
                    <Link to={`/inventory/${recon.assetId}`}>
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

export default Reconciliation;