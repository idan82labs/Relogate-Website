"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteContent } from "@/content/he";
import { Button } from "@/components/shared";
import { useAuth } from "@/contexts";
import { isAuthenticated as hasToken } from "@/services/auth";
import { debugLog } from "@/utils/debug";

export const Header = () => {
  const { nav } = siteContent;
  const router = useRouter();
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth();

  // Track token status in state to handle hydration properly
  const [tokenExists, setTokenExists] = useState(false);

  useEffect(() => {
    const token = hasToken();
    setTokenExists(token);

    debugLog('Header', 'Auth state check', {
      tokenExists: token,
      isAuthenticated,
      hasCompletedOnboarding,
      isLoading,
    });
  }, [isAuthenticated, hasCompletedOnboarding, isLoading]);

  // Determine if navigation should be restricted
  const shouldRestrictNavigation = tokenExists && (isLoading || (isAuthenticated && !hasCompletedOnboarding));

  // Handle logo click - intercept and redirect if needed
  const handleLogoClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    debugLog('Header', 'Logo clicked', {
      shouldRestrictNavigation,
      tokenExists,
      isAuthenticated,
      hasCompletedOnboarding,
      isLoading,
    });

    if (shouldRestrictNavigation) {
      e.preventDefault();
      debugLog('Header', 'Preventing navigation, redirecting to questionnaire');
      router.push('/questionnaire/countries');
    }
    // If not restricted, the default Link behavior will navigate to "/"
  }, [shouldRestrictNavigation, tokenExists, isAuthenticated, hasCompletedOnboarding, isLoading, router]);

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
