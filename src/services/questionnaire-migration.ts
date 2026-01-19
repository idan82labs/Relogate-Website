/**
 * Questionnaire Migration Utility
 *
 * Handles migration from V1 (legacy) questionnaire data to V2 format.
 * Preserves existing data while identifying new fields that need completion.
 */

import type {
  QuestionnaireDataV1,
  MigrationResult,
} from "@/types/questionnaire-api";
import type {
  QuestionnaireDataV2,
  FamilyStatus,
  RelocationReason,
} from "@/types/questionnaire";
import type { StepId } from "@/components/questionnaire/steps/types";

// ============================================================================
// V2 Required Fields Per Step
// ============================================================================

/**
 * Required fields for each step in V2 questionnaire
 */
const V2_REQUIRED_FIELDS: Record<StepId, string[]> = {
  intro: [],
  "personal-details": ["fullName", "birthDate", "phone", "email"],
  "family-status": ["familyStatus"],
  "relocation-goals": ["relocationReasons"],
  citizenship: ["citizenships"],
  "employment-education": ["employmentStatus", "remoteWorkCapable"],
  income: ["householdIncome", "hasPassiveIncome"],
  "partner-details": [], // All fields conditional
  "studies-investments-languages": [
    "openToStudyingAbroad",
    "willingToInvestInProperty",
    "speakingLanguages",
    "writingLanguages",
  ],
  preferences: [
    "distanceFromIsrael",
    "timeZoneDifference",
    "weatherPreference",
    "jewishCommunityImportance",
    "israeliCommunityImportance",
    "livingType",
    "previousVisaAttempt",
    "hasCriminalRecord",
  ],
};

/**
 * Fields that exist in V1 (mapped to V2 field names)
 */
const V1_EXISTING_FIELDS: string[] = [
  // From personalDetails
  "fullName",
  "email",
  "phone",
  "birthDate",
  // From root
  "familyStatus",
  // Citizenships derived from citizenship field
  "citizenships",
];

// ============================================================================
// Family Status Mapping
// ============================================================================

/**
 * Map V1 simple family status to V2 union type
 * V1 had: "single", "married", "common_law", "divorced", "widowed"
 * V2 has more specific types that include children status
 */
function mapFamilyStatus(v1Status?: string): FamilyStatus | undefined {
  if (!v1Status) return undefined;

  const statusMap: Record<string, FamilyStatus> = {
    single: "single",
    married: "married_no_children", // Default to no children, user can update
    common_law: "married_no_children", // Treat as married
    divorced: "divorced_no_children",
    widowed: "widowed_no_children",
  };

  return statusMap[v1Status.toLowerCase()] || undefined;
}

/**
 * Map V1 relocation reason to V2 reasons array
 * V1 had free text, V2 has predefined options
 */
function mapRelocationReasons(v1Reason?: string): RelocationReason[] {
  if (!v1Reason) return [];

  // Try to map common keywords to V2 reasons
  const keywordMap: Record<string, RelocationReason> = {
    economic: "economic_quality_of_life",
    quality: "economic_quality_of_life",
    money: "economic_quality_of_life",
    security: "personal_security",
    safety: "personal_security",
    education: "better_education",
    school: "better_education",
    family: "better_future_for_family",
    children: "better_future_for_family",
    career: "professional_development",
    professional: "professional_development",
    work: "professional_development",
    job: "professional_development",
    "real estate": "real_estate_opportunity",
    property: "real_estate_opportunity",
    investment: "real_estate_opportunity",
    academic: "academic_opportunity",
    university: "academic_opportunity",
    study: "academic_opportunity",
    adventure: "adventure",
    explore: "adventure",
    change: "life_change",
    "new start": "life_change",
  };

  const lowerReason = v1Reason.toLowerCase();
  const matchedReasons: RelocationReason[] = [];

  for (const [keyword, reason] of Object.entries(keywordMap)) {
    if (lowerReason.includes(keyword) && !matchedReasons.includes(reason)) {
      matchedReasons.push(reason);
    }
  }

  // If no match, mark as "just_exploring"
  if (matchedReasons.length === 0) {
    return ["just_exploring"];
  }

  return matchedReasons;
}

// ============================================================================
// Migration Functions
// ============================================================================

/**
 * Migrate V1 questionnaire data to V2 format
 * Preserves existing data and identifies new fields needed
 */
