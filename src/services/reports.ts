/**
 * Reports Service - Handles reports API calls to the backend
 */

import { getAccessToken, refreshAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types
export type ReportStatus = 'draft' | 'published';

export interface ReportProfileSummary {
  userName: string;
  citizenship?: string;
  age?: string;
  profession?: string;
  familyStatus?: string;
  netIncome?: string;
  passiveIncome?: string;
  relocationGoals?: string;
}

export interface ReportUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
}

/**
 * Destination info - self-contained, personalized per user
 */
export interface DestinationInfo {
  name: string;
  subtitle: string | null;
  image: string | null;
  badge: string | null;
}

/**
 * Match info for a destination
 */
export interface MatchInfo {
  score: number;
  reasons: string[];
  visaType: string | null;
}

/**
 * Narrative content - personalized story for the destination
 */
export interface DestinationNarrative {
  introduction?: string;
  pathway?: string;
  fit?: string;
  benefits?: string;
  highlights?: string[];
}

/**
 * Flexible content section - replaces fixed category overrides
 */
export interface DestinationSection {
  id: string;
  key: string;
  title: string;
  icon?: string;
  content: string;
  position: number;
}

/**
 * Destination response in list view (minimal)
 * Note: narrative and sections are optional, included in admin detail views
 */
export interface DestinationResponseListItem {
  id: string;
  destination: DestinationInfo;
  displayOrder: number;
  match: MatchInfo;
  status: ReportStatus;
  publishedAt: string | null;
  // Optional fields - included in admin detail views
  narrative?: DestinationNarrative;
  sections?: DestinationSection[];
}

/**
 * Full destination response with all details (admin view)
 */
