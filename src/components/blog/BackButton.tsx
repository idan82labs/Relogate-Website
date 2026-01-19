"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { BackButtonProps } from "@/types/blog";

/**
 * BackButton - Navigation back button with arrow icon
 *
 * Used on article pages to return to the listing
 */
export function BackButton({ href, label }: BackButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-[16px] font-medium text-[var(--color-primary)] hover:opacity-70 transition-opacity group"
      >
        {/* Arrow pointing right (for RTL "back" direction) */}
        <motion.span
          className="text-lg"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
        <span>{label}</span>
      </Link>
    </motion.div>
  );
}
