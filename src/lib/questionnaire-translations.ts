/**
 * Hebrew translations for questionnaire field values
 * Used to display questionnaire answers in human-readable format
 */

// Gender translations
export const genderTranslations: Record<string, string> = {
  male: 'זכר',
  female: 'נקבה',
  prefer_not_to_say: 'לא רוצה לציין',
};

// Family status translations
export const familyStatusTranslations: Record<string, string> = {
  single: 'רווק/ה',
  single_with_children: 'רווק/ה עם ילדים',
  married_no_children: 'נשוי/אה ללא ילדים',
  married_with_children: 'נשוי/אה עם ילדים',
  divorced_no_children: 'גרוש/ה ללא ילדים',
  divorced_with_children: 'גרוש/ה עם ילדים',
  widowed_no_children: 'אלמן/ה ללא ילדים',
  widowed_with_children: 'אלמן/ה עם ילדים',
};

// Process partner translations
export const processPartnerTranslations: Record<string, string> = {
  alone: 'לבד',
  partner: 'עם בן/בת זוג',
  wife: 'עם אשתי',
  husband: 'עם בעלי',
  wife_and_children: 'עם אשתי והילדים',
  husband_and_children: 'עם בעלי והילדים',
  ex_spouse_and_children: 'עם בן/בת הזוג לשעבר והילדים',
};

// Relocation reasons translations
export const relocationReasonTranslations: Record<string, string> = {
  economic_quality_of_life: 'איכות חיים כלכלית',
  personal_security: 'ביטחון אישי',
  better_education: 'חינוך טוב יותר',
  better_future_for_family: 'עתיד טוב יותר למשפחה',
  professional_development: 'התפתחות מקצועית',
  real_estate_opportunity: 'הזדמנות נדל"ן',
  academic_opportunity: 'הזדמנות אקדמית',
  adventure: 'הרפתקה',
  life_change: 'שינוי חיים',
  just_exploring: 'בודק/ת אפשרויות',
};

// Employment status translations
export const employmentStatusTranslations: Record<string, string> = {
  employed: 'שכיר/ה',
  self_employed: 'עצמאי/ת',
  business_owner: 'בעל/ת עסק',
  not_working: 'לא עובד/ת',
  retired: 'פנסיונר/ית',
};

// Education level translations
export const educationTranslations: Record<string, string> = {
  high_school: 'תיכון',
  vocational: 'לימודי מקצוע',
  bachelor: 'תואר ראשון',
  master: 'תואר שני',
  doctorate: 'דוקטורט',
  other: 'אחר',
};

// Income range translations
export const incomeRangeTranslations: Record<string, string> = {
  up_to_10k: 'עד 10,000 ₪',
  '10k_15k': '10,000-15,000 ₪',
  '15k_20k': '15,000-20,000 ₪',
  '20k_25k': '20,000-25,000 ₪',
  '25k_30k': '25,000-30,000 ₪',
  '30k_35k': '30,000-35,000 ₪',
  '35k_40k': '35,000-40,000 ₪',
  '40k_45k': '40,000-45,000 ₪',
  '45k_50k': '45,000-50,000 ₪',
  '50k_55k': '50,000-55,000 ₪',
  '55k_60k': '55,000-60,000 ₪',
  '60k_plus': 'מעל 60,000 ₪',
};

// Passive income range translations
export const passiveIncomeRangeTranslations: Record<string, string> = {
  up_to_5k: 'עד 5,000 ₪',
  '5k_10k': '5,000-10,000 ₪',
  '10k_15k': '10,000-15,000 ₪',
  '15k_20k': '15,000-20,000 ₪',
  '20k_25k': '20,000-25,000 ₪',
  '25k_30k': '25,000-30,000 ₪',
  '30k_35k': '30,000-35,000 ₪',
  '35k_40k': '35,000-40,000 ₪',
  '40k_plus': 'מעל 40,000 ₪',
};

// Language translations
export const languageTranslations: Record<string, string> = {
  hebrew: 'עברית',
  english: 'אנגלית',
  arabic: 'ערבית',
  russian: 'רוסית',
  french: 'צרפתית',
  spanish: 'ספרדית',
  german: 'גרמנית',
  portuguese: 'פורטוגזית',
  italian: 'איטלקית',
  chinese: 'סינית',
  japanese: 'יפנית',
  korean: 'קוריאנית',
  hindi: 'הינדי',
  turkish: 'טורקית',
  polish: 'פולנית',
  dutch: 'הולנדית',
  greek: 'יוונית',
  romanian: 'רומנית',
  ukrainian: 'אוקראינית',
  other: 'אחר',
};

// Distance preference translations
export const distancePreferenceTranslations: Record<string, string> = {
  up_to_3_hours: 'עד 3 שעות טיסה',
  up_to_6_hours: 'עד 6 שעות טיסה',
  up_to_12_hours: 'עד 12 שעות טיסה',
  not_important: 'לא משנה',
};

