"use client";

import { motion } from "framer-motion";
import { MobileHeader } from "./MobileHeader";

interface MobileHP3Props {
  onComplete?: () => void;
}

/**
 * Mobile HP3 - Placeholder component
 * TODO: Implement based on Figma design (mobile HP3: node 265-683)
 */
export const MobileHP3 = ({ onComplete }: MobileHP3Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-40 bg-white flex flex-col"
    >
      {/* Header */}
      <MobileHeader />

      {/* Placeholder content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#215388]/10 flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[#215388]"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-medium text-[#1D1D1B] mb-2">
            Mobile HP3
          </h2>
          <p className="text-[#706F6F] mb-8">
            Placeholder - To be implemented
          </p>
          {onComplete && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onComplete}
              className="
                px-8 py-3
                bg-[#215388] text-white
                rounded-[100px]
                font-semibold text-base
                transition-colors duration-200
                hover:bg-[#1a4270]
              "
            >
              Continue to Home
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MobileHP3;
