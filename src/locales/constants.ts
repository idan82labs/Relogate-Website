/**
 * Localization Constants
 *
 * Single source of truth for all English tags used in the application.
 * These constants are stored in the database and translated for display.
 *
 * IMPORTANT: When adding new values, add them here FIRST, then add
 * translations in the locale files (he/questionnaire.ts, etc.)
 */

// ============================================================================
// Gender
// ============================================================================

export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  PREFER_NOT_TO_SAY: 'prefer_not_to_say',
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];

// ============================================================================
// Family Status
// ============================================================================

export const FAMILY_STATUS = {
  SINGLE: 'single',
  SINGLE_WITH_CHILDREN: 'single_with_children',
  MARRIED_NO_CHILDREN: 'married_no_children',
  MARRIED_WITH_CHILDREN: 'married_with_children',
  DIVORCED_NO_CHILDREN: 'divorced_no_children',
  DIVORCED_WITH_CHILDREN: 'divorced_with_children',
  WIDOWED_NO_CHILDREN: 'widowed_no_children',
  WIDOWED_WITH_CHILDREN: 'widowed_with_children',
} as const;

export type FamilyStatus = (typeof FAMILY_STATUS)[keyof typeof FAMILY_STATUS];

// ============================================================================
// Process Partner
// ============================================================================

export const PROCESS_PARTNER = {
  ALONE: 'alone',
  PARTNER: 'partner',
  WIFE: 'wife',
  HUSBAND: 'husband',
  WIFE_AND_CHILDREN: 'wife_and_children',
  HUSBAND_AND_CHILDREN: 'husband_and_children',
  EX_SPOUSE_AND_CHILDREN: 'ex_spouse_and_children',
} as const;

export type ProcessPartner = (typeof PROCESS_PARTNER)[keyof typeof PROCESS_PARTNER];

// ============================================================================
// Relocation Reasons
// ============================================================================

export const RELOCATION_REASON = {
  ECONOMIC_QUALITY_OF_LIFE: 'economic_quality_of_life',
  PERSONAL_SECURITY: 'personal_security',
  BETTER_EDUCATION: 'better_education',
  BETTER_FUTURE_FOR_FAMILY: 'better_future_for_family',
  PROFESSIONAL_DEVELOPMENT: 'professional_development',
  REAL_ESTATE_OPPORTUNITY: 'real_estate_opportunity',
  ACADEMIC_OPPORTUNITY: 'academic_opportunity',
  ADVENTURE: 'adventure',
  LIFE_CHANGE: 'life_change',
  JUST_EXPLORING: 'just_exploring',
} as const;

export type RelocationReason = (typeof RELOCATION_REASON)[keyof typeof RELOCATION_REASON];

// ============================================================================
// Employment Status
// ============================================================================

export const EMPLOYMENT_STATUS = {
  EMPLOYED: 'employed',
  SELF_EMPLOYED: 'self_employed',
  BUSINESS_OWNER: 'business_owner',
  NOT_WORKING: 'not_working',
  RETIRED: 'retired',
} as const;

export type EmploymentStatus = (typeof EMPLOYMENT_STATUS)[keyof typeof EMPLOYMENT_STATUS];

// ============================================================================
// Education Level
// ============================================================================

export const EDUCATION_LEVEL = {
  HIGH_SCHOOL: 'high_school',
  VOCATIONAL: 'vocational',
  BACHELOR: 'bachelor',
  MASTER: 'master',
  DOCTORATE: 'doctorate',
  OTHER: 'other',
} as const;

export type EducationLevel = (typeof EDUCATION_LEVEL)[keyof typeof EDUCATION_LEVEL];

// ============================================================================
// Income Ranges (NIS)
// ============================================================================

export const INCOME_RANGE = {
  UP_TO_10K: 'up_to_10k',
  '10K_15K': '10k_15k',
  '15K_20K': '15k_20k',
  '20K_25K': '20k_25k',
  '25K_30K': '25k_30k',
  '30K_35K': '30k_35k',
  '35K_40K': '35k_40k',
  '40K_45K': '40k_45k',
  '45K_50K': '45k_50k',
  '50K_55K': '50k_55k',
  '55K_60K': '55k_60k',
  '60K_PLUS': '60k_plus',
} as const;

export type IncomeRange = (typeof INCOME_RANGE)[keyof typeof INCOME_RANGE];

// ============================================================================
// Passive Income Ranges (NIS)
// ============================================================================

export const PASSIVE_INCOME_RANGE = {
  UP_TO_5K: 'up_to_5k',
  '5K_10K': '5k_10k',
  '10K_15K': '10k_15k',
  '15K_20K': '15k_20k',
  '20K_25K': '20k_25k',
  '25K_30K': '25k_30k',
  '30K_35K': '30k_35k',
  '35K_40K': '35k_40k',
  '40K_PLUS': '40k_plus',
} as const;

