/**
 * Hebrew Questionnaire Translations
 */

import {
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
  QUESTIONNAIRE_STEP,
} from '../constants';
import type { QuestionnaireTranslations } from '../types';

export const questionnaire: QuestionnaireTranslations = {
  // ============================================================================
  // Step Metadata
  // ============================================================================
  steps: {
    [QUESTIONNAIRE_STEP.PERSONAL_DETAILS]: {
      title: 'פרטים אישיים',
      description: 'נתחיל עם כמה פרטים בסיסיים',
    },
    [QUESTIONNAIRE_STEP.FAMILY_STATUS]: {
      title: 'מצב משפחתי',
      description: 'ספרו לנו על המשפחה שלכם',
    },
    [QUESTIONNAIRE_STEP.RELOCATION_GOALS]: {
      title: 'מטרות המעבר',
      description: 'מה מניע אתכם לשקול רילוקיישן?',
    },
    [QUESTIONNAIRE_STEP.CITIZENSHIP]: {
      title: 'אזרחות',
      description: 'אילו אזרחויות יש לכם?',
    },
    [QUESTIONNAIRE_STEP.EMPLOYMENT_EDUCATION]: {
      title: 'תעסוקה והשכלה',
      description: 'ספרו לנו על הרקע המקצועי שלכם',
    },
    [QUESTIONNAIRE_STEP.INCOME]: {
      title: 'הכנסה',
      description: 'מידע על ההכנסה שלכם',
    },
    [QUESTIONNAIRE_STEP.PARTNER_DETAILS]: {
      title: 'פרטי בן/בת הזוג',
      description: 'ספרו לנו על בן/בת הזוג',
    },
    [QUESTIONNAIRE_STEP.STUDIES_INVESTMENTS_LANGUAGES]: {
      title: 'לימודים, השקעות ושפות',
      description: 'מידע נוסף שיעזור לנו להתאים לכם יעדים',
    },
    [QUESTIONNAIRE_STEP.PREFERENCES]: {
      title: 'העדפות',
      description: 'מה חשוב לכם במקום המגורים החדש?',
    },
  },

  // ============================================================================
  // Field Configurations
  // ============================================================================
  fields: {
    // Step 1: Personal Details
    fullName: {
      label: 'שם מלא',
      placeholder: 'הזינו את שמכם המלא',
    },
    birthDate: {
      label: 'תאריך לידה',
      placeholder: 'בחרו תאריך',
    },
    phone: {
      label: 'טלפון',
      placeholder: '05X-XXXXXXX',
    },
    email: {
      label: 'אימייל',
      placeholder: 'example@email.com',
    },
    gender: {
      label: 'מגדר',
      placeholder: 'בחרו מגדר',
      options: {
        [GENDER.MALE]: 'זכר',
        [GENDER.FEMALE]: 'נקבה',
        [GENDER.PREFER_NOT_TO_SAY]: 'מעדיף/ה לא לציין',
      },
    },

    // Step 2: Family Status
    familyStatus: {
      label: 'מצב משפחתי',
      placeholder: 'בחרו מצב משפחתי',
      options: {
        [FAMILY_STATUS.SINGLE]: 'רווק/ה',
        [FAMILY_STATUS.SINGLE_WITH_CHILDREN]: 'רווק/ה עם ילדים',
        [FAMILY_STATUS.MARRIED_NO_CHILDREN]: 'נשוי/אה ללא ילדים',
        [FAMILY_STATUS.MARRIED_WITH_CHILDREN]: 'נשוי/אה עם ילדים',
        [FAMILY_STATUS.DIVORCED_NO_CHILDREN]: 'גרוש/ה ללא ילדים',
        [FAMILY_STATUS.DIVORCED_WITH_CHILDREN]: 'גרוש/ה עם ילדים',
        [FAMILY_STATUS.WIDOWED_NO_CHILDREN]: 'אלמן/ה ללא ילדים',
        [FAMILY_STATUS.WIDOWED_WITH_CHILDREN]: 'אלמן/ה עם ילדים',
      },
    },
    processPartner: {
      label: 'עם מי תעברו את התהליך?',
      placeholder: 'בחרו אפשרות',
      options: {
        [PROCESS_PARTNER.ALONE]: 'לבד',
        [PROCESS_PARTNER.PARTNER]: 'עם בן/בת זוג',
        [PROCESS_PARTNER.WIFE]: 'עם אשתי',
        [PROCESS_PARTNER.HUSBAND]: 'עם בעלי',
        [PROCESS_PARTNER.WIFE_AND_CHILDREN]: 'עם אשתי והילדים',
        [PROCESS_PARTNER.HUSBAND_AND_CHILDREN]: 'עם בעלי והילדים',
        [PROCESS_PARTNER.EX_SPOUSE_AND_CHILDREN]: 'עם בן/בת הזוג לשעבר והילדים',
      },
    },
    partnerName: {
      label: 'שם בן/בת הזוג',
      placeholder: 'הזינו את שם בן/בת הזוג',
    },
    childName: {
      label: 'שם הילד/ה',
      placeholder: 'הזינו שם',
    },
    childAge: {
      label: 'גיל',
      placeholder: 'גיל',
    },

    // Step 3: Relocation Goals
    relocationReasons: {
      label: 'מה הסיבות העיקריות לרילוקיישן?',
      placeholder: 'בחרו סיבות (ניתן לבחור מספר אפשרויות)',
      options: {
        [RELOCATION_REASON.ECONOMIC_QUALITY_OF_LIFE]: 'איכות חיים כלכלית',
        [RELOCATION_REASON.PERSONAL_SECURITY]: 'ביטחון אישי',
        [RELOCATION_REASON.BETTER_EDUCATION]: 'חינוך טוב יותר',
        [RELOCATION_REASON.BETTER_FUTURE_FOR_FAMILY]: 'עתיד טוב יותר למשפחה',
        [RELOCATION_REASON.PROFESSIONAL_DEVELOPMENT]: 'התפתחות מקצועית',
        [RELOCATION_REASON.REAL_ESTATE_OPPORTUNITY]: 'הזדמנות נדל"ן',
        [RELOCATION_REASON.ACADEMIC_OPPORTUNITY]: 'הזדמנות אקדמית',
        [RELOCATION_REASON.ADVENTURE]: 'הרפתקה',
        [RELOCATION_REASON.LIFE_CHANGE]: 'שינוי חיים',
        [RELOCATION_REASON.JUST_EXPLORING]: 'בודק/ת אפשרויות',
      },
    },

    // Step 4: Citizenship
    citizenships: {
      label: 'אזרחויות שלך',
      placeholder: 'בחרו אזרחויות (עד 3)',
      options: {
        [COUNTRY.ISRAEL]: 'ישראל',
        [COUNTRY.USA]: 'ארה"ב',
        [COUNTRY.UK]: 'בריטניה',
        [COUNTRY.GERMANY]: 'גרמניה',
        [COUNTRY.FRANCE]: 'צרפת',
        [COUNTRY.POLAND]: 'פולין',
        [COUNTRY.RUSSIA]: 'רוסיה',
        [COUNTRY.UKRAINE]: 'אוקראינה',
        [COUNTRY.ROMANIA]: 'רומניה',
        [COUNTRY.PORTUGAL]: 'פורטוגל',
        [COUNTRY.SPAIN]: 'ספרד',
        [COUNTRY.ITALY]: 'איטליה',
        [COUNTRY.CANADA]: 'קנדה',
        [COUNTRY.AUSTRALIA]: 'אוסטרליה',
        [COUNTRY.HUNGARY]: 'הונגריה',
        [COUNTRY.AUSTRIA]: 'אוסטריה',
        [COUNTRY.NETHERLANDS]: 'הולנד',
        [COUNTRY.BELGIUM]: 'בלגיה',
        [COUNTRY.SOUTH_AFRICA]: 'דרום אפריקה',
        [COUNTRY.ARGENTINA]: 'ארגנטינה',
        [COUNTRY.BRAZIL]: 'ברזיל',
        [COUNTRY.MEXICO]: 'מקסיקו',
        [COUNTRY.INDIA]: 'הודו',
        [COUNTRY.SWITZERLAND]: 'שוויץ',
        [COUNTRY.GREECE]: 'יוון',
        [COUNTRY.TURKEY]: 'טורקיה',
        [COUNTRY.MOROCCO]: 'מרוקו',
        [COUNTRY.OTHER]: 'אחר',
      },
    },
    partnerCitizenships: {
      label: 'אזרחויות בן/בת הזוג',
      placeholder: 'בחרו אזרחויות (עד 3)',
      options: {
        [COUNTRY.ISRAEL]: 'ישראל',
        [COUNTRY.USA]: 'ארה"ב',
        [COUNTRY.UK]: 'בריטניה',
        [COUNTRY.GERMANY]: 'גרמניה',
        [COUNTRY.FRANCE]: 'צרפת',
        [COUNTRY.POLAND]: 'פולין',
        [COUNTRY.RUSSIA]: 'רוסיה',
        [COUNTRY.UKRAINE]: 'אוקראינה',
        [COUNTRY.ROMANIA]: 'רומניה',
        [COUNTRY.PORTUGAL]: 'פורטוגל',
        [COUNTRY.SPAIN]: 'ספרד',
        [COUNTRY.ITALY]: 'איטליה',
        [COUNTRY.CANADA]: 'קנדה',
        [COUNTRY.AUSTRALIA]: 'אוסטרליה',
        [COUNTRY.HUNGARY]: 'הונגריה',
        [COUNTRY.AUSTRIA]: 'אוסטריה',
        [COUNTRY.NETHERLANDS]: 'הולנד',
        [COUNTRY.BELGIUM]: 'בלגיה',
        [COUNTRY.SOUTH_AFRICA]: 'דרום אפריקה',
        [COUNTRY.ARGENTINA]: 'ארגנטינה',
        [COUNTRY.BRAZIL]: 'ברזיל',
        [COUNTRY.MEXICO]: 'מקסיקו',
        [COUNTRY.INDIA]: 'הודו',
        [COUNTRY.SWITZERLAND]: 'שוויץ',
        [COUNTRY.GREECE]: 'יוון',
        [COUNTRY.TURKEY]: 'טורקיה',
        [COUNTRY.MOROCCO]: 'מרוקו',
        [COUNTRY.OTHER]: 'אחר',
      },
    },

    // Step 5: Employment & Education
    employmentStatus: {
      label: 'סטטוס תעסוקתי',
      placeholder: 'בחרו סטטוס',
      options: {
        [EMPLOYMENT_STATUS.EMPLOYED]: 'שכיר/ה',
        [EMPLOYMENT_STATUS.SELF_EMPLOYED]: 'עצמאי/ת',
        [EMPLOYMENT_STATUS.BUSINESS_OWNER]: 'בעל/ת עסק',
        [EMPLOYMENT_STATUS.NOT_WORKING]: 'לא עובד/ת',
        [EMPLOYMENT_STATUS.RETIRED]: 'פנסיונר/ית',
      },
    },
    occupation: {
      label: 'תחום עיסוק',
      placeholder: 'תארו את תחום העיסוק שלכם',
    },
    education: {
      label: 'רמת השכלה',
      placeholder: 'בחרו רמת השכלה',
      options: {
        [EDUCATION_LEVEL.HIGH_SCHOOL]: 'תיכון',
        [EDUCATION_LEVEL.VOCATIONAL]: 'לימודי מקצוע',
        [EDUCATION_LEVEL.BACHELOR]: 'תואר ראשון',
        [EDUCATION_LEVEL.MASTER]: 'תואר שני',
        [EDUCATION_LEVEL.DOCTORATE]: 'דוקטורט',
        [EDUCATION_LEVEL.OTHER]: 'אחר',
      },
    },
    remoteWorkCapable: {
      label: 'האם יש לך אפשרות לעבוד מרחוק?',
      yes: 'כן',
      no: 'לא',
    },

    // Step 6: Income
    householdIncome: {
      label: 'הכנסה חודשית של משק הבית (נטו)',
      placeholder: 'בחרו טווח הכנסה',
      options: {
        [INCOME_RANGE.UP_TO_10K]: 'עד 10,000 ₪',
        [INCOME_RANGE['10K_15K']]: '10,000-15,000 ₪',
        [INCOME_RANGE['15K_20K']]: '15,000-20,000 ₪',
        [INCOME_RANGE['20K_25K']]: '20,000-25,000 ₪',
        [INCOME_RANGE['25K_30K']]: '25,000-30,000 ₪',
        [INCOME_RANGE['30K_35K']]: '30,000-35,000 ₪',
        [INCOME_RANGE['35K_40K']]: '35,000-40,000 ₪',
        [INCOME_RANGE['40K_45K']]: '40,000-45,000 ₪',
        [INCOME_RANGE['45K_50K']]: '45,000-50,000 ₪',
        [INCOME_RANGE['50K_55K']]: '50,000-55,000 ₪',
        [INCOME_RANGE['55K_60K']]: '55,000-60,000 ₪',
        [INCOME_RANGE['60K_PLUS']]: 'מעל 60,000 ₪',
      },
    },
    hasPassiveIncome: {
      label: 'האם יש לך הכנסה פסיבית?',
      yes: 'כן',
      no: 'לא',
    },
    passiveIncomeAmount: {
      label: 'סכום ההכנסה הפסיבית החודשית',
      placeholder: 'בחרו טווח',
      options: {
        [PASSIVE_INCOME_RANGE.UP_TO_5K]: 'עד 5,000 ₪',
        [PASSIVE_INCOME_RANGE['5K_10K']]: '5,000-10,000 ₪',
        [PASSIVE_INCOME_RANGE['10K_15K']]: '10,000-15,000 ₪',
        [PASSIVE_INCOME_RANGE['15K_20K']]: '15,000-20,000 ₪',
        [PASSIVE_INCOME_RANGE['20K_25K']]: '20,000-25,000 ₪',
        [PASSIVE_INCOME_RANGE['25K_30K']]: '25,000-30,000 ₪',
        [PASSIVE_INCOME_RANGE['30K_35K']]: '30,000-35,000 ₪',
        [PASSIVE_INCOME_RANGE['35K_40K']]: '35,000-40,000 ₪',
        [PASSIVE_INCOME_RANGE['40K_PLUS']]: 'מעל 40,000 ₪',
      },
    },

    // Step 7: Partner Details
    partnerEmploymentStatus: {
      label: 'סטטוס תעסוקתי של בן/בת הזוג',
      placeholder: 'בחרו סטטוס',
      options: {
        [EMPLOYMENT_STATUS.EMPLOYED]: 'שכיר/ה',
        [EMPLOYMENT_STATUS.SELF_EMPLOYED]: 'עצמאי/ת',
        [EMPLOYMENT_STATUS.BUSINESS_OWNER]: 'בעל/ת עסק',
        [EMPLOYMENT_STATUS.NOT_WORKING]: 'לא עובד/ת',
        [EMPLOYMENT_STATUS.RETIRED]: 'פנסיונר/ית',
      },
    },
    partnerOccupation: {
      label: 'תחום עיסוק של בן/בת הזוג',
      placeholder: 'תארו את תחום העיסוק',
    },
    partnerEducation: {
      label: 'רמת השכלה של בן/בת הזוג',
      placeholder: 'בחרו רמת השכלה',
      options: {
        [EDUCATION_LEVEL.HIGH_SCHOOL]: 'תיכון',
        [EDUCATION_LEVEL.VOCATIONAL]: 'לימודי מקצוע',
        [EDUCATION_LEVEL.BACHELOR]: 'תואר ראשון',
        [EDUCATION_LEVEL.MASTER]: 'תואר שני',
        [EDUCATION_LEVEL.DOCTORATE]: 'דוקטורט',
        [EDUCATION_LEVEL.OTHER]: 'אחר',
      },
    },
    partnerRemoteWorkCapable: {
      label: 'האם לבן/בת הזוג יש אפשרות לעבוד מרחוק?',
      yes: 'כן',
      no: 'לא',
    },

    // Step 8: Studies, Investments & Languages
    openToStudyingAbroad: {
      label: 'האם את/ה פתוח/ה ללימודים בחו"ל?',
      yes: 'כן',
      no: 'לא',
    },
    partnerOpenToStudyingAbroad: {
      label: 'האם בן/בת הזוג פתוח/ה ללימודים בחו"ל?',
      yes: 'כן',
      no: 'לא',
    },
    willingToInvestInProperty: {
      label: 'האם את/ה מוכן/ה להשקיע בנדל"ן לצורך ויזה?',
      yes: 'כן',
      no: 'לא',
    },
    has250kEuroForInvestment: {
      label: 'האם יש לך 250,000 אירו להשקעה בנדל"ן?',
      yes: 'כן',
      no: 'לא',
    },
    speakingLanguages: {
      label: 'שפות שאת/ה מדבר/ת',
      placeholder: 'בחרו שפות',
      options: {
        [LANGUAGE.HEBREW]: 'עברית',
        [LANGUAGE.ENGLISH]: 'אנגלית',
        [LANGUAGE.ARABIC]: 'ערבית',
        [LANGUAGE.RUSSIAN]: 'רוסית',
        [LANGUAGE.FRENCH]: 'צרפתית',
        [LANGUAGE.SPANISH]: 'ספרדית',
        [LANGUAGE.GERMAN]: 'גרמנית',
        [LANGUAGE.PORTUGUESE]: 'פורטוגזית',
        [LANGUAGE.ITALIAN]: 'איטלקית',
        [LANGUAGE.CHINESE]: 'סינית',
        [LANGUAGE.JAPANESE]: 'יפנית',
        [LANGUAGE.KOREAN]: 'קוריאנית',
        [LANGUAGE.HINDI]: 'הינדי',
        [LANGUAGE.TURKISH]: 'טורקית',
        [LANGUAGE.POLISH]: 'פולנית',
        [LANGUAGE.DUTCH]: 'הולנדית',
        [LANGUAGE.GREEK]: 'יוונית',
        [LANGUAGE.ROMANIAN]: 'רומנית',
        [LANGUAGE.UKRAINIAN]: 'אוקראינית',
        [LANGUAGE.OTHER]: 'אחר',
      },
    },
    writingLanguages: {
      label: 'שפות שאת/ה כותב/ת',
      placeholder: 'בחרו שפות',
      options: {
        [LANGUAGE.HEBREW]: 'עברית',
        [LANGUAGE.ENGLISH]: 'אנגלית',
        [LANGUAGE.ARABIC]: 'ערבית',
        [LANGUAGE.RUSSIAN]: 'רוסית',
        [LANGUAGE.FRENCH]: 'צרפתית',
        [LANGUAGE.SPANISH]: 'ספרדית',
        [LANGUAGE.GERMAN]: 'גרמנית',
        [LANGUAGE.PORTUGUESE]: 'פורטוגזית',
        [LANGUAGE.ITALIAN]: 'איטלקית',
        [LANGUAGE.CHINESE]: 'סינית',
        [LANGUAGE.JAPANESE]: 'יפנית',
        [LANGUAGE.KOREAN]: 'קוריאנית',
        [LANGUAGE.HINDI]: 'הינדי',
        [LANGUAGE.TURKISH]: 'טורקית',
        [LANGUAGE.POLISH]: 'פולנית',
        [LANGUAGE.DUTCH]: 'הולנדית',
        [LANGUAGE.GREEK]: 'יוונית',
        [LANGUAGE.ROMANIAN]: 'רומנית',
        [LANGUAGE.UKRAINIAN]: 'אוקראינית',
        [LANGUAGE.OTHER]: 'אחר',
      },
    },
    partnerSpeakingLanguages: {
      label: 'שפות שבן/בת הזוג מדבר/ת',
      placeholder: 'בחרו שפות',
      options: {
        [LANGUAGE.HEBREW]: 'עברית',
        [LANGUAGE.ENGLISH]: 'אנגלית',
        [LANGUAGE.ARABIC]: 'ערבית',
        [LANGUAGE.RUSSIAN]: 'רוסית',
        [LANGUAGE.FRENCH]: 'צרפתית',
        [LANGUAGE.SPANISH]: 'ספרדית',
        [LANGUAGE.GERMAN]: 'גרמנית',
        [LANGUAGE.PORTUGUESE]: 'פורטוגזית',
        [LANGUAGE.ITALIAN]: 'איטלקית',
        [LANGUAGE.CHINESE]: 'סינית',
        [LANGUAGE.JAPANESE]: 'יפנית',
        [LANGUAGE.KOREAN]: 'קוריאנית',
        [LANGUAGE.HINDI]: 'הינדי',
        [LANGUAGE.TURKISH]: 'טורקית',
        [LANGUAGE.POLISH]: 'פולנית',
        [LANGUAGE.DUTCH]: 'הולנדית',
        [LANGUAGE.GREEK]: 'יוונית',
        [LANGUAGE.ROMANIAN]: 'רומנית',
        [LANGUAGE.UKRAINIAN]: 'אוקראינית',
        [LANGUAGE.OTHER]: 'אחר',
      },
    },
    partnerWritingLanguages: {
      label: 'שפות שבן/בת הזוג כותב/ת',
      placeholder: 'בחרו שפות',
      options: {
        [LANGUAGE.HEBREW]: 'עברית',
        [LANGUAGE.ENGLISH]: 'אנגלית',
        [LANGUAGE.ARABIC]: 'ערבית',
        [LANGUAGE.RUSSIAN]: 'רוסית',
        [LANGUAGE.FRENCH]: 'צרפתית',
        [LANGUAGE.SPANISH]: 'ספרדית',
        [LANGUAGE.GERMAN]: 'גרמנית',
        [LANGUAGE.PORTUGUESE]: 'פורטוגזית',
        [LANGUAGE.ITALIAN]: 'איטלקית',
        [LANGUAGE.CHINESE]: 'סינית',
        [LANGUAGE.JAPANESE]: 'יפנית',
        [LANGUAGE.KOREAN]: 'קוריאנית',
        [LANGUAGE.HINDI]: 'הינדי',
        [LANGUAGE.TURKISH]: 'טורקית',
        [LANGUAGE.POLISH]: 'פולנית',
        [LANGUAGE.DUTCH]: 'הולנדית',
        [LANGUAGE.GREEK]: 'יוונית',
        [LANGUAGE.ROMANIAN]: 'רומנית',
        [LANGUAGE.UKRAINIAN]: 'אוקראינית',
        [LANGUAGE.OTHER]: 'אחר',
      },
    },

    // Step 9: Preferences
    distanceFromIsrael: {
      label: 'מרחק מישראל',
      placeholder: 'בחרו העדפה',
      options: {
        [DISTANCE_PREFERENCE.UP_TO_3_HOURS]: 'עד 3 שעות טיסה',
        [DISTANCE_PREFERENCE.UP_TO_6_HOURS]: 'עד 6 שעות טיסה',
        [DISTANCE_PREFERENCE.UP_TO_12_HOURS]: 'עד 12 שעות טיסה',
        [DISTANCE_PREFERENCE.NOT_IMPORTANT]: 'לא משנה',
      },
    },
    timeZoneDifference: {
      label: 'הפרש אזורי זמן',
      placeholder: 'בחרו העדפה',
      options: {
        [TIME_ZONE_PREFERENCE.UP_TO_1_HOUR]: 'עד שעה הפרש',
        [TIME_ZONE_PREFERENCE.UP_TO_2_HOURS]: 'עד 2 שעות הפרש',
        [TIME_ZONE_PREFERENCE.UP_TO_6_HOURS]: 'עד 6 שעות הפרש',
        [TIME_ZONE_PREFERENCE.UP_TO_8_HOURS]: 'עד 8 שעות הפרש',
        [TIME_ZONE_PREFERENCE.UP_TO_10_HOURS]: 'עד 10 שעות הפרש',
        [TIME_ZONE_PREFERENCE.NOT_IMPORTANT]: 'לא משנה',
      },
    },
    weatherPreference: {
      label: 'העדפת מזג אוויר',
      placeholder: 'בחרו העדפה',
      options: {
        [WEATHER_PREFERENCE.FOUR_SEASONS]: 'ארבע עונות',
        [WEATHER_PREFERENCE.WARM_AND_SUNNY]: 'חם ושמשי',
        [WEATHER_PREFERENCE.COLD_MOST_OF_YEAR]: 'קר רוב השנה',
        [WEATHER_PREFERENCE.NO_PREFERENCE]: 'אין העדפה',
      },
    },
    jewishCommunityImportance: {
      label: 'חשיבות קהילה יהודית',
      placeholder: 'בחרו',
      options: {
        [COMMUNITY_IMPORTANCE.IMPORTANT]: 'חשוב',
        [COMMUNITY_IMPORTANCE.NOT_IMPORTANT]: 'לא חשוב',
      },
    },
    israeliCommunityImportance: {
      label: 'חשיבות קהילה ישראלית',
      placeholder: 'בחרו',
      options: {
        [COMMUNITY_IMPORTANCE.IMPORTANT]: 'חשוב',
        [COMMUNITY_IMPORTANCE.NOT_IMPORTANT]: 'לא חשוב',
      },
    },
    livingType: {
      label: 'סוג מגורים מועדף',
      placeholder: 'בחרו סוג',
      options: {
        [LIVING_TYPE.BIG_CITY]: 'עיר גדולה',
        [LIVING_TYPE.SMALL_TOWN]: 'עיר קטנה',
        [LIVING_TYPE.RURAL_AREA]: 'אזור כפרי',
        [LIVING_TYPE.NEAR_THE_SEA]: 'ליד הים',
        [LIVING_TYPE.NO_PREFERENCE]: 'אין העדפה',
      },
    },
    hasAdditionalConsiderations: {
      label: 'האם יש שיקולים נוספים שחשוב לנו לדעת?',
      yes: 'כן',
      no: 'לא',
    },
    additionalConsiderationsText: {
      label: 'שיקולים נוספים',
      placeholder: 'ספרו לנו על שיקולים נוספים...',
    },
    previousVisaAttempt: {
      label: 'ניסיון קודם לבקשת ויזה',
      placeholder: 'בחרו',
      options: {
        [VISA_ATTEMPT_STATUS.NEVER_TRIED]: 'לא ניסיתי מעולם',
        [VISA_ATTEMPT_STATUS.TRIED_AND_APPROVED]: 'ניסיתי ואושר',
        [VISA_ATTEMPT_STATUS.TRIED_AND_REJECTED]: 'ניסיתי ונדחה',
      },
    },
    hasCriminalRecord: {
      label: 'האם יש לך רקע פלילי?',
      yes: 'כן',
      no: 'לא',
    },
  },

  // ============================================================================
  // Validation Errors
  // ============================================================================
  errors: {
    required: 'שדה חובה',
    invalidEmail: 'כתובת אימייל לא תקינה',
    invalidPhone: 'מספר טלפון לא תקין',
    invalidDate: 'תאריך לא תקין',
    invalidAge: 'גיל לא תקין',
    minSelection: 'יש לבחור לפחות אפשרות אחת',
    maxSelection: 'ניתן לבחור עד {max} אפשרויות',
  },

  // ============================================================================
  // UI Elements
  // ============================================================================
  ui: {
    next: 'המשך',
    back: 'חזור',
    submit: 'שלח',
    saving: 'שומר...',
    loading: 'טוען...',
    addChild: 'הוסף ילד/ה',
    removeChild: 'הסר',
    selectPlaceholder: 'בחרו...',
    searchPlaceholder: 'חפשו...',
    noResults: 'לא נמצאו תוצאות',
    selected: 'נבחרו',
    clear: 'נקה',
  },

  // ============================================================================
  // Progress Indicator
  // ============================================================================
  progress: {
    step: 'שלב',
    of: 'מתוך',
    complete: 'הושלם',
  },

  // ============================================================================
  // Success Messages
  // ============================================================================
  success: {
    saved: 'הנתונים נשמרו בהצלחה',
    submitted: 'השאלון נשלח בהצלחה',
    title: 'תודה!',
    message: 'קיבלנו את התשובות שלך. ניצור איתך קשר בקרוב.',
  },
};
