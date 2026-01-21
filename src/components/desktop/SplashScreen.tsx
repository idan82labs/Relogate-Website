"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { siteContent } from "@/content/he";

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const { hero } = siteContent;

  const handleButtonClick = () => {
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
            <div className="relative flex items-end justify-center flex-row" style={{ direction: "ltr" }}>
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

              {/* Animated Globe as "o" */}
              <div className="relative w-[80px] lg:w-[115px] h-[80px] lg:h-[115px] -translate-y-[8px] lg:-translate-y-[12px]">
                <DotLottieReact
                  src="/earth.lottie"
                  loop
                  autoplay
                  style={{ width: "100%", height: "100%" }}
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
            onClick={handleButtonClick}
            className="bg-[#215388] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#1a4270] transition-colors cursor-pointer"
          >
            {hero.cta}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
