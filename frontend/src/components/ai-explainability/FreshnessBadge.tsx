"use client";

import React from "react";

type FreshnessBadgeProps = {
  timestamp: string; // ISO date string
  label?: string;
};

export const FreshnessBadge: React.FC<FreshnessBadgeProps> = ({
  timestamp,
  label = "Data Freshness",
}) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  let text: string;
  if (diffHours < 1) {
    text = "Just updated";
  } else if (diffHours < 24) {
    text = `${diffHours} hours ago`;
  } else {
    const diffDays = Math.floor(diffHours / 24);
    text = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }

  return (
    <span className="px-2 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-600 rounded-full">
      {label}: {text}
    </span>
  );
};

export default FreshnessBadge;