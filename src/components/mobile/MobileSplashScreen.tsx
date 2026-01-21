"use client";

import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { siteContent } from "@/content/he";

interface MobileSplashScreenProps {
  onComplete: () => void;
}

export const MobileSplashScreen = ({ onComplete }: MobileSplashScreenProps) => {
  const { mobile } = siteContent;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-white flex flex-col items-center"
    >
      {/* Spacer to push content down - positions logo at ~45% from top */}
      <div className="flex-[45] min-h-0" />

      {/* Logo with Animated Globe */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-shrink-0"
        dir="ltr"
        style={{ direction: "ltr", unicodeBidi: "isolate" }}
      >
        <div className="relative flex items-end justify-center flex-row" style={{ direction: "ltr" }}>
          {/* Rel */}
          <span className="text-[48px] sm:text-[56px] font-medium text-[#215388] tracking-tight leading-none">
            R
          </span>
          <span className="text-[48px] sm:text-[56px] font-medium text-[#215388] tracking-tight leading-none">
            e
          </span>
          <span className="text-[48px] sm:text-[56px] font-medium text-[#215388] tracking-tight leading-none">
            l
          </span>

          {/* Animated Globe as "o" */}
          <div className="relative w-[32px] sm:w-[38px] h-[32px] sm:h-[38px] -translate-y-[3px] sm:-translate-y-[4px]">
            <DotLottieReact
              src="/earth.lottie"
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          {/* gate */}
          <span className="text-[48px] sm:text-[56px] font-medium text-[#215388] tracking-tight leading-none">
            g
          </span>
          <span className="text-[48px] sm:text-[56px] font-medium text-[#215388] tracking-tight leading-none">
            a
          </span>
          <span className="text-[48px] sm:text-[56px] font-medium text-[#215388] tracking-tight leading-none">
            t
          </span>
          <span className="text-[48px] sm:text-[56px] font-medium text-[#215388] tracking-tight leading-none">
            e
          </span>
        </div>
      </motion.div>

      {/* Spacer between logo and CTA */}
      <div className="flex-[15] min-h-[40px] max-h-[70px]" />

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex-shrink-0"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
          onClick={onComplete}
          className="
            min-w-[165px] h-[40px] px-6
            bg-[#215388] text-white
            rounded-[100px]
            font-semibold text-sm
            transition-colors duration-200
            hover:bg-[#1a4270] active:bg-[#153659]
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-[#215388] focus-visible:ring-offset-2
          "
        >
          {mobile.splash.cta}
        </motion.button>
      </motion.div>

      {/* Bottom spacer */}
      <div className="flex-[40] min-h-0" />
    </motion.div>
  );
};
