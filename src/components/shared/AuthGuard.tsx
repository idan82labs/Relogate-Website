'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts';

interface AuthGuardProps {
  children: ReactNode;
  /** Routes that don't require authentication */
  publicRoutes?: string[];
  /** Routes that are part of the questionnaire flow */
  questionnaireRoutes?: string[];
  /** Fallback component while loading */
  loadingFallback?: ReactNode;
}

const DEFAULT_PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
];

const DEFAULT_QUESTIONNAIRE_ROUTES = [
  '/questionnaire',
  '/questionnaire/v2',
  '/questionnaire/update',
];

export function AuthGuard({
  children,
  publicRoutes = DEFAULT_PUBLIC_ROUTES,
  questionnaireRoutes = DEFAULT_QUESTIONNAIRE_ROUTES,
  loadingFallback,
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, hasCompletedOnboarding } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
    const isQuestionnaireRoute = questionnaireRoutes.some(route => pathname === route || pathname.startsWith(route));

    // Not authenticated
    if (!isAuthenticated) {
      // Allow public routes and questionnaire landing
      if (isPublicRoute) {
        return;
      }
      // Redirect to login for protected routes
      router.replace('/login');
      return;
    }

    // Authenticated but hasn't completed onboarding
    // Allow access to all routes - no forced questionnaire redirect

    // Authenticated and completed onboarding
    // Redirect away from login/register if already authenticated
    if (pathname === '/login' || pathname === '/register') {
      router.replace('/');
      return;
    }
  }, [
    isAuthenticated,
    isLoading,
    hasCompletedOnboarding,
    pathname,
    router,
    publicRoutes,
    questionnaireRoutes,
  ]);

  // Show loading state
  if (isLoading) {
    if (loadingFallback) {
      return <>{loadingFallback}</>;
    }
    // Default loading state - matches the existing pattern from page.tsx
    return (
      <div className="min-h-screen bg-[var(--color-gray-warm)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
