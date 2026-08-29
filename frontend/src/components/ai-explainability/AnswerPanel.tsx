"use client";

import React from "react";

type AnswerPanelProps = {
  recommendation: string;
  reasoningSummary: string;
  confidence: number; // 0-1
  dataFreshness: string; // e.g., "Last updated 2 hours ago"
  policyRule: string;
  impact: string;
  recommendedAction: string;
  approvalRequired: boolean;
  evidenceCount: number;
};

export const AnswerPanel: React.FC<AnswerPanelProps> = ({
  recommendation,
  reasoningSummary,
  confidence,
  dataFreshness,
  policyRule,
  impact,
  recommendedAction,
  approvalRequired,
  evidenceCount,
}) => {
  return (
    <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          AI Recommendation
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{recommendation}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
          <h3 className="font-medium mb-2">Reasoning Summary</h3>
          <p className="text-sm text-gray-700 dark:text-gray-200">{reasoningSummary}</p>
        </div>

        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
          <h3 className="font-medium mb-2">Evidence & Confidence</h3>
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <ConfidenceMeter confidence={confidence} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {evidenceCount} evidence items
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
          <h3 className="font-medium mb-2">Context</h3>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Data Freshness:</span>
              <span className="ml-2">{dataFreshness}</span>
            </div>
            <div>
              <span className="font-medium">Policy/Rule:</span>
              <span className="ml-2">{policyRule}</span>
            </div>
            <div>
              <span className="font-medium">Impact:</span>
              <span className="ml-2">{impact}</span>
            </div>
            <div>
              <span className="font-medium">Recommended Action:</span>
              <span className="ml-2">{recommendedAction}</span>
            </div>
            <div>
              <span className="font-medium">Approval Required:</span>
              <span className="ml-2">
                {approvalRequired ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Insufficient evidence notice */}
      <div className="border rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900">
        <h3 className="font-medium mb-2">Notice</h3>
        <p className="text-sm text-yellow-800 dark:text-yellow-100">
          Insufficient evidence to provide a reliable recommendation.
        </p>
      </div>
    </div>
  );
};

// ConfidenceMeter sub-component
const ConfidenceMeter: React.FC<{ confidence: number }> = ({ confidence }) => {
  const confidencePercent = Math.round(confidence * 100);
  const getConfidenceColor = (c: number) => {
    if (c < 0.5) return "text-red-500";
    if (c < 0.8) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="w-16 h-4 bg-gray-200 dark:bg-gray-600 rounded-full relative overflow-hidden">
        <div
          className={`h-full w-${confidencePercent}% bg-${getConfidenceColor(confidence)} transition-width duration-500`}
        ></div>
      </div>
      <span className="text-sm font-medium">{confidencePercent}%</span>
    </div>
  );
};

export default AnswerPanel;