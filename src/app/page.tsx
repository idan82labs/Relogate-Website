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

type MobilePhase = "splash" | "home";

export default function Home() {
  const router = useRouter();
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

  // Check if coming from auth (login/register) to skip splash
  useEffect(() => {
    if (typeof window !== "undefined" && isMobile !== null) {
      const urlParams = new URLSearchParams(window.location.search);
      // Skip splash ONLY when coming from auth (login/register success)
      const fromAuth = urlParams.get("from") === "auth";

      if (fromAuth) {
        // Skip splash and show main content
        if (isMobile) {
          setMobilePhase("home");
        } else {
          setShowDesktopSplash(false);
        }
      }
    }
  }, [isMobile]);

  const handleSplashComplete = () => {
    // Navigate to login page instead of continuing phases
    router.push("/login");
  };

  const handleDesktopSplashComplete = () => {
    // Navigate to login page instead of hiding splash
    router.push("/login");
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
        {mobilePhase === "home" && <MobileHP3 key="home" />}
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
