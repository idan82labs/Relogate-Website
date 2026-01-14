/**
 * Notifications Service - Handles notifications API calls for users
 */

import { getAccessToken, refreshAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types
export type NotificationType =
  | 'report_ready'
  | 'country_response_ready'
  | 'questionnaire_completed'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: {
    reportId?: string;
    responseId?: string;
    countryName?: string;
    questionnaireId?: string;
  };
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UnreadCountResponse {
  count: number;
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
    console.error('Notifications API error:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Get user notifications with pagination
 */
export async function getUserNotifications(params: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
} = {}): Promise<{ data: NotificationListResponse | null; error?: string }> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.unreadOnly) searchParams.set('unreadOnly', 'true');

  const queryString = searchParams.toString();
  const url = `/api/v1/notifications${queryString ? `?${queryString}` : ''}`;

  const response = await authenticatedFetch<NotificationListResponse>(url);

  if (!response.success || !response.data) {
    return { data: null, error: response.error };
  }

  return { data: response.data };
}

/**
 * Get unread notifications count
 */
export async function getUnreadCount(): Promise<{ count: number; error?: string }> {
  const response = await authenticatedFetch<UnreadCountResponse>(
    '/api/v1/notifications/unread-count'
  );

  if (!response.success || !response.data) {
    return { count: 0, error: response.error };
  }

  return { count: response.data.count };
}

/**
 * Mark a notification as read
 */
export async function markAsRead(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  const response = await authenticatedFetch<void>(
    `/api/v1/notifications/${notificationId}/read`,
    {
      method: 'PATCH',
    }
  );

  if (!response.success) {
    return { success: false, error: response.error };
  }

  return { success: true };
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<{ success: boolean; error?: string }> {
  const response = await authenticatedFetch<void>(
    '/api/v1/notifications/read-all',
    {
      method: 'PATCH',
    }
  );

  if (!response.success) {
    return { success: false, error: response.error };
  }

  return { success: true };
}
