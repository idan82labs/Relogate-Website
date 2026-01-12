import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

  // Get auth cookies
  const isAuthenticated = request.cookies.get('relogate_auth')?.value === 'true';
  const onboardingStatus = request.cookies.get('relogate_onboarding')?.value;
  const hasCompletedOnboarding = onboardingStatus === 'completed';

  // Debug logging (visible in server console)
  console.log(`[Proxy] Path: ${pathname}, Auth: ${isAuthenticated}, Onboarding: ${onboardingStatus}`);

  // If user is authenticated but hasn't completed onboarding
  if (isAuthenticated && !hasCompletedOnboarding) {
    // Allow access to questionnaire routes
    if (QUESTIONNAIRE_ROUTES.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // Allow access to public routes (login/register) - they will redirect themselves
    if (PUBLIC_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }

    // Redirect from protected routes (like home) to questionnaire
    if (PROTECTED_ROUTES.includes(pathname)) {
      console.log(`[Proxy] Redirecting to questionnaire - incomplete onboarding`);
      const url = request.nextUrl.clone();
      url.pathname = '/questionnaire/countries';
      return NextResponse.redirect(url);
    }
  }

  // If user is authenticated and has completed onboarding
  if (isAuthenticated && hasCompletedOnboarding) {
    // Redirect from questionnaire to home (they already completed it)
    if (QUESTIONNAIRE_ROUTES.some(route => pathname === route) && pathname !== '/questionnaire/results') {
      console.log(`[Proxy] Redirecting to home - onboarding already completed`);
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
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
