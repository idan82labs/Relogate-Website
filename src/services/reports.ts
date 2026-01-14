/**
 * Reports Service - Handles reports API calls to the backend
 */

import { getAccessToken, refreshAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types
export type ReportStatus = 'pending' | 'draft' | 'published';

export interface ReportProfileSummary {
  userName?: string;
  citizenship?: string;
  familyStatus?: string;
  relocationGoals?: string;
}

export interface ReportUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
}

export interface ReportQuestionnaire {
  id: string;
  status: string;
  completedAt: string | null;
  responses: Record<string, unknown>;
}

export interface ReportCountryResponse {
  id: string;
  countryId: string;
  countryCode: string;
  countryName: string;
  countryFlagImage: string | null;
  content: Record<string, unknown>;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  userId: string;
  questionnaireId: string;
  greeting: string | null;
  profileSummary: ReportProfileSummary;
  status: ReportStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: ReportUser;
  questionnaire?: ReportQuestionnaire;
  countryResponses?: ReportCountryResponse[];
}

export interface ReportListItem {
  id: string;
  userId: string;
  questionnaireId: string;
  greeting: string | null;
  profileSummary: ReportProfileSummary;
  status: ReportStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: ReportUser;
  questionnaire?: ReportQuestionnaire;
  countryResponseCount?: number;
}

export interface ReportListResponse {
  reports: ReportListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ListReportsParams {
  page?: number;
  limit?: number;
  status?: ReportStatus;
  userId?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateReportInput {
  userId: string;
  questionnaireId: string;
  greeting?: string;
  profileSummary?: ReportProfileSummary;
}

export interface UpdateReportInput {
  greeting?: string | null;
  profileSummary?: ReportProfileSummary;
  status?: ReportStatus;
}

export interface CountryResponseContent {
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

export interface CreateCountryResponseInput {
  countryId: string;
  content?: CountryResponseContent;
}

export interface UpdateCountryResponseInput {
  content?: CountryResponseContent;
  status?: ReportStatus;
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
    console.error('Reports API error:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * List reports with pagination and filtering (admin)
 */
export async function listReports(
  params: ListReportsParams = {}
): Promise<{ data: ReportListResponse | null; error?: string }> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.status) searchParams.set('status', params.status);
  if (params.userId) searchParams.set('userId', params.userId);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

  const queryString = searchParams.toString();
  const url = `/api/v1/admin/reports${queryString ? `?${queryString}` : ''}`;

  const response = await authenticatedFetch<ReportListResponse>(url);

  if (!response.success || !response.data) {
    return { data: null, error: response.error };
  }

  return { data: response.data };
}

/**
 * Get pending questionnaires that need reports (admin)
 */
export async function getPendingQuestionnaires(): Promise<{
  data: { questionnaires: Array<{
    id: string;
    userId: string;
    status: string;
    completedAt: string | null;
    responses: Record<string, unknown>;
    user: ReportUser;
  }> } | null;
  error?: string;
}> {
  const response = await authenticatedFetch<{
    questionnaires: Array<{
      id: string;
      userId: string;
      status: string;
      completedAt: string | null;
      responses: Record<string, unknown>;
      user: ReportUser;
    }>;
  }>('/api/v1/admin/reports/pending-questionnaires');

  if (!response.success || !response.data) {
    return { data: null, error: response.error };
  }

  return { data: response.data };
}

/**
 * Get a report by ID (admin)
 */
export async function getReportById(
  reportId: string
): Promise<{ report: Report | null; error?: string }> {
  const response = await authenticatedFetch<{ report: Report }>(
    `/api/v1/admin/reports/${reportId}`
  );

  if (!response.success || !response.data) {
    return { report: null, error: response.error };
  }

  return { report: response.data.report };
}

/**
 * Create a new report (admin)
 */
export async function createReport(
  input: CreateReportInput
): Promise<{ report: Report | null; error?: string }> {
  const response = await authenticatedFetch<{ report: Report }>(
    '/api/v1/admin/reports',
    {
      method: 'POST',
      body: JSON.stringify(input),
    }
  );

  if (!response.success || !response.data) {
    return { report: null, error: response.error };
  }

  return { report: response.data.report };
}

/**
 * Update a report (admin)
 */
export async function updateReport(
  reportId: string,
  input: UpdateReportInput
): Promise<{ report: Report | null; error?: string }> {
  const response = await authenticatedFetch<{ report: Report }>(
    `/api/v1/admin/reports/${reportId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    }
  );

  if (!response.success || !response.data) {
    return { report: null, error: response.error };
  }

  return { report: response.data.report };
}

/**
 * Delete a report (admin)
 */
export async function deleteReport(
  reportId: string
): Promise<{ success: boolean; error?: string }> {
  const response = await authenticatedFetch<void>(
    `/api/v1/admin/reports/${reportId}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.success) {
    return { success: false, error: response.error };
  }

  return { success: true };
}

/**
 * Add a country response to a report (admin)
 */
export async function createCountryResponse(
  reportId: string,
  input: CreateCountryResponseInput
): Promise<{ response: ReportCountryResponse | null; error?: string }> {
  const apiResponse = await authenticatedFetch<{ response: ReportCountryResponse }>(
    `/api/v1/admin/reports/${reportId}/responses`,
    {
      method: 'POST',
      body: JSON.stringify(input),
    }
  );

  if (!apiResponse.success || !apiResponse.data) {
    return { response: null, error: apiResponse.error };
  }

  return { response: apiResponse.data.response };
}

/**
 * Update a country response (admin)
 */
export async function updateCountryResponse(
  reportId: string,
  responseId: string,
  input: UpdateCountryResponseInput
): Promise<{ response: ReportCountryResponse | null; error?: string }> {
  const apiResponse = await authenticatedFetch<{ response: ReportCountryResponse }>(
    `/api/v1/admin/reports/${reportId}/responses/${responseId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    }
  );

  if (!apiResponse.success || !apiResponse.data) {
    return { response: null, error: apiResponse.error };
  }

  return { response: apiResponse.data.response };
}

/**
 * Delete a country response (admin)
 */
export async function deleteCountryResponse(
  reportId: string,
  responseId: string
): Promise<{ success: boolean; error?: string }> {
  const response = await authenticatedFetch<void>(
    `/api/v1/admin/reports/${reportId}/responses/${responseId}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.success) {
    return { success: false, error: response.error };
  }

  return { success: true };
}
