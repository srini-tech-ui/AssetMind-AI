/**
 * Phase 2.1: Mock Explainability/Evidence Data
 * 
 * Development/demo data only. No backend connected.
 */
import { Evidence } from "@/types/reporting";

export const mockExplainabilityData = {
  recommendations: {
    "rec-001": {
      recommendation: "Upgrade Web Server 01 storage from HDD to SSD to improve I/O performance by an estimated 40%.",
      reasoningSummary: "Analysis of disk I/O metrics shows consistent bottlenecks during peak hours. SSD migration is the most cost-effective solution with a projected ROI of 8 months.",
      confidence: 0.85,
      dataFreshness: "Last updated 2 hours ago",
      policyRule: "IT-OPS-004: Performance optimization must be approved by IT Manager.",
      impact: "Improved page load times by ~40% for all web-facing services.",
      recommendedAction: "Procure SSD drives and schedule maintenance window for migration.",
      approvalRequired: true,
      evidence: [
        {
          id: "evidence-rec-001-1",
          source: "Performance Monitoring System",
          description: "Disk I/O wait times exceeded 200ms threshold for 72 consecutive hours during peak load.",
          timestamp: "2024-12-03T00:00:00Z",
          confidence: 0.92,
        },
        {
          id: "evidence-rec-001-2",
          source: "User Experience Analytics",
          description: "Page load times increased 35% over the past month correlating with disk I/O bottlenecks.",
          timestamp: "2024-12-02T00:00:00Z",
          confidence: 0.88,
        },
      ],
    },
    "rec-002": {
      recommendation: "Implement data tiering to move infrequently accessed data to cheaper storage tiers.",
      reasoningSummary: "Storage utilization analysis shows 35% of data has not been accessed in over 90 days. Tiering this data to lower-cost storage could reduce annual storage costs significantly.",
      confidence: 0.72,
      dataFreshness: "Last updated 1 day ago",
      policyRule: "IT-DATA-002: Data retention and tiering policies must comply with SOX requirements.",
      impact: "Estimated annual savings of $12,000 on storage costs with minimal performance impact.",
      recommendedAction: "Implement automated data tiering policy and validate compliance with SOX.",
      approvalRequired: true,
      evidence: [
        {
          id: "evidence-rec-002-1",
          source: "Storage Analytics Platform",
          description: "35% of stored data has zero access events in the last 90 days.",
          timestamp: "2024-11-28T00:00:00Z",
          confidence: 0.9,
        },
        {
          id: "evidence-rec-002-2",
          source: "Cost Management System",
          description: "Current storage costs trending 15% above budget forecast.",
          timestamp: "2024-11-25T00:00:00Z",
          confidence: 0.85,
        },
      ],
    },
    "rec-003": {
      recommendation: "Migrate cloud database from on-demand to reserved instances for 30% annual savings.",
      reasoningSummary: "Cloud database has been running on-demand for 10 months with stable, predictable usage patterns. Reserved instances offer significant cost savings with no operational impact.",
      confidence: 0.9,
      dataFreshness: "Last updated 5 hours ago",
      policyRule: "IT-CLOUD-001: All cloud resources must be optimized for cost efficiency.",
      impact: "Estimated annual savings of $5,400 with no change to database performance or availability.",
      recommendedAction: "Purchase 1-year reserved instances for the RDS PostgreSQL instance.",
      approvalRequired: true,
      evidence: [
        {
          id: "evidence-rec-003-1",
          source: "AWS Cost Explorer",
          description: "On-demand RDS instance costs $18,000/year. Reserved instance equivalent is $12,600/year.",
          timestamp: "2024-12-04T00:00:00Z",
          confidence: 0.95,
        },
        {
          id: "evidence-rec-003-2",
          source: "CloudWatch Metrics",
          description: "CPU utilization has been stable at 40-60% for the past 10 months.",
          timestamp: "2024-12-03T00:00:00Z",
          confidence: 0.91,
        },
      ],
    },
  },
};

export function getExplainabilityForRecommendation(
  recommendationId: string
): {
  recommendation: string;
  reasoningSummary: string;
  confidence: number;
  dataFreshness: string;
  policyRule: string;
  impact: string;
  recommendedAction: string;
  approvalRequired: boolean;
  evidence: Evidence[];
} | undefined {
  return mockExplainabilityData.recommendations[recommendationId];
}

export function getAllExplainabilityEvidence(): Record<string, Evidence[]> {
  const result: Record<string, Evidence[]> = {};
  for (const [recId, data] of Object.entries(mockExplainabilityData.recommendations)) {
    result[recId] = data.evidence;
  }
  return result;
}