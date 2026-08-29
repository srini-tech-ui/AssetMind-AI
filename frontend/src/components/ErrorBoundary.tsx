"use client";

import React from "react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
  errorMessage?: string;
};

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, errorMessage }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    setHasError(false);
    setError(null);
  }, []);

  if (hasError) {
    return (
      <div className="p-4 bg-destructive text-white">
        <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
        <p className="text-sm">{errorMessage || error?.message}</p>
        <button
          onClick={() => setHasError(false)}
          className="mt-2 inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
        >
          Retry
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ErrorBoundary;