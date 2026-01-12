"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { siteContent } from "@/content/he";
import { Icon } from "@/components/shared";
import { useAuth } from "@/contexts";
import { isAuthenticated as hasToken } from "@/services/auth";
import { debugLog } from "@/utils/debug";

/**
 * MobileFooter - Shared footer component for all mobile pages
 */
export const MobileFooter = () => {
  const { footer } = siteContent;
  const router = useRouter();
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth();

  // Track token status in state to handle hydration properly
  const [tokenExists, setTokenExists] = useState(false);

  useEffect(() => {
    const token = hasToken();
    setTokenExists(token);

    debugLog('MobileFooter', 'Auth state check', {
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
    debugLog('MobileFooter', 'Logo clicked', {
      shouldRestrictNavigation,
      tokenExists,
      isAuthenticated,
      hasCompletedOnboarding,
      isLoading,
    });

    if (shouldRestrictNavigation) {
      e.preventDefault();
      debugLog('MobileFooter', 'Preventing navigation, redirecting to questionnaire');
      router.push('/questionnaire/countries');
    }
  }, [shouldRestrictNavigation, tokenExists, isAuthenticated, hasCompletedOnboarding, isLoading, router]);

  return (
    <footer className="bg-[#215388] py-8 px-4">
      <div className="flex flex-col items-center text-center">
        {/* Logo - always href="/" but onClick intercepts if needed */}
        <a
          href="/"
          className="flex items-center mb-4"
          onClick={handleLogoClick}
        >
          <img
            src="/logo-white.svg"
            alt="Relogate"
            style={{ width: "140px", height: "29px" }}
          />
        </a>

        {/* Contact Info */}
        <div className="text-white/80 text-sm space-y-1 mb-4">
          <p>{footer.email}</p>
          <p dir="ltr">{footer.phone}</p>
        </div>

        {/* Social Icons */}
        <div className="flex gap-3 mb-4">
          <a
            href="#"
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
            aria-label="Facebook"
          >
            <Icon name="facebook" size={16} className="text-white" />
          </a>
          <a
            href="#"
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
            aria-label="Instagram"
          >
            <Icon name="instagram" size={16} className="text-white" />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-white/60 text-xs">{footer.copyright}</p>
      </div>
    </footer>
  );
};

export default MobileFooter;
