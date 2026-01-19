"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FieldWrapper } from "./FieldWrapper";
import type { BaseFieldProps, Option } from "./types";

/** Predefined language options */
const LANGUAGE_OPTIONS: Option[] = [
  { value: "hebrew", label: "עברית" },
  { value: "english", label: "אנגלית" },
  { value: "arabic", label: "ערבית" },
  { value: "russian", label: "רוסית" },
  { value: "french", label: "צרפתית" },
  { value: "spanish", label: "ספרדית" },
  { value: "german", label: "גרמנית" },
  { value: "portuguese", label: "פורטוגזית" },
  { value: "italian", label: "איטלקית" },
  { value: "chinese", label: "סינית" },
  { value: "japanese", label: "יפנית" },
  { value: "korean", label: "קוריאנית" },
  { value: "hindi", label: "הינדי" },
  { value: "turkish", label: "טורקית" },
  { value: "polish", label: "פולנית" },
  { value: "dutch", label: "הולנדית" },
  { value: "greek", label: "יוונית" },
  { value: "romanian", label: "רומנית" },
  { value: "ukrainian", label: "אוקראינית" },
  { value: "other", label: "אחר" },
];

interface LanguageSelectFieldProps extends BaseFieldProps {
  /** Currently selected language values */
  values: string[];
  /** Change handler */
  onChange: (values: string[]) => void;
  /** Maximum number of languages allowed (default: 5) */
  maxLanguages?: number;
  /** Custom language options (optional, uses defaults if not provided) */
  options?: Option[];
}

/**
 * LanguageSelectField - Specialized multi-select for languages
 * Displays selected languages as tags with remove buttons
 */
export function LanguageSelectField({
  name,
  label,
  values,
  onChange,
  maxLanguages = 5,
  options = LANGUAGE_OPTIONS,
  error,
  required = false,
  disabled = false,
  hint,
  className = "",
}: LanguageSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const fieldId = name || generatedId;
  const listboxId = `${fieldId}-listbox`;

  const isMaxReached = values.length >= maxLanguages;

  // Filter available options (not already selected)
  const availableOptions = options.filter(
    (opt) =>
      !values.includes(opt.value) &&
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get labels for selected values
  const getLabel = (value: string) =>
    options.find((opt) => opt.value === value)?.label || value;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (value: string) => {
      if (!disabled && !isMaxReached && !values.includes(value)) {
        onChange([...values, value]);
        setSearchQuery("");
        setIsOpen(false);
      }
    },
    [disabled, isMaxReached, values, onChange]
  );

  const handleRemove = useCallback(
    (value: string) => {
      if (!disabled) {
        onChange(values.filter((v) => v !== value));
      }
    },
    [disabled, values, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
      } else if (
        e.key === "Backspace" &&
        searchQuery === "" &&
        values.length > 0
      ) {
        handleRemove(values[values.length - 1]);
      }
    },
    [searchQuery, values, handleRemove]
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
      <div className="relative" ref={containerRef}>
        {/* Selected tags and input container */}
        <div
          onClick={() => !disabled && !isMaxReached && inputRef.current?.focus()}
          className={`
            min-h-[48px] p-2 rounded-[10px]
            bg-white border-2 transition-colors duration-200
            flex flex-wrap gap-2 items-center cursor-text
            ${error ? "border-red-500" : isOpen ? "border-[#215388]" : "border-[#C6C6C6]"}
            ${disabled ? "opacity-50 cursor-not-allowed bg-[#F7F7F7]" : ""}
          `}
        >
          {/* Selected tags */}
          <AnimatePresence>
            {values.map((value) => (
              <motion.span
                key={value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className={`
                  inline-flex items-center gap-1 px-3 py-1
                  bg-[#215388]/10 text-[#215388] rounded-full
                  text-[14px] font-medium
                `}
              >
                {getLabel(value)}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(value);
                  }}
                  disabled={disabled}
                  aria-label={`הסר ${getLabel(value)}`}
                  className="hover:text-red-500 transition-colors"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M4 4l6 6M10 4l-6 6" />
                  </svg>
                </button>
              </motion.span>
            ))}
          </AnimatePresence>

          {/* Search input */}
          {!isMaxReached && (
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={values.length === 0 ? "בחר שפות..." : "הוסף שפה..."}
              disabled={disabled}
              aria-controls={listboxId}
              aria-expanded={isOpen}
              aria-autocomplete="list"
              className={`
                flex-1 min-w-[100px] h-[32px] px-2
                bg-transparent border-none outline-none
                text-[#1D1D1B] placeholder:text-[#B2B2B2]
                text-[16px]
              `}
              dir="rtl"
            />
          )}

          {/* Max reached indicator */}
          {isMaxReached && values.length > 0 && (
            <span className="text-[14px] text-[#706F6F] px-2">
              מקסימום {maxLanguages} שפות
            </span>
          )}
        </div>

        {/* Dropdown options */}
        <AnimatePresence>
          {isOpen && availableOptions.length > 0 && !isMaxReached && (
            <motion.div
              id={listboxId}
              role="listbox"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#C6C6C6] rounded-[10px] shadow-lg z-50 overflow-hidden max-h-[200px] overflow-y-auto"
            >
              {availableOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full px-4 py-3 text-right text-[16px]
                    text-[#1D1D1B] hover:bg-[#F7F7F7]
                    transition-colors duration-150
                  `}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No results message */}
        {isOpen && searchQuery && availableOptions.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#C6C6C6] rounded-[10px] shadow-lg z-50 p-4 text-center text-[#706F6F]">
            לא נמצאו תוצאות
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}

