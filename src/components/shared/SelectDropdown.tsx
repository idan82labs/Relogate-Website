"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectDropdownProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

/**
 * SelectDropdown - Styled dropdown select component
 * RTL-aware with chevron icon and animated options
 */
export const SelectDropdown = ({
  label,
  options,
  value,
  onChange,
  placeholder = "בחר/י",
  className = "",
  error,
}: SelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-[14px] text-[#706F6F] mb-2">{label}</label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full h-[50px] px-4 rounded-[10px] text-right
          flex items-center justify-between
          bg-white border-2 transition-colors duration-200
          ${error ? "border-red-500" : isOpen ? "border-[#215388]" : "border-[#C6C6C6]"}
          ${!value ? "text-[#B2B2B2]" : "text-[#1D1D1B]"}
        `}
      >
        <span className="flex-1 text-[16px]">
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
          className="text-[#706F6F]"
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

      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}

      {/* Dropdown options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#C6C6C6] rounded-[10px] shadow-lg z-50 overflow-hidden"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-3 text-right text-[16px]
                  transition-colors duration-150
                  ${
                    option.value === value
                      ? "bg-[#215388] text-white"
                      : "text-[#1D1D1B] hover:bg-[#F7F7F7]"
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SelectDropdown;