export interface DestinationResponseFull {
  id: string;
  reportId: string;
  displayOrder: number;
  destination: DestinationInfo;
  match: MatchInfo;
  narrative: DestinationNarrative;
  sections: DestinationSection[];
  status: ReportStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Report with destination responses
 */
export interface Report {
  id: string;
  user: ReportUser;
  questionnaireId: string;
  greeting: string | null;
  profileSummary: ReportProfileSummary;
  status: ReportStatus;
  destinations: DestinationResponseListItem[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Report in list view (admin dashboard)
 */
export interface ReportListItem {
  id: string;
  user: ReportUser;
  questionnaireId: string;
  status: ReportStatus;
  destinationCount: number;
  publishedDestinationCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
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
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateReportInput {
  questionnaireId: string;
  greeting?: string;
  profileSummary?: Partial<ReportProfileSummary>;
}

export interface UpdateReportInput {
  greeting?: string;
  profileSummary?: Partial<ReportProfileSummary>;
}

/**
 * Create destination response input
 */
export interface CreateDestinationResponseInput {
  reportId: string;
  displayOrder?: number;
  destination: {
    name: string;
    subtitle?: string | null;
    image?: string | null;
    badge?: string | null;
  };
  match?: {
    score?: number;
    reasons?: string[];
    visaType?: string | null;
  };
  narrative?: DestinationNarrative;
  sections?: Omit<DestinationSection, 'id'>[];
}

/**
 * Update destination response input
 */
export interface UpdateDestinationResponseInput {
  displayOrder?: number;
  destination?: Partial<{
    name: string;
    subtitle: string | null;
    image: string | null;
    badge: string | null;
  }>;
  match?: Partial<{
    score: number;
    reasons: string[];
    visaType: string | null;
  }>;
  narrative?: DestinationNarrative;
  sections?: Omit<DestinationSection, 'id'>[];
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
  if (params.search) searchParams.set('search', params.search);
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
 * Pending questionnaire (no report created yet)
 */
export interface PendingQuestionnaire {
  id: string;
  user: ReportUser;
  countries: string[];
  submittedAt: string;
  reportExists: boolean;
}

/**
 * Get pending questionnaires that need reports (admin)
 */
export async function getPendingQuestionnaires(): Promise<{
  data: {
    questionnaires: PendingQuestionnaire[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  } | null;
  error?: string;
}> {
  const response = await authenticatedFetch<{
    questionnaires: PendingQuestionnaire[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>('/api/v1/admin/reports/pending');

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
 * Publish a report (admin)
 */
export async function publishReport(
  reportId: string,
  publishDestinations: boolean = true
): Promise<{ report: Report | null; error?: string }> {
  const response = await authenticatedFetch<{ report: Report }>(
    `/api/v1/admin/reports/${reportId}/publish`,
    {
      method: 'POST',
      body: JSON.stringify({ publishDestinations }),
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
 * Questionnaire responses data (for admin view)
 */
export interface QuestionnaireResponsesData {
  id: string;
  userId: string;
  userName: string | null;
  responses: Record<string, unknown>;
  status: string;
  completedAt: string | null;
  createdAt: string;
}

/**
 * Get questionnaire responses by questionnaire ID (admin)
 * Used when admin wants to view user's questionnaire answers while preparing a report
 */
export async function getQuestionnaireResponses(
  questionnaireId: string
): Promise<{ questionnaire: QuestionnaireResponsesData | null; error?: string }> {
  const response = await authenticatedFetch<{ questionnaire: QuestionnaireResponsesData }>(
    `/api/v1/admin/reports/questionnaire/${questionnaireId}`
  );

  if (!response.success || !response.data) {
    return { questionnaire: null, error: response.error };
  }

  return { questionnaire: response.data.questionnaire };
}

/**
 * Get a destination response by ID (admin)
 */
export async function getDestinationResponseById(
  destinationId: string
): Promise<{ response: DestinationResponseFull | null; error?: string }> {
  const apiResponse = await authenticatedFetch<{ response: DestinationResponseFull }>(
    `/api/v1/admin/reports/destinations/${destinationId}`
  );

  if (!apiResponse.success || !apiResponse.data) {
    return { response: null, error: apiResponse.error };
  }

  return { response: apiResponse.data.response };
}

/**
 * Create a destination response (admin)
 */
export async function createDestinationResponse(
  input: CreateDestinationResponseInput
): Promise<{ response: DestinationResponseFull | null; error?: string }> {
  const apiResponse = await authenticatedFetch<{ response: DestinationResponseFull }>(
    '/api/v1/admin/reports/destinations',
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
 * Update a destination response (admin)
 */
export async function updateDestinationResponse(
  destinationId: string,
  input: UpdateDestinationResponseInput
): Promise<{ response: DestinationResponseFull | null; error?: string }> {
  const apiResponse = await authenticatedFetch<{ response: DestinationResponseFull }>(
    `/api/v1/admin/reports/destinations/${destinationId}`,
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
 * Publish or unpublish a destination response (admin)
 */
export async function publishDestinationResponse(
  destinationId: string,
  publish: boolean = true
): Promise<{ response: DestinationResponseFull | null; error?: string }> {
  const apiResponse = await authenticatedFetch<{ response: DestinationResponseFull }>(
    `/api/v1/admin/reports/destinations/${destinationId}/publish`,
    {
      method: 'POST',
      body: JSON.stringify({ publish }),
    }
  );

  if (!apiResponse.success || !apiResponse.data) {
    return { response: null, error: apiResponse.error };
  }

  return { response: apiResponse.data.response };
}

/**
 * Delete a destination response (admin)
 */
export async function deleteDestinationResponse(
  destinationId: string
): Promise<{ success: boolean; error?: string }> {
  const response = await authenticatedFetch<void>(
    `/api/v1/admin/reports/destinations/${destinationId}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.success) {
    return { success: false, error: response.error };
  }

  return { success: true };
}

// Legacy type aliases for backwards compatibility (deprecated)
/** @deprecated Use DestinationResponseFull instead */
export type ReportCountryResponse = DestinationResponseFull;
/** @deprecated Use CreateDestinationResponseInput instead */
export type CreateCountryResponseInput = CreateDestinationResponseInput;
/** @deprecated Use UpdateDestinationResponseInput instead */
export type UpdateCountryResponseInput = UpdateDestinationResponseInput;
/** @deprecated Use DestinationNarrative instead */
export type PersonalizedContent = DestinationNarrative;
/** @deprecated Removed - use DestinationSection[] instead */
export type CategoryOverrides = Record<string, string>;
/** @deprecated Use deleteDestinationResponse instead */
export const deleteCountryResponse = deleteDestinationResponse;
