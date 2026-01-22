/**
 * User Reports Service - Handles user-facing report API calls
 */

import { getAccessToken, refreshAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types
export type ReportStatus = 'draft' | 'published';

export interface UserReportProfileSummary {
  userName: string;
  citizenship?: string;
  age?: string;
  profession?: string;
  familyStatus?: string;
  netIncome?: string;
  passiveIncome?: string;
  relocationGoals?: string;
}

/**
 * Destination info - self-contained, personalized per user
 */
export interface UserDestinationInfo {
  name: string;
  subtitle: string | null;
  image: string | null;
  badge: string | null;
}

/**
 * Match info for a destination
 */
export interface UserMatchInfo {
  score: number;
  reasons: string[];
  visaType: string | null;
}

/**
 * Narrative content - personalized story for the destination
 */
export interface UserDestinationNarrative {
  introduction?: string;
  pathway?: string;
  fit?: string;
  benefits?: string;
  highlights?: string[];
}

/**
 * Flexible content section
 */
export interface UserDestinationSection {
  id: string;
  key: string;
  title: string;
  icon?: string;
  content: string;
  position: number;
}

/**
 * User-facing destination response (public view)
 * Self-contained with all personalized content
 */
export interface UserDestinationResponse {
  id: string;
  displayOrder: number;
  destination: UserDestinationInfo;
  match: UserMatchInfo;
  narrative: UserDestinationNarrative;
  sections: UserDestinationSection[];
}

/**
 * User-facing report (public view)
 */
export interface UserReport {
  id: string;
  greeting: string | null;
  profileSummary: UserReportProfileSummary;
  destinations: UserDestinationResponse[];
  publishedAt: string | null;
}

/**
 * User report status
 */
export interface UserReportStatus {
  hasReport: boolean;
  hasPublishedReport: boolean;
  publishedDestinationCount: number;
  reportId?: string;
  /** Whether the user has completed the questionnaire (even if no report exists yet) */
  hasCompletedQuestionnaire: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  message?: string;
}

/**
 * Make an authenticated API request
 */
async function authenticatedFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  let accessToken = getAccessToken();

  if (!accessToken) {
    return { success: false, error: 'Not authenticated' };
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
    ...options.headers,
  };

  try {
    let response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    // Try to refresh token on 401
    if (response.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        accessToken = getAccessToken();
        if (accessToken) {
          response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: {
              ...headers,
              'Authorization': `Bearer ${accessToken}`,
            },
          });
        }
      }
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Request failed',
        code: data.code,
      };
    }

    return data as ApiResponse<T>;
  } catch (error) {
    console.error('User Reports API error:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Get user's report status
 */
export async function getReportStatus(): Promise<{
  data: UserReportStatus | null;
  error?: string;
}> {
  const response = await authenticatedFetch<UserReportStatus>(
    '/api/v1/reports/status'
  );

  if (!response.success || !response.data) {
    return { data: null, error: response.error };
  }

  return { data: response.data };
}

/**
 * Get user's published report
 */
export async function getUserReport(): Promise<{
  report: UserReport | null;
  error?: string;
}> {
  const response = await authenticatedFetch<{ report: UserReport }>(
    '/api/v1/reports'
  );

  if (!response.success || !response.data) {
    return { report: null, error: response.error };
  }

  return { report: response.data.report };
}

/**
 * Get a specific destination response from user's report
 */
export async function getDestinationResponse(
  destinationId: string
): Promise<{ response: UserDestinationResponse | null; error?: string }> {
  const apiResponse = await authenticatedFetch<{ response: UserDestinationResponse }>(
    `/api/v1/reports/destinations/${destinationId}`
  );

  if (!apiResponse.success || !apiResponse.data) {
    return { response: null, error: apiResponse.error };
  }

  return { response: apiResponse.data.response };
}

// Legacy type aliases for backwards compatibility (deprecated)
/** @deprecated Use UserDestinationResponse instead */
export type UserCountryResponse = UserDestinationResponse;
/** @deprecated Use getDestinationResponse instead */
export const getCountryResponse = getDestinationResponse;
