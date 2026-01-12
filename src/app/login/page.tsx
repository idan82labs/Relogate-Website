"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts";

// Desktop components
import { LoginForm } from "@/components/desktop";

// Mobile components
import { MobileLoginForm, WelcomeIntro } from "@/components/mobile";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [showWelcomeIntro, setShowWelcomeIntro] = useState(false);

  // Detect viewport and set mobile state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      if (hasCompletedOnboarding) {
        router.replace("/");
      } else {
        router.replace("/questionnaire");
      }
    }
  }, [isAuthenticated, hasCompletedOnboarding, isLoading, router]);

  const handleLoginSuccess = () => {
    if (isMobile) {
      // Show WelcomeIntro animation on mobile before redirecting
      setShowWelcomeIntro(true);
    } else {
      // Desktop: redirect based on onboarding status
      // After login, useAuth will update and the useEffect above will handle redirect
      // But we need to refresh the auth state first
      router.push("/questionnaire");
    }
  };

  const handleWelcomeIntroComplete = () => {
    // After WelcomeIntro animation, redirect to questionnaire
    // (AuthGuard will redirect to home if onboarding is complete)
    router.push("/questionnaire");
  };

  // Show loading while checking auth state
  if (isLoading || isMobile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="animate-pulse"
        >
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
        </motion.div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  // Mobile Experience
  if (isMobile) {
    return (
      <AnimatePresence mode="wait">
        {showWelcomeIntro ? (
          <WelcomeIntro key="welcome" onComplete={handleWelcomeIntroComplete} />
        ) : (
          <MobileLoginForm key="login" onLoginSuccess={handleLoginSuccess} />
        )}
      </AnimatePresence>
    );
  }

  // Desktop Experience
  return <LoginForm onLoginSuccess={handleLoginSuccess} />;
}
