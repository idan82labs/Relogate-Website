"use client";

import { motion } from "framer-motion";
import { siteContent } from "@/content/he";

interface SplashProps {
  onComplete: () => void;
}

export const Splash = ({ onComplete }: SplashProps) => {
  const { mobile } = siteContent;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-white flex flex-col items-center"
    >
      {/*
        Layout based on Figma HP1 (375×812):
        - Logo at Y: 371px (~45.7% from top)
        - CTA at Y: 490px (~60.3% from top)
        Using percentage-based positioning for responsiveness
      */}

      {/* Spacer to push content down - positions logo at ~45% from top */}
      <div className="flex-[45] min-h-0" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-shrink-0 w-full px-7"
      >
        {/*
          Figma logo: 322×69px on 375px width = 85.9% width
          Logo positioned at x:26px from edge, so ~7% padding each side
          Using width-based sizing to match Figma proportions
        */}
        <img
          src="/logo.svg"
          alt="Relogate"
          className="w-full h-auto"
        />
      </motion.div>

      {/* Spacer between logo and CTA - approximately 50px gap in Figma */}
      <div className="flex-[15] min-h-[40px] max-h-[70px]" />

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex-shrink-0"
      >
        {/*
          Figma button: 165×40px, pill shape, #215388 background
          Font: Noto Sans Hebrew SemiBold, 14px
        */}
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

      {/* Bottom spacer - remaining space (~40% of screen) */}
      <div className="flex-[40] min-h-0" />
    </motion.div>
  );
};

export default Splash;
