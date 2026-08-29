"use client";

import React from "react";

type EmptyStateProps = {
  message: string;
  illustration?: React.ReactNode;
};

export const EmptyState: React.FC<EmptyStateProps> = ({ message, illustration }) => {
  return (
    <div className="text-center py-16">
      {illustration && <div className="mb-4">{illustration}</div>}
      <h3 className="text-xl font-medium mb-2">{message}</h3>
      <p className="text-muted">{/* description */}</p>
    </div>
  );
};

export default EmptyState;