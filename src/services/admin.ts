/**
 * Admin Service - Handles admin API calls to the backend
 */

import { getAccessToken, refreshAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types
export type UserRole = 'user' | 'admin';
export type OnboardingStatus = 'pending' | 'in_progress' | 'completed';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  idNumber: string | null;
  phone: string | null;
  citizenship: string | null;
  birthDate: string | null;
  preferredLanguage: string;
  isActive: boolean;
  emailVerified: boolean;
  role: UserRole;
  onboardingStatus: OnboardingStatus;
  onboardingCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminQuestionnaire {
  id: string;
  userId: string;
  status: 'in_progress' | 'completed' | 'archived';
  currentStep: string;
  schemaVersion: number;
  responses: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface AdminQuestionnaireDetail extends AdminQuestionnaire {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface AdminUserDetail extends AdminUser {
  questionnaires: AdminQuestionnaire[];
}

export interface UserListResponse {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  sortBy?: 'createdAt' | 'firstName' | 'lastName' | 'email';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  idNumber?: string;
  phone?: string;
  birthDate?: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  idNumber?: string | null;
  phone?: string | null;
  citizenship?: string | null;
  birthDate?: string | null;
  preferredLanguage?: string;
  isActive?: boolean;
  role?: UserRole;
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
    console.error('Admin API error:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * List users with pagination and filtering
 */
export async function listUsers(
  params: ListUsersParams = {}
): Promise<{ data: UserListResponse | null; error?: string }> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.role) searchParams.set('role', params.role);
  if (params.isActive !== undefined) searchParams.set('isActive', String(params.isActive));
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

  const queryString = searchParams.toString();
  const url = `/api/v1/admin/users${queryString ? `?${queryString}` : ''}`;

  const response = await authenticatedFetch<UserListResponse>(url);

  if (!response.success || !response.data) {
    return { data: null, error: response.error };
  }

  return { data: response.data };
}

/**
 * Get a user by ID with their questionnaires
 */
export async function getUserById(
  userId: string
): Promise<{ user: AdminUserDetail | null; error?: string }> {
  const response = await authenticatedFetch<{ user: AdminUserDetail }>(
    `/api/v1/admin/users/${userId}`
  );

  if (!response.success || !response.data) {
    return { user: null, error: response.error };
  }

  return { user: response.data.user };
}

/**
 * Create a new user
 */
export async function createUser(
  input: CreateUserInput
): Promise<{ user: AdminUser | null; error?: string }> {
  const response = await authenticatedFetch<{ user: AdminUser }>(
    '/api/v1/admin/users',
    {
      method: 'POST',
      body: JSON.stringify(input),
    }
  );

  if (!response.success || !response.data) {
    return { user: null, error: response.error };
  }

  return { user: response.data.user };
}

/**
 * Update a user
 */
export async function updateUser(
  userId: string,
  input: UpdateUserInput
): Promise<{ user: AdminUser | null; error?: string }> {
  const response = await authenticatedFetch<{ user: AdminUser }>(
    `/api/v1/admin/users/${userId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    }
  );

  if (!response.success || !response.data) {
    return { user: null, error: response.error };
  }

  return { user: response.data.user };
}

/**
 * Delete (deactivate) a user
 */
export async function deleteUser(
  userId: string,
  hardDelete = false
): Promise<{ success: boolean; error?: string }> {
  const url = `/api/v1/admin/users/${userId}${hardDelete ? '?hard=true' : ''}`;

  const response = await authenticatedFetch<void>(url, {
    method: 'DELETE',
  });

  if (!response.success) {
    return { success: false, error: response.error };
  }

  return { success: true };
}

/**
 * Get a questionnaire by ID with user info
 */
export async function getQuestionnaireById(
  questionnaireId: string
): Promise<{ questionnaire: AdminQuestionnaireDetail | null; error?: string }> {
  const response = await authenticatedFetch<{ questionnaire: AdminQuestionnaireDetail }>(
    `/api/v1/admin/questionnaires/${questionnaireId}`
  );

  if (!response.success || !response.data) {
    return { questionnaire: null, error: response.error };
  }

  return { questionnaire: response.data.questionnaire };
}

/**
 * Restore a deactivated user
 */
export async function restoreUser(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const response = await authenticatedFetch<void>(
    `/api/v1/admin/users/${userId}/restore`,
    {
      method: 'POST',
    }
  );

  if (!response.success) {
    return { success: false, error: response.error };
  }

  return { success: true };
}

/**
 * User payment status response from admin API
 */
export interface UserPaymentStatus {
  hasPaidReport: boolean;
  hasPaidConsultation: boolean;
  totalPayments: number;
  lastPayment: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    productType: string;
    paidAt: string | null;
    createdAt: string;
  } | null;
}

/**
 * Get user's payment status
 */
export async function getUserPaymentStatus(
  userId: string
): Promise<{ data: UserPaymentStatus | null; error?: string }> {
  const response = await authenticatedFetch<UserPaymentStatus>(
    `/api/v1/admin/users/${userId}/payments`
  );

  if (!response.success || !response.data) {
    return { data: null, error: response.error };
  }

  return { data: response.data };
}

/**
 * Admin payment list item with user info
 */
export interface AdminPayment {
  id: string;
  userId: string;
  questionnaireResponseId: string | null;
  stripeCustomerId: string | null;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'expired' | 'refunded' | 'disputed';
  productType: 'relomatch_report' | 'consultation';
  productName: string;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
  refundedAt: string | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

/**
 * Admin payments list response
 */
export interface AdminPaymentsListResponse {
  payments: AdminPayment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * List all payments params
 */
export interface ListPaymentsParams {
  page?: number;
  limit?: number;
  status?: string;
  productType?: string;
  search?: string;
  sortBy?: 'createdAt' | 'amount' | 'paidAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * List all payments (admin)
 */
export async function listPayments(
  params: ListPaymentsParams = {}
): Promise<{ data: AdminPaymentsListResponse | null; error?: string }> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.status) searchParams.set('status', params.status);
  if (params.productType) searchParams.set('productType', params.productType);
  if (params.search) searchParams.set('search', params.search);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

  const queryString = searchParams.toString();
  const url = `/api/v1/admin/payments${queryString ? `?${queryString}` : ''}`;

  const response = await authenticatedFetch<AdminPaymentsListResponse>(url);

  if (!response.success || !response.data) {
    return { data: null, error: response.error };
  }

  return { data: response.data };
}
