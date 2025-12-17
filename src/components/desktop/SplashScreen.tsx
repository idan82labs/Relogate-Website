"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteContent } from "@/content/he";

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const { hero } = siteContent;

  useEffect(() => {
    // Auto-hide after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleClick = () => {
    setIsVisible(false);
    onComplete?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
          onClick={handleClick}
        >
          {/* Logo with 3D Globe */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-16"
            dir="ltr"
            style={{ direction: "ltr", unicodeBidi: "isolate" }}
          >
            <div className="relative flex items-center justify-center flex-row" style={{ direction: "ltr" }}>
              {/* R-el */}
              <span className="text-[120px] lg:text-[180px] font-medium text-[#215388] tracking-tight leading-none">
                R
              </span>
              <span className="text-[120px] lg:text-[180px] font-medium text-[#215388] tracking-tight leading-none">
                e
              </span>
              <span className="text-[120px] lg:text-[180px] font-medium text-[#215388] tracking-tight leading-none">
                l
              </span>
              
              {/* 3D Globe as "o" */}
              <div className="relative w-[85px] lg:w-[128px] h-[85px] lg:h-[128px] mx-[-8px] lg:mx-[-12px]">
                <img 
                  src="/globe-3d-full.svg" 
                  alt="Globe" 
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>

              {/* gate */}
              <span className="text-[120px] lg:text-[180px] font-medium text-[#215388] tracking-tight leading-none">
                g
              </span>
              <span className="text-[120px] lg:text-[180px] font-medium text-[#215388] tracking-tight leading-none">
                a
              </span>
              <span className="text-[120px] lg:text-[180px] font-medium text-[#215388] tracking-tight leading-none">
                t
              </span>
              <span className="text-[120px] lg:text-[180px] font-medium text-[#215388] tracking-tight leading-none">
                e
              </span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#215388] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#1a4270] transition-colors"
          >
            {hero.cta}
          </motion.button>

          {/* Click anywhere hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="absolute bottom-8 text-sm text-[#706F6F]"
          >
            לחץ בכל מקום להמשך
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;

