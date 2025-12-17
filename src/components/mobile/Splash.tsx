"use client";

import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Button } from "@/components/shared";

interface SplashProps {
  onComplete: () => void;
}

export const Splash = ({ onComplete }: SplashProps) => {
  const { mobile, hero } = siteContent;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-8"
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12"
      >
        <img src="/logo.svg" alt="Relogate" className="h-16" />
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Button variant="primary" size="lg" onClick={onComplete}>
          {mobile.splash.cta}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Splash;
