/**
 * Locale Manager
 *
 * Central module for managing localization across the application.
 * Provides functions for:
 * - Getting the current locale
 * - Translating option values to display text
 * - Getting field options for dropdowns
 * - Switching locales (future)
 */

import type { Locale, LocaleCode } from './types';
import { he } from './he';

// ============================================================================
// Locale Registry
// ============================================================================

/**
 * All available locales
 */
const locales: Record<LocaleCode, Locale> = {
  he,
  // Add more locales here as they are implemented:
  // en: en,
} as Record<LocaleCode, Locale>;

/**
 * Default locale code
 */
const DEFAULT_LOCALE: LocaleCode = 'he';

/**
 * Current active locale
 */
let currentLocaleCode: LocaleCode = DEFAULT_LOCALE;

// ============================================================================
// Locale Management
// ============================================================================

/**
 * Get the current locale object
 */
export function getLocale(): Locale {
  return locales[currentLocaleCode] ?? locales[DEFAULT_LOCALE];
}

/**
 * Get the current locale code
 */
export function getLocaleCode(): LocaleCode {
  return currentLocaleCode;
}

/**
 * Get the text direction for the current locale
 */
export function getDirection(): 'rtl' | 'ltr' {
  return getLocale().dir;
}

/**
 * Set the active locale
 * @param code - The locale code to switch to
 * @returns true if the locale was changed, false if the locale is not available
 */
export function setLocale(code: LocaleCode): boolean {
  if (locales[code]) {
    currentLocaleCode = code;
    return true;
  }
  return false;
}

/**
 * Get list of available locale codes
 */
export function getAvailableLocales(): LocaleCode[] {
  return Object.keys(locales) as LocaleCode[];
}

// ============================================================================
// Translation Helpers
// ============================================================================

/**
 * Translate an option value to its display text
 *
 * @param fieldName - The questionnaire field name (e.g., 'employmentStatus')
 * @param value - The stored value (e.g., 'employed')
 * @returns The translated display text (e.g., 'שכיר/ה')
 *
 * @example
 * translateOption('employmentStatus', 'employed') // Returns 'שכיר/ה'
 * translateOption('gender', 'male') // Returns 'זכר'
 */
export function translateOption(fieldName: string, value: string): string {
  const locale = getLocale();
  const field = locale.questionnaire.fields[fieldName as keyof typeof locale.questionnaire.fields];

  if (field && 'options' in field) {
    const options = field.options as Record<string, string>;
    return options[value] ?? value;
  }

  return value;
}

/**
 * Translate a boolean value
 *
 * @param value - The boolean value or string 'true'/'false'
 * @returns The translated text ('כן' or 'לא')
 */
export function translateBoolean(value: boolean | string): string {
  const locale = getLocale();
  const boolValue = typeof value === 'string' ? value === 'true' : value;
  return boolValue ? locale.common.boolean.yes : locale.common.boolean.no;
}

/**
 * Translate an array of option values
 *
 * @param fieldName - The questionnaire field name
 * @param values - Array of stored values
 * @returns Comma-separated translated values
 */
export function translateOptions(fieldName: string, values: string[]): string {
  return values.map((v) => translateOption(fieldName, v)).join(', ');
}

/**
 * Universal value translator that handles all types
 *
 * @param fieldName - The questionnaire field name
 * @param value - The value to translate (string, boolean, array, etc.)
 * @returns The translated display text
 */
export function translateValue(fieldName: string, value: unknown): string {
  if (value === null || value === undefined) {
    return '-';
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map((v) => translateValue(fieldName, v)).join(', ');
  }

  // Handle booleans
  if (typeof value === 'boolean') {
    return translateBoolean(value);
  }

  // Handle string booleans
  if (value === 'true' || value === 'false') {
    return translateBoolean(value);
  }

  // Handle option fields
  return translateOption(fieldName, String(value));
}

/**
 * Get the label for a questionnaire field
 *
 * @param fieldName - The field name
 * @returns The translated label
 */
export function getFieldLabel(fieldName: string): string {
  const locale = getLocale();

  // First check questionnaire fields
  const qField = locale.questionnaire.fields[fieldName as keyof typeof locale.questionnaire.fields];
  if (qField) {
    return qField.label;
  }

  // Then check personal area field labels
  const paLabel = locale.personalArea.fieldLabels[fieldName];
  if (paLabel) {
    return paLabel;
  }

  return fieldName;
}

/**
 * Get options for a select/dropdown field
 *
 * @param fieldName - The field name
 * @returns Array of { value, label } objects for use in select components
 */
export function getFieldOptions(
  fieldName: string
): Array<{ value: string; label: string }> {
  const locale = getLocale();
  const field = locale.questionnaire.fields[fieldName as keyof typeof locale.questionnaire.fields];

  if (field && 'options' in field) {
    const options = field.options as Record<string, string>;
    return Object.entries(options).map(([value, label]) => ({
      value,
      label,
    }));
  }

  return [];
}

/**
 * Get step metadata
 *
 * @param stepId - The step ID
 * @returns Step metadata (title, description)
 */
export function getStepMeta(stepId: string): { title: string; description?: string } {
  const locale = getLocale();
  const step = locale.questionnaire.steps[stepId as keyof typeof locale.questionnaire.steps];
  return step ?? { title: stepId };
}

// ============================================================================
// Exports
// ============================================================================

// Re-export types
export * from './types';

// Re-export constants
export * from './constants';

// Export locales for direct access
export { locales, he };
