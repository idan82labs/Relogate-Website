"use client";

import { useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BaseFieldProps } from "./types";

interface CheckboxFieldProps extends Omit<BaseFieldProps, "label"> {
  /** Checkbox label text */
  label: string;
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Change handler */
  onChange: (checked: boolean) => void;
  /** Additional description text below the label */
  description?: string;
}

/**
 * CheckboxField - Single checkbox for boolean values
 * Includes optional description text
 */
export function CheckboxField({
  name,
  label,
  checked,
  onChange,
  description,
  error,
  required = false,
  disabled = false,
  hint,
  className = "",
}: CheckboxFieldProps) {
  const generatedId = useId();
  const fieldId = name || generatedId;
  const errorId = `${fieldId}-error`;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const hintId = hint ? `${fieldId}-hint` : undefined;

  const handleChange = useCallback(() => {
    if (!disabled) {
      onChange(!checked);
    }
  }, [disabled, checked, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleChange();
      }
    },
    [handleChange]
  );

  return (
    <div className={`w-full ${className}`} dir="rtl">
      {/* Hint text above */}
      {hint && (
        <p id={hintId} className="text-[14px] text-[#706F6F] mb-2">
          {hint}
        </p>
      )}

      <label
        htmlFor={fieldId}
        className={`
          flex items-start gap-3 cursor-pointer
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input
          type="checkbox"
          id={fieldId}
          checked={checked}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            [error ? errorId : undefined, descriptionId, hintId]
              .filter(Boolean)
              .join(" ") || undefined
          }
          aria-required={required}
          className="sr-only"
        />
        <span
          className={`
            w-5 h-5 rounded-[4px] border-2 flex-shrink-0 mt-0.5
            flex items-center justify-center
            transition-colors duration-200
            ${
              checked
                ? "bg-[#215388] border-[#215388]"
                : error
                  ? "bg-white border-red-500"
                  : "bg-white border-[#C6C6C6]"
            }
          `}
        >
          {checked && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="text-white"
            >
              <path
                d="M10 3L4.5 8.5L2 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <div className="flex-1">
          <span className="text-[#1D1D1B] text-[16px]">
            {label}
            {required && (
              <span className="text-red-500 mr-1" aria-hidden="true">
                *
              </span>
            )}
          </span>
          {description && (
            <p
              id={descriptionId}
              className="text-[14px] text-[#706F6F] mt-1"
            >
              {description}
            </p>
          )}
        </div>
      </label>

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