export type PassiveIncomeRange = (typeof PASSIVE_INCOME_RANGE)[keyof typeof PASSIVE_INCOME_RANGE];

// ============================================================================
// Languages
// ============================================================================

export const LANGUAGE = {
  HEBREW: 'hebrew',
  ENGLISH: 'english',
  ARABIC: 'arabic',
  RUSSIAN: 'russian',
  FRENCH: 'french',
  SPANISH: 'spanish',
  GERMAN: 'german',
  PORTUGUESE: 'portuguese',
  ITALIAN: 'italian',
  CHINESE: 'chinese',
  JAPANESE: 'japanese',
  KOREAN: 'korean',
  HINDI: 'hindi',
  TURKISH: 'turkish',
  POLISH: 'polish',
  DUTCH: 'dutch',
  GREEK: 'greek',
  ROMANIAN: 'romanian',
  UKRAINIAN: 'ukrainian',
  OTHER: 'other',
} as const;

export type Language = (typeof LANGUAGE)[keyof typeof LANGUAGE];

// ============================================================================
// Countries (for citizenship)
// ============================================================================

export const COUNTRY = {
  ISRAEL: 'israel',
  USA: 'usa',
  UK: 'uk',
  GERMANY: 'germany',
  FRANCE: 'france',
  POLAND: 'poland',
  RUSSIA: 'russia',
  UKRAINE: 'ukraine',
  ROMANIA: 'romania',
  PORTUGAL: 'portugal',
  SPAIN: 'spain',
  ITALY: 'italy',
  CANADA: 'canada',
  AUSTRALIA: 'australia',
  HUNGARY: 'hungary',
  AUSTRIA: 'austria',
  NETHERLANDS: 'netherlands',
  BELGIUM: 'belgium',
  SOUTH_AFRICA: 'south_africa',
  ARGENTINA: 'argentina',
  BRAZIL: 'brazil',
  MEXICO: 'mexico',
  INDIA: 'india',
  SWITZERLAND: 'switzerland',
  GREECE: 'greece',
  TURKEY: 'turkey',
  MOROCCO: 'morocco',
  OTHER: 'other',
} as const;

export type Country = (typeof COUNTRY)[keyof typeof COUNTRY];

// ============================================================================
// Distance Preference
// ============================================================================

export const DISTANCE_PREFERENCE = {
  UP_TO_3_HOURS: 'up_to_3_hours',
  UP_TO_6_HOURS: 'up_to_6_hours',
  UP_TO_12_HOURS: 'up_to_12_hours',
  NOT_IMPORTANT: 'not_important',
} as const;

export type DistancePreference = (typeof DISTANCE_PREFERENCE)[keyof typeof DISTANCE_PREFERENCE];

// ============================================================================
// Time Zone Preference
// ============================================================================

export const TIME_ZONE_PREFERENCE = {
  UP_TO_1_HOUR: 'up_to_1_hour',
  UP_TO_2_HOURS: 'up_to_2_hours',
  UP_TO_6_HOURS: 'up_to_6_hours',
  UP_TO_8_HOURS: 'up_to_8_hours',
  UP_TO_10_HOURS: 'up_to_10_hours',
  NOT_IMPORTANT: 'not_important',
} as const;

export type TimeZonePreference = (typeof TIME_ZONE_PREFERENCE)[keyof typeof TIME_ZONE_PREFERENCE];

// ============================================================================
// Weather Preference
// ============================================================================

export const WEATHER_PREFERENCE = {
  FOUR_SEASONS: 'four_seasons',
  WARM_AND_SUNNY: 'warm_and_sunny',
  COLD_MOST_OF_YEAR: 'cold_most_of_year',
  NO_PREFERENCE: 'no_preference',
} as const;

export type WeatherPreference = (typeof WEATHER_PREFERENCE)[keyof typeof WEATHER_PREFERENCE];

// ============================================================================
// Community Importance
// ============================================================================

export const COMMUNITY_IMPORTANCE = {
  IMPORTANT: 'important',
  NOT_IMPORTANT: 'not_important',
} as const;

export type CommunityImportance = (typeof COMMUNITY_IMPORTANCE)[keyof typeof COMMUNITY_IMPORTANCE];

// ============================================================================
// Living Type Preference
// ============================================================================

export const LIVING_TYPE = {
  BIG_CITY: 'big_city',
  SMALL_TOWN: 'small_town',
  RURAL_AREA: 'rural_area',
  NEAR_THE_SEA: 'near_the_sea',
  NO_PREFERENCE: 'no_preference',
} as const;

export type LivingType = (typeof LIVING_TYPE)[keyof typeof LIVING_TYPE];

// ============================================================================
// Visa Attempt Status
// ============================================================================

