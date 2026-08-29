import { z } from "zod";

// Define the API error class
export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number = 500, data: any = null) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

// Get the base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Determine if we are using mocks
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

// Phase 1 placeholder: a static correlation ID.
// This is intentionally not a production-grade correlation ID system.
const generateCorrelationId = (): string => {
  return "phase1-correlation-id";
};

// Helper to parse JSON response with Zod schema
const parseJsonWithZod = <T>(schema: z.ZodType<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ApiError(
      `Invalid response format: ${result.error.message}`,
      500,
      data
    );
  }
  return result.data;
};

// Check if a value is a "plain" JSON-serializable object (not a BodyInit type
// like FormData, Blob, ArrayBuffer, URLSearchParams, ReadableStream, etc.)
const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

// Main API request function
export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {},
  schema?: z.ZodType<T>
): Promise<T> => {
  // If in mock mode, Phase 1 does not implement mock adapters.
  // We throw so callers can detect this explicitly.
  if (USE_MOCKS) {
    throw new Error(
      "Mock mode is enabled but no mock adapter implemented for this endpoint"
    );
  }

  // Generate correlation ID (Phase 1 placeholder)
  const correlationId = generateCorrelationId();

  // Build headers, preserving any caller-provided headers.
  const headers = new Headers(options.headers ?? undefined);
  if (!headers.has("Content-Type") && options.body && isPlainObject(options.body)) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Correlation-ID", correlationId);

  // Phase 1: authentication is intentionally disabled. No bearer token is sent.
  // const token = getAuthToken();
  // if (token) {
  //   headers.set("Authorization", `Bearer ${token}`);
  // }

  // Prepare request options, only stringifying the body for plain JSON objects.
  const requestOptions: RequestInit = {
    ...options,
    headers,
  };

  if (
    requestOptions.body !== undefined &&
    requestOptions.body !== null &&
    isPlainObject(requestOptions.body)
  ) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  // Make the request
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    requestOptions
  );

  // Handle 401 and 403
  if (response.status === 401) {
    throw new ApiError("Unauthorized", 401);
  }
  if (response.status === 403) {
    throw new ApiError("Forbidden", 403);
  }

  // If response is not OK, throw an error
  if (!response.ok) {
    let errorData: unknown = null;
    try {
      const rawText = await response.text();
      if (rawText.length > 0) {
        errorData = JSON.parse(rawText);
      }
    } catch {
      // If parsing fails, keep errorData as null
    }
    throw new ApiError(
      `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData
    );
  }

  // Handle 204 No Content (or any truly empty body) without calling response.json()
  if (response.status === 204) {
    return undefined as T;
  }

  // Read the body once as text
  const rawText = await response.text();
  if (rawText.length === 0) {
    return undefined as T;
  }

  let data: unknown;
  try {
    data = JSON.parse(rawText);
  } catch (e) {
    throw new ApiError(
      `Failed to parse JSON response: ${(e as Error).message}`,
      response.status,
      rawText
    );
  }

  // If no schema, return the parsed data
  if (!schema) {
    return data as T;
  }

  // Parse and validate with Zod
  return parseJsonWithZod(schema, data);
};

// Export helper functions for setting auth token (Phase 1: no-ops)
export const setAuthToken = (_token: string | null) => {
  // Phase 1: authentication is disabled. This is intentionally a no-op.
};

export const clearAuthToken = () => {
  // Phase 1: authentication is disabled. This is intentionally a no-op.
};

export default apiClient;