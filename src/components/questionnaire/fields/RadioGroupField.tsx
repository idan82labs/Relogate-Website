"use client";

import { useCallback, useId } from "react";
import { FieldWrapper } from "./FieldWrapper";
import type { BaseFieldProps, Option } from "./types";

interface RadioGroupFieldProps extends BaseFieldProps {
  /** Currently selected value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Available options */
  options: Option[];
  /** Layout direction */
  direction?: "horizontal" | "vertical";
}

/**
 * RadioGroupField - Radio button group for single selection
 * Displays visible options with radio button styling
 */
export function RadioGroupField({
  name,
  label,
  value,
  onChange,
  options,
  direction = "vertical",
  error,
  required = false,
  disabled = false,
  hint,
  className = "",
}: RadioGroupFieldProps) {
  const generatedId = useId();
  const fieldId = name || generatedId;
  const errorId = `${fieldId}-error`;
  const hintId = hint ? `${fieldId}-hint` : undefined;

  const handleChange = useCallback(
    (optionValue: string) => {
      if (!disabled) {
        onChange(optionValue);
      }
    },
    [disabled, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, optionValue: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleChange(optionValue);
      }
    },
    [handleChange]
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
      <div
        role="radiogroup"
        aria-labelledby={`${fieldId}-label`}
        aria-describedby={
          [error ? errorId : undefined, hintId].filter(Boolean).join(" ") ||
          undefined
        }
        aria-required={required}
        className={`
          flex
          ${direction === "horizontal" ? "flex-row flex-wrap gap-4" : "flex-col gap-3"}
        `}
      >
        {options.map((option) => {
          const optionId = `${fieldId}-${option.value}`;
          const isSelected = value === option.value;
          const isDisabled = disabled || option.disabled;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={`
                flex items-center gap-3 cursor-pointer
                ${direction === "vertical" ? "p-3 rounded-[10px] border-2 transition-colors duration-200" : ""}
                ${
                  direction === "vertical"
                    ? isSelected
                      ? "border-[#215388] bg-[#215388]/5"
                      : "border-[#C6C6C6] hover:border-[#215388]/50"
                    : ""
                }
                ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <input
                type="radio"
                id={optionId}
                name={fieldId}
                value={option.value}
                checked={isSelected}
                onChange={() => handleChange(option.value)}
                onKeyDown={(e) => handleKeyDown(e, option.value)}
                disabled={isDisabled}
                className="sr-only"
              />
              <span
                className={`
                  w-5 h-5 rounded-full border-2 flex-shrink-0
                  flex items-center justify-center
                  transition-colors duration-200
                  ${
                    isSelected
                      ? "border-[#215388]"
                      : "border-[#C6C6C6]"
                  }
                `}
              >
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#215388]" />
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

export default RadioGroupField;
