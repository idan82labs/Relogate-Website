/**
 * useTranslation Hook
 *
 * React hook for accessing translations in components.
 * Provides a consistent interface for all translation needs.
 *
 * @example
 * ```tsx
 * const { t, translateValue, getOptions, getLabel, dir } = useTranslation();
 *
 * // Access nested translations
 * <h1>{t.questionnaire.steps['personal-details'].title}</h1>
 *
 * // Translate a stored value
 * <span>{translateValue('employmentStatus', userData.employmentStatus)}</span>
 *
 * // Get options for a dropdown
 * <select>
 *   {getOptions('gender').map(opt => (
 *     <option key={opt.value} value={opt.value}>{opt.label}</option>
 *   ))}
 * </select>
 * ```
 */

'use client';

import { useMemo } from 'react';
import {
  getLocale,
  getLocaleCode,
  getDirection,
  translateValue as translateValueFn,
  translateOption as translateOptionFn,
  translateBoolean as translateBooleanFn,
  translateOptions as translateOptionsFn,
  getFieldLabel as getFieldLabelFn,
  getFieldOptions as getFieldOptionsFn,
  getStepMeta as getStepMetaFn,
} from '@/locales';
import type { Locale, LocaleCode } from '@/locales/types';

/**
 * Translation hook return type
 */
export interface UseTranslationReturn {
  /** The complete locale object for direct access */
  t: Locale;
  /** Current locale code */
  localeCode: LocaleCode;
  /** Text direction ('rtl' or 'ltr') */
  dir: 'rtl' | 'ltr';

  /**
   * Translate a stored value to display text
   * Handles strings, booleans, and arrays automatically
   */
  translateValue: (fieldName: string, value: unknown) => string;

  /**
   * Translate a single option value
   */
  translateOption: (fieldName: string, value: string) => string;

  /**
   * Translate a boolean value to yes/no text
   */
  translateBoolean: (value: boolean | string) => string;

  /**
   * Translate an array of option values
   */
  translateOptions: (fieldName: string, values: string[]) => string;

  /**
   * Get the label for a field
   */
  getLabel: (fieldName: string) => string;

  /**
   * Get options for a select/dropdown field
   * Returns array of { value, label } objects
   */
  getOptions: (fieldName: string) => Array<{ value: string; label: string }>;

  /**
   * Get step metadata (title, description)
   */
  getStepMeta: (stepId: string) => { title: string; description?: string };
}

/**
 * Hook for accessing translations in React components
 *
 * @returns Translation utilities and the current locale
 */
export function useTranslation(): UseTranslationReturn {
  // Memoize to prevent unnecessary re-renders
  // In a real multi-language app, this would depend on a locale context
  return useMemo(
    () => ({
      t: getLocale(),
      localeCode: getLocaleCode(),
      dir: getDirection(),
      translateValue: translateValueFn,
      translateOption: translateOptionFn,
      translateBoolean: translateBooleanFn,
      translateOptions: translateOptionsFn,
      getLabel: getFieldLabelFn,
      getOptions: getFieldOptionsFn,
      getStepMeta: getStepMetaFn,
    }),
    []
  );
}

/**
 * Hook specifically for questionnaire translations
 * Provides shortcuts for common questionnaire operations
 */
export function useQuestionnaireTranslation() {
  const { t, translateValue, getOptions, getLabel, getStepMeta, dir } = useTranslation();

  return useMemo(
    () => ({
      /** Questionnaire-specific translations */
      q: t.questionnaire,
      /** Common translations */
      common: t.common,
      /** Text direction */
      dir,
      /** Translate field value */
      translateValue,
      /** Get field options */
      getOptions,
      /** Get field label */
      getLabel,
      /** Get step metadata */
      getStepMeta,
      /** Get error message */
      getError: (key: keyof typeof t.questionnaire.errors) => t.questionnaire.errors[key],
      /** Get UI text */
      getUI: (key: keyof typeof t.questionnaire.ui) => t.questionnaire.ui[key],
    }),
    [t, translateValue, getOptions, getLabel, getStepMeta, dir]
  );
}

/**
 * Hook specifically for personal area translations
 */
export function usePersonalAreaTranslation() {
  const { t, translateValue, getLabel, dir } = useTranslation();

  return useMemo(
    () => ({
      /** Personal area translations */
      pa: t.personalArea,
      /** Common translations */
      common: t.common,
      /** Text direction */
      dir,
      /** Translate field value */
      translateValue,
      /** Get field label */
      getLabel,
      /** Get section title */
      getSectionTitle: (key: keyof typeof t.personalArea.sectionTitles) =>
        t.personalArea.sectionTitles[key],
    }),
    [t, translateValue, getLabel, dir]
  );
}
