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
import { Splash, WelcomeIntro, MobileHP3, MobileHome } from "@/components/mobile";

type MobilePhase = "splash" | "intro" | "hp3" | "home";

const SESSION_KEY = "relogate_visited";
const DESKTOP_SPLASH_KEY = "relogate_desktop_splash";

export default function Home() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [mobilePhase, setMobilePhase] = useState<MobilePhase>("splash");
  const [showDesktopSplash, setShowDesktopSplash] = useState(true);

  // Detect viewport and set mobile state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check session storage for returning visitors
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Allow forcing splash screen with ?splash=1 query param
      const urlParams = new URLSearchParams(window.location.search);
      const forceSplash = urlParams.get("splash") === "1";

      // Mobile returning visitors
      if (isMobile) {
        const hasVisited = sessionStorage.getItem(SESSION_KEY);
        if (hasVisited && !forceSplash) {
          setMobilePhase("home");
        }
      }
      // Desktop returning visitors
      if (!isMobile && isMobile !== null) {
        const hasSeenSplash = sessionStorage.getItem(DESKTOP_SPLASH_KEY);
        if (hasSeenSplash && !forceSplash) {
          setShowDesktopSplash(false);
        }
      }
    }
  }, [isMobile]);

  // Mark as visited when reaching home
  useEffect(() => {
    if (mobilePhase === "home" && typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_KEY, "true");
    }
  }, [mobilePhase]);

  const handleSplashComplete = () => {
    setMobilePhase("intro");
  };

  const handleIntroComplete = () => {
    setMobilePhase("hp3");
  };

  const handleHP3Complete = () => {
    setMobilePhase("home");
  };

  const handleDesktopSplashComplete = () => {
    setShowDesktopSplash(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(DESKTOP_SPLASH_KEY, "true");
    }
  };

  // Loading state
  if (isMobile === null) {
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
        {mobilePhase === "splash" && (
          <Splash key="splash" onComplete={handleSplashComplete} />
        )}
        {mobilePhase === "intro" && (
          <WelcomeIntro key="intro" onComplete={handleIntroComplete} />
        )}
        {mobilePhase === "hp3" && (
          <MobileHP3 key="hp3" onComplete={handleHP3Complete} />
        )}
        {mobilePhase === "home" && <MobileHome key="home" />}
      </AnimatePresence>
    );
  }

  // Desktop Experience
  return (
    <>
      <AnimatePresence>
        {showDesktopSplash && (
          <SplashScreen onComplete={handleDesktopSplashComplete} />
        )}
      </AnimatePresence>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: showDesktopSplash ? 0 : 1 }}
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
