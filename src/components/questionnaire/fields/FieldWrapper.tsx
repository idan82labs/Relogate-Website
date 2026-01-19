"use client";

import { motion, AnimatePresence } from "framer-motion";

interface FieldWrapperProps {
  /** Field label text */
  label: string;
  /** Unique name for htmlFor attribute */
  name: string;
  /** Whether the field is required */
  required?: boolean;
  /** Error message to display */
  error?: string;
  /** Optional hint text displayed below the label */
  hint?: string;
  /** Field content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * FieldWrapper - Common wrapper providing consistent layout for all fields
 * Handles label, required indicator, error message, and hint text display
 */
export function FieldWrapper({
  label,
  name,
  required = false,
  error,
  hint,
  children,
  className = "",
}: FieldWrapperProps) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;

  return (
    <div className={`w-full ${className}`} dir="rtl">
      {/* Label */}
      <label
        htmlFor={name}
        className="block text-base font-medium text-[#1D1D1B] mb-2"
      >
        {label}
        {required && (
          <span className="text-red-500 mr-1" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {/* Hint text */}
      {hint && (
        <p id={hintId} className="text-[14px] text-[#706F6F] mb-2">
          {hint}
        </p>
      )}

      {/* Field content */}
      {children}

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="mt-1 text-sm text-red-500"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

