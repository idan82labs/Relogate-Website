/**
 * User Reports Service - Handles user-facing report API calls
 */

import { getAccessToken, refreshAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types
export type ReportStatus = 'pending' | 'draft' | 'published';

export interface UserReportProfileSummary {
  userName?: string;
  citizenship?: string;
  familyStatus?: string;
  relocationGoals?: string;
}

export interface UserCountryResponseContent {
  introduction?: string;
  visaOptions?: string;
  costOfLiving?: string;
  healthcare?: string;
  education?: string;
  employment?: string;
  safety?: string;
  community?: string;
  transportation?: string;
  additionalNotes?: string;
}

export interface UserCountryResponse {
  id: string;
  countryId: string;
  countryCode: string;
  countryName: string;
  countryFlagImage: string | null;
  content: UserCountryResponseContent;
  createdAt: string;
}

export interface UserReport {
  id: string;
  greeting: string | null;
  profileSummary: UserReportProfileSummary;
  publishedAt: string | null;
  countryResponses: UserCountryResponse[];
}

export interface UserReportStatus {
  hasReport: boolean;
  status: ReportStatus | null;
  hasPublishedResponses: boolean;
  publishedResponseCount: number;
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
 * Get a specific country response from user's report
 */
export async function getCountryResponse(
  countryId: string
): Promise<{ response: UserCountryResponse | null; error?: string }> {
  const apiResponse = await authenticatedFetch<{ response: UserCountryResponse }>(
    `/api/v1/reports/countries/${countryId}`
  );

  if (!apiResponse.success || !apiResponse.data) {
    return { response: null, error: apiResponse.error };
  }

  return { response: apiResponse.data.response };
}
