"use client";

import React from "react";

type GuardrailNoticeProps = {
  message: string;
  type: "warning" | "info" | "error";
};

export const GuardrailNotice: React.FC<GuardrailNoticeProps> = ({
  message,
  type = "info",
}) => {
  const getVariant = (t: GuardrailNoticeProps["type"]) => {
    switch (t) {
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 dark:border-yellow-500";
      case "error":
        return "bg-red-50 dark:bg-red-900 border-l-4 border-red-400 dark:border-red-500";
      case "info":
      default:
        return "bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 dark:border-blue-500";
    }
  };

  const getIcon = (t: GuardrailNoticeProps["type"]) => {
    switch (t) {
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      case "info":
      default:
        return "ℹ️";
    }
  };

  return (
    <div className={`${getVariant(type)} p-4 mb-4`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon(type)}
        </div>
        <div className="ml-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default GuardrailNotice;