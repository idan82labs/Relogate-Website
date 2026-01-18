/**
 * Shared types for questionnaire field components
 */

/**
 * Base props shared by all field components
 */
export interface BaseFieldProps {
  /** Unique name for the field (used for id and htmlFor) */
  name: string;
  /** Field label text */
  label: string;
  /** Error message to display */
  error?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Optional hint text displayed below the label */
  hint?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Option type for select/radio/checkbox fields
 */
export interface Option {
  /** Option value */
  value: string;
  /** Option display label */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
}

/**
 * Child data structure for ChildrenField
 */
export interface ChildData {
  /** Unique ID for React key */
  id: string;
  /** Child's name */
  name: string;
  /** Child's age (empty string when not set) */
  age: number | "";
}

/**
 * Field validation result
 */
export interface ValidationResult {
  /** Whether the field value is valid */
  isValid: boolean;
  /** Error message if invalid */
  error?: string;
}