// Time zone preference translations
export const timeZonePreferenceTranslations: Record<string, string> = {
  up_to_1_hour: 'עד שעה הפרש',
  up_to_2_hours: 'עד 2 שעות הפרש',
  up_to_6_hours: 'עד 6 שעות הפרש',
  up_to_8_hours: 'עד 8 שעות הפרש',
  up_to_10_hours: 'עד 10 שעות הפרש',
  not_important: 'לא משנה',
};

// Weather preference translations
export const weatherPreferenceTranslations: Record<string, string> = {
  four_seasons: 'ארבע עונות',
  warm_and_sunny: 'חם ושמשי',
  cold_most_of_year: 'קר רוב השנה',
  no_preference: 'אין העדפה',
};

// Community importance translations
export const communityImportanceTranslations: Record<string, string> = {
  important: 'חשוב',
  not_important: 'לא חשוב',
};

// Living type translations
export const livingTypeTranslations: Record<string, string> = {
  big_city: 'עיר גדולה',
  small_town: 'עיר קטנה',
  rural_area: 'אזור כפרי',
  near_the_sea: 'ליד הים',
  no_preference: 'אין העדפה',
};

// Visa attempt status translations
export const visaAttemptStatusTranslations: Record<string, string> = {
  never_tried: 'לא ניסיתי מעולם',
  tried_and_approved: 'ניסיתי ואושר',
  tried_and_rejected: 'ניסיתי ונדחה',
};

// Citizenship translations (common countries)
export const citizenshipTranslations: Record<string, string> = {
  israel: 'ישראל',
  usa: 'ארה"ב',
  uk: 'בריטניה',
  germany: 'גרמניה',
  france: 'צרפת',
  poland: 'פולין',
  russia: 'רוסיה',
  ukraine: 'אוקראינה',
  romania: 'רומניה',
  portugal: 'פורטוגל',
  spain: 'ספרד',
  italy: 'איטליה',
  canada: 'קנדה',
  australia: 'אוסטרליה',
  hungary: 'הונגריה',
  austria: 'אוסטריה',
  netherlands: 'הולנד',
  belgium: 'בלגיה',
  south_africa: 'דרום אפריקה',
  argentina: 'ארגנטינה',
  brazil: 'ברזיל',
  mexico: 'מקסיקו',
  india: 'הודו',
  other: 'אחר',
};

// Occupation/field translations (common fields)
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

// Boolean translations
export const booleanTranslations: Record<string, string> = {
  true: 'כן',
  false: 'לא',
};

/**
 * Field labels in Hebrew
 */
export const fieldLabels: Record<string, string> = {
  // Personal Details
  fullName: 'שם מלא',
  birthDate: 'תאריך לידה',
  phone: 'טלפון',
  email: 'אימייל',
  gender: 'מגדר',

  // Family Status
  familyStatus: 'מצב משפחתי',
  processPartner: 'מי מעורב בתהליך',
  partnerName: 'שם בן/בת הזוג',
  children: 'ילדים',

  // Relocation Goals
  relocationReasons: 'סיבות למעבר',

  // Citizenship
  citizenships: 'אזרחויות',
  partnerCitizenships: 'אזרחויות בן/בת הזוג',

  // Employment & Education
  employmentStatus: 'סטטוס תעסוקתי',
  occupation: 'תחום עיסוק',
  education: 'השכלה',
  remoteWorkCapable: 'יכולת עבודה מרחוק',

  // Income
  householdIncome: 'הכנסה חודשית משק בית (נטו)',
  hasPassiveIncome: 'יש הכנסה פסיבית',
  passiveIncomeAmount: 'סכום הכנסה פסיבית',

  // Partner Details
  partnerEmploymentStatus: 'סטטוס תעסוקתי בן/בת זוג',
  partnerOccupation: 'תחום עיסוק בן/בת זוג',
  partnerEducation: 'השכלת בן/בת זוג',
  partnerRemoteWorkCapable: 'בן/בת זוג יכול/ה לעבוד מרחוק',

  // Studies, Investments & Languages
  openToStudyingAbroad: 'פתוח/ה ללימודים בחו"ל',
  partnerOpenToStudyingAbroad: 'בן/בת זוג פתוח/ה ללימודים',
  willingToInvestInProperty: 'מוכן/ה להשקיע בנדל"ן',
  has250kEuroForInvestment: 'יש 250,000 אירו להשקעה',
  speakingLanguages: 'שפות דיבור',
  writingLanguages: 'שפות כתיבה',
  partnerSpeakingLanguages: 'שפות דיבור בן/בת זוג',
  partnerWritingLanguages: 'שפות כתיבה בן/בת זוג',

  // Preferences
  distanceFromIsrael: 'מרחק מישראל',
  timeZoneDifference: 'הפרש אזורי זמן',
  weatherPreference: 'העדפת מזג אוויר',
  jewishCommunityImportance: 'חשיבות קהילה יהודית',
  israeliCommunityImportance: 'חשיבות קהילה ישראלית',
  livingType: 'סוג מגורים מועדף',
  hasAdditionalConsiderations: 'יש שיקולים נוספים',
  additionalConsiderationsText: 'שיקולים נוספים',
  previousVisaAttempt: 'ניסיון ויזה קודם',
  hasCriminalRecord: 'יש רקע פלילי',
};

