"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Desktop components
import {
  PersonalAreaWelcome,
  PersonalAreaRegistration,
} from "@/components/desktop";

// Mobile components
import {
  MobilePersonalAreaWelcome,
  MobilePersonalAreaRegistration,
} from "@/components/mobile";

type ViewType = "login" | "register";

export default function PersonalAreaPage() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("login");

  // Detect viewport and set mobile state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNavigateToRegister = () => {
    setCurrentView("register");
  };

  const handleNavigateToLogin = () => {
    setCurrentView("login");
  };

  // Loading state
  if (isMobile === null) {
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

  // Mobile Experience
  if (isMobile) {
    return (
      <AnimatePresence mode="wait">
        {currentView === "login" ? (
          <motion.div
            key="mobile-login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MobilePersonalAreaWelcome
              onNavigateToRegister={handleNavigateToRegister}
            />
          </motion.div>
        ) : (
          <motion.div
            key="mobile-register"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MobilePersonalAreaRegistration
              onNavigateToLogin={handleNavigateToLogin}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop Experience
  return (
    <AnimatePresence mode="wait">
      {currentView === "login" ? (
        <motion.div
          key="desktop-login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PersonalAreaWelcome onNavigateToRegister={handleNavigateToRegister} />
        </motion.div>
      ) : (
        <motion.div
          key="desktop-register"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PersonalAreaRegistration onNavigateToLogin={handleNavigateToLogin} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