export const VISA_ATTEMPT_STATUS = {
  NEVER_TRIED: 'never_tried',
  TRIED_AND_APPROVED: 'tried_and_approved',
  TRIED_AND_REJECTED: 'tried_and_rejected',
} as const;

export type VisaAttemptStatus = (typeof VISA_ATTEMPT_STATUS)[keyof typeof VISA_ATTEMPT_STATUS];

// ============================================================================
// Boolean (for storage)
// ============================================================================

export const BOOLEAN = {
  TRUE: 'true',
  FALSE: 'false',
} as const;

export type BooleanString = (typeof BOOLEAN)[keyof typeof BOOLEAN];

// ============================================================================
// Questionnaire Field Names
// ============================================================================

export const QUESTIONNAIRE_FIELD = {
  // Step 1: Personal Details
  FULL_NAME: 'fullName',
  BIRTH_DATE: 'birthDate',
  PHONE: 'phone',
  EMAIL: 'email',
  GENDER: 'gender',

  // Step 2: Family Status
  FAMILY_STATUS: 'familyStatus',
  PROCESS_PARTNER: 'processPartner',
  PARTNER_NAME: 'partnerName',
  CHILDREN: 'children',

  // Step 3: Relocation Goals
  RELOCATION_REASONS: 'relocationReasons',

  // Step 4: Citizenship
  CITIZENSHIPS: 'citizenships',
  PARTNER_CITIZENSHIPS: 'partnerCitizenships',

  // Step 5: Employment & Education
  EMPLOYMENT_STATUS: 'employmentStatus',
  OCCUPATION: 'occupation',
  EDUCATION: 'education',
  REMOTE_WORK_CAPABLE: 'remoteWorkCapable',

  // Step 6: Income
  HOUSEHOLD_INCOME: 'householdIncome',
  HAS_PASSIVE_INCOME: 'hasPassiveIncome',
  PASSIVE_INCOME_AMOUNT: 'passiveIncomeAmount',

  // Step 7: Partner Details
  PARTNER_EMPLOYMENT_STATUS: 'partnerEmploymentStatus',
  PARTNER_OCCUPATION: 'partnerOccupation',
  PARTNER_EDUCATION: 'partnerEducation',
  PARTNER_REMOTE_WORK_CAPABLE: 'partnerRemoteWorkCapable',

  // Step 8: Studies, Investments & Languages
  OPEN_TO_STUDYING_ABROAD: 'openToStudyingAbroad',
  PARTNER_OPEN_TO_STUDYING_ABROAD: 'partnerOpenToStudyingAbroad',
  WILLING_TO_INVEST_IN_PROPERTY: 'willingToInvestInProperty',
  HAS_250K_EURO_FOR_INVESTMENT: 'has250kEuroForInvestment',
  SPEAKING_LANGUAGES: 'speakingLanguages',
  WRITING_LANGUAGES: 'writingLanguages',
  PARTNER_SPEAKING_LANGUAGES: 'partnerSpeakingLanguages',
  PARTNER_WRITING_LANGUAGES: 'partnerWritingLanguages',

  // Step 9: Preferences & Additional Info
  DISTANCE_FROM_ISRAEL: 'distanceFromIsrael',
  TIME_ZONE_DIFFERENCE: 'timeZoneDifference',
  WEATHER_PREFERENCE: 'weatherPreference',
  JEWISH_COMMUNITY_IMPORTANCE: 'jewishCommunityImportance',
  ISRAELI_COMMUNITY_IMPORTANCE: 'israeliCommunityImportance',
  LIVING_TYPE: 'livingType',
  HAS_ADDITIONAL_CONSIDERATIONS: 'hasAdditionalConsiderations',
  ADDITIONAL_CONSIDERATIONS_TEXT: 'additionalConsiderationsText',
  PREVIOUS_VISA_ATTEMPT: 'previousVisaAttempt',
  HAS_CRIMINAL_RECORD: 'hasCriminalRecord',
} as const;

export type QuestionnaireField = (typeof QUESTIONNAIRE_FIELD)[keyof typeof QUESTIONNAIRE_FIELD];

// ============================================================================
// Questionnaire Step IDs
// ============================================================================

export const QUESTIONNAIRE_STEP = {
  PERSONAL_DETAILS: 'personal-details',
  FAMILY_STATUS: 'family-status',
  RELOCATION_GOALS: 'relocation-goals',
  CITIZENSHIP: 'citizenship',
  EMPLOYMENT_EDUCATION: 'employment-education',
  INCOME: 'income',
  PARTNER_DETAILS: 'partner-details',
  STUDIES_INVESTMENTS_LANGUAGES: 'studies-investments-languages',
  PREFERENCES: 'preferences',
} as const;

export type QuestionnaireStepId = (typeof QUESTIONNAIRE_STEP)[keyof typeof QUESTIONNAIRE_STEP];
