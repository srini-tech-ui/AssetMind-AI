"use client";

import React from "react";

type EvidenceCitationProps = {
  evidence: {
    id: string;
    source: string;
    description: string;
    timestamp: string; // ISO date
    confidence: number; // 0-1
  };
};

export const EvidenceCitation: React.FC<EvidenceCitationProps> = ({
  evidence,
}) => {
  const date = new Date(evidence.timestamp).toLocaleDateString();
  return (
    <div className="border-l-4 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900 p-3 mb-2">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            {evidence.source}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            {evidence.description}
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-3">
            <span>{date}</span>
            <span>
              Confidence: {Math.round(evidence.confidence * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceCitation;