"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { siteContent } from "@/content/he";
import { Button, Icon } from "@/components/shared";
import { useAuth } from "@/contexts";
import { isAuthenticated as hasToken, getAccessToken } from "@/services/auth";
import { debugLog } from "@/utils/debug";

export const MobileHeader = () => {
  const { nav, mobile } = siteContent;
  const router = useRouter();
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Track token status in state to handle hydration properly
  const [tokenExists, setTokenExists] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const renderCount = useRef(0);
  const mountTime = useRef(Date.now());

  // Log on every render to track state changes
  renderCount.current += 1;
  debugLog('MobileHeader', 'RENDER', {
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

    debugLog('MobileHeader', 'useEffect - Auth state check', {
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

    debugLog('MobileHeader', 'LOGO CLICKED', {
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
      debugLog('MobileHeader', 'NAVIGATION PREVENTED - redirecting to questionnaire', {
        from: window.location.pathname,
        to: '/questionnaire/countries',
      });
      router.push('/questionnaire/countries');
    } else {
      debugLog('MobileHeader', 'NAVIGATION ALLOWED - letting anchor navigate to home', {
        reason: !currentToken ? 'No token' : 'Onboarding completed or not authenticated',
      });
    }
  }, [shouldRestrictNavigation, tokenExists, isAuthenticated, hasCompletedOnboarding, isLoading, isHydrated, router]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen, closeMenu]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white h-[52px] border-b border-[#C6C6C6]">
        <div className="h-full px-4 flex items-center" dir="ltr">
          {/* Menu button - LEFT (visual) */}
          <button
            onClick={toggleMenu}
            className="w-10 h-10 flex items-center justify-center"
            aria-label={isMenuOpen ? "סגור תפריט" : "פתח תפריט"}
            aria-expanded={isMenuOpen}
          >
            <Icon name="menu" size={24} className="text-[#1D1D1B]" />
          </button>

          {/* CTA Button - Placeholder (no navigation) */}
          <Button variant="primary" size="sm" className="ml-2 text-xs px-3 py-1.5">
            {nav.cta}
          </Button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Logo - RIGHT (visual) - always href="/" but onClick intercepts if needed */}
          <a
            href="/"
            className="flex items-center"
            onClick={handleLogoClick}
          >
            <img
              src="/logo-header.svg"
              alt="Relogate"
              style={{ width: '120px', height: '25.5px' }}
            />
          </a>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={closeMenu}
            />

            {/* Menu Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[280px] bg-white shadow-xl"
              role="dialog"
              aria-modal="true"
              aria-label="תפריט ניווט"
            >
              {/* Close button */}
              <div className="h-[52px] px-4 flex items-center justify-between border-b border-[#C6C6C6]">
                <button
                  onClick={closeMenu}
                  className="w-10 h-10 flex items-center justify-center"
                  aria-label="סגור תפריט"
                >
                  <Icon name="close" size={24} className="text-[#1D1D1B]" />
                </button>
                <span className="font-medium text-[#1D1D1B]">
                  {mobile.menu.close}
                </span>
              </div>

              {/* Navigation */}
              <nav className="p-6">
                <ul className="space-y-4">
                  {nav.items.map((item, index) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <a
                        href={item.href}
                        onClick={closeMenu}
                        className="block py-2 text-lg text-[#1D1D1B] hover:text-[#215388] transition-colors"
                      >
                        {item.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA in menu - Placeholder (no navigation) */}
                <div className="mt-8">
                  <Button variant="primary" size="md" fullWidth onClick={closeMenu}>
                    {nav.cta}
                  </Button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileHeader;
