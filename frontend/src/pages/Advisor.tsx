"use client";

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMockAssets } from "@/mocks/mockAdapter";
import { mockAssetOwners } from "@/mocks/owners";
import { mockRisks } from "@/mocks/risks";
import { mockComplianceRecords } from "@/mocks/compliance";
import { mockReconciliations } from "@/mocks/reconciliation";
import { mockLifecycleEvents } from "@/mocks/lifecycle";
import { mockCostEntries } from "@/mocks/costs";
import { mockRecommendations } from "@/mocks/recommendations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Box,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileSearch,
  GitCompare,
  Info,
  Lightbulb,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  User,
  Users,
  Wrench,
} from "lucide-react";
import {
  AdvisorPriority,
  AdvisorRecommendation,
  buildAdvisorRecommendations,
  summarizeSignals,
} from "@/utils/advisor";

const getPriorityStyles = (priority: AdvisorPriority) => {
  switch (priority) {
    case "high":
      return { badge: "bg-red-100 text-red-800 border-red-200", icon: <AlertTriangle className="h-4 w-4 text-red-500" /> };
    case "medium":
      return { badge: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: <AlertCircle className="h-4 w-4 text-yellow-500" /> };
    case "low":
      return { badge: "bg-blue-100 text-blue-800 border-blue-200", icon: <Info className="h-4 w-4 text-blue-500" /> };
    case "info":
    default:
      return { badge: "bg-gray-100 text-gray-800 border-gray-200", icon: <Info className="h-4 w-4 text-gray-500" /> };
  }
};

const getCategoryIcon = (cat: AdvisorRecommendation["category"]) => {
  switch (cat) {
    case "risk":
      return <ShieldAlert className="h-4 w-4" />;
    case "ownership":
      return <Users className="h-4 w-4" />;
    case "lifecycle":
      return <Clock className="h-4 w-4" />;
    case "cost":
      return <DollarSign className="h-4 w-4" />;
    case "compliance":
      return <Shield className="h-4 w-4" />;
    case "reconciliation":
      return <GitCompare className="h-4 w-4" />;
  }
};

const getCategoryLabel = (cat: AdvisorRecommendation["category"]) => {
  switch (cat) {
    case "risk":
      return "Risk";
    case "ownership":
      return "Ownership";
    case "lifecycle":
      return "Lifecycle";
    case "cost":
      return "Cost";
    case "compliance":
      return "Compliance";
    case "reconciliation":
      return "Reconciliation";
  }
};

const getPriorityLabel = (p: AdvisorPriority) => {
  switch (p) {
    case "high":
      return "High Priority";
    case "medium":
      return "Medium Priority";
    case "low":
      return "Low Priority";
    case "info":
      return "Informational";
  }
};

