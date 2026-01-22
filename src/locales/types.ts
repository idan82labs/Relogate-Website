/**
 * Localization Type Definitions
 *
 * Defines the structure of locale files to ensure type safety
 * and completeness across all supported languages.
 */

import type {
  Gender,
  FamilyStatus,
  ProcessPartner,
  RelocationReason,
  EmploymentStatus,
  EducationLevel,
  IncomeRange,
  PassiveIncomeRange,
  Language,
  Country,
  DistancePreference,
  TimeZonePreference,
  WeatherPreference,
  CommunityImportance,
  LivingType,
  VisaAttemptStatus,
  QuestionnaireStepId,
} from './constants';

// ============================================================================
// Base Field Types
// ============================================================================

/**
 * Text field configuration (for free text inputs)
 */
export interface TextField {
  /** Field label displayed above the input */
  label: string;
  /** Placeholder text inside the input */
  placeholder?: string;
  /** Help text below the input */
  hint?: string;
}

/**
 * Option field configuration (for dropdowns, radio buttons, checkboxes)
 * @template T - The type of option values (e.g., Gender, EmploymentStatus)
 */
export interface OptionField<T extends string> {
  /** Field label */
  label: string;
  /** Placeholder text for empty state */
  placeholder?: string;
  /** Mapping from option value to display text */
  options: Record<T, string>;
}

/**
 * Boolean field configuration (for yes/no questions)
 */
export interface BooleanField {
  /** Field label (the question) */
  label: string;
  /** Text for "yes" option */
  yes: string;
  /** Text for "no" option */
  no: string;
}

// ============================================================================
// Questionnaire Step Translations
// ============================================================================

/**
 * Step metadata
 */
export interface StepMeta {
  /** Step title displayed in progress bar */
  title: string;
  /** Step description/subtitle */
  description?: string;
}

/**
 * Questionnaire translations structure
 */
export interface QuestionnaireTranslations {
  /** Step metadata */
  steps: Record<QuestionnaireStepId, StepMeta>;

  /** Field configurations */
  fields: {
    // Step 1: Personal Details
    fullName: TextField;
    birthDate: TextField;
    phone: TextField;
    email: TextField;
    gender: OptionField<Gender>;

    // Step 2: Family Status
    familyStatus: OptionField<FamilyStatus>;
    processPartner: OptionField<ProcessPartner>;
    partnerName: TextField;
    childName: TextField;
    childAge: TextField;

    // Step 3: Relocation Goals
    relocationReasons: OptionField<RelocationReason>;

    // Step 4: Citizenship
    citizenships: OptionField<Country>;
    partnerCitizenships: OptionField<Country>;

    // Step 5: Employment & Education
    employmentStatus: OptionField<EmploymentStatus>;
    occupation: TextField;
    education: OptionField<EducationLevel>;
    remoteWorkCapable: BooleanField;

    // Step 6: Income
    householdIncome: OptionField<IncomeRange>;
    hasPassiveIncome: BooleanField;
    passiveIncomeAmount: OptionField<PassiveIncomeRange>;

    // Step 7: Partner Details
    partnerEmploymentStatus: OptionField<EmploymentStatus>;
    partnerOccupation: TextField;
    partnerEducation: OptionField<EducationLevel>;
    partnerRemoteWorkCapable: BooleanField;

    // Step 8: Studies, Investments & Languages
    openToStudyingAbroad: BooleanField;
    partnerOpenToStudyingAbroad: BooleanField;
    willingToInvestInProperty: BooleanField;
    has250kEuroForInvestment: BooleanField;
    speakingLanguages: OptionField<Language>;
    writingLanguages: OptionField<Language>;
    partnerSpeakingLanguages: OptionField<Language>;
    partnerWritingLanguages: OptionField<Language>;

    // Step 9: Preferences
    distanceFromIsrael: OptionField<DistancePreference>;
    timeZoneDifference: OptionField<TimeZonePreference>;
    weatherPreference: OptionField<WeatherPreference>;
    jewishCommunityImportance: OptionField<CommunityImportance>;
    israeliCommunityImportance: OptionField<CommunityImportance>;
    livingType: OptionField<LivingType>;
    hasAdditionalConsiderations: BooleanField;
    additionalConsiderationsText: TextField;
    previousVisaAttempt: OptionField<VisaAttemptStatus>;
    hasCriminalRecord: BooleanField;
  };

  /** Validation error messages */
  errors: {
    required: string;
    invalidEmail: string;
    invalidPhone: string;
    invalidDate: string;
    invalidAge: string;
    minSelection: string;
    maxSelection: string;
  };

