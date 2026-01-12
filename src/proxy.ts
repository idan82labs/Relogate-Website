import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logInfo, logDebug, generateSessionId } from '@/lib/server-logger';

// Cookie name for logging session
const LOG_SESSION_COOKIE = 'relogate_log_session';

// Routes that require completed onboarding
const PROTECTED_ROUTES = ['/'];

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
const PUBLIC_ROUTES = ['/login', '/register'];

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
  if (isAuthenticated && !hasCompletedOnboarding) {
    logDebug(sessionId, 'Proxy', 'User authenticated but onboarding incomplete', {
      pathname,
      checkingQuestionnaireRoutes: QUESTIONNAIRE_ROUTES,
      checkingProtectedRoutes: PROTECTED_ROUTES,
    });

    // Allow access to questionnaire routes
    if (QUESTIONNAIRE_ROUTES.some(route => pathname.startsWith(route))) {
      logInfo(sessionId, 'Proxy', 'Allowing questionnaire route access', { pathname });
      return createResponse(NextResponse.next(), 'allow-questionnaire');
    }

    // Allow access to public routes (login/register) - they will redirect themselves
    if (PUBLIC_ROUTES.includes(pathname)) {
      logInfo(sessionId, 'Proxy', 'Allowing public route access', { pathname });
      return createResponse(NextResponse.next(), 'allow-public');
    }

    // Redirect from protected routes (like home) to questionnaire
    if (PROTECTED_ROUTES.includes(pathname)) {
      logInfo(sessionId, 'Proxy', 'REDIRECTING - incomplete onboarding, blocking protected route', {
        pathname,
        redirectTo: '/questionnaire/countries',
        reason: 'User authenticated but has not completed onboarding',
      });
      const url = request.nextUrl.clone();
      url.pathname = '/questionnaire/countries';
      return createResponse(NextResponse.redirect(url), 'redirect-to-questionnaire');
    }
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

  // If user is NOT authenticated and trying to access questionnaire routes
  if (!isAuthenticated && QUESTIONNAIRE_ROUTES.some(route => pathname.startsWith(route))) {
    logInfo(sessionId, 'Proxy', 'REDIRECTING - unauthenticated user accessing questionnaire', {
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
