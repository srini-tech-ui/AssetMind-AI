/**
 * Phase 2.1: Mock Cost Data
 * 
 * Development/demo data only. No backend connected.
 */
import { CostEntry, CostEntryListItem, AssetCostSummary } from "@/types/domain";

export const mockCostEntries: CostEntry[] = [
  {
    id: "cost-001",
    assetId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    category: "acquisition",
    amount: 12000,
    currency: "USD",
    date: "2023-06-15T00:00:00Z",
    description: "Dell PowerEdge R750 purchase",
    vendor: "Dell Technologies",
    invoiceNumber: "INV-2023-0615-001",
    costCenter: "CC-IT-001",
    isRecurring: false,
    tags: ["hardware", "server"],
    createdAt: "2023-06-15T10:00:00Z",
    updatedAt: "2023-06-15T10:00:00Z",
  },
  {
    id: "cost-002",
    assetId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    category: "maintenance",
    amount: 800,
    currency: "USD",
    date: "2024-12-05T00:00:00Z",
    description: "Quarterly maintenance and patching",
    vendor: "Dell Support",
    invoiceNumber: "INV-2024-1205-001",
    costCenter: "CC-IT-001",
    isRecurring: true,
    recurrencePeriod: "quarterly",
    tags: ["maintenance"],
    createdAt: "2024-12-05T09:00:00Z",
    updatedAt: "2024-12-05T09:00:00Z",
  },
  {
    id: "cost-003",
    assetId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    category: "support",
    amount: 2400,
    currency: "USD",
    date: "2024-01-01T00:00:00Z",
    description: "Annual ProSupport contract",
    vendor: "Dell Technologies",
    invoiceNumber: "INV-2024-0101-001",
    costCenter: "CC-IT-001",
    isRecurring: true,
    recurrencePeriod: "annually",
    tags: ["support"],
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-01T08:00:00Z",
  },
  {
    id: "cost-004",
    assetId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    category: "acquisition",
    amount: 3200,
    currency: "USD",
    date: "2024-01-20T00:00:00Z",
    description: "MacBook Pro 16-inch purchase",
    vendor: "Apple",
    invoiceNumber: "INV-2024-0120-001",
    costCenter: "CC-ENG-002",
    isRecurring: false,
    tags: ["hardware", "laptop"],
    createdAt: "2024-01-20T09:00:00Z",
    updatedAt: "2024-01-20T09:00:00Z",
  },
  {
    id: "cost-005",
    assetId: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    category: "maintenance",
    amount: 1500,
    currency: "USD",
    date: "2024-06-01T00:00:00Z",
    description: "Annual firmware support contract",
    vendor: "Cisco",
    invoiceNumber: "INV-2024-0601-001",
    costCenter: "CC-IT-001",
    isRecurring: true,
    recurrencePeriod: "annually",
    tags: ["support"],
    createdAt: "2024-06-01T08:00:00Z",
    updatedAt: "2024-06-01T08:00:00Z",
  },
  {
    id: "cost-006",
    assetId: "d4e5f6a7-b8c9-0123-defa-234567890123",
    category: "acquisition",
    amount: 85000,
    currency: "USD",
    date: "2022-11-05T00:00:00Z",
    description: "NetApp AFF A800 storage array",
    vendor: "NetApp",
    invoiceNumber: "INV-2022-1105-001",
    costCenter: "CC-DATA-003",
    isRecurring: false,
    tags: ["hardware", "storage"],
    createdAt: "2022-11-05T07:00:00Z",
    updatedAt: "2022-11-05T07:00:00Z",
  },
  {
    id: "cost-007",
    assetId: "e5f6a7b8-c9d0-1234-efab-345678901234",
    category: "license",
    amount: 18000,
    currency: "USD",
    date: "2024-02-01T00:00:00Z",
    description: "AWS RDS PostgreSQL annual license",
    vendor: "AWS",
    invoiceNumber: "INV-2024-0201-001",
    costCenter: "CC-IT-001",
    isRecurring: true,
    recurrencePeriod: "annually",
    tags: ["cloud", "license"],
    createdAt: "2024-02-01T12:00:00Z",
    updatedAt: "2024-02-01T12:00:00Z",
  },
  {
    id: "cost-008",
    assetId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    category: "infrastructure",
    amount: 3600,
    currency: "USD",
    date: "2024-01-01T00:00:00Z",
    description: "Annual rack space and power",
    vendor: "Data Center Provider",
    invoiceNumber: "INV-2024-0101-002",
    costCenter: "CC-IT-001",
    isRecurring: true,
    recurrencePeriod: "annually",
    tags: ["infrastructure"],
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-01T08:00:00Z",
  },
];

export function getCostsByAsset(assetId: string): CostEntry[] {
  return mockCostEntries.filter((c) => c.assetId === assetId);
}

export function getAssetCostSummary(assetId: string): AssetCostSummary | undefined {
  const costs = mockCostEntries.filter((c) => c.assetId === assetId);
  if (costs.length === 0) return undefined;

  const byCategory: Record<string, number> = {};
  costs.forEach((c) => {
    byCategory[c.category] = (byCategory[c.category] || 0) + c.amount;
  });

  const recurringMonthly = costs
    .filter((c) => c.isRecurring && c.recurrencePeriod === "monthly")
    .reduce((sum, c) => sum + c.amount / 12, 0);
  const recurringAnnual = costs
    .filter((c) => c.isRecurring && c.recurrencePeriod === "annually")
    .reduce((sum, c) => sum + c.amount, 0);
  const quarterlyAnnual = costs
    .filter((c) => c.isRecurring && c.recurrencePeriod === "quarterly")
    .reduce((sum, c) => sum + c.amount * 4, 0);

  return {
    assetId,
    totalCost: costs.reduce((sum, c) => sum + c.amount, 0),
    currency: "USD",
    byCategory,
    recurringMonthly,
    recurringAnnual: recurringAnnual + quarterlyAnnual,
    lastUpdated: costs.reduce((max, c) => (c.updatedAt > max ? c.updatedAt : max), costs[0]?.createdAt || ""),
  };
}

export function getCostSummaryByPeriod(): Record<string, number> {
  const summary: Record<string, number> = {};
  mockCostEntries.forEach((c) => {
    const year = new Date(c.date).getFullYear().toString();
    summary[year] = (summary[year] || 0) + c.amount;
  });
  return summary;
}

export function getCostEntryListItems(): CostEntryListItem[] {
  return mockCostEntries.map(
    ({ id, assetId, category, amount, currency, date, isRecurring }) => ({
      id,
      assetId,
      category,
      amount,
      currency,
      date,
      isRecurring,
    })
  );
}