/**
 * Shared API Utilities
 *
 * Common utilities for API communication including error handling,
 * authentication, and request helpers.
 */

import { getAccessToken, refreshAccessToken } from "./auth";
import type { ApiResponse } from "@/types/questionnaire-api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// ============================================================================
// Error Classes
// ============================================================================

/**
 * Base API error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }

  /** Hebrew message for user display */
  get hebrewMessage(): string {
    return "שגיאה בתקשורת עם השרת";
  }
}

/**
 * Unauthorized error (401) - user needs to login
 */
export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }

  get hebrewMessage(): string {
    return "יש להתחבר מחדש";
  }
}

/**
 * Not found error (404) - resource doesn't exist
 */
export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }

  get hebrewMessage(): string {
    return "המידע המבוקש לא נמצא";
  }
}

/**
 * Validation error (400) - invalid input data
 */
export class ValidationError extends ApiError {
  constructor(
    message = "Validation failed",
    public readonly errors: Record<string, string> = {}
  ) {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }

  get hebrewMessage(): string {
    return "יש לתקן את השדות המסומנים";
  }
}

/**
 * Network error - connectivity issues
 */
export class NetworkError extends ApiError {
  constructor(message = "Network error") {
    super(message, 0, "NETWORK_ERROR");
    this.name = "NetworkError";
  }

  get hebrewMessage(): string {
    return "שגיאת רשת. אנא בדוק את החיבור לאינטרנט";
  }
}

// ============================================================================
// API Request Helper
// ============================================================================

/**
 * Make authenticated API request with automatic token refresh on 401
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retryOnUnauthorized = true
): Promise<ApiResponse<T>> {
  const token = getAccessToken();

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    // Handle 401 with token refresh
    if (response.status === 401 && retryOnUnauthorized) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry with new token
        return apiRequest<T>(endpoint, options, false);
      }
      // Refresh failed, throw unauthorized error
      throw new UnauthorizedError();
    }

    const result: ApiResponse<T> = await response.json();

    // Handle error responses
    if (!response.ok) {
      if (response.status === 404) {
        throw new NotFoundError(result.error);
      }
      if (response.status === 400) {
        throw new ValidationError(result.error);
      }
      throw new ApiError(
        result.error || "Unknown error",
        response.status,
        result.code
      );
    }

    return result;
  } catch (error) {
    // Re-throw our custom errors
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    console.error("API request failed:", error);
    throw new NetworkError(
      error instanceof Error ? error.message : "Network error"
    );
  }
}

// ============================================================================
// Convenience Methods
// ============================================================================

/**
 * API helper object with convenience methods for common HTTP operations
 */
export const api = {
  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { method: "GET" });
  },

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { method: "DELETE" });
  },
};

// ============================================================================
// Error Helpers
// ============================================================================

/**
 * Get Hebrew error message from any error
 */
export function getHebrewErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.hebrewMessage;
  }

  if (error instanceof Error) {
    // Map common error messages to Hebrew
    const errorMap: Record<string, string> = {
      "Failed to fetch": "שגיאת רשת. אנא בדוק את החיבור לאינטרנט",
      "Network error": "שגיאת רשת. אנא בדוק את החיבור לאינטרנט",
    };

    for (const [pattern, translation] of Object.entries(errorMap)) {
      if (error.message.toLowerCase().includes(pattern.toLowerCase())) {
        return translation;
      }
    }
  }

  return "אירעה שגיאה. אנא נסה שוב";
}

/**
 * Check if error is due to authentication issues
 */
export function isAuthError(error: unknown): boolean {
  return error instanceof UnauthorizedError;
}

/**
 * Check if error is due to network issues
 */
export function isNetworkError(error: unknown): boolean {
  return error instanceof NetworkError;
}
