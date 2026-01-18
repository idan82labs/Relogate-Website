"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FieldWrapper } from "./FieldWrapper";
import type { BaseFieldProps, Option } from "./types";

interface SelectFieldProps extends BaseFieldProps {
  /** Current selected value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Available options */
  options: Option[];
  /** Placeholder text when no value selected */
  placeholder?: string;
}

/**
 * SelectField - Dropdown select for single selection
 * Matches styling from SelectDropdown component
 */
export function SelectField({
  name,
  label,
  value,
  onChange,
  options,
  placeholder = "בחר/י",
  error,
  required = false,
  disabled = false,
  hint,
  className = "",
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const fieldId = name || generatedId;
  const listboxId = `${fieldId}-listbox`;
  const errorId = `${fieldId}-error`;
  const hintId = hint ? `${fieldId}-hint` : undefined;

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate focused index based on current value (no need for effect)
  const getInitialFocusIndex = () => {
    const currentIndex = options.findIndex((opt) => opt.value === value);
    return currentIndex >= 0 ? currentIndex : 0;
  };

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      setIsOpen(false);
      buttonRef.current?.focus();
    },
    [onChange]
  );

  const openDropdown = () => {
    setFocusedIndex(getInitialFocusIndex());
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          const option = options[focusedIndex];
          if (!option.disabled) {
            handleSelect(option.value);
          }
        } else {
          openDropdown();
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          openDropdown();
        } else {
          setFocusedIndex((prev) => {
            const next = prev + 1;
            return next < options.length ? next : prev;
          });
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) {
          openDropdown();
        } else {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case "Tab":
        if (isOpen) {
          setIsOpen(false);
        }
        break;
    }
  };

  return (
    <FieldWrapper
      label={label}
      name={fieldId}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <div className="relative" ref={containerRef}>
        <button
          ref={buttonRef}
          id={fieldId}
          type="button"
          onClick={() => {
            if (disabled) return;
            if (!isOpen) {
              setFocusedIndex(getInitialFocusIndex());
            }
            setIsOpen(!isOpen);
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-describedby={
            [error ? errorId : undefined, hintId].filter(Boolean).join(" ") ||
            undefined
          }
          className={`
            w-full h-[56px] lg:h-[60px] px-4 rounded-[10px] text-right
            flex items-center justify-between
            bg-white border-2 transition-colors duration-200
            ${error ? "border-red-500" : isOpen ? "border-[#215388]" : "border-[#C6C6C6]"}
            ${!value ? "text-[#B2B2B2]" : "text-[#1D1D1B]"}
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#F7F7F7]
          `}
        >
          <span className="flex-1 text-[16px] text-right">
            {selectedOption?.label || placeholder}
          </span>

          {/* Chevron icon */}
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-[#706F6F] flex-shrink-0 mr-2"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </button>

        {/* Dropdown options */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-labelledby={`${fieldId}-label`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#C6C6C6] rounded-[10px] shadow-lg z-50 overflow-hidden max-h-[240px] overflow-y-auto"
            >
              {options.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  disabled={option.disabled}
                  className={`
                    w-full px-4 py-3 text-right text-[16px]
                    transition-colors duration-150
                    ${
                      option.value === value
                        ? "bg-[#215388] text-white"
                        : index === focusedIndex
                          ? "bg-[#F7F7F7] text-[#1D1D1B]"
                          : "text-[#1D1D1B] hover:bg-[#F7F7F7]"
                    }
                    ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FieldWrapper>
  );
}

export default SelectField;
