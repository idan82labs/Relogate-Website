/**
 * QuestionnaireV2 Types
 *
 * Comprehensive type definitions for the expanded 9-step questionnaire.
 * Supports ~40 fields across multiple sections.
 */

// ============================================================================
// Enums / Union Types
// ============================================================================

/** Gender options */
export type Gender = "male" | "female" | "prefer_not_to_say";

/** Family status options */
export type FamilyStatus =
  | "single"
  | "single_with_children"
  | "married_no_children"
  | "married_with_children"
  | "divorced_no_children"
  | "divorced_with_children"
  | "widowed_no_children"
  | "widowed_with_children";

/** Process partner options - who is participating in the relocation process */
export type ProcessPartner =
  | "alone"
  | "partner"
  | "wife"
  | "husband"
  | "wife_and_children"
  | "husband_and_children"
  | "ex_spouse_and_children";

/** Relocation reasons - multi-select */
export type RelocationReason =
  | "economic_quality_of_life"
  | "personal_security"
  | "better_education"
  | "better_future_for_family"
  | "professional_development"
  | "real_estate_opportunity"
  | "academic_opportunity"
  | "adventure"
  | "life_change"
  | "just_exploring";

/** Employment status options */
export type EmploymentStatus =
  | "employed"
  | "self_employed"
  | "business_owner"
  | "not_working"
  | "retired";

/** Education level options */
export type EducationLevel =
  | "high_school"
  | "vocational"
  | "bachelor"
  | "master"
  | "doctorate"
  | "other";

/** Income range options (NIS) */
export type IncomeRange =
  | "up_to_10k"
  | "10k_15k"
  | "15k_20k"
  | "20k_25k"
  | "25k_30k"
  | "30k_35k"
  | "35k_40k"
  | "40k_45k"
  | "45k_50k"
  | "50k_55k"
  | "55k_60k"
  | "60k_plus";

/** Passive income range options (NIS) */
export type PassiveIncomeRange =
  | "up_to_5k"
  | "5k_10k"
  | "10k_15k"
  | "15k_20k"
  | "20k_25k"
  | "25k_30k"
  | "30k_35k"
  | "35k_40k"
  | "40k_plus";

/** Language proficiency - for speaking and writing */
export type Language =
  | "hebrew"
  | "english"
  | "arabic"
  | "russian"
  | "french"
  | "spanish"
  | "german"
  | "portuguese"
  | "italian"
  | "chinese"
  | "japanese"
  | "korean"
  | "hindi"
  | "turkish"
  | "polish"
  | "dutch"
  | "greek"
  | "romanian"
  | "ukrainian"
  | "other";

/** Distance from Israel preference */
export type DistancePreference =
  | "up_to_3_hours"
  | "up_to_6_hours"
  | "up_to_12_hours"
  | "not_important";

/** Time zone difference preference */
export type TimeZonePreference =
  | "up_to_1_hour"
  | "up_to_2_hours"
  | "up_to_6_hours"
  | "up_to_8_hours"
  | "up_to_10_hours"
  | "not_important";

/** Weather preference */
export type WeatherPreference =
  | "four_seasons"
  | "warm_and_sunny"
  | "cold_most_of_year"
  | "no_preference";

/** Community importance level */
export type CommunityImportance = "important" | "not_important";

/** Living type preference */
export type LivingTypePreference =
  | "big_city"
  | "small_town"
  | "rural_area"
  | "near_the_sea"
  | "no_preference";

/** Previous visa attempt status */
export type VisaAttemptStatus =
  | "never_tried"
  | "tried_and_approved"
  | "tried_and_rejected";

// ============================================================================
// Child Data
// ============================================================================

/** Child information */
export interface ChildInfo {
  /** Child's name */
  name: string;
  /** Child's age */
  age: number;
}

// ============================================================================
// Step Data Interfaces
// ============================================================================

/**
 * Step 1: Personal Details (פרטים אישיים)
 * Basic registration info collected at signup
 */
export interface PersonalDetailsStep {
  /** Full name - required */
  fullName: string;
  /** Birth date - required */
  birthDate: string;
  /** Phone number - required */
  phone: string;
  /** Email address - required */
  email: string;
  /** Gender - optional */
  gender?: Gender;
}

/**
 * Step 2: Family Status (מצב משפחתי)
 * Family situation and who's involved in the process
 */
