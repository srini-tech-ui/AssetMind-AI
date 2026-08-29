export interface ReportPayload {
  title: string;
  generatedAt: string; // ISO date string
  sections: ReportSection[];
}

export interface ReportSection {
  id: string;
  title: string;
  content: string; // Could be HTML or markdown, but for Phase 1 we keep it simple
  chartData?: ChartData;
  historicalChartData?: HistoricalChartData;
  dataTable?: DataTable;
  evidence?: Evidence[];
  recommendations?: Recommendation[];
}

export interface ChartData {
  type: "bar" | "line" | "pie" | "doughnut" | "radar" | "polarArea";
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface HistoricalChartData {
  type: "line"; // For simplicity, we assume line chart for historical data
  labels: string[]; // Time periods (e.g., months)
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor?: string;
    fill: boolean;
    tension?: number;
  }[];
}

export interface DataTable {
  columns: {
    key: string;
    label: string;
  }[];
  rows: Record<string, any>[];
}

export interface Evidence {
  id: string;
  source: string; // e.g., "Asset Management System", "CMDB", "Log File"
  description: string;
  timestamp: string; // ISO date string
  confidence: number; // 0 to 1
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  evidenceIds: string[]; // References to evidence items
  affectedAssets: string[]; // Asset IDs
  approvalRequired: boolean;
}

export interface AuditInfo {
  generatedBy: string; // User ID or name
  generatedAt: string; // ISO date string
  version: string;
  parameters: Record<string, any>; // Filters, etc.
}

// Backend exporter interface (frontend contract)
export interface BackendExporter {
  exportReport: (payload: ReportPayload, format: "docx" | "pdf" | "xlsx" | "csv") => Promise<Blob>;
}

// Report service interface (frontend contract)
export interface ReportService {
  generateReport: (filters: Record<string, any>) => Promise<ReportPayload>;
  getReportTemplates: () => Promise<string[]>;
}