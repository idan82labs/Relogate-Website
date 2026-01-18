"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { FieldWrapper } from "./FieldWrapper";
import type { BaseFieldProps, Option } from "./types";

interface MultiSelectFieldProps extends BaseFieldProps {
  /** Currently selected values */
  values: string[];
  /** Change handler */
  onChange: (values: string[]) => void;
  /** Available options */
  options: Option[];
  /** Maximum number of selections allowed */
  maxSelections?: number;
  /** Grid columns (1, 2, or 3) */
  columns?: 1 | 2 | 3;
  /** Visual variant - button (like countries) or checkbox */
  variant?: "button" | "checkbox";
}

/**
 * MultiSelectField - Multi-select with button grid or checkbox variants
 * Button variant matches CountrySelector styling
 */
export function MultiSelectField({
  name,
  label,
  values,
  onChange,
  options,
  maxSelections,
  columns = 2,
  variant = "button",
  error,
  required = false,
  disabled = false,
  hint,
  className = "",
}: MultiSelectFieldProps) {
  const generatedId = useId();
  const fieldId = name || generatedId;
  const errorId = `${fieldId}-error`;
  const hintId = hint ? `${fieldId}-hint` : undefined;

  const isSelected = (optionValue: string) => values.includes(optionValue);

  const isMaxReached = maxSelections
    ? values.length >= maxSelections
    : false;

  const handleToggle = (optionValue: string) => {
    if (disabled) return;

    if (values.includes(optionValue)) {
      onChange(values.filter((v) => v !== optionValue));
    } else if (!isMaxReached) {
      onChange([...values, optionValue]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, optionValue: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle(optionValue);
    }
  };

  const gridColsClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
        ? "grid-cols-3"
        : "grid-cols-2";

  if (variant === "checkbox") {
    return (
      <FieldWrapper
        label={label}
        name={fieldId}
        required={required}
        error={error}
        hint={hint}
        className={className}
      >
        <div
          role="group"
          aria-labelledby={`${fieldId}-label`}
          aria-describedby={
            [error ? errorId : undefined, hintId].filter(Boolean).join(" ") ||
            undefined
          }
          className={`grid ${gridColsClass} gap-3`}
        >
          {options.map((option) => {
            const optionId = `${fieldId}-${option.value}`;
            const selected = isSelected(option.value);
            const isDisabled =
              disabled || option.disabled || (!selected && isMaxReached);

            return (
              <label
                key={option.value}
                htmlFor={optionId}
                className={`
                  flex items-center gap-3 p-3 rounded-[10px] cursor-pointer
                  border-2 transition-colors duration-200
                  ${
                    selected
                      ? "border-[#215388] bg-[#215388]/5"
                      : "border-[#C6C6C6] hover:border-[#215388]/50"
                  }
                  ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <input
                  type="checkbox"
                  id={optionId}
                  checked={selected}
                  onChange={() => handleToggle(option.value)}
                  disabled={isDisabled}
                  className="sr-only"
                />
                <span
                  className={`
                    w-5 h-5 rounded-[4px] border-2 flex-shrink-0
                    flex items-center justify-center
                    transition-colors duration-200
                    ${
                      selected
                        ? "bg-[#215388] border-[#215388]"
                        : "bg-white border-[#C6C6C6]"
                    }
                  `}
                >
                  {selected && (
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
                <span className="text-[#1D1D1B] text-[16px]">{option.label}</span>
              </label>
            );
          })}
        </div>
      </FieldWrapper>
    );
  }

  // Button variant (like CountrySelector)
  return (
    <FieldWrapper
      label={label}
      name={fieldId}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <div
        role="group"
        aria-labelledby={`${fieldId}-label`}
        aria-describedby={
          [error ? errorId : undefined, hintId].filter(Boolean).join(" ") ||
          undefined
        }
        className={`grid ${gridColsClass} gap-4 lg:gap-5`}
      >
        {options.map((option) => {
          const selected = isSelected(option.value);
          const isDisabled =
            disabled || option.disabled || (!selected && isMaxReached);

          return (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => handleToggle(option.value)}
              onKeyDown={(e) => handleKeyDown(e, option.value)}
              disabled={isDisabled}
              aria-pressed={selected}
              className={`
                h-[56px] lg:h-[64px] rounded-[10px] font-medium text-[16px] lg:text-[18px]
                transition-colors duration-200
                ${
                  selected
                    ? "bg-[#215388] text-white border-2 border-[#215388]"
                    : "bg-white text-[#1D1D1B] border-2 border-[#C6C6C6] hover:border-[#215388]"
                }
                ${isDisabled && !selected ? "opacity-50 cursor-not-allowed hover:border-[#C6C6C6]" : ""}
              `}
              whileHover={!isDisabled ? { scale: 1.02 } : undefined}
              whileTap={!isDisabled ? { scale: 0.98 } : undefined}
            >
              {option.label}
            </motion.button>
          );
        })}
      </div>
    </FieldWrapper>
  );
}

export default MultiSelectField;