export interface FamilyStatusStep {
  /** Family status - required */
  familyStatus: FamilyStatus;
  /** Who is participating in the relocation process */
  processPartner?: ProcessPartner;
  /** Partner's name - conditional, shown if partner is involved */
  partnerName?: string;
  /** Children details - conditional, shown if has children */
  children?: ChildInfo[];
}

/**
 * Step 3: Relocation Goals (מטרות המעבר)
 * Main reasons for considering relocation
 */
export interface RelocationGoalsStep {
  /** Main reasons for relocation - multi-select */
  relocationReasons: RelocationReason[];
}

/**
 * Step 4: Citizenship (אזרחות)
 * User and partner citizenship information
 */
export interface CitizenshipStep {
  /** User's citizenships - at least one required */
  citizenships: string[];
  /** Partner's citizenships - conditional */
  partnerCitizenships?: string[];
}

/**
 * Step 5: Education & Employment - User (השכלה ותעסוקה)
 * User's employment status, occupation, education
 */
export interface EmploymentEducationStep {
  /** Employment status */
  employmentStatus: EmploymentStatus;
  /** Field of work / occupation */
  occupation?: string;
  /** Highest education level */
  education?: EducationLevel;
  /** Can work remotely from anywhere */
  remoteWorkCapable: boolean;
}

/**
 * Step 6: Income (הכנסה)
 * Household income and passive income
 */
export interface IncomeStep {
  /** Monthly household income (net, NIS) */
  householdIncome: IncomeRange;
  /** Whether has passive income */
  hasPassiveIncome: boolean;
  /** Passive income amount - conditional */
  passiveIncomeAmount?: PassiveIncomeRange;
}

/**
 * Step 7: Partner Details (פרטי בן/בת הזוג)
 * Partner's employment, education, and capabilities
 * Only shown if familyStatus includes partner
 */
export interface PartnerDetailsStep {
  /** Partner's employment status */
  partnerEmploymentStatus?: EmploymentStatus;
  /** Partner's field of work */
  partnerOccupation?: string;
  /** Partner's highest education */
  partnerEducation?: EducationLevel;
  /** Partner can work remotely */
  partnerRemoteWorkCapable?: boolean;
}

/**
 * Step 8: Studies, Investments & Languages (לימודים, השקעות ושפות)
 * Willingness to study abroad, invest, and language proficiency
 */
export interface StudiesInvestmentsLanguagesStep {
  /** Open to studying abroad for the process */
  openToStudyingAbroad: boolean;
  /** Partner open to studying abroad - conditional */
  partnerOpenToStudyingAbroad?: boolean;
  /** Willing to invest in property for residence visa */
  willingToInvestInProperty: boolean;
  /** Has 250,000 EUR available for property investment - conditional */
  has250kEuroForInvestment?: boolean;
  /** Languages user can speak */
  speakingLanguages: Language[];
  /** Languages user can write */
  writingLanguages: Language[];
  /** Languages partner can speak - conditional */
  partnerSpeakingLanguages?: Language[];
  /** Languages partner can write - conditional */
  partnerWritingLanguages?: Language[];
}

/**
 * Step 9: Preferences & Additional Info (העדפות ומידע נוסף)
 * Location preferences and final details
 */
export interface PreferencesStep {
  /** Distance from Israel preference */
  distanceFromIsrael: DistancePreference;
  /** Time zone difference preference */
  timeZoneDifference: TimeZonePreference;
  /** Weather preference */
  weatherPreference: WeatherPreference;
  /** Importance of being part of religious Jewish community */
  jewishCommunityImportance: CommunityImportance;
  /** Importance of being part of Israeli community */
  israeliCommunityImportance: CommunityImportance;
  /** Living type preference */
  livingType: LivingTypePreference;
  /** Has additional considerations */
  hasAdditionalConsiderations: boolean;
  /** Additional considerations details - conditional */
  additionalConsiderationsText?: string;
  /** Previous visa application attempt */
  previousVisaAttempt: VisaAttemptStatus;
  /** Has criminal record */
  hasCriminalRecord: boolean;
}

// ============================================================================
// Complete Questionnaire Data
// ============================================================================

/**
 * Complete QuestionnaireV2 data combining all steps
 */
export interface QuestionnaireDataV2 {
  // Step 1: Personal Details
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
  gender?: Gender;

