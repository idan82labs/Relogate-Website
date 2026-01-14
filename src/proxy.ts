import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logInfo, logDebug, generateSessionId } from '@/lib/server-logger';

// Cookie name for logging session
const LOG_SESSION_COOKIE = 'relogate_log_session';

// Routes that are part of the questionnaire flow
const QUESTIONNAIRE_ROUTES = [
  '/questionnaire',
  '/questionnaire/countries',
  '/questionnaire/relocation-reason',
  '/questionnaire/family-status',
  '/questionnaire/personal-details',
  '/questionnaire/results',
];

// Routes that should be accessible without auth
const PUBLIC_ROUTES = ['/', '/login', '/register'];

// Admin routes - handled separately with their own login
const ADMIN_PUBLIC_ROUTES = ['/admin/login'];
const ADMIN_PROTECTED_PREFIX = '/admin';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get or create session ID for logging
  let sessionId = request.cookies.get(LOG_SESSION_COOKIE)?.value;
  const isNewSession = !sessionId;
  if (!sessionId) {
    sessionId = generateSessionId();
  }

  // Get auth cookies
  const authCookie = request.cookies.get('relogate_auth')?.value;
  const onboardingCookie = request.cookies.get('relogate_onboarding')?.value;
  const isAuthenticated = authCookie === 'true';
  const hasCompletedOnboarding = onboardingCookie === 'completed';

  // Get request metadata for logging
  const userAgent = request.headers.get('user-agent')?.substring(0, 100) || 'unknown';
  const referer = request.headers.get('referer') || 'direct';
  const method = request.method;

  // Enhanced logging with all context
  logInfo(sessionId, 'Proxy', 'Request received', {
    pathname,
    method,
    isAuthenticated,
    authCookie,
    onboardingCookie,
    hasCompletedOnboarding,
    isNewSession,
    userAgent,
    referer,
    allCookies: Array.from(request.cookies.getAll()).map(c => c.name),
  });

  // Helper to create response with session cookie
  const createResponse = (response: NextResponse, action: string): NextResponse => {
    logDebug(sessionId!, 'Proxy', `Action: ${action}`, { pathname });

    // Set session cookie if new
    if (isNewSession) {
      response.cookies.set(LOG_SESSION_COOKIE, sessionId!, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      });
    }
    return response;
  };

  // If user is authenticated but hasn't completed onboarding
  // Allow access to all routes - no forced questionnaire redirect
  if (isAuthenticated && !hasCompletedOnboarding) {
    logDebug(sessionId, 'Proxy', 'User authenticated but onboarding incomplete - allowing access', {
      pathname,
    });
  }

  // If user is authenticated and has completed onboarding
  if (isAuthenticated && hasCompletedOnboarding) {
    logDebug(sessionId, 'Proxy', 'User authenticated with completed onboarding', { pathname });

    // Redirect from questionnaire to home (they already completed it)
    if (QUESTIONNAIRE_ROUTES.some(route => pathname === route) && pathname !== '/questionnaire/results') {
      logInfo(sessionId, 'Proxy', 'REDIRECTING - onboarding completed, blocking questionnaire', {
        pathname,
        redirectTo: '/',
        reason: 'User already completed onboarding',
      });
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return createResponse(NextResponse.redirect(url), 'redirect-to-home');
    }
  }

  // Handle admin routes separately - redirect to /admin/login instead of /login
  const isAdminRoute = pathname.startsWith(ADMIN_PROTECTED_PREFIX);
  const isAdminPublicRoute = ADMIN_PUBLIC_ROUTES.includes(pathname);

  if (isAdminRoute && !isAdminPublicRoute && !isAuthenticated) {
    logInfo(sessionId, 'Proxy', 'REDIRECTING - unauthenticated user accessing admin route', {
      pathname,
      redirectTo: '/admin/login',
      reason: 'User not authenticated for admin area',
    });
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return createResponse(NextResponse.redirect(url), 'redirect-to-admin-login');
  }

  // If user is NOT authenticated and trying to access any protected page (non-admin)
  if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname) && !isAdminRoute) {
    logInfo(sessionId, 'Proxy', 'REDIRECTING - unauthenticated user accessing protected route', {
      pathname,
      redirectTo: '/login',
      reason: 'User not authenticated',
    });
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return createResponse(NextResponse.redirect(url), 'redirect-to-login');
  }

  // No redirect needed - allow access
  logDebug(sessionId, 'Proxy', 'Passing through', {
    pathname,
    isAuthenticated,
    hasCompletedOnboarding,
  });

  return createResponse(NextResponse.next(), 'pass-through');
}

// Configure which routes the proxy should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
