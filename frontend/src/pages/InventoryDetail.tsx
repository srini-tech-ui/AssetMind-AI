"use client";

import React from "react";
import { useParams, Link } from "react-router-dom";
import { useMockAssetById, useMockRisksByAsset, useMockLifecycleByAsset, useMockCostsByAsset, useMockRecommendationsByAsset } from "@/mocks/mockAdapter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, AlertCircle, CheckCircle, Wrench, Pause, Archive, Box, DollarSign, Clock, User, Building, Tag, Calendar, MapPin } from "lucide-react";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "inactive":
      return <Pause className="h-5 w-5 text-yellow-500" />;
    case "maintenance":
      return <Wrench className="h-5 w-5 text-blue-500" />;
    case "retired":
    case "disposed":
      return <Archive className="h-5 w-5 text-gray-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-400" />;
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
    case "disposed":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "server":
      return "bg-purple-100 text-purple-800";
    case "laptop":
      return "bg-blue-100 text-blue-800";
    case "mobile":
      return "bg-green-100 text-green-800";
    case "network":
      return "bg-orange-100 text-orange-800";
    case "storage":
      return "bg-cyan-100 text-cyan-800";
    case "cloud":
      return "bg-indigo-100 text-indigo-800";
    case "software":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | undefined }) => (
  <div className="flex items-center py-2">
    <Icon className="h-4 w-4 text-gray-400 mr-3" />
    <span className="text-gray-500 text-sm w-32">{label}</span>
    <span className="text-gray-900 dark:text-gray-100 text-sm font-medium">{value || "-"}</span>
  </div>
);

