"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteContent } from "@/content/he";
import { Button } from "@/components/shared";
import { useAuth } from "@/contexts";
import { isAuthenticated as hasToken, getAccessToken } from "@/services/auth";
import { debugLog } from "@/utils/debug";

export const Header = () => {
  const { nav } = siteContent;
  const router = useRouter();
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth();

  // Track token status in state to handle hydration properly
  const [tokenExists, setTokenExists] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const renderCount = useRef(0);
  const mountTime = useRef(Date.now());

  // Log on every render to track state changes
  renderCount.current += 1;
  debugLog('Header', 'RENDER', {
    renderCount: renderCount.current,
    timeSinceMount: Date.now() - mountTime.current,
    tokenExists,
    isHydrated,
    isAuthenticated,
    hasCompletedOnboarding,
    isLoading,
  });

  useEffect(() => {
    const token = hasToken();
    const accessToken = getAccessToken();
    setTokenExists(token);
    setIsHydrated(true);

    debugLog('Header', 'useEffect - Auth state check', {
      tokenExists: token,
      hasAccessToken: !!accessToken,
      accessTokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : null,
      isAuthenticated,
      hasCompletedOnboarding,
      isLoading,
      timeSinceMount: Date.now() - mountTime.current,
    });
  }, [isAuthenticated, hasCompletedOnboarding, isLoading]);

  // Determine if navigation should be restricted
  const shouldRestrictNavigation = tokenExists && (isLoading || (isAuthenticated && !hasCompletedOnboarding));

  // Handle logo click - intercept and redirect if needed
  const handleLogoClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    // Read token directly at click time to avoid stale closure
    const currentToken = hasToken();
    const currentShouldRestrict = currentToken && (isLoading || (isAuthenticated && !hasCompletedOnboarding));

    debugLog('Header', 'LOGO CLICKED', {
      eventType: e.type,
      eventDefaultPrevented: e.defaultPrevented,
      shouldRestrictNavigation,
      currentShouldRestrict,
      tokenExists,
      currentToken,
      isAuthenticated,
      hasCompletedOnboarding,
      isLoading,
      isHydrated,
      timeSinceMount: Date.now() - mountTime.current,
    });

    if (currentShouldRestrict) {
      e.preventDefault();
      e.stopPropagation();
      debugLog('Header', 'NAVIGATION PREVENTED - redirecting to questionnaire', {
        from: window.location.pathname,
        to: '/questionnaire/countries',
      });
      router.push('/questionnaire/countries');
    } else {
      debugLog('Header', 'NAVIGATION ALLOWED - letting Link navigate to home', {
        reason: !currentToken ? 'No token' : 'Onboarding completed or not authenticated',
      });
    }
  }, [shouldRestrictNavigation, tokenExists, isAuthenticated, hasCompletedOnboarding, isLoading, isHydrated, router]);

  return (
    <header className="sticky top-0 z-50 bg-white h-[88px] border-b border-[#C6C6C6]">
      <div className="container h-full flex items-center justify-between">
        {/* Logo - always href="/" but onClick intercepts if needed */}
        <Link
          href="/"
          className="flex items-center"
          onClick={handleLogoClick}
        >
          <img src="/logo-header.svg" alt="Relogate" style={{ width: '167px', height: '35.5px' }} />
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {nav.items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[#1D1D1B] text-base hover:text-[#215388] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA Button - Placeholder (no navigation) */}
        <Button variant="primary" size="md">
          {nav.cta}
        </Button>
      </div>
    </header>
  );
};

export default Header;
