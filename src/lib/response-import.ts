/**
 * Response Import Utility v2.0
 * Parses and validates JSON import files for destination responses
 */

import type {
  DestinationInfo,
  MatchInfo,
  DestinationNarrative,
  DestinationSection,
} from '@/services/reports';

/**
 * Import format v2.0
 */
export interface ResponseImportData {
  version: '2.0';
  destination: {
    name: string;
    subtitle?: string;
    image?: string;
    badge?: string;
  };
  match?: {
    score: number;
    reasons?: string[];
    visaType?: string;
  };
  narrative?: {
    introduction?: string;
    pathway?: string;
    fit?: string;
    benefits?: string;
    highlights?: string[];
  };
  sections?: Array<{
    key: string;
    title: string;
    icon?: string;
    content: string;
  }>;
}

/**
 * Legacy import format v1.0 (for backwards compatibility)
 */
export interface LegacyResponseImportData {
  version: '1.0';
  countryCode: string;
  matchScore: number;
  visaType?: string;
  matchReasons?: string[];
  personalizedContent?: {
    visaPath?: string;
    howYouFit?: string;
    whyRightForYou?: string;
    advantages?: string[];
  };
  categoryOverrides?: Record<string, string>;
}

export interface ParsedResponseImport {
  destination: DestinationInfo;
  match: MatchInfo;
  narrative: DestinationNarrative;
  sections: DestinationSection[];
}

export interface ImportResult {
  success: boolean;
  data?: ParsedResponseImport;
  error?: string;
  warning?: string;
}