  /** UI elements */
  ui: {
    next: string;
    back: string;
    submit: string;
    saving: string;
    loading: string;
    addChild: string;
    removeChild: string;
    selectPlaceholder: string;
    searchPlaceholder: string;
    noResults: string;
    selected: string;
    clear: string;
  };

  /** Progress indicator */
  progress: {
    step: string;
    of: string;
    complete: string;
  };

  /** Success/completion messages */
  success: {
    saved: string;
    submitted: string;
    title: string;
    message: string;
  };
}

// ============================================================================
// Common Translations
// ============================================================================

/**
 * Common UI elements used across the application
 */
export interface CommonTranslations {
  /** Navigation */
  nav: {
    home: string;
    about: string;
    contact: string;
    login: string;
    logout: string;
    register: string;
    personalArea: string;
    questionnaire: string;
  };

  /** Actions */
  actions: {
    save: string;
    cancel: string;
    confirm: string;
    delete: string;
    edit: string;
    close: string;
    retry: string;
    refresh: string;
    viewMore: string;
    viewLess: string;
  };

  /** Status */
  status: {
    loading: string;
    error: string;
    success: string;
    pending: string;
    completed: string;
    inProgress: string;
  };

  /** Boolean display */
  boolean: {
    yes: string;
    no: string;
  };

  /** General error messages */
  errors: {
    generic: string;
    network: string;
    unauthorized: string;
    notFound: string;
    serverError: string;
  };

  /** Date/time */
  dateTime: {
    today: string;
    yesterday: string;
    daysAgo: string;
    hoursAgo: string;
    minutesAgo: string;
    justNow: string;
  };
}

// ============================================================================
// Personal Area Translations
// ============================================================================

/**
 * Personal area/dashboard translations
 */
export interface PersonalAreaTranslations {
  /** Page title and meta */
  meta: {
    title: string;
    description: string;
  };

  /** Dashboard sections */
  sections: {
    welcome: {
      title: string;
      greeting: string;
    };
    questionnaire: {
      title: string;
      notStarted: string;
      inProgress: string;
      completed: string;
      startButton: string;
      continueButton: string;
      viewButton: string;
    };
    report: {
      title: string;
      notReady: string;
      ready: string;
      viewButton: string;
      destinations: string;
    };
    profile: {
      title: string;
      editButton: string;
    };
  };

  /** Field labels for displaying questionnaire data */
  fieldLabels: Record<string, string>;

  /** Section titles for grouped display */
  sectionTitles: {
    personal: string;
    family: string;
    goals: string;
    citizenship: string;
    employment: string;
    income: string;
    partner: string;
    studiesLanguages: string;
    preferences: string;
  };
}

// ============================================================================
// Site/Marketing Translations
// ============================================================================

/**
 * Marketing site translations (homepage, etc.)
 */
export interface SiteTranslations {
  /** Site metadata */
  meta: {
    title: string;
    description: string;
    keywords: string;
  };

  /** Header */
  header: {
    logo: string;
    tagline: string;
    ctaButton: string;
  };

  /** Hero section */
  hero: {
    title: string;
    subtitle: string;
    ctaButton: string;
    secondaryButton: string;
  };

  /** Features section */
  features: {
    title: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };

  /** How it works section */
  howItWorks: {
    title: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  };

  /** Testimonials section */
  testimonials: {
    title: string;
    items: Array<{
      quote: string;
      author: string;
      role: string;
    }>;
  };

  /** FAQ section */
  faq: {
    title: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };

  /** Footer */
  footer: {
    copyright: string;
    privacyPolicy: string;
    termsOfService: string;
    contact: string;
  };
}

// ============================================================================
// Complete Locale Type
// ============================================================================

/**
 * Complete locale configuration
 */
export interface Locale {
  /** Locale code (e.g., 'he', 'en') */
  code: string;
  /** Locale display name (e.g., 'עברית', 'English') */
  name: string;
  /** Text direction */
  dir: 'rtl' | 'ltr';
  /** Questionnaire translations */
  questionnaire: QuestionnaireTranslations;
  /** Common UI translations */
  common: CommonTranslations;
  /** Personal area translations */
  personalArea: PersonalAreaTranslations;
  /** Marketing site translations */
  site: SiteTranslations;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Extract option values from an OptionField
 */
export type OptionValues<T> = T extends OptionField<infer V> ? V : never;

/**
 * Get the label for a specific option value
 */
export type GetOptionLabel<T extends OptionField<string>> = (
  value: OptionValues<T>
) => string;

/**
 * Supported locale codes
 */
export type LocaleCode = 'he' | 'en';

/**
 * Translation key path (for nested access)
 */
export type TranslationPath =
  | `questionnaire.${string}`
  | `common.${string}`
  | `personalArea.${string}`
  | `site.${string}`;
