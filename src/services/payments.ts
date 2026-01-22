/**
 * Payments Service - Handles payment API calls to the backend
 */

import { getAccessToken, refreshAccessToken } from './auth';
import type {
  Payment,
  CheckoutSessionResponse,
  PaymentStatusResponse,
  PaymentsListResponse,
  StripeConfigResponse,
  CreateCheckoutParams,
  ProductType,
} from '@/types/payment';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const BASE_PATH = '/api/v1/payments';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

/**
 * Make a public API request (no authentication required)
 */
async function publicFetch<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

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
    console.error('Payments API error:', error);
    return { success: false, error: 'Network error' };
  }
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
    console.error('Payments API error:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Get Stripe publishable key
 */
export async function getStripeConfig(): Promise<{
  success: boolean;
  data?: StripeConfigResponse;
  error?: string;
}> {
  return publicFetch<StripeConfigResponse>(`${BASE_PATH}/config`);
}

/**
 * Create a Stripe Checkout Session
 */
export async function createCheckoutSession(
  params: CreateCheckoutParams
): Promise<{
  success: boolean;
  data?: CheckoutSessionResponse;
  error?: string;
}> {
  return authenticatedFetch<CheckoutSessionResponse>(`${BASE_PATH}/checkout`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * Get user's payment history
 */
export async function getUserPayments(options?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<{
  success: boolean;
  data?: PaymentsListResponse;
  error?: string;
}> {
  const params = new URLSearchParams();
  if (options?.status) params.set('status', options.status);
  if (options?.limit) params.set('limit', options.limit.toString());
  if (options?.offset) params.set('offset', options.offset.toString());

  const query = params.toString();
  const url = query ? `${BASE_PATH}?${query}` : BASE_PATH;

  return authenticatedFetch<PaymentsListResponse>(url);
}

/**
 * Get a specific payment by ID
 */
export async function getPayment(paymentId: string): Promise<{
  success: boolean;
  data?: Payment;
  error?: string;
}> {
  return authenticatedFetch<Payment>(`${BASE_PATH}/${paymentId}`);
}

/**
 * Check if user has paid for a specific product
 */
export async function checkPaymentStatus(
  productType: ProductType
): Promise<{
  success: boolean;
  data?: PaymentStatusResponse;
  error?: string;
}> {
  return authenticatedFetch<PaymentStatusResponse>(
    `${BASE_PATH}/status/${productType}`
  );
}

/**
 * Redirect to Stripe Checkout
 */
export async function redirectToCheckout(
  params: CreateCheckoutParams
): Promise<{ success: boolean; error?: string }> {
  const result = await createCheckoutSession(params);

  if (!result.success || !result.data?.url) {
    return { success: false, error: result.error || 'Failed to create checkout session' };
  }

  // Redirect to Stripe Checkout
  window.location.href = result.data.url;
  return { success: true };
}
