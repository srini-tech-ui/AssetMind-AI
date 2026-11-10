import { z } from "zod";

// ============================================
// API ERROR CLASS
// ============================================

export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(
    message: string,
    status: number = 500,
    data: any = null
  ) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

// ============================================
// API BASE URL
// ============================================
//
// Use VITE_API_BASE_URL when configured.
//
// Development fallback:
// FastAPI backend runs on port 8000.
//

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

// ============================================
// MOCK MODE
// ============================================

const USE_MOCKS =
  import.meta.env.VITE_USE_MOCKS === "true";

// ============================================
// CORRELATION ID
// ============================================
//
// Generate a unique UUID for every request.
// Matches the backend X-Correlation-ID header.
//

const generateCorrelationId = (): string => {
  return crypto.randomUUID();
};

// ============================================
// ZOD RESPONSE VALIDATION
// ============================================

const parseJsonWithZod = <T>(
  schema: z.ZodType<T>,
  data: unknown
): T => {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ApiError(
     "Invalid response format: " + result.error.message,
      500,
      data
    );
  }

  return result.data;
};

// ============================================
// PLAIN OBJECT CHECK
// ============================================
//
// Check whether a value is a plain JSON object.
//
// Prevents FormData, Blob, ArrayBuffer,
// URLSearchParams, ReadableStream, etc.
// from being JSON stringified.
//

const isPlainObject = (
  value: unknown
): value is Record<string, unknown> => {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return false;
  }

  const proto =
    Object.getPrototypeOf(value);

  return (
    proto === Object.prototype ||
    proto === null
  );
};

// ============================================
// MAIN API CLIENT
// ============================================

export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {},
  schema?: z.ZodType<T>
): Promise<T> => {

  // ------------------------------------------
  // MOCK MODE
  // ------------------------------------------

  if (USE_MOCKS) {
    throw new ApiError(
      `Mock mode is enabled. No apiClient endpoint adapter is configured for: ${endpoint}. Use the appropriate mock service or hook from src/mocks/mockAdapter.ts.`,
      501,
      {
        endpoint,
        method:
          options.method ?? "GET",
        mockMode: true,
      }
    );
  }

  // ------------------------------------------
  // CORRELATION ID
  // ------------------------------------------

  const correlationId =
    generateCorrelationId();

  // ------------------------------------------
  // HEADERS
  // ------------------------------------------

  const headers = new Headers(
    options.headers ?? undefined
  );

  if (
    !headers.has("Content-Type") &&
    options.body &&
    isPlainObject(options.body)
  ) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  // Match backend middleware header name.
  headers.set(
    "X-Correlation-ID",
    correlationId
  );

  // ------------------------------------------
  // AUTHENTICATION
  // ------------------------------------------
  //
  // Phase 1:
  // Authentication intentionally disabled.
  //
  // Production:
  // Integrate the approved OIDC/JWT token provider.
  //

  /*
  const token = getAuthToken();

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }
  */

  // ------------------------------------------
  // REQUEST OPTIONS
  // ------------------------------------------

  const requestOptions: RequestInit = {
    ...options,
    headers,
  };

  // ------------------------------------------
  // JSON SERIALIZATION
  // ------------------------------------------

  if (
    requestOptions.body !== undefined &&
    requestOptions.body !== null &&
    isPlainObject(requestOptions.body)
  ) {
    requestOptions.body = JSON.stringify(
      requestOptions.body
    );
  }

  // ------------------------------------------
  // BACKEND REQUEST
  // ------------------------------------------

  let response: Response;

  try {
    response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      requestOptions
    );

  } catch (error) {
    throw new ApiError(
      `Unable to connect to backend API at ${API_BASE_URL}. Make sure the FastAPI backend is running.`,
      503,
      {
        endpoint,
        apiBaseUrl: API_BASE_URL,
        originalError:
          error instanceof Error
            ? error.message
            : String(error),
      }
    );
  }

  // ------------------------------------------
  // AUTHORIZATION ERRORS
  // ------------------------------------------

  if (response.status === 401) {
    throw new ApiError(
      "Unauthorized",
      401
    );
  }

  if (response.status === 403) {
    throw new ApiError(
      "Forbidden",
      403
    );
  }

  // ------------------------------------------
  // NON-SUCCESS RESPONSES
  // ------------------------------------------

  if (!response.ok) {
    let errorData: unknown = null;

    try {
      const rawText =
        await response.text();

      if (rawText.length > 0) {
        errorData =
          JSON.parse(rawText);
      }

    } catch {
      // Keep errorData as null
      // if response is not JSON.
    }

    throw new ApiError(
      `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData
    );
  }

  // ------------------------------------------
  // NO CONTENT
  // ------------------------------------------

  if (response.status === 204) {
    return undefined as T;
  }

  // ------------------------------------------
  // READ RESPONSE
  // ------------------------------------------

  const rawText =
    await response.text();

  // ------------------------------------------
  // EMPTY RESPONSE
  // ------------------------------------------

  if (rawText.length === 0) {
    return undefined as T;
  }

  // ------------------------------------------
  // PARSE JSON
  // ------------------------------------------

  let data: unknown;

  try {
    data =
      JSON.parse(rawText);

  } catch (error) {
    throw new ApiError(
      `Failed to parse JSON response: ${
        (error as Error).message
      }`,
      response.status,
      rawText
    );
  }

  // ------------------------------------------
  // RETURN WITHOUT SCHEMA
  // ------------------------------------------

  if (!schema) {
    return data as T;
  }

  // ------------------------------------------
  // ZOD VALIDATION
  // ------------------------------------------

  return parseJsonWithZod(
    schema,
    data
  );
};

// ============================================
// AUTH TOKEN HELPERS
// ============================================
//
// Phase 1:
// Authentication intentionally disabled.
//
// These functions remain placeholders until
// the approved OIDC integration is implemented.
//

export const setAuthToken = (
  _token: string | null
) => {
  // Intentionally a no-op in Phase 1.
};

export const clearAuthToken = () => {
  // Intentionally a no-op in Phase 1.
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default apiClient;