const Advisor = () => {
  const { data: assets, isLoading: assetsLoading, error: assetsError } = useMockAssets();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  // Build advisor context from existing mock data (no duplication)
  const advisorContext = useMemo(
    () => ({
      assets: assets ?? [],
      owners: mockAssetOwners,
      risks: mockRisks,
      lifecycle: mockLifecycleEvents,
      costs: mockCostEntries,
      compliance: mockComplianceRecords,
      reconciliations: mockReconciliations,
      recommendations: mockRecommendations,
    }),
    [assets]
  );

  // All advisor findings
  const allRecommendations = useMemo(
    () => buildAdvisorRecommendations(advisorContext),
    [advisorContext]
  );

  const signals = useMemo(() => summarizeSignals(allRecommendations), [allRecommendations]);

  // Top recommendations (high/medium priority)
  const priorityRecommendations = useMemo(
    () => allRecommendations.filter((r) => r.priority === "high" || r.priority === "medium"),
    [allRecommendations]
  );

  // Asset selection: search/filter
  const filteredAssets = useMemo(() => {
    if (!assets) return [];
    return assets.filter((a) => {
      const matchesSearch =
        searchTerm === "" ||
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || a.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [assets, searchTerm, typeFilter]);

  const selectedAsset = useMemo(() => {
    if (!selectedAssetId || !assets) return null;
    return assets.find((a) => a.id === selectedAssetId) ?? null;
  }, [assets, selectedAssetId]);

  // Asset-specific findings
  const assetFindings = useMemo(() => {
    if (!selectedAssetId) return [];
    return allRecommendations.filter((r) => r.assetId === selectedAssetId);
  }, [allRecommendations, selectedAssetId]);

  // Total cost for the selected asset
  const selectedAssetCost = useMemo(() => {
    if (!selectedAssetId) return 0;
    return mockCostEntries
      .filter((c) => c.assetId === selectedAssetId)
      .reduce((sum, c) => sum + c.amount, 0);
  }, [selectedAssetId]);

  const clearAssetSelection = () => {
    setSelectedAssetId(null);
    setSearchTerm("");
    setTypeFilter("all");
  };

  if (assetsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Advisor Unavailable</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Unable to load advisor data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-blue-600" />
          AI Asset Advisor
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Deterministic advisory insights derived from existing application data. Highlights asset risks,
          ownership gaps, lifecycle concerns, cost opportunities, compliance gaps, and reconciliation mismatches.
        </p>
      </div>

      {/* Advisory Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Advisory Summary
          </CardTitle>
          <CardDescription>
            Signals detected across the portfolio from existing data sources.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <SignalTile icon={<ShieldAlert className="h-4 w-4" />} label="Risk" count={signals.risk} tone={signals.risk > 0 ? "warn" : "ok"} />
            <SignalTile icon={<Users className="h-4 w-4" />} label="Ownership" count={signals.ownership} tone={signals.ownership > 0 ? "warn" : "ok"} />
            <SignalTile icon={<Clock className="h-4 w-4" />} label="Lifecycle" count={signals.lifecycle} tone={signals.lifecycle > 0 ? "info" : "ok"} />
            <SignalTile icon={<DollarSign className="h-4 w-4" />} label="Cost" count={signals.cost} tone={signals.cost > 0 ? "info" : "ok"} />
            <SignalTile icon={<Shield className="h-4 w-4" />} label="Compliance" count={signals.compliance} tone={signals.compliance > 0 ? "warn" : "ok"} />
            <SignalTile icon={<GitCompare className="h-4 w-4" />} label="Reconciliation" count={signals.reconciliation} tone={signals.reconciliation > 0 ? "info" : "ok"} />
          </div>
        </CardContent>
      </Card>

      {/* Priority Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Priority Recommendations
          </CardTitle>
          <CardDescription>
            {priorityRecommendations.length === 0
              ? "No high or medium priority findings detected."
              : `${priorityRecommendations.length} high or medium priority finding${priorityRecommendations.length === 1 ? "" : "s"} requiring attention.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assetsLoading ? (
            <div className="flex items-center justify-center h-24 text-gray-500">Loading advisor data...</div>
          ) : priorityRecommendations.length === 0 ? (
            <EmptyState message="No priority actions identified from the available data." />
          ) : (
            <div className="space-y-3">
              {priorityRecommendations.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Advisor Findings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            All Advisor Findings
          </CardTitle>
          <CardDescription>
            Complete advisory list including low-priority and informational items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allRecommendations.length === 0 ? (
            <EmptyState message="No advisor findings available from the current data." />
          ) : (
            <div className="space-y-3">
              {allRecommendations.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Asset-Specific Advisor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Box className="h-5 w-5 text-indigo-500" />
            Asset-Specific Advisor
          </CardTitle>
          <CardDescription>
            Search for an asset to view its dedicated advisory findings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by asset name, ID, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="server">Server</SelectItem>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="network">Network</SelectItem>
                <SelectItem value="storage">Storage</SelectItem>
                <SelectItem value="cloud">Cloud</SelectItem>
                <SelectItem value="software">Software</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedAsset ? (
            <AssetAdvisorPanel
              asset={selectedAsset}
              findings={assetFindings}
              totalCost={selectedAssetCost}
              onClear={clearAssetSelection}
            />
          ) : (
            <div className="space-y-2">
              {assetsLoading ? (
                <div className="flex items-center justify-center h-16 text-gray-500">Loading assets...</div>
              ) : filteredAssets.length === 0 ? (
                <EmptyState message="No assets match your search." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredAssets.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setSelectedAssetId(a.id)}
                      className="text-left p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{a.name}</p>
                          <p className="text-xs text-gray-500 font-mono">{a.id.slice(0, 8)}...</p>
                        </div>
                        <Badge variant="outline" className="text-xs">{a.type}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const SignalTile: React.FC<{
  icon: React.ReactNode;
  label: string;
  count: number;
  tone: "ok" | "warn" | "info";
}> = ({ icon, label, count, tone }) => {
  const toneClass =
    tone === "warn"
      ? "border-red-200 bg-red-50 text-red-700"
      : tone === "info"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : "border-green-200 bg-green-50 text-green-700";
  return (
    <div className={`flex items-center justify-between p-3 border rounded-lg ${toneClass}`}>
      <div className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {label}
      </div>
      <span className="text-lg font-bold">{count}</span>
    </div>
  );
};

const RecommendationCard: React.FC<{ rec: AdvisorRecommendation }> = ({ rec }) => {
  const styles = getPriorityStyles(rec.priority);
  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          {styles.icon}
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{rec.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                {getCategoryIcon(rec.category)}
                {getCategoryLabel(rec.category)}
              </Badge>
              <Badge className={styles.badge}>{getPriorityLabel(rec.priority)}</Badge>
              {rec.evidenceCount > 0 && (
                <span className="text-xs text-gray-500">{rec.evidenceCount} evidence</span>
              )}
            </div>
          </div>
        </div>
        {rec.route && rec.assetId && (
          <Link to={rec.route}>
            <Button variant="outline" size="sm">
              {rec.routeLabel ?? "View"} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        )}
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
        <p>
          <span className="font-medium">Finding:</span> {rec.finding}
        </p>
        <p>
          <span className="font-medium">Why it matters:</span> {rec.whyItMatters}
        </p>
        <p>
          <span className="font-medium">Recommended action:</span> {rec.recommendedAction}
        </p>
      </div>
    </div>
  );
};

const AssetAdvisorPanel: React.FC<{
  asset: ReturnType<typeof Object>;
  findings: AdvisorRecommendation[];
  totalCost: number;
  onClear: () => void;
}> = ({ asset, findings, totalCost, onClear }) => {
  const a = asset as import("@/types/domain").Asset;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-lg bg-indigo-50 dark:bg-indigo-950 border-indigo-200">
        <div>
          <p className="text-sm text-indigo-700 dark:text-indigo-200 font-medium">Selected asset</p>
          <p className="text-xl font-bold text-indigo-900 dark:text-indigo-100">{a.name}</p>
          <p className="text-xs text-indigo-700 dark:text-indigo-300 font-mono">{a.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{a.type}</Badge>
          <Badge variant="outline">{a.status}</Badge>
          <Link to={`/inventory/${a.id}`}>
            <Button variant="outline" size="sm">
              View Asset <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <MiniStat icon={<Box className="h-4 w-4" />} label="Type" value={a.type} />
        <MiniStat icon={<User className="h-4 w-4" />} label="Owner" value={a.ownerId ?? "Unassigned"} />
        <MiniStat icon={<DollarSign className="h-4 w-4" />} label="Total Cost" value={`$${totalCost.toLocaleString()}`} />
        <MiniStat
          icon={<Calendar className="h-4 w-4" />}
          label="Purchase Date"
          value={a.purchaseDate ? new Date(a.purchaseDate).toLocaleDateString() : "—"}
        />
        <MiniStat
          icon={<Wrench className="h-4 w-4" />}
          label="Warranty Expiry"
          value={a.warrantyExpiry ? new Date(a.warrantyExpiry).toLocaleDateString() : "—"}
        />
        <MiniStat
          icon={<ShieldAlert className="h-4 w-4" />}
          label="Open Risks"
          value={mockRisks.filter((r) => r.assetId === a.id && (r.status === "open" || r.status === "in_progress")).length}
        />
      </div>

      <div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Advisory Findings for this Asset</h3>
        {findings.length === 0 ? (
          <EmptyState message="No specific findings for this asset. It looks well-governed based on available data." />
        ) : (
          <div className="space-y-3">
            {findings.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MiniStat: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-center gap-2 p-3 border rounded-lg bg-white dark:bg-gray-800">
    <div className="text-gray-400">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-24 text-center">
    <CheckCircle2 className="h-6 w-6 text-green-500 mb-2" />
    <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
  </div>
);

export default Advisor;