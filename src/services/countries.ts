/**
 * Countries Service - Handles countries API calls to the backend
 */

import { getAccessToken, refreshAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types
export interface CountryCategories {
  general?: string;
  visa?: string;
  language?: string;
  safety?: string;
  jewish?: string;
  openness?: string;
  healthcare?: string;
  education?: string;
  employment?: string;
  transport?: string;
  cost?: string;
  distance?: string;
  community?: string;
}

export interface Country {
  id: string;
  code: string;
  name: string;
  englishName: string;
  flagImage: string | null;
  heroImage: string | null;
  introduction: string | null;
  categories: CountryCategories;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CountryListItem {
  id: string;
  code: string;
  name: string;
  englishName: string;
  flagImage: string | null;
  isActive: boolean;
}

export interface CountryListResponse {
  countries: Country[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ActiveCountriesResponse {
  countries: CountryListItem[];
}

export interface ListCountriesParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: 'createdAt' | 'name' | 'englishName' | 'code';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCountryInput {
  code: string;
  name: string;
  englishName: string;
  flagImage?: string;
  heroImage?: string;
  introduction?: string;
  categories?: CountryCategories;
  isActive?: boolean;
}

export interface UpdateCountryInput {
  code?: string;
  name?: string;
  englishName?: string;
  flagImage?: string | null;
  heroImage?: string | null;
  introduction?: string | null;
  categories?: CountryCategories;
  isActive?: boolean;
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
    console.error('Countries API error:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * List countries with pagination and filtering (admin)
 */
export async function listCountries(
  params: ListCountriesParams = {}
): Promise<{ data: CountryListResponse | null; error?: string }> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.isActive !== undefined) searchParams.set('isActive', String(params.isActive));
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

  const queryString = searchParams.toString();
  const url = `/api/v1/admin/countries${queryString ? `?${queryString}` : ''}`;

  const response = await authenticatedFetch<CountryListResponse>(url);

  if (!response.success || !response.data) {
    return { data: null, error: response.error };
  }

  return { data: response.data };
}

/**
 * Get active countries for dropdowns (public)
 */
export async function getActiveCountries(): Promise<{ data: CountryListItem[] | null; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/countries`);
    const data = await response.json() as ApiResponse<ActiveCountriesResponse>;

    if (!response.ok || !data.success || !data.data) {
      return { data: null, error: data.error || 'Failed to fetch countries' };
    }

    return { data: data.data.countries };
  } catch (error) {
    console.error('Get active countries error:', error);
    return { data: null, error: 'Network error' };
  }
}

/**
 * Get a country by ID (admin)
 */
export async function getCountryById(
  countryId: string
): Promise<{ country: Country | null; error?: string }> {
  const response = await authenticatedFetch<{ country: Country }>(
    `/api/v1/admin/countries/${countryId}`
  );

  if (!response.success || !response.data) {
    return { country: null, error: response.error };
  }

  return { country: response.data.country };
}

/**
 * Create a new country (admin)
 */
export async function createCountry(
  input: CreateCountryInput
): Promise<{ country: Country | null; error?: string }> {
  const response = await authenticatedFetch<{ country: Country }>(
    '/api/v1/admin/countries',
    {
      method: 'POST',
      body: JSON.stringify(input),
    }
  );

  if (!response.success || !response.data) {
    return { country: null, error: response.error };
  }

  return { country: response.data.country };
}

/**
 * Update a country (admin)
 */
export async function updateCountry(
  countryId: string,
  input: UpdateCountryInput
): Promise<{ country: Country | null; error?: string }> {
  const response = await authenticatedFetch<{ country: Country }>(
    `/api/v1/admin/countries/${countryId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    }
  );

  if (!response.success || !response.data) {
    return { country: null, error: response.error };
  }

  return { country: response.data.country };
}

/**
 * Delete a country (admin)
 */
export async function deleteCountry(
  countryId: string
): Promise<{ success: boolean; error?: string }> {
  const response = await authenticatedFetch<void>(
    `/api/v1/admin/countries/${countryId}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.success) {
    return { success: false, error: response.error };
  }

  return { success: true };
}
