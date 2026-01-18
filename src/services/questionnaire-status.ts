/**
 * Questionnaire Status Service
 * Handles questionnaire version checking and migration
 */

import { getAccessToken, refreshAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types - matches backend QuestionnaireVersionStatus
export interface QuestionnaireVersionStatus {
  isOutdated: boolean;
  currentVersion: number;
  userVersion: number;
  needsUpdate: boolean;
  requiresResubmission: boolean;
  missingFields: string[];
  newRequiredFields: string[];
}

// Normalized type for frontend consumption
export interface QuestionnaireStatus {
  hasQuestionnaire: boolean;
  status: 'in_progress' | 'completed' | 'archived' | null;
  schemaVersion: number | null;
  currentSchemaVersion: number;
  needsUpdate: boolean;
  missingFields: string[];
}

export interface MigrateResponse {
  questionnaire: {
    id: string;
    status: string;
    schemaVersion: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
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
    console.error('Questionnaire Status API error:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Get questionnaire version status including migration info
 * Calls /api/v1/questionnaire/version-status which returns QuestionnaireVersionStatus
 */
export async function getQuestionnaireStatus(): Promise<{
  data: QuestionnaireStatus | null;
  error?: string;
}> {
  const response = await authenticatedFetch<QuestionnaireVersionStatus>(
    '/api/v1/questionnaire/version-status'
  );

  if (!response.success) {
    // If no questionnaire exists or any error, return a default "no questionnaire" status
    // This is a safe default - users without questionnaires should see normal flow
    const isNotFoundError =
      response.code === 'NOT_FOUND' ||
      response.error?.toLowerCase().includes('not found') ||
      response.error?.toLowerCase().includes('no questionnaire');

    if (isNotFoundError) {
      return {
        data: {
          hasQuestionnaire: false,
          status: null,
          schemaVersion: null,
          currentSchemaVersion: 2,
          needsUpdate: false,
          missingFields: [],
        },
      };
    }

    // For other errors, still return a safe default but log it
    console.warn('Questionnaire status check failed:', response.error);
    return {
      data: {
        hasQuestionnaire: false,
        status: null,
        schemaVersion: null,
        currentSchemaVersion: 2,
        needsUpdate: false,
        missingFields: [],
      },
    };
  }

  if (!response.data) {
    return {
      data: {
        hasQuestionnaire: false,
        status: null,
        schemaVersion: null,
        currentSchemaVersion: 2,
        needsUpdate: false,
        missingFields: [],
      },
    };
  }

  // Transform backend response to frontend format
  const versionStatus = response.data;
  return {
    data: {
      hasQuestionnaire: true,
      status: 'completed',
      schemaVersion: versionStatus.userVersion,
      currentSchemaVersion: versionStatus.currentVersion,
      needsUpdate: versionStatus.needsUpdate || versionStatus.isOutdated,
      missingFields: versionStatus.missingFields,
    },
  };
}

/**
 * Migrate questionnaire to new version (reopen for updates)
 */
export async function migrateQuestionnaire(): Promise<{
  data: MigrateResponse | null;
  error?: string;
}> {
  const response = await authenticatedFetch<MigrateResponse>(
    '/api/v1/questionnaire/migrate',
    { method: 'POST' }
  );

  if (!response.success || !response.data) {
    return { data: null, error: response.error };
  }

  return { data: response.data };
}
