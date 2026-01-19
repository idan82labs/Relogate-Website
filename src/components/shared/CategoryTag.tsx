"use client";

import { motion } from "framer-motion";

interface CategoryTagProps {
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * CategoryTag - Clickable pill/tag for category selection
 * Used in results detail view for info categories like visa, healthcare, etc.
 */
export const CategoryTag = ({
  label,
  isSelected = false,
  onClick,
  className = "",
}: CategoryTagProps) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`
        px-4 py-2 rounded-[10px] text-[14px] lg:text-[16px] text-center
        border border-[#C6C6C6] transition-colors duration-200
        ${
          isSelected
            ? "bg-[#215388] text-white border-[#215388]"
            : "bg-white text-[#1D1D1B] hover:border-[#215388]"
        }
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {label}
    </motion.button>
  );
};

