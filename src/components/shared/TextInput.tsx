"use client";

import { forwardRef, useState, useCallback } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type InputType = "text" | "email" | "password";
type InputSize = "sm" | "md" | "lg";

interface TextInputProps
  extends Omit<HTMLMotionProps<"input">, "ref" | "onChange" | "type" | "size"> {
  label: string;
  type?: InputType;
  size?: InputSize;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

const sizeStyles: Record<InputSize, string> = {
  sm: "h-[30px] px-3 text-sm rounded-[8px]",
  md: "h-[40px] px-4 text-base rounded-[10px]",
  lg: "h-[50px] px-5 text-lg rounded-[12px]",
};

const labelSizeStyles: Record<InputSize, string> = {
  sm: "text-sm mb-1",
  md: "text-base mb-2",
  lg: "text-lg mb-2",
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      type = "text",
      size = "md",
      value,
      onChange,
      placeholder,
      error,
      disabled = false,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputId = id || `input-${label.replace(/\s+/g, "-").toLowerCase()}`;
    const inputType = type === "password" && showPassword ? "text" : type;

    const togglePasswordVisibility = useCallback(() => {
      setShowPassword((prev) => !prev);
    }, []);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      },
      [onChange]
    );

    return (
      <div className="w-full">
        {/* Label */}
        <label
          htmlFor={inputId}
          className={`
            block font-medium text-[#1D1D1B]
            ${labelSizeStyles[size]}
          `}
        >
          {label}
        </label>

        {/* Input Container */}
        <div className="relative">
          <motion.input
            ref={ref}
            id={inputId}
            type={inputType}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            whileFocus={{ scale: 1.005 }}
            transition={{ duration: 0.15 }}
            className={`
              w-full
              bg-white
              border-2
              ${error
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
              ${type === "password" ? "pr-12" : ""}
              ${sizeStyles[size]}
              ${className}
            `}
            dir="rtl"
            {...props}
          />

          {/* Password Toggle Button */}
          {type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="
                absolute left-3 top-1/2 -translate-y-1/2
                text-[#706F6F] hover:text-[#215388]
                transition-colors duration-200
                focus-visible:outline-none focus-visible:text-[#215388]
              "
              aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
