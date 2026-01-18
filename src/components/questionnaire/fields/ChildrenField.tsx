"use client";

import { useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FieldWrapper } from "./FieldWrapper";
import type { BaseFieldProps, ChildData } from "./types";

interface ChildrenFieldProps extends Omit<BaseFieldProps, "name"> {
  /** Field name */
  name: string;
  /** Array of children data */
  children: ChildData[];
  /** Change handler */
  onChange: (children: ChildData[]) => void;
  /** Maximum number of children allowed (default: 8) */
  maxChildren?: number;
}

/**
 * ChildrenField - Dynamic array field for entering children data
 * Supports name and age for each child with add/remove functionality
 */
export function ChildrenField({
  name,
  label,
  children,
  onChange,
  maxChildren = 8,
  error,
  required = false,
  disabled = false,
  hint,
  className = "",
}: ChildrenFieldProps) {
  const generatedId = useId();
  const fieldId = name || generatedId;
  const errorId = `${fieldId}-error`;
  const hintId = hint ? `${fieldId}-hint` : undefined;

  const canAddMore = children.length < maxChildren;

  const generateId = () => `child-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const handleAddChild = useCallback(() => {
    if (!disabled && canAddMore) {
      onChange([
        ...children,
        { id: generateId(), name: "", age: "" },
      ]);
    }
  }, [disabled, canAddMore, children, onChange]);

  const handleRemoveChild = useCallback(
    (id: string) => {
      if (!disabled) {
        onChange(children.filter((child) => child.id !== id));
      }
    },
    [disabled, children, onChange]
  );

  const handleChildChange = useCallback(
    (id: string, field: "name" | "age", value: string | number) => {
      if (!disabled) {
        onChange(
          children.map((child) =>
            child.id === id ? { ...child, [field]: value } : child
          )
        );
      }
    },
    [disabled, children, onChange]
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
        role="group"
        aria-labelledby={`${fieldId}-label`}
        aria-describedby={
          [error ? errorId : undefined, hintId].filter(Boolean).join(" ") ||
          undefined
        }
        className="space-y-3"
      >
        <AnimatePresence initial={false}>
          {children.map((child, index) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              {/* Child number indicator */}
              <span className="text-[14px] text-[#706F6F] flex-shrink-0 w-6">
                {index + 1}.
              </span>

              {/* Name input */}
              <input
                type="text"
                value={child.name}
                onChange={(e) => handleChildChange(child.id, "name", e.target.value)}
                placeholder="שם הילד/ה"
                disabled={disabled}
                aria-label={`שם ילד ${index + 1}`}
                className={`
                  flex-1 h-[40px] px-4 text-base rounded-[10px]
                  bg-white border-2 border-[#C6C6C6]
                  text-[#1D1D1B] placeholder:text-[#B2B2B2]
                  focus:border-[#215388] focus:outline-none
                  transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#F7F7F7]
                `}
                dir="rtl"
              />

              {/* Age input */}
              <input
                type="number"
                min="0"
                max="120"
                value={child.age}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChildChange(
                    child.id,
                    "age",
                    value === "" ? "" : parseInt(value, 10)
                  );
                }}
                placeholder="גיל"
                disabled={disabled}
                aria-label={`גיל ילד ${index + 1}`}
                className={`
                  w-[80px] h-[40px] px-3 text-base rounded-[10px]
                  bg-white border-2 border-[#C6C6C6]
                  text-[#1D1D1B] placeholder:text-[#B2B2B2]
                  focus:border-[#215388] focus:outline-none
                  transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#F7F7F7]
                  [&::-webkit-inner-spin-button]:appearance-none
                  [&::-webkit-outer-spin-button]:appearance-none
                  [-moz-appearance:textfield]
                `}
                dir="ltr"
              />

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemoveChild(child.id)}
                disabled={disabled}
                aria-label={`הסר ילד ${index + 1}`}
                className={`
                  w-[40px] h-[40px] rounded-[10px]
                  flex items-center justify-center
                  border-2 border-[#C6C6C6] text-[#706F6F]
                  hover:border-red-500 hover:text-red-500 hover:bg-red-50
                  transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M4 8h8" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add child button */}
        {canAddMore && (
          <motion.button
            type="button"
            onClick={handleAddChild}
            disabled={disabled}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`
              w-full h-[48px] rounded-[10px]
              flex items-center justify-center gap-2
              border-2 border-dashed border-[#C6C6C6]
              text-[#706F6F] text-[16px]
              hover:border-[#215388] hover:text-[#215388]
              transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M8 4v8M4 8h8" />
            </svg>
            הוסף ילד/ה
          </motion.button>
        )}

        {/* Max reached message */}
        {!canAddMore && (
          <p className="text-[14px] text-[#706F6F] text-center">
            הגעת למקסימום {maxChildren} ילדים
          </p>
        )}
      </div>
    </FieldWrapper>
  );
}

export default ChildrenField;
