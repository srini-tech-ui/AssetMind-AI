"use client";

import React from "react";

type SourceChipProps = {
  source: string;
  label?: string;
};

export const SourceChip: React.FC<SourceChipProps> = ({
  source,
  label = "Source",
}) => {
  return (
    <span className="px-2 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-600 rounded-full">
      {label}: {source}
    </span>
  );
};

export default SourceChip;