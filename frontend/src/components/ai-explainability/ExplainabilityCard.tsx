"use client";

import React from "react";
import AnswerPanel from "./AnswerPanel";
import EvidenceList from "./EvidenceList";
import { Evidence } from "@/types/reporting"; // Adjust the path if needed

type ExplainabilityCardProps = {
  recommendation: string;
  reasoningSummary: string;
  confidence: number;
  dataFreshness: string;
  policyRule: string;
  impact: string;
  recommendedAction: string;
  approvalRequired: boolean;
  evidence: Evidence[];
};

export const ExplainabilityCard: React.FC<ExplainabilityCardProps> = ({
  recommendation,
  reasoningSummary,
  confidence,
  dataFreshness,
  policyRule,
  impact,
  recommendedAction,
  approvalRequired,
  evidence,
}) => {
  return (
    <div className="space-y-6">
      <AnswerPanel
        recommendation={recommendation}
        reasoningSummary={reasoningSummary}
        confidence={confidence}
        dataFreshness={dataFreshness}
        policyRule={policyRule}
        impact={impact}
        recommendedAction={recommendedAction}
        approvalRequired={approvalRequired}
        evidenceCount={evidence.length}
      />
      <EvidenceList evidence={evidence} />
    </div>
  );
};

export default ExplainabilityCard;