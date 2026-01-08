"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Splash, MobileHP3 } from "@/components/mobile";

const SPLASH_SEEN_KEY = "relogate_splash_seen";

export default function Home() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [showSplash, setShowSplash] = useState<boolean | null>(null);

  // Detect viewport and check splash state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Check if splash was already seen this session
    const splashSeen = sessionStorage.getItem(SPLASH_SEEN_KEY) === "true";
    setShowSplash(!splashSeen);

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSplashComplete = () => {
    // Mark splash as seen and navigate to login
    sessionStorage.setItem(SPLASH_SEEN_KEY, "true");
    router.push("/login");
  };

  const handleDesktopSplashComplete = () => {
    // Mark splash as seen and navigate to login
    sessionStorage.setItem(SPLASH_SEEN_KEY, "true");
    router.push("/login");
  };

  // Loading state - wait for both viewport and splash state to be determined
  if (isMobile === null || showSplash === null) {
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

  // Mobile Experience
  if (isMobile) {
    return (
      <AnimatePresence mode="wait">
        {showSplash && (
          <Splash key="splash" onComplete={handleSplashComplete} />
        )}
        {!showSplash && <MobileHP3 key="home" />}
      </AnimatePresence>
    );
  }

  // Desktop Experience
  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={handleDesktopSplashComplete} />
        )}
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
