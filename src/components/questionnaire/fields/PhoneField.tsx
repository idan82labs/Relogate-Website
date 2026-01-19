"use client";

import { forwardRef, useState, useCallback, useId } from "react";
import { motion } from "framer-motion";
import { FieldWrapper } from "./FieldWrapper";
import type { BaseFieldProps } from "./types";

interface PhoneFieldProps extends BaseFieldProps {
  /** Current field value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
}

/**
 * PhoneField - Phone number input
 * Uses LTR direction for numbers with Israeli phone format support
 */
export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(
  (
    {
      name,
      label,
      value,
      onChange,
      placeholder = "050-000-0000",
      error,
      required = false,
      disabled = false,
      hint,
      className = "",
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const generatedId = useId();
    const fieldId = name || generatedId;
    const errorId = `${fieldId}-error`;
    const hintId = hint ? `${fieldId}-hint` : undefined;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        // Allow only numbers, dashes, parentheses, spaces, and plus sign
        const cleaned = input.replace(/[^\d\-\(\)\s\+]/g, "");
        onChange(cleaned);
      },
      [onChange]
    );

    return (
      <FieldWrapper
        label={label}
        name={fieldId}
        required={required}
        error={error}
        hint={hint}
        className={className}
      >
        <motion.input
          ref={ref}
          id={fieldId}
          type="tel"
          inputMode="tel"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="tel"
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{ scale: 1.005 }}
          transition={{ duration: 0.15 }}
          aria-invalid={!!error}
          aria-describedby={
            [error ? errorId : undefined, hintId].filter(Boolean).join(" ") ||
            undefined
          }
          aria-required={required}
          className={`
            w-full h-[40px] px-4 text-base rounded-[10px]
            bg-white border-2
            ${
              error
                ? "border-red-500"
                : isFocused
                  ? "border-[#215388]"
                  : "border-[#C6C6C6]"
            }
            text-[#1D1D1B]
            placeholder:text-[#B2B2B2]
            transition-colors duration-200
            focus-visible:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#F7F7F7]
          `}
          dir="ltr"
        />
      </FieldWrapper>
    );
  }
);

PhoneField.displayName = "PhoneField";

