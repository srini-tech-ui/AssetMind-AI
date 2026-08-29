"use client";

import React from "react";
import EvidenceCitation from "./EvidenceCitation";

type EvidenceListProps = {
  evidence: {
    id: string;
    source: string;
    description: string;
    timestamp: string; // ISO date
    confidence: number; // 0-1
  }[];
};

export const EvidenceList: React.FC<EvidenceListProps> = ({ evidence }) => {
  if (evidence.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 italic">
        No evidence available.
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-medium mb-2">Evidence</h3>
      <div className="space-y-2">
        {evidence.map((ev) => (
          <EvidenceCitation key={ev.id} evidence={ev} />
        ))}
      </div>
    </div>
  );
};

export default EvidenceList;