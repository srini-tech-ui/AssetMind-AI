"use client";

import React from "react";

export const EnvironmentBanner: React.FC = () => {
  const mode = import.meta.env.VITE_APP_ENV || 
               (import.meta.env.DEV ? "development" : "production");
  const isDev = mode === "development";
  const useMocks = import.meta.env.VITE_USE_MOCKS === "true";

  const bgColor = isDev ? "bg-yellow-50 dark:bg-yellow-900" : "bg-blue-50 dark:bg-blue-900";
  const borderColor = isDev ? "border-yellow-400 dark:border-yellow-500" : "border-blue-400 dark:border-blue-500";
  const textColor = isDev ? "text-yellow-800 dark:text-yellow-100" : "text-blue-800 dark:text-blue-100";
  const badgeColor = isDev ? "bg-yellow-200 dark:bg-yellow-800" : "bg-blue-200 dark:bg-blue-800";

  return (
    <div className={`${bgColor} ${borderColor} border-l-4 py-2`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${textColor}`}>
            Environment: <span className="font-mono">{mode}</span>
            {isDev && (
              <>
                <span className="ml-2 px-3 py-0.5 text-xs font-semibold rounded-full">
                  Development Mode
                </span>
                <span className="ml-2 px-3 py-0.5 text-xs font-semibold rounded-full">
                  Authentication not connected
                </span>
              </>
            )}
            {useMocks && (
              <span className="ml-2 px-3 py-0.5 text-xs font-semibold rounded-full">
                Mock Data Enabled
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentBanner;