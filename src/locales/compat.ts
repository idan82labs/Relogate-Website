/**
 * Compatibility Layer
 *
 * Provides backward-compatible APIs for components that still use the old
 * translation patterns. This allows gradual migration to the new system.
 *
 * DEPRECATION NOTICE: This file is intended as a temporary bridge.
 * New code should use the functions from '@/locales' directly.
 */

import { getLocale } from './index';
import type { Locale } from './types';
import {
  QUESTIONNAIRE_FIELD,
  GENDER,
  FAMILY_STATUS,
  PROCESS_PARTNER,
  RELOCATION_REASON,
  EMPLOYMENT_STATUS,
  EDUCATION_LEVEL,
  INCOME_RANGE,
  PASSIVE_INCOME_RANGE,
  LANGUAGE,
  COUNTRY,
  DISTANCE_PREFERENCE,
  TIME_ZONE_PREFERENCE,
  WEATHER_PREFERENCE,
  COMMUNITY_IMPORTANCE,
  LIVING_TYPE,
  VISA_ATTEMPT_STATUS,
} from './constants';

// ============================================================================
// Types
// ============================================================================

/**
 * Section definition for questionnaire display
 * @deprecated Use the new locale system instead
 */
export interface QuestionnaireSection {
  id: string;
  title: string;
  fields: string[];
}

/**
 * Option in array format (for dropdowns)
 */
export interface OptionItem {
  value: string;
  label: string;
}

// ============================================================================
// Questionnaire Sections
// ============================================================================

/**
 * Get questionnaire sections for display
 * @deprecated Use the new locale system for translations
 */
export function getQuestionnaireSections(): QuestionnaireSection[] {
  const locale = getLocale();
  const pa = locale.personalArea;

  return [
    {
      id: 'personal',
      title: pa.sectionTitles.personal,
      fields: [
        QUESTIONNAIRE_FIELD.FULL_NAME,
        QUESTIONNAIRE_FIELD.BIRTH_DATE,
        QUESTIONNAIRE_FIELD.PHONE,
        QUESTIONNAIRE_FIELD.EMAIL,
        QUESTIONNAIRE_FIELD.GENDER,
      ],
    },
    {
      id: 'family',
      title: pa.sectionTitles.family,
      fields: [
        QUESTIONNAIRE_FIELD.FAMILY_STATUS,
        QUESTIONNAIRE_FIELD.PROCESS_PARTNER,
        QUESTIONNAIRE_FIELD.PARTNER_NAME,
        QUESTIONNAIRE_FIELD.CHILDREN,
      ],
    },
    {
      id: 'goals',
      title: pa.sectionTitles.goals,
      fields: [QUESTIONNAIRE_FIELD.RELOCATION_REASONS],
    },
    {
      id: 'citizenship',
      title: pa.sectionTitles.citizenship,
      fields: [
        QUESTIONNAIRE_FIELD.CITIZENSHIPS,
        QUESTIONNAIRE_FIELD.PARTNER_CITIZENSHIPS,
      ],
    },
    {
      id: 'employment',
      title: pa.sectionTitles.employment,
      fields: [
        QUESTIONNAIRE_FIELD.EMPLOYMENT_STATUS,
        QUESTIONNAIRE_FIELD.OCCUPATION,
        QUESTIONNAIRE_FIELD.EDUCATION,
        QUESTIONNAIRE_FIELD.REMOTE_WORK_CAPABLE,
      ],
    },
    {
      id: 'income',
      title: pa.sectionTitles.income,
      fields: [
        QUESTIONNAIRE_FIELD.HOUSEHOLD_INCOME,
        QUESTIONNAIRE_FIELD.HAS_PASSIVE_INCOME,
        QUESTIONNAIRE_FIELD.PASSIVE_INCOME_AMOUNT,
      ],
    },
    {
      id: 'partner',
      title: pa.sectionTitles.partner,
      fields: [
        QUESTIONNAIRE_FIELD.PARTNER_EMPLOYMENT_STATUS,
        QUESTIONNAIRE_FIELD.PARTNER_OCCUPATION,
        QUESTIONNAIRE_FIELD.PARTNER_EDUCATION,
        QUESTIONNAIRE_FIELD.PARTNER_REMOTE_WORK_CAPABLE,
      ],
    },
    {
      id: 'studies_languages',
      title: pa.sectionTitles.studiesLanguages,
      fields: [
        QUESTIONNAIRE_FIELD.OPEN_TO_STUDYING_ABROAD,
        QUESTIONNAIRE_FIELD.PARTNER_OPEN_TO_STUDYING_ABROAD,
        QUESTIONNAIRE_FIELD.WILLING_TO_INVEST_IN_PROPERTY,
        QUESTIONNAIRE_FIELD.HAS_250K_EURO_FOR_INVESTMENT,
        QUESTIONNAIRE_FIELD.SPEAKING_LANGUAGES,
        QUESTIONNAIRE_FIELD.WRITING_LANGUAGES,
        QUESTIONNAIRE_FIELD.PARTNER_SPEAKING_LANGUAGES,
        QUESTIONNAIRE_FIELD.PARTNER_WRITING_LANGUAGES,
      ],
    },
    {
      id: 'preferences',
      title: pa.sectionTitles.preferences,
      fields: [
        QUESTIONNAIRE_FIELD.DISTANCE_FROM_ISRAEL,
        QUESTIONNAIRE_FIELD.TIME_ZONE_DIFFERENCE,
        QUESTIONNAIRE_FIELD.WEATHER_PREFERENCE,
        QUESTIONNAIRE_FIELD.JEWISH_COMMUNITY_IMPORTANCE,
        QUESTIONNAIRE_FIELD.ISRAELI_COMMUNITY_IMPORTANCE,
        QUESTIONNAIRE_FIELD.LIVING_TYPE,
        QUESTIONNAIRE_FIELD.HAS_ADDITIONAL_CONSIDERATIONS,
        QUESTIONNAIRE_FIELD.ADDITIONAL_CONSIDERATIONS_TEXT,
        QUESTIONNAIRE_FIELD.PREVIOUS_VISA_ATTEMPT,
        QUESTIONNAIRE_FIELD.HAS_CRIMINAL_RECORD,
      ],
    },
  ];
}

/**
 * Static export for backward compatibility
 * @deprecated Use getQuestionnaireSections() instead
 */
export const questionnaireSections = getQuestionnaireSections();

// ============================================================================
// Field Labels
// ============================================================================

/**
 * Get field labels as a Record
 * @deprecated Use getFieldLabel() from '@/locales' instead
 */
export function getFieldLabels(): Record<string, string> {
  const locale = getLocale();
  return locale.personalArea.fieldLabels;
}

/**
 * Static export for backward compatibility
 * @deprecated Use getFieldLabel() from '@/locales' instead
 */
export const fieldLabels = getFieldLabels();

/**
 * Get the Hebrew label for a field
 * @deprecated Use getFieldLabel() from '@/locales' instead
 */
export function getFieldLabel(fieldName: string): string {
  const locale = getLocale();

  // Check personal area field labels first
  const paLabel = locale.personalArea.fieldLabels[fieldName];
  if (paLabel) return paLabel;

  // Check questionnaire fields
  const field = locale.questionnaire.fields[fieldName as keyof Locale['questionnaire']['fields']];
  if (field) return field.label;

  return fieldName;
}

// ============================================================================
// Value Translation
// ============================================================================

/**
 * Translate a single value based on its field name
 * @deprecated Use translateValue() from '@/locales' instead
 */
export function translateValue(fieldName: string, value: unknown): string {
  if (value === null || value === undefined) {
    return '-';
  }

  const locale = getLocale();

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map((v) => translateValue(fieldName, v)).join(', ');
  }

  // Handle booleans
  if (typeof value === 'boolean') {
    return value ? locale.common.boolean.yes : locale.common.boolean.no;
  }

  // Handle string booleans
  if (value === 'true' || value === 'false') {
    return value === 'true' ? locale.common.boolean.yes : locale.common.boolean.no;
  }

  const strValue = String(value);

  // Get the translation from the appropriate field options
  const field = locale.questionnaire.fields[fieldName as keyof Locale['questionnaire']['fields']];
  if (field && 'options' in field) {
    const options = field.options as Record<string, string>;
    if (options[strValue]) {
      return options[strValue];
    }
    // Try lowercase for country codes
    if (options[strValue.toLowerCase()]) {
      return options[strValue.toLowerCase()];
    }
  }

  // Handle shared fields (partner fields use same options as user fields)
  const sharedFieldMap: Record<string, string> = {
    partnerEmploymentStatus: 'employmentStatus',
    partnerEducation: 'education',
    partnerCitizenships: 'citizenships',
    partnerSpeakingLanguages: 'speakingLanguages',
    partnerWritingLanguages: 'writingLanguages',
  };

  const sharedField = sharedFieldMap[fieldName];
  if (sharedField) {
    const sharedFieldDef = locale.questionnaire.fields[sharedField as keyof Locale['questionnaire']['fields']];
    if (sharedFieldDef && 'options' in sharedFieldDef) {
      const options = sharedFieldDef.options as Record<string, string>;
      if (options[strValue]) {
        return options[strValue];
      }
      if (options[strValue.toLowerCase()]) {
        return options[strValue.toLowerCase()];
      }
    }
  }

  return strValue;
}

// ============================================================================
// Options Conversion
// ============================================================================

/**
 * Convert Record options to array format for select components
 */
export function optionsToArray(options: Record<string, string>): OptionItem[] {
  return Object.entries(options).map(([value, label]) => ({ value, label }));
}

/**
 * Get options for a field as an array (for select/dropdown components)
 */
export function getFieldOptionsArray(fieldName: string): OptionItem[] {
  const locale = getLocale();
  const field = locale.questionnaire.fields[fieldName as keyof Locale['questionnaire']['fields']];

  if (field && 'options' in field) {
    return optionsToArray(field.options as Record<string, string>);
  }

  return [];
}

// ============================================================================
// Individual Translation Maps (for direct access if needed)
// ============================================================================

/**
 * Get gender translations
 */
export function getGenderTranslations(): Record<string, string> {
  const locale = getLocale();
  return locale.questionnaire.fields.gender.options;
}

/**
 * Get family status translations
 */
export function getFamilyStatusTranslations(): Record<string, string> {
  const locale = getLocale();
  return locale.questionnaire.fields.familyStatus.options;
}

/**
 * Get employment status translations
 */
export function getEmploymentStatusTranslations(): Record<string, string> {
  const locale = getLocale();
  return locale.questionnaire.fields.employmentStatus.options;
}

/**
 * Get education translations
 */
export function getEducationTranslations(): Record<string, string> {
  const locale = getLocale();
  return locale.questionnaire.fields.education.options;
}

/**
 * Get citizenship/country translations
 */
export function getCitizenshipTranslations(): Record<string, string> {
  const locale = getLocale();
  return locale.questionnaire.fields.citizenships.options;
}

/**
 * Get language translations
 */
export function getLanguageTranslations(): Record<string, string> {
  const locale = getLocale();
  return locale.questionnaire.fields.speakingLanguages.options;
}

/**
 * Get boolean translations
 */
export function getBooleanTranslations(): Record<string, string> {
  const locale = getLocale();
  return {
    true: locale.common.boolean.yes,
    false: locale.common.boolean.no,
  };
}

/**
 * Get income range translations
 */
export function getIncomeRangeTranslations(): Record<string, string> {
  const locale = getLocale();
  return locale.questionnaire.fields.householdIncome.options;
}

/**
 * Get passive income range translations
 */
export function getPassiveIncomeRangeTranslations(): Record<string, string> {
  const locale = getLocale();
  return locale.questionnaire.fields.passiveIncomeAmount.options;
}

/**
 * Get relocation reason translations
 */
export function getRelocationReasonTranslations(): Record<string, string> {
  const locale = getLocale();
  return locale.questionnaire.fields.relocationReasons.options;
}

/**
 * Get process partner translations
 */
export function getProcessPartnerTranslations(): Record<string, string> {
  const locale = getLocale();
  return locale.questionnaire.fields.processPartner.options;
}

/**
 * Get distance preference translations
 */
export function getDistancePreferenceTranslations(): Record<string, string> {
  const locale = getLocale();
  return locale.questionnaire.fields.distanceFromIsrael.options;
}

/**
 * Get time zone preference translations
 */
export function getTimeZonePreferenceTranslations(): Record<string, string> {
  const locale = getLocale();
  return locale.questionnaire.fields.timeZoneDifference.options;
}

/**
 * Get weather preference translations
 */
export function getWeatherPreferenceTranslations(): Record<string, string> {
  const locale = getLocale();
  return locale.questionnaire.fields.weatherPreference.options;
}

/**
 * Get community importance translations
 */
export function getCommunityImportanceTranslations(): Record<string, string> {
  const locale = getLocale();
  return locale.questionnaire.fields.jewishCommunityImportance.options;
}

/**
 * Get living type translations
 */
export function getLivingTypeTranslations(): Record<string, string> {
  const locale = getLocale();
  return locale.questionnaire.fields.livingType.options;
}

/**
 * Get visa attempt status translations
 */
export function getVisaAttemptStatusTranslations(): Record<string, string> {
  const locale = getLocale();
  return locale.questionnaire.fields.previousVisaAttempt.options;
}

/**
 * Occupation/profession translations (common terms for best-effort translation)
 * Since occupation is a free-text field, these are common values that may be entered
 */
export const occupationTranslations: Record<string, string> = {
  HITECH: 'הייטק',
  hitech: 'הייטק',
  finance: 'פיננסים',
  healthcare: 'בריאות',
  education: 'חינוך',
  law: 'משפטים',
  marketing: 'שיווק',
  sales: 'מכירות',
  engineering: 'הנדסה',
  management: 'ניהול',
  art: 'אמנות',
  media: 'תקשורת',
  construction: 'בנייה',
  real_estate: 'נדל"ן',
  food: 'מזון',
  retail: 'קמעונאות',
  tourism: 'תיירות',
  security: 'אבטחה',
  transportation: 'תחבורה',
  government: 'ממשלתי',
  other: 'אחר',
};

// ============================================================================
// Backward Compatibility Exports (matching old questionnaire-translations.ts)
// ============================================================================

// These are lazy getters to ensure locale is loaded
export const genderTranslations = getGenderTranslations();
export const familyStatusTranslations = getFamilyStatusTranslations();
export const employmentStatusTranslations = getEmploymentStatusTranslations();
export const educationTranslations = getEducationTranslations();
export const citizenshipTranslations = getCitizenshipTranslations();
export const languageTranslations = getLanguageTranslations();
export const booleanTranslations = getBooleanTranslations();
export const incomeRangeTranslations = getIncomeRangeTranslations();
export const passiveIncomeRangeTranslations = getPassiveIncomeRangeTranslations();
export const relocationReasonTranslations = getRelocationReasonTranslations();
export const processPartnerTranslations = getProcessPartnerTranslations();
export const distancePreferenceTranslations = getDistancePreferenceTranslations();
export const timeZonePreferenceTranslations = getTimeZonePreferenceTranslations();
export const weatherPreferenceTranslations = getWeatherPreferenceTranslations();
export const communityImportanceTranslations = getCommunityImportanceTranslations();
export const livingTypeTranslations = getLivingTypeTranslations();
export const visaAttemptStatusTranslations = getVisaAttemptStatusTranslations();

// ============================================================================
// Questionnaire Step Content (for step components)
// ============================================================================

/**
 * Get questionnaire step content in the format expected by step components.
 * This provides backward compatibility with the old siteContent.questionnaireV2.steps structure.
 */
export function getQuestionnaireStepContent() {
  const locale = getLocale();
  const q = locale.questionnaire;

  // Helper to convert Record options to array format
  const toOptionsArray = (options: Record<string, string>): OptionItem[] =>
    Object.entries(options).map(([value, label]) => ({ value, label }));

  return {
    // Step 1: Personal Details
    personalDetails: {
      id: 'personal-details',
      title: q.steps['personal-details'].title,
      subtitle: q.steps['personal-details'].description || '',
      fields: {
        fullName: {
          label: q.fields.fullName.label,
          placeholder: q.fields.fullName.placeholder || '',
          required: true,
        },
        birthDate: {
          label: q.fields.birthDate.label,
          placeholder: q.fields.birthDate.placeholder || '',
          required: true,
        },
        phone: {
          label: q.fields.phone.label,
          placeholder: q.fields.phone.placeholder || '',
          required: true,
        },
        email: {
          label: q.fields.email.label,
          placeholder: q.fields.email.placeholder || '',
          required: true,
        },
        gender: {
          label: q.fields.gender.label,
          placeholder: q.fields.gender.placeholder || '',
          options: toOptionsArray(q.fields.gender.options),
        },
      },
    },

    // Step 2: Family Status
    familyStatus: {
      id: 'family-status',
      title: q.steps['family-status'].title,
      subtitle: q.steps['family-status'].description || '',
      fields: {
        familyStatus: {
          label: q.fields.familyStatus.label,
          placeholder: q.fields.familyStatus.placeholder || '',
          required: true,
          options: toOptionsArray(q.fields.familyStatus.options),
        },
        processPartner: {
          label: q.fields.processPartner.label,
          placeholder: q.fields.processPartner.placeholder || '',
          options: toOptionsArray(q.fields.processPartner.options),
        },
        partnerName: {
          label: q.fields.partnerName.label,
          placeholder: q.fields.partnerName.placeholder || '',
        },
        children: {
          label: 'פרטי הילדים',
          addChild: q.ui.addChild,
          removeChild: q.ui.removeChild,
          maxChildren: 8,
          childFields: {
            name: {
              label: q.fields.childName.label,
              placeholder: q.fields.childName.placeholder || '',
            },
            age: {
              label: q.fields.childAge.label,
              placeholder: q.fields.childAge.placeholder || '',
            },
          },
        },
      },
    },

    // Step 3: Relocation Goals
    relocationGoals: {
      id: 'relocation-goals',
      title: q.steps['relocation-goals'].title,
      subtitle: q.steps['relocation-goals'].description || '',
      hint: 'ניתן לבחור יותר מאפשרות אחת',
      fields: {
        relocationReasons: {
          label: q.fields.relocationReasons.label,
          options: toOptionsArray(q.fields.relocationReasons.options),
        },
      },
    },

    // Step 4: Citizenship
    citizenship: {
      id: 'citizenship',
      title: q.steps.citizenship.title,
      subtitle: q.steps.citizenship.description || '',
      fields: {
        citizenships: {
          label: q.fields.citizenships.label,
          hint: 'ניתן לבחור עד 3 אזרחויות',
          placeholder: q.fields.citizenships.placeholder || '',
          maxSelections: 3,
        },
        partnerCitizenships: {
          label: q.fields.partnerCitizenships.label,
          hint: 'ניתן לבחור עד 3 אזרחויות',
          placeholder: q.fields.partnerCitizenships.placeholder || '',
          maxSelections: 3,
        },
      },
    },

    // Step 5: Employment & Education
    employmentEducation: {
      id: 'employment-education',
      title: q.steps['employment-education'].title,
      subtitle: q.steps['employment-education'].description || '',
      fields: {
        employmentStatus: {
          label: q.fields.employmentStatus.label,
          placeholder: q.fields.employmentStatus.placeholder || '',
          required: true,
          options: toOptionsArray(q.fields.employmentStatus.options),
        },
        occupation: {
          label: q.fields.occupation.label,
          placeholder: q.fields.occupation.placeholder || '',
        },
        education: {
          label: q.fields.education.label,
          placeholder: q.fields.education.placeholder || '',
          options: toOptionsArray(q.fields.education.options),
        },
        remoteWorkCapable: {
          label: q.fields.remoteWorkCapable.label,
          hint: '',
          options: [
            { value: true, label: q.fields.remoteWorkCapable.yes },
            { value: false, label: q.fields.remoteWorkCapable.no },
          ],
        },
      },
    },

    // Step 6: Income
    income: {
      id: 'income',
      title: q.steps.income.title,
      subtitle: q.steps.income.description || '',
      fields: {
        householdIncome: {
          label: q.fields.householdIncome.label,
          placeholder: q.fields.householdIncome.placeholder || '',
          required: true,
          options: toOptionsArray(q.fields.householdIncome.options),
        },
        hasPassiveIncome: {
          label: q.fields.hasPassiveIncome.label,
          options: [
            { value: 'true', label: q.fields.hasPassiveIncome.yes },
            { value: 'false', label: q.fields.hasPassiveIncome.no },
          ],
        },
        passiveIncomeAmount: {
          label: q.fields.passiveIncomeAmount.label,
          placeholder: q.fields.passiveIncomeAmount.placeholder || '',
          options: toOptionsArray(q.fields.passiveIncomeAmount.options),
        },
      },
    },

    // Step 7: Partner Details
    partnerDetails: {
      id: 'partner-details',
      title: q.steps['partner-details'].title,
      subtitle: q.steps['partner-details'].description || '',
      fields: {
        partnerEmploymentStatus: {
          label: q.fields.partnerEmploymentStatus.label,
          placeholder: q.fields.partnerEmploymentStatus.placeholder || '',
          options: toOptionsArray(q.fields.partnerEmploymentStatus.options),
        },
        partnerOccupation: {
          label: q.fields.partnerOccupation.label,
          placeholder: q.fields.partnerOccupation.placeholder || '',
        },
        partnerEducation: {
          label: q.fields.partnerEducation.label,
          placeholder: q.fields.partnerEducation.placeholder || '',
          options: toOptionsArray(q.fields.partnerEducation.options),
        },
        partnerRemoteWorkCapable: {
          label: q.fields.partnerRemoteWorkCapable.label,
          hint: '',
          options: [
            { value: true, label: q.fields.partnerRemoteWorkCapable.yes },
            { value: false, label: q.fields.partnerRemoteWorkCapable.no },
          ],
        },
      },
    },

    // Step 8: Studies, Investments & Languages
    studiesInvestmentsLanguages: {
      id: 'studies-investments-languages',
      title: q.steps['studies-investments-languages'].title,
      subtitle: q.steps['studies-investments-languages'].description || '',
      fields: {
        openToStudyingAbroad: {
          label: q.fields.openToStudyingAbroad.label,
          options: [
            { value: true, label: q.fields.openToStudyingAbroad.yes },
            { value: false, label: q.fields.openToStudyingAbroad.no },
          ],
        },
        partnerOpenToStudyingAbroad: {
          label: q.fields.partnerOpenToStudyingAbroad.label,
          options: [
            { value: true, label: q.fields.partnerOpenToStudyingAbroad.yes },
            { value: false, label: q.fields.partnerOpenToStudyingAbroad.no },
          ],
        },
        willingToInvestInProperty: {
          label: q.fields.willingToInvestInProperty.label,
          options: [
            { value: true, label: q.fields.willingToInvestInProperty.yes },
            { value: false, label: q.fields.willingToInvestInProperty.no },
          ],
        },
        has250kEuroForInvestment: {
          label: q.fields.has250kEuroForInvestment.label,
          options: [
            { value: true, label: q.fields.has250kEuroForInvestment.yes },
            { value: false, label: q.fields.has250kEuroForInvestment.no },
          ],
        },
        speakingLanguages: {
          label: q.fields.speakingLanguages.label,
          placeholder: q.fields.speakingLanguages.placeholder || '',
          maxLanguages: 5,
        },
        writingLanguages: {
          label: q.fields.writingLanguages.label,
          placeholder: q.fields.writingLanguages.placeholder || '',
          maxLanguages: 5,
        },
        partnerSpeakingLanguages: {
          label: q.fields.partnerSpeakingLanguages.label,
          placeholder: q.fields.partnerSpeakingLanguages.placeholder || '',
          maxLanguages: 5,
        },
        partnerWritingLanguages: {
          label: q.fields.partnerWritingLanguages.label,
          placeholder: q.fields.partnerWritingLanguages.placeholder || '',
          maxLanguages: 5,
        },
      },
    },

    // Step 9: Preferences
    preferences: {
      id: 'preferences',
      title: q.steps.preferences.title,
      subtitle: q.steps.preferences.description || '',
      fields: {
        distanceFromIsrael: {
          label: q.fields.distanceFromIsrael.label,
          placeholder: q.fields.distanceFromIsrael.placeholder || '',
          options: toOptionsArray(q.fields.distanceFromIsrael.options),
        },
        timeZoneDifference: {
          label: q.fields.timeZoneDifference.label,
          placeholder: q.fields.timeZoneDifference.placeholder || '',
          options: toOptionsArray(q.fields.timeZoneDifference.options),
        },
        weatherPreference: {
          label: q.fields.weatherPreference.label,
          placeholder: q.fields.weatherPreference.placeholder || '',
          options: toOptionsArray(q.fields.weatherPreference.options),
        },
        jewishCommunityImportance: {
          label: q.fields.jewishCommunityImportance.label,
          options: toOptionsArray(q.fields.jewishCommunityImportance.options),
        },
        israeliCommunityImportance: {
          label: q.fields.israeliCommunityImportance.label,
          options: toOptionsArray(q.fields.israeliCommunityImportance.options),
        },
        livingType: {
          label: q.fields.livingType.label,
          placeholder: q.fields.livingType.placeholder || '',
          options: toOptionsArray(q.fields.livingType.options),
        },
        hasAdditionalConsiderations: {
          label: q.fields.hasAdditionalConsiderations.label,
          options: [
            { value: 'true', label: q.fields.hasAdditionalConsiderations.yes },
            { value: 'false', label: q.fields.hasAdditionalConsiderations.no },
          ],
        },
        additionalConsiderationsText: {
          label: q.fields.additionalConsiderationsText.label,
          placeholder: q.fields.additionalConsiderationsText.placeholder || '',
        },
        previousVisaAttempt: {
          label: q.fields.previousVisaAttempt.label,
          placeholder: q.fields.previousVisaAttempt.placeholder || '',
          options: toOptionsArray(q.fields.previousVisaAttempt.options),
        },
        hasCriminalRecord: {
          label: q.fields.hasCriminalRecord.label,
          options: [
            { value: 'true', label: q.fields.hasCriminalRecord.yes },
            { value: 'false', label: q.fields.hasCriminalRecord.no },
          ],
        },
      },
    },
  };
}

/**
 * Get country options for citizenship fields
 */
export function getCountryOptions(): OptionItem[] {
  const locale = getLocale();
  return Object.entries(locale.questionnaire.fields.citizenships.options).map(
    ([value, label]) => ({ value, label })
  );
}

/**
 * Get language options for language fields
 */
export function getLanguageOptions(): OptionItem[] {
  const locale = getLocale();
  return Object.entries(locale.questionnaire.fields.speakingLanguages.options).map(
    ([value, label]) => ({ value, label })
  );
}

/**
 * Get questionnaire navigation content
 */
export function getQuestionnaireNavigation() {
  const locale = getLocale();
  return {
    back: locale.questionnaire.ui.back,
    continue: locale.questionnaire.ui.next,
    submit: locale.questionnaire.ui.submit,
    saveAndContinue: locale.questionnaire.ui.saving,
    step: locale.questionnaire.progress.step,
    of: locale.questionnaire.progress.of,
  };
}

/**
 * Questionnaire V2 content object for backward compatibility
 * This mimics the structure of siteContent.questionnaireV2
 */
export function getQuestionnaireV2Content() {
  return {
    title: 'שאלון רילוקיישן',
    subtitle: 'מלאו את השאלון כדי לקבל דוח מותאם אישית',
    progress: {
      personalInfo: 'פרטים אישיים',
      goals: 'מטרות',
      eligibility: 'זכאות',
      preferences: 'העדפות',
    },
    navigation: getQuestionnaireNavigation(),
    steps: getQuestionnaireStepContent(),
    countryOptions: getCountryOptions(),
    languageOptions: getLanguageOptions(),
  };
}