/**
 * Translate a single value based on its field name
 */
export function translateValue(fieldName: string, value: unknown): string {
  if (value === null || value === undefined) {
    return '-';
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(v => translateValue(fieldName, v)).join(', ');
  }

  // Handle booleans
  if (typeof value === 'boolean') {
    return booleanTranslations[String(value)] || String(value);
  }

  const strValue = String(value);

  // Try field-specific translations first
  switch (fieldName) {
    case 'gender':
      return genderTranslations[strValue] || strValue;
    case 'familyStatus':
      return familyStatusTranslations[strValue] || strValue;
    case 'processPartner':
      return processPartnerTranslations[strValue] || strValue;
    case 'relocationReasons':
      return relocationReasonTranslations[strValue] || strValue;
    case 'employmentStatus':
    case 'partnerEmploymentStatus':
      return employmentStatusTranslations[strValue] || strValue;
    case 'education':
    case 'partnerEducation':
      return educationTranslations[strValue] || strValue;
    case 'householdIncome':
      return incomeRangeTranslations[strValue] || strValue;
    case 'passiveIncomeAmount':
      return passiveIncomeRangeTranslations[strValue] || strValue;
    case 'speakingLanguages':
    case 'writingLanguages':
    case 'partnerSpeakingLanguages':
    case 'partnerWritingLanguages':
      return languageTranslations[strValue] || strValue;
    case 'distanceFromIsrael':
      return distancePreferenceTranslations[strValue] || strValue;
    case 'timeZoneDifference':
      return timeZonePreferenceTranslations[strValue] || strValue;
    case 'weatherPreference':
      return weatherPreferenceTranslations[strValue] || strValue;
    case 'jewishCommunityImportance':
    case 'israeliCommunityImportance':
      return communityImportanceTranslations[strValue] || strValue;
    case 'livingType':
      return livingTypeTranslations[strValue] || strValue;
    case 'previousVisaAttempt':
      return visaAttemptStatusTranslations[strValue] || strValue;
    case 'citizenships':
    case 'partnerCitizenships':
      return citizenshipTranslations[strValue.toLowerCase()] || strValue;
    case 'occupation':
    case 'partnerOccupation':
      return occupationTranslations[strValue] || strValue;
    default:
      return strValue;
  }
}

/**
 * Get the Hebrew label for a field
 */
export function getFieldLabel(fieldName: string): string {
  return fieldLabels[fieldName] || fieldName;
}

/**
 * Section definitions for organized display
 */
export interface QuestionnaireSection {
  id: string;
  title: string;
  fields: string[];
}

export const questionnaireSections: QuestionnaireSection[] = [
  {
    id: 'personal',
    title: 'פרטים אישיים',
    fields: ['fullName', 'birthDate', 'phone', 'email', 'gender'],
  },
  {
    id: 'family',
    title: 'מצב משפחתי',
    fields: ['familyStatus', 'processPartner', 'partnerName', 'children'],
  },
  {
    id: 'goals',
    title: 'מטרות המעבר',
    fields: ['relocationReasons'],
  },
  {
    id: 'citizenship',
    title: 'אזרחות',
    fields: ['citizenships', 'partnerCitizenships'],
  },
  {
    id: 'employment',
    title: 'תעסוקה והשכלה',
    fields: ['employmentStatus', 'occupation', 'education', 'remoteWorkCapable'],
  },
  {
    id: 'income',
    title: 'הכנסה',
    fields: ['householdIncome', 'hasPassiveIncome', 'passiveIncomeAmount'],
  },
  {
    id: 'partner',
    title: 'פרטי בן/בת הזוג',
    fields: ['partnerEmploymentStatus', 'partnerOccupation', 'partnerEducation', 'partnerRemoteWorkCapable'],
  },
  {
    id: 'studies_languages',
    title: 'לימודים, השקעות ושפות',
    fields: [
      'openToStudyingAbroad',
      'partnerOpenToStudyingAbroad',
      'willingToInvestInProperty',
      'has250kEuroForInvestment',
      'speakingLanguages',
      'writingLanguages',
      'partnerSpeakingLanguages',
      'partnerWritingLanguages',
    ],
  },
  {
    id: 'preferences',
    title: 'העדפות',
    fields: [
      'distanceFromIsrael',
      'timeZoneDifference',
      'weatherPreference',
      'jewishCommunityImportance',
      'israeliCommunityImportance',
      'livingType',
      'hasAdditionalConsiderations',
      'additionalConsiderationsText',
      'previousVisaAttempt',
      'hasCriminalRecord',
    ],
  },
];