export function migrateV1ToV2(v1Data: QuestionnaireDataV1): MigrationResult {
  const v2Data: Partial<QuestionnaireDataV2> = {};

  // Map personal details
  if (v1Data.personalDetails) {
    const pd = v1Data.personalDetails;
    if (pd.fullName) v2Data.fullName = pd.fullName;
    if (pd.email) v2Data.email = pd.email;
    if (pd.phone) v2Data.phone = pd.phone;
    if (pd.birthDate) v2Data.birthDate = pd.birthDate;

    // Map citizenship to citizenships array
    if (pd.citizenship) {
      v2Data.citizenships = [pd.citizenship];
      if (pd.additionalCitizenship) {
        v2Data.citizenships.push(pd.additionalCitizenship);
      }
    }
  }

  // Map family status
  if (v1Data.familyStatus) {
    const mappedStatus = mapFamilyStatus(v1Data.familyStatus);
    if (mappedStatus) {
      v2Data.familyStatus = mappedStatus;
    }
  }

  // Map relocation reason to reasons array
  if (v1Data.relocationReason) {
    v2Data.relocationReasons = mapRelocationReasons(v1Data.relocationReason);
  }

  // Map spouse details to partner citizenships
  if (v1Data.spouseDetails?.citizenship) {
    v2Data.partnerCitizenships = [v1Data.spouseDetails.citizenship];
  }

  // Get migration info
  const newFields = getNewFieldsToComplete(v2Data);
  const stepsWithNewFields = getStepsWithNewFields(v2Data);

  return {
    data: v2Data,
    info: {
      migrated: true,
      newFields,
      stepsWithNewFields,
    },
  };
}

/**
 * Get list of new fields that need to be filled after migration
 * These are V2 required fields that weren't in V1
 */
export function getNewFieldsToComplete(
  data: Partial<QuestionnaireDataV2>
): string[] {
  const newFields: string[] = [];

  // Go through all required fields and check which are missing
  for (const [stepId, requiredFields] of Object.entries(V2_REQUIRED_FIELDS)) {
    // Skip intro step
    if (stepId === "intro") continue;

    for (const field of requiredFields) {
      // Check if field existed in V1
      const wasInV1 = V1_EXISTING_FIELDS.includes(field);

      // If field is new (not in V1) and not yet filled
      if (!wasInV1) {
        const value = data[field as keyof QuestionnaireDataV2];
        const isEmpty =
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0);

        if (isEmpty) {
          newFields.push(field);
        }
      }
    }
  }

  return newFields;
}

/**
 * Get list of step IDs that contain new fields needing completion
 */
export function getStepsWithNewFields(
  data: Partial<QuestionnaireDataV2>
): string[] {
  const stepsWithNewFields: string[] = [];
  const newFields = getNewFieldsToComplete(data);

  for (const [stepId, requiredFields] of Object.entries(V2_REQUIRED_FIELDS)) {
    // Skip intro step
    if (stepId === "intro") continue;

    // Check if any required field from this step is in new fields list
    const hasNewFields = requiredFields.some((field) =>
      newFields.includes(field)
    );

    if (hasNewFields) {
      stepsWithNewFields.push(stepId);
    }
  }

  return stepsWithNewFields;
}

/**
 * Check if data appears to be V1 format (has nested personalDetails)
 */
export function isV1Data(data: unknown): data is QuestionnaireDataV1 {
  return (
    data !== null &&
    typeof data === "object" &&
    "personalDetails" in data &&
    typeof (data as Record<string, unknown>).personalDetails === "object"
  );
}

/**
 * Deep merge two objects, preserving existing data
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const key of Object.keys(source) as (keyof T)[]) {
    const sourceValue = source[key];
    const targetValue = target[key];

    // Skip undefined values
    if (sourceValue === undefined) {
      continue;
    }

    // Deep merge objects (not arrays)
    if (
      targetValue &&
      sourceValue &&
      typeof targetValue === "object" &&
      typeof sourceValue === "object" &&
      !Array.isArray(targetValue) &&
      !Array.isArray(sourceValue)
    ) {
      result[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      ) as T[keyof T];
    } else {
      // Direct assignment for primitives and arrays
      result[key] = sourceValue as T[keyof T];
    }
  }

  return result;
}

/**
 * Get the first step that needs completion
 */
export function getFirstIncompleteStep(
  data: Partial<QuestionnaireDataV2>
): StepId {
  const stepOrder: StepId[] = [
    "intro",
    "personal-details",
    "family-status",
    "relocation-goals",
    "citizenship",
    "employment-education",
    "income",
    "partner-details",
    "studies-investments-languages",
    "preferences",
  ];

  for (const stepId of stepOrder) {
    // Skip intro
    if (stepId === "intro") continue;

    const requiredFields = V2_REQUIRED_FIELDS[stepId] || [];
    const hasIncomplete = requiredFields.some((field) => {
      const value = data[field as keyof QuestionnaireDataV2];
      return (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      );
    });

    if (hasIncomplete) {
      return stepId;
    }
  }

  // All steps complete
  return "preferences";
}