  // Step 2: Family Status
  familyStatus: FamilyStatus;
  processPartner?: ProcessPartner;
  partnerName?: string;
  children?: ChildInfo[];

  // Step 3: Relocation Goals
  relocationReasons: RelocationReason[];

  // Step 4: Citizenship
  citizenships: string[];
  partnerCitizenships?: string[];

  // Step 5: Employment & Education
  employmentStatus: EmploymentStatus;
  occupation?: string;
  education?: EducationLevel;
  remoteWorkCapable: boolean;

  // Step 6: Income
  householdIncome: IncomeRange;
  hasPassiveIncome: boolean;
  passiveIncomeAmount?: PassiveIncomeRange;

  // Step 7: Partner Details (conditional)
  partnerEmploymentStatus?: EmploymentStatus;
  partnerOccupation?: string;
  partnerEducation?: EducationLevel;
  partnerRemoteWorkCapable?: boolean;

  // Step 8: Studies, Investments & Languages
  openToStudyingAbroad: boolean;
  partnerOpenToStudyingAbroad?: boolean;
  willingToInvestInProperty: boolean;
  has250kEuroForInvestment?: boolean;
  speakingLanguages: Language[];
  writingLanguages: Language[];
  partnerSpeakingLanguages?: Language[];
  partnerWritingLanguages?: Language[];

  // Step 9: Preferences & Additional Info
  distanceFromIsrael: DistancePreference;
  timeZoneDifference: TimeZonePreference;
  weatherPreference: WeatherPreference;
  jewishCommunityImportance: CommunityImportance;
  israeliCommunityImportance: CommunityImportance;
  livingType: LivingTypePreference;
  hasAdditionalConsiderations: boolean;
  additionalConsiderationsText?: string;
  previousVisaAttempt: VisaAttemptStatus;
  hasCriminalRecord: boolean;
}

// ============================================================================
// Questionnaire State
// ============================================================================

/** Step identifier for the V2 questionnaire */
export type QuestionnaireV2StepId =
  | "personal-details"
  | "family-status"
  | "relocation-goals"
  | "citizenship"
  | "employment-education"
  | "income"
  | "partner-details"
  | "studies-investments-languages"
  | "preferences";

/** Step configuration */
export interface QuestionnaireV2Step {
  id: QuestionnaireV2StepId;
  path: string;
  stepNumber: number;
  /** Title for progress display */
  title: string;
  /** Whether this step is conditional (e.g., partner details) */
  conditional?: boolean;
  /** Function to check if step should be shown */
  shouldShow?: (data: Partial<QuestionnaireDataV2>) => boolean;
}

/** Questionnaire status */
export type QuestionnaireStatus = "in_progress" | "completed" | "archived";

/** Full questionnaire state for state management */
export interface QuestionnaireV2State {
  /** Questionnaire ID from backend */
  id: string | null;
  /** Current step number (1-indexed) */
  currentStep: number;
  /** Partial data collected so far */
  data: Partial<QuestionnaireDataV2>;
  /** Whether form is being submitted */
  isSubmitting: boolean;
  /** Whether questionnaire is complete */
  isComplete: boolean;
  /** Whether syncing with backend */
  isSyncing: boolean;
  /** Error message if any */
  error: string | null;
  /** Questionnaire status */
  status: QuestionnaireStatus;
}

// ============================================================================
// Validation Types
// ============================================================================

/** Field validation result */
export interface FieldValidation {
  isValid: boolean;
  error?: string;
}

/** Step validation result */
export interface StepValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

// ============================================================================
// Helper Types
// ============================================================================

/** Check if user has a partner based on family status */
export function hasPartner(familyStatus?: FamilyStatus): boolean {
  if (!familyStatus) return false;
  return (
    familyStatus === "married_no_children" ||
    familyStatus === "married_with_children"
  );
}

/** Check if user has children based on family status */
export function hasChildren(familyStatus?: FamilyStatus): boolean {
  if (!familyStatus) return false;
  return (
    familyStatus === "single_with_children" ||
    familyStatus === "married_with_children" ||
    familyStatus === "divorced_with_children" ||
    familyStatus === "widowed_with_children"
  );
}

/** Check if partner details step should be shown */
export function shouldShowPartnerDetails(
  data: Partial<QuestionnaireDataV2>
): boolean {
  return hasPartner(data.familyStatus);
}
