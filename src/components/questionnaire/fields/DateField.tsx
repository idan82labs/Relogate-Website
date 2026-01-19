"use client";

import { forwardRef, useState, useCallback, useId } from "react";
import { motion } from "framer-motion";
import { FieldWrapper } from "./FieldWrapper";
import type { BaseFieldProps } from "./types";

interface DateFieldProps extends BaseFieldProps {
  /** Current field value (ISO date string YYYY-MM-DD) */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Minimum allowed date (ISO string) */
  minDate?: string;
  /** Maximum allowed date (ISO string) */
  maxDate?: string;
  /** Placeholder text */
  placeholder?: string;
}

/**
 * DateField - Date input with picker
 * Uses native date input with consistent styling
 */
export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(
  (
    {
      name,
      label,
      value,
      onChange,
      minDate,
      maxDate,
      placeholder,
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
        onChange(e.target.value);
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
          type="date"
          value={value}
          onChange={handleChange}
          min={minDate}
          max={maxDate}
          placeholder={placeholder}
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
            [&::-webkit-calendar-picker-indicator]:cursor-pointer
          `}
          dir="ltr"
        />
      </FieldWrapper>
    );
  }
);

DateField.displayName = "DateField";

