"use client";

import { forwardRef, useState, useCallback, useId } from "react";
import { FieldWrapper } from "./FieldWrapper";
import type { BaseFieldProps } from "./types";

interface TextAreaFieldProps extends BaseFieldProps {
  /** Current field value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Maximum character length */
  maxLength?: number;
  /** Number of visible text rows (default: 4) */
  rows?: number;
}

/**
 * TextAreaField - Multi-line text field for longer responses
 * Matches styling from relocation-reason page implementation
 */
export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  (
    {
      name,
      label,
      value,
      onChange,
      placeholder,
      maxLength,
      rows = 4,
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
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        <textarea
          ref={ref}
          id={fieldId}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={!!error}
          aria-describedby={
            [error ? errorId : undefined, hintId].filter(Boolean).join(" ") ||
            undefined
          }
          aria-required={required}
          className={`
            w-full p-4 lg:p-5
            border border-[#C6C6C6] lg:border-2 rounded-[10px] lg:rounded-[12px]
            text-[14px] lg:text-[16px] text-[#1D1D1B] placeholder-[#B2B2B2]
            focus:outline-none focus:border-[#215388] focus:ring-1 focus:ring-[#215388]
            resize-none leading-relaxed
            transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#F7F7F7]
            ${error ? "border-red-500" : isFocused ? "border-[#215388]" : ""}
          `}
          dir="rtl"
        />
      </FieldWrapper>
    );
  }
);

TextAreaField.displayName = "TextAreaField";

