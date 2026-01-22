/**
 * Hebrew Personal Area Translations
 *
 * Dashboard and personal area content.
 */

import type { PersonalAreaTranslations } from '../types';

export const personalArea: PersonalAreaTranslations = {
  // ============================================================================
  // Page Meta
  // ============================================================================
  meta: {
    title: 'אזור אישי | Relogate',
    description: 'צפו בסטטוס השאלון והדוח האישי שלכם',
  },

  // ============================================================================
  // Sections
  // ============================================================================
  sections: {
    welcome: {
      title: 'ברוכים הבאים לאזור האישי',
      greeting: 'שלום, {name}',
    },
    questionnaire: {
      title: 'השאלון שלי',
      notStarted: 'טרם התחלת למלא את השאלון',
      inProgress: 'השאלון שלך בתהליך מילוי',
      completed: 'השאלון הושלם בהצלחה!',
      startButton: 'התחל שאלון',
      continueButton: 'המשך מילוי',
      viewButton: 'צפה בתשובות',
    },
    report: {
      title: 'הדוח האישי שלי',
      notReady: 'הדוח שלך עדיין בהכנה. נעדכן אותך כשיהיה מוכן.',
      ready: 'הדוח האישי שלך מוכן לצפייה!',
      viewButton: 'צפה בדוח',
      destinations: 'יעדים מומלצים',
    },
    profile: {
      title: 'הפרופיל שלי',
      editButton: 'ערוך פרופיל',
    },
  },

  // ============================================================================
  // Field Labels (for displaying questionnaire data)
  // ============================================================================
  fieldLabels: {
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
  },

  // ============================================================================
  // Section Titles (for grouped display)
  // ============================================================================
  sectionTitles: {
    personal: 'פרטים אישיים',
    family: 'מצב משפחתי',
    goals: 'מטרות המעבר',
    citizenship: 'אזרחות',
    employment: 'תעסוקה והשכלה',
    income: 'הכנסה',
    partner: 'פרטי בן/בת הזוג',
    studiesLanguages: 'לימודים, השקעות ושפות',
    preferences: 'העדפות',
  },
};
