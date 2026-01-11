/**
 * Auth Service - Handles authentication API calls to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types for API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt: number;
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  emailVerified: boolean;
  createdAt: string;
}

interface LoginResponse {
  user: User;
  session: AuthTokens;
}

interface RegisterResponse {
  user: User;
  session: AuthTokens;
}

// Storage keys
const ACCESS_TOKEN_KEY = 'relogate_access_token';
const REFRESH_TOKEN_KEY = 'relogate_refresh_token';

/**
 * Store auth tokens in localStorage
 */
function storeTokens(tokens: AuthTokens): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

/**
 * Clear stored tokens
 */
function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Get stored access token
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Get stored refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

/**
 * Login user with email and password
 */
export async function login(email: string, password: string): Promise<{ user: User; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data: ApiResponse<LoginResponse> = await response.json();

    if (!response.ok || !data.success) {
      return { user: null as unknown as User, error: data.error || 'Login failed' };
    }

    if (data.data?.session) {
      storeTokens(data.data.session);
    }

    return { user: data.data!.user };
  } catch (error) {
    console.error('Login error:', error);
    return { user: null as unknown as User, error: 'Network error. Please try again.' };
  }
}

/**
 * Register new user
 */
export async function register(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}): Promise<{ user: User; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data: ApiResponse<RegisterResponse> = await response.json();

    if (!response.ok || !data.success) {
      return { user: null as unknown as User, error: data.error || 'Registration failed' };
    }

    if (data.data?.session) {
      storeTokens(data.data.session);
    }

    return { user: data.data!.user };
  } catch (error) {
    console.error('Registration error:', error);
    return { user: null as unknown as User, error: 'Network error. Please try again.' };
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  const accessToken = getAccessToken();

  if (accessToken) {
    try {
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  clearTokens();
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data: ApiResponse<{ session: AuthTokens }> = await response.json();

    if (!response.ok || !data.success || !data.data?.session) {
      clearTokens();
      return false;
    }

    storeTokens(data.data.session);
    return true;
  } catch (error) {
    console.error('Token refresh error:', error);
    clearTokens();
    return false;
  }
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User | null> {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data: ApiResponse<{ user: User }> = await response.json();

    if (!response.ok || !data.success) {
      // Try to refresh token if unauthorized
      if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          return getCurrentUser();
        }
      }
      return null;
    }

    return data.data!.user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export type { User, AuthTokens, LoginResponse, RegisterResponse };
