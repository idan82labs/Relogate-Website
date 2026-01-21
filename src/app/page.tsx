"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Desktop components
import {
  Header,
  SplashScreen,
  Hero,
  AboutSection,
  BannerToInfoTransition,
  HowItWorks,
  Testimonials,
  ArticlesCarousel,
  FAQ,
  Contact,
  Footer,
} from "@/components/desktop";

// Mobile components
import { MobileSplashScreen, WelcomeIntro, MobileHomepage } from "@/components/mobile";

const SPLASH_SEEN_KEY = "relogate_splash_seen";
const WELCOME_SEEN_KEY = "relogate_welcome_seen";

export default function Home() {
  // Combined client state to avoid multiple setState calls in useEffect
  const [clientState, setClientState] = useState<{
    isMobile: boolean;
    showSplash: boolean;
    showWelcome: boolean;
  } | null>(null);

  // Initialize client-only state after hydration
  // This pattern is required for SSR apps - sessionStorage is only available on client
  useEffect(() => {
    const splashSeen = sessionStorage.getItem(SPLASH_SEEN_KEY) === "true";
    const welcomeSeen = sessionStorage.getItem(WELCOME_SEEN_KEY) === "true";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Required for SSR hydration with client-only sessionStorage
    setClientState({
      isMobile: window.innerWidth < 1024,
      showSplash: !splashSeen,
      showWelcome: splashSeen && !welcomeSeen,
    });

    const handleResize = () => {
      setClientState((prev) =>
        prev ? { ...prev, isMobile: window.innerWidth < 1024 } : null
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSplashComplete = () => {
    // Mark splash as seen and show welcome intro
    sessionStorage.setItem(SPLASH_SEEN_KEY, "true");
    setClientState((prev) => (prev ? { ...prev, showSplash: false, showWelcome: true } : null));
  };

  const handleWelcomeComplete = () => {
    // Mark welcome as seen and show homepage
    sessionStorage.setItem(WELCOME_SEEN_KEY, "true");
    setClientState((prev) => (prev ? { ...prev, showWelcome: false } : null));
  };

  // Loading state - wait for client state to be initialized
  if (clientState === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse">
          <svg
            width="48"
            height="48"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="16" cy="16" r="14" fill="#239083" />
            <ellipse
              cx="16"
              cy="16"
              rx="6"
              ry="14"
              stroke="#215388"
              strokeWidth="1.5"
            />
            <path d="M2 16h28" stroke="#215388" strokeWidth="1.5" />
            <ellipse
              cx="16"
              cy="16"
              rx="14"
              ry="6"
              stroke="#215388"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>
    );
  }

  const { isMobile, showSplash, showWelcome } = clientState;

  // Mobile Experience: Splash → WelcomeIntro (HP2) → Homepage (HP3)
  if (isMobile) {
    return (
      <AnimatePresence mode="wait">
        {showSplash && (
          <MobileSplashScreen key="splash" onComplete={handleSplashComplete} />
        )}
        {!showSplash && showWelcome && (
          <WelcomeIntro key="welcome" onComplete={handleWelcomeComplete} />
        )}
        {!showSplash && !showWelcome && <MobileHomepage key="home" />}
      </AnimatePresence>
    );
  }

  // Desktop Experience
  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="min-h-screen bg-white"
      >
        <Header />
        <Hero />
        <AboutSection />
        <BannerToInfoTransition />
        <HowItWorks />
        <Testimonials />
        <ArticlesCarousel />
        <FAQ />
        <Contact />
        <Footer />
      </motion.main>
    </>
  );
}