const InventoryDetail = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const { data: asset, isLoading: assetLoading, error: assetError } = useMockAssetById(assetId || "");
  const { data: risks } = useMockRisksByAsset(assetId || "");
  const { data: lifecycle } = useMockLifecycleByAsset(assetId || "");
  const { data: costs } = useMockCostsByAsset(assetId || "");
  const { data: recommendations } = useMockRecommendationsByAsset(assetId || "");

  if (assetLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading asset details...</div>
      </div>
    );
  }

  if (assetError || !asset) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Asset Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">The requested asset does not exist or could not be loaded.</p>
        <Link to="/inventory">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
        </Link>
      </div>
    );
  }

  const totalCost = costs?.reduce((sum, c) => sum + c.amount, 0) || 0;
  const activeRisks = risks?.filter((r) => r.status === "open" || r.status === "in_progress").length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/inventory">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{asset.name}</h1>
            <p className="text-gray-500 text-sm font-mono mt-1">{asset.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getTypeColor(asset.type)} variant="outline">
            {asset.type}
          </Badge>
          <Badge className={getStatusColor(asset.status)} variant="outline">
            <div className="flex items-center gap-1">
              {getStatusIcon(asset.status)}
              {asset.status}
            </div>
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Risks</CardTitle>
            <AlertCircle className={`h-4 w-4 ${activeRisks > 0 ? "text-red-500" : "text-green-500"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${activeRisks > 0 ? "text-red-600" : "text-green-600"}`}>
              {activeRisks}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lifecycle Events</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lifecycle?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
            <Box className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recommendations?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
            <CardDescription>Core asset details and identification</CardDescription>
          </CardHeader>
          <CardContent>
            <InfoRow icon={Box} label="Asset ID" value={asset.id} />
            <InfoRow icon={Tag} label="Type" value={asset.type} />
            <InfoRow icon={CheckCircle} label="Status" value={asset.status} />
            <InfoRow icon={Building} label="Manufacturer" value={asset.manufacturer} />
            <InfoRow icon={Box} label="Model" value={asset.model} />
            <InfoRow icon={Calendar} label="Serial Number" value={asset.serialNumber} />
          </CardContent>
        </Card>

        {/* Ownership & Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ownership & Assignment</CardTitle>
            <CardDescription>Ownership and organizational assignment</CardDescription>
          </CardHeader>
          <CardContent>
            <InfoRow icon={User} label="Owner ID" value={asset.ownerId} />
            <InfoRow icon={Building} label="Business Unit" value={asset.businessUnitId} />
            <InfoRow icon={MapPin} label="Location" value={asset.locationId} />
            <InfoRow icon={DollarSign} label="Cost Center" value={asset.costCenter} />
            <Separator className="my-2" />
            <div className="py-2">
              <span className="text-gray-500 text-sm">Tags</span>
              <div className="flex flex-wrap gap-1 mt-2">
                {asset.tags && asset.tags.length > 0 ? (
                  asset.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No tags</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dates & Warranty */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dates & Warranty</CardTitle>
            <CardDescription>Purchase and warranty information</CardDescription>
          </CardHeader>
          <CardContent>
            <InfoRow icon={Calendar} label="Purchase Date" value={asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : undefined} />
            <InfoRow icon={Calendar} label="Warranty Expiry" value={asset.warrantyExpiry ? new Date(asset.warrantyExpiry).toLocaleDateString() : undefined} />
            <InfoRow icon={Calendar} label="Created" value={new Date(asset.createdAt).toLocaleDateString()} />
            <InfoRow icon={Calendar} label="Last Updated" value={new Date(asset.updatedAt).toLocaleDateString()} />
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Details</CardTitle>
            <CardDescription>Additional asset metadata and configuration</CardDescription>
          </CardHeader>
          <CardContent>
            {asset.metadata && Object.keys(asset.metadata).length > 0 ? (
              Object.entries(asset.metadata).map(([key, value]) => (
                <InfoRow key={key} icon={Tag} label={key} value={String(value)} />
              ))
            ) : (
              <p className="text-gray-500 text-sm">No additional metadata</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Risks Section */}
      {risks && risks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Associated Risks ({risks.length})</CardTitle>
            <CardDescription>Risk items associated with this asset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {risks.map((risk) => (
                <div key={risk.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className={`h-4 w-4 ${
                      risk.severity === "critical" ? "text-red-500" :
                      risk.severity === "high" ? "text-orange-500" :
                      risk.severity === "medium" ? "text-yellow-500" : "text-blue-500"
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{risk.title}</p>
                      <p className="text-sm text-gray-500">{risk.category} • {risk.severity}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(risk.status)}>
                    {risk.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations Section */}
      {recommendations && recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommendations ({recommendations.length})</CardTitle>
            <CardDescription>AI-generated recommendations for this asset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{rec.title}</p>
                    <p className="text-sm text-gray-500">{rec.category} • {rec.priority} priority</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {rec.approvalRequired && (
                      <Badge variant="outline" className="text-amber-600 border-amber-200">
                        Approval Required
                      </Badge>
                    )}
                    <Badge variant="outline">{rec.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cost Entries */}
      {costs && costs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cost History ({costs.length})</CardTitle>
            <CardDescription>Financial records associated with this asset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {costs.map((cost) => (
                <div key={cost.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{cost.description}</p>
                    <p className="text-sm text-gray-500">
                      {cost.category} • {new Date(cost.date).toLocaleDateString()} • {cost.vendor || "No vendor"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-gray-100">
                      ${cost.amount.toLocaleString()} {cost.currency}
                    </p>
                    {cost.isRecurring && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {cost.recurrencePeriod}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lifecycle Events */}
      {lifecycle && lifecycle.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lifecycle Events ({lifecycle.length})</CardTitle>
            <CardDescription>Asset lifecycle history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lifecycle.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{event.title}</p>
                    <p className="text-sm text-gray-500">
                      {event.eventType} • {event.scheduledDate ? new Date(event.scheduledDate).toLocaleDateString() : "No date"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {event.cost && (
                      <span className="text-sm text-gray-600">${event.cost.toLocaleString()}</span>
                    )}
                    <Badge variant="outline">{event.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InventoryDetail;