// Legacy category key to section mapping
const LEGACY_CATEGORY_MAP: Record<string, { title: string; icon: string }> = {
  general: { title: 'מידע כללי', icon: '📋' },
  visa: { title: 'ויזה', icon: '🛂' },
  language: { title: 'שפה ומזג אויר', icon: '🌤️' },
  safety: { title: 'ביטחון אישי', icon: '🛡️' },
  jewish: { title: 'קהילה יהודית וישראלית', icon: '✡️' },
  openness: { title: 'פתיחות למהגרים', icon: '🤝' },
  healthcare: { title: 'מערכת בריאות', icon: '🏥' },
  education: { title: 'חינוך', icon: '🎓' },
  employment: { title: 'תעסוקה', icon: '💼' },
  transport: { title: 'תחבורה ציבורית', icon: '🚌' },
  cost: { title: 'יוקר מחייה', icon: '💰' },
  distance: { title: 'מרחק מישראל', icon: '✈️' },
  community: { title: 'קהילה', icon: '👥' },
};

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `import-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Validate v2.0 import data structure
 */
function validateV2ImportData(data: unknown): data is ResponseImportData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const obj = data as Record<string, unknown>;

  if (obj.version !== '2.0') {
    return false;
  }

  // destination is required
  if (!obj.destination || typeof obj.destination !== 'object') {
    return false;
  }

  const dest = obj.destination as Record<string, unknown>;
  if (typeof dest.name !== 'string' || !dest.name.trim()) {
    return false;
  }

  // match is optional but must be valid if present
  if (obj.match !== undefined) {
    if (typeof obj.match !== 'object') return false;
    const match = obj.match as Record<string, unknown>;
    if (typeof match.score !== 'number' || match.score < 0 || match.score > 100) {
      return false;
    }
  }

  // sections must be array if present
  if (obj.sections !== undefined && !Array.isArray(obj.sections)) {
    return false;
  }

  return true;
}

/**
 * Validate v1.0 legacy import data structure
 */
function validateV1ImportData(data: unknown): data is LegacyResponseImportData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const obj = data as Record<string, unknown>;

  if (obj.version !== '1.0') {
    return false;
  }

  if (typeof obj.countryCode !== 'string') {
    return false;
  }

  if (typeof obj.matchScore !== 'number' || obj.matchScore < 0 || obj.matchScore > 100) {
    return false;
  }

  return true;
}

/**
 * Parse v2.0 format
 */
function parseV2Import(data: ResponseImportData): ParsedResponseImport {
  const destination: DestinationInfo = {
    name: data.destination.name,
    subtitle: data.destination.subtitle || null,
    image: data.destination.image || null,
    badge: data.destination.badge || null,
  };

  const match: MatchInfo = {
    score: data.match?.score ?? 85,
    reasons: data.match?.reasons || [],
    visaType: data.match?.visaType || null,
  };

  const narrative: DestinationNarrative = {};
  if (data.narrative) {
    if (data.narrative.introduction) narrative.introduction = data.narrative.introduction;
    if (data.narrative.pathway) narrative.pathway = data.narrative.pathway;
    if (data.narrative.fit) narrative.fit = data.narrative.fit;
    if (data.narrative.benefits) narrative.benefits = data.narrative.benefits;
    if (data.narrative.highlights && data.narrative.highlights.length > 0) {
      narrative.highlights = data.narrative.highlights;
    }
  }

  const sections: DestinationSection[] = (data.sections || []).map((s, index) => ({
    id: generateId(),
    key: s.key,
    title: s.title,
    icon: s.icon,
    content: s.content,
    position: index,
  }));

  return { destination, match, narrative, sections };
}

/**
 * Convert v1.0 legacy format to v2.0 structure
 */
function convertV1ToV2(data: LegacyResponseImportData): ParsedResponseImport {
  // Build destination from country code (user will need to customize)
  const destination: DestinationInfo = {
    name: data.countryCode, // Placeholder - user should rename
    subtitle: null,
    image: null,
    badge: null,
  };

  const match: MatchInfo = {
    score: data.matchScore,
    reasons: data.matchReasons || [],
    visaType: data.visaType || null,
  };

  // Convert personalizedContent to narrative
  const narrative: DestinationNarrative = {};
  if (data.personalizedContent) {
    const pc = data.personalizedContent;
    if (pc.visaPath) narrative.pathway = pc.visaPath;
    if (pc.howYouFit) narrative.fit = pc.howYouFit;
    if (pc.whyRightForYou) narrative.introduction = pc.whyRightForYou;
    if (pc.advantages && pc.advantages.length > 0) {
      narrative.highlights = pc.advantages;
    }
  }

  // Convert categoryOverrides to sections
  const sections: DestinationSection[] = [];
  if (data.categoryOverrides) {
    let position = 0;
    for (const [key, content] of Object.entries(data.categoryOverrides)) {
      if (content && typeof content === 'string' && content.trim()) {
        const mapping = LEGACY_CATEGORY_MAP[key];
        sections.push({
          id: generateId(),
          key,
          title: mapping?.title || key,
          icon: mapping?.icon,
          content,
          position: position++,
        });
      }
    }
  }

  return { destination, match, narrative, sections };
}

/**
 * Parse and validate a JSON import file
 */
export function parseResponseImport(jsonString: string): ImportResult {
  let data: unknown;

  // Parse JSON
  try {
    data = JSON.parse(jsonString);
  } catch {
    return {
      success: false,
      error: 'קובץ JSON לא תקין. בדקו את התחביר.',
    };
  }

  // Check version
  const obj = data as Record<string, unknown>;
  const version = obj.version;

  // Handle v2.0 format
  if (version === '2.0') {
    if (!validateV2ImportData(data)) {
      return {
        success: false,
        error: 'מבנה הקובץ לא תקין. וודאו שיש destination.name.',
      };
    }

    return {
      success: true,
      data: parseV2Import(data),
    };
  }

  // Handle v1.0 legacy format
  if (version === '1.0') {
    if (!validateV1ImportData(data)) {
      return {
        success: false,
        error: 'מבנה הקובץ לא תקין (פורמט 1.0). וודאו שיש countryCode ו-matchScore.',
      };
    }

    return {
      success: true,
      data: convertV1ToV2(data),
      warning: 'הקובץ בפורמט ישן (1.0). מומלץ לעדכן לפורמט 2.0. שם היעד מוגדר לקוד המדינה - נא לעדכן.',
    };
  }

  return {
    success: false,
    error: 'גרסת הפורמט לא נתמכת. השתמשו ב-version: "2.0".',
  };
}

/**
 * Read a file and parse it as a response import
 */
export async function importResponseFromFile(file: File): Promise<ImportResult> {
  // Validate file type
  if (!file.name.endsWith('.json')) {
    return {
      success: false,
      error: 'יש לבחור קובץ JSON (.json)',
    };
  }

  // Read file contents
  try {
    const text = await file.text();
    return parseResponseImport(text);
  } catch {
    return {
      success: false,
      error: 'שגיאה בקריאת הקובץ',
    };
  }
}

/**
 * Export response data to JSON format v2.0
 */
export function exportResponseToJson(
  destination: DestinationInfo,
  match: MatchInfo,
  narrative: DestinationNarrative,
  sections: DestinationSection[]
): string {
  const data: ResponseImportData = {
    version: '2.0',
    destination: {
      name: destination.name,
      subtitle: destination.subtitle || undefined,
      image: destination.image || undefined,
      badge: destination.badge || undefined,
    },
    match: {
      score: match.score,
      reasons: match.reasons.length > 0 ? match.reasons : undefined,
      visaType: match.visaType || undefined,
    },
    narrative: Object.keys(narrative).length > 0
      ? {
          introduction: narrative.introduction || undefined,
          pathway: narrative.pathway || undefined,
          fit: narrative.fit || undefined,
          benefits: narrative.benefits || undefined,
          highlights:
            narrative.highlights && narrative.highlights.length > 0
              ? narrative.highlights
              : undefined,
        }
      : undefined,
    sections:
      sections.length > 0
        ? sections
            .sort((a, b) => a.position - b.position)
            .map((s) => ({
              key: s.key,
              title: s.title,
              icon: s.icon || undefined,
              content: s.content,
            }))
        : undefined,
  };

  return JSON.stringify(data, null, 2);
}
