import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// Define the filter types
export interface FilterValues {
  dateRange: {
    start: string | null; // ISO date string
    end: string | null;   // ISO date string
  };
  assetType: string[];    // e.g., ["server", "laptop", "mobile"]
  location: string[];     // e.g., ["New York", "London"]
  businessUnit: string[]; // e.g., ["Finance", "HR"]
  owner: string[];        // e.g., ["John Doe", "Jane Smith"]
  risk: string[];         // e.g., ["low", "medium", "high"]
  compliance: string[];   // e.g., ["gdpr", "hipaa", "sox"]
  lifecycleState: string[]; // e.g., ["active", "retired", "maintenance"]
}

// Default filter values
const defaultFilters: FilterValues = {
  dateRange: { start: null, end: null },
  assetType: [],
  location: [],
  businessUnit: [],
  owner: [],
  risk: [],
  compliance: [],
  lifecycleState: [],
};

// Helper to parse a param as string array
const parseStringArray = (param: string | null): string[] => {
  if (!param) return [];
  try {
    return JSON.parse(param);
  } catch (e) {
    // If not JSON, treat as comma-separated string
    return param.split(",").filter((item) => item.trim() !== "");
  }
};

// Helper to stringify a string array
const stringifyStringArray = (arr: string[]): string => {
  return JSON.stringify(arr);
};

// Hook to manage filters
export const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterValues>(defaultFilters);

  // Initialize filters from URL on mount
  useEffect(() => {
    const urlFilters: FilterValues = {
      dateRange: {
        start: searchParams.get("dateRangeStart") || null,
        end: searchParams.get("dateRangeEnd") || null,
      },
      assetType: parseStringArray(searchParams.get("assetType")),
      location: parseStringArray(searchParams.get("location")),
      businessUnit: parseStringArray(searchParams.get("businessUnit")),
      owner: parseStringArray(searchParams.get("owner")),
      risk: parseStringArray(searchParams.get("risk")),
      compliance: parseStringArray(searchParams.get("compliance")),
      lifecycleState: parseStringArray(searchParams.get("lifecycleState")),
    };
    setFilters(urlFilters);
  }, [searchParams]);

  // Update URL when filters change
  const updateFilters = useCallback(
    (newFilters: Partial<FilterValues>) => {
      setFilters((prev) => {
        const updated = { ...prev, ...newFilters };
        // Update URL search params
        const params = new URLSearchParams(searchParams.toString());

        // Date range
        if (newFilters.dateRange !== undefined) {
          if (updated.dateRange.start) {
            params.set("dateRangeStart", updated.dateRange.start);
          } else {
            params.delete("dateRangeStart");
          }
          if (updated.dateRange.end) {
            params.set("dateRangeEnd", updated.dateRange.end);
          } else {
            params.delete("dateRangeEnd");
          }
        }

        // Array filters
        const arrayKeys: Array<keyof Pick<FilterValues, "assetType" | "location" | "businessUnit" | "owner" | "risk" | "compliance" | "lifecycleState">> = [
          "assetType",
          "location",
          "businessUnit",
          "owner",
          "risk",
          "compliance",
          "lifecycleState",
        ];
        arrayKeys.forEach((key) => {
          if (newFilters[key] !== undefined) {
            const value = updated[key];
            if (value.length > 0) {
              params.set(key, stringifyStringArray(value));
            } else {
              params.delete(key);
            }
          }
        });

        setSearchParams(params, { replace: true });
        return updated;
      });
    },
    [searchParams, setSearchParams]
  );

  // Reset filters to default and clear URL
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    const params = new URLSearchParams();
    // Clear all filter params
    ["dateRangeStart", "dateRangeEnd", "assetType", "location", "businessUnit", "owner", "risk", "compliance", "lifecycleState"].forEach(
      (key) => params.delete(key)
    );
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  return { filters, updateFilters, resetFilters };
};