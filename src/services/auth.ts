/**
 * Auth Service - Handles authentication API calls to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Translate API error messages to Hebrew for user display
 * Logs original error in English for debugging
 */
function translateError(error: string, code?: string): string {
  // Map common error patterns to Hebrew messages
  const errorMap: Record<string, string> = {
    'Validation failed': 'אנא בדוק את הפרטים שהזנת',
    'Email already registered': 'כתובת האימייל כבר רשומה במערכת',
    'Invalid email or password': 'אימייל או סיסמה שגויים',
    'Invalid email address': 'כתובת אימייל לא תקינה',
    'Email address is not allowed': 'כתובת האימייל אינה מותרת. נסה כתובת אחרת.',
    'Password must be at least 8 characters': 'הסיסמה חייבת להכיל לפחות 8 תווים',
    'First name is required': 'נא להזין שם פרטי',
    'Last name is required': 'נא להזין שם משפחה',
    'Network error. Please try again.': 'שגיאת רשת. אנא נסה שוב.',
    'Registration failed': 'ההרשמה נכשלה. אנא נסה שוב.',
    'Login failed': 'ההתחברות נכשלה. אנא נסה שוב.',
  };

  // Check for exact match
  if (errorMap[error]) {
    return errorMap[error];
  }

  // Check for partial matches (for errors like "Validation failed" with details)
  for (const [pattern, translation] of Object.entries(errorMap)) {
    if (error.toLowerCase().includes(pattern.toLowerCase())) {
      return translation;
    }
  }

  // Check error code for specific cases
  if (code === 'VALIDATION_ERROR') {
    return 'אנא בדוק את הפרטים שהזנת';
  }
  if (code === 'CONFLICT') {
    return 'כתובת האימייל כבר רשומה במערכת';
  }

  // Default error message in Hebrew
  return 'אירעה שגיאה. אנא נסה שוב.';
}

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

type OnboardingStatus = 'pending' | 'in_progress' | 'completed';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  emailVerified: boolean;
  onboardingStatus: OnboardingStatus;
  createdAt: string;
}

interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
}

// Storage keys
const ACCESS_TOKEN_KEY = 'relogate_access_token';
const REFRESH_TOKEN_KEY = 'relogate_refresh_token';
const AUTH_COOKIE_KEY = 'relogate_auth';
const ONBOARDING_COOKIE_KEY = 'relogate_onboarding';

/**
 * Set a cookie with proper options
 */
function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Delete a cookie
 */
function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

/**
 * Store auth tokens in localStorage and set auth cookie for middleware
 */
function storeTokens(tokens: AuthTokens, onboardingStatus?: OnboardingStatus): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);

  // Set cookies for middleware access
  setCookie(AUTH_COOKIE_KEY, 'true');
  if (onboardingStatus) {
    setCookie(ONBOARDING_COOKIE_KEY, onboardingStatus);
  }
}

/**
 * Update onboarding status cookie
 */
export function setOnboardingCookie(status: OnboardingStatus): void {
  setCookie(ONBOARDING_COOKIE_KEY, status);
}

/**
 * Clear stored tokens and cookies
 */
function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);

  // Clear auth cookies
  deleteCookie(AUTH_COOKIE_KEY);
  deleteCookie(ONBOARDING_COOKIE_KEY);
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
      // Log original error in English for debugging
      console.error('Login failed:', data.error, data.code);
      // Return translated Hebrew error for user display
      return { user: null as unknown as User, error: translateError(data.error || 'Login failed', data.code) };
    }

    if (data.data?.tokens) {
      storeTokens(data.data.tokens, data.data.user.onboardingStatus);
    }

    return { user: data.data!.user };
  } catch (error) {
    console.error('Login error:', error);
    return { user: null as unknown as User, error: translateError('Network error. Please try again.') };
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
      // Log original error in English for debugging
      console.error('Registration failed:', data.error, data.code);
      // Return translated Hebrew error for user display
      return { user: null as unknown as User, error: translateError(data.error || 'Registration failed', data.code) };
    }

    if (data.data?.tokens) {
      storeTokens(data.data.tokens, data.data.user.onboardingStatus);
    }

    return { user: data.data!.user };
  } catch (error) {
    console.error('Registration error:', error);
    return { user: null as unknown as User, error: translateError('Network error. Please try again.') };
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

export type { User, AuthTokens, LoginResponse, RegisterResponse, OnboardingStatus };
