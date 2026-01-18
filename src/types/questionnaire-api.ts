/**
 * Questionnaire API Types
 *
 * Type definitions for questionnaire API communication.
 * Supports both V1 (legacy) and V2 (new) data formats.
 */

import type { QuestionnaireDataV2, QuestionnaireStatus } from "./questionnaire";

// ============================================================================
// V1 Legacy Types (for backward compatibility)
// ============================================================================

/**
 * V1 questionnaire data format (legacy 4-step flow)
 */
export interface QuestionnaireDataV1 {
  /** User's preferred countries */
  preferredCountries?: string[];
  /** Reason for relocation (free text) */
  relocationReason?: string;
  /** Family status */
  familyStatus?: string;
  /** Personal details (nested) */
  personalDetails?: {
    fullName?: string;
    email?: string;
    phone?: string;
    birthDate?: string;
    citizenship?: string;
    residenceCountry?: string;
    additionalCitizenship?: string;
  };
  /** Spouse details (nested) */
  spouseDetails?: {
    birthDate?: string;
    citizenship?: string;
  };
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

/**
 * Questionnaire entity from API
 */
export interface ApiQuestionnaire {
  /** Unique questionnaire ID */
  id: string;
  /** User ID who owns this questionnaire */
  userId: string;
  /** Schema version (1 = legacy, 2 = new) */
  schemaVersion: number;
  /** Questionnaire responses data */
  responses: QuestionnaireDataV1 | Partial<QuestionnaireDataV2>;
  /** Current status */
  status: QuestionnaireStatus;
  /** Current step ID */
  currentStep: string;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** Completion timestamp (if completed) */
  completedAt: string | null;
}

/**
 * API response for questionnaire operations
 */
export interface ApiQuestionnaireResponse {
  questionnaire: ApiQuestionnaire;
}

/**
 * API response for questionnaire list
 */
export interface ApiQuestionnaireListResponse {
  questionnaires: ApiQuestionnaire[];
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if response data is V1 format (legacy nested structure)
 */
export function isV1Response(
  responses: QuestionnaireDataV1 | Partial<QuestionnaireDataV2>
): responses is QuestionnaireDataV1 {
  // V1 has nested personalDetails object
  return (
    responses &&
    typeof responses === "object" &&
    "personalDetails" in responses &&
    typeof responses.personalDetails === "object"
  );
}

/**
 * Check if response data is V2 format (flat structure)
 */
export function isV2Response(
  responses: QuestionnaireDataV1 | Partial<QuestionnaireDataV2>
): responses is Partial<QuestionnaireDataV2> {
  // V2 has flat structure with familyStatus as union type
  return (
    responses &&
    typeof responses === "object" &&
    !("personalDetails" in responses) &&
    ("fullName" in responses ||
      "relocationReasons" in responses ||
      "employmentStatus" in responses)
  );
}

/**
 * Check if questionnaire uses V2 schema based on schemaVersion
 */
export function isV2Questionnaire(questionnaire: ApiQuestionnaire): boolean {
  return questionnaire.schemaVersion >= 2;
}

// ============================================================================
// API Request Types
// ============================================================================

/**
 * Request body for creating a new questionnaire
 */
export interface CreateQuestionnaireRequest {
  /** Initial responses data */
  responses?: Partial<QuestionnaireDataV2>;
  /** Schema version (default: 2) */
  schemaVersion?: number;
}

/**
 * Request body for updating questionnaire
 */
export interface UpdateQuestionnaireRequest {
  /** Updated responses data */
  responses: Partial<QuestionnaireDataV2>;
  /** Current step ID */
  currentStep?: string;
}

/**
 * Request body for completing questionnaire
 */
export interface CompleteQuestionnaireRequest {
  /** Final responses data */
  responses: Partial<QuestionnaireDataV2>;
}

// ============================================================================
// Migration Types
// ============================================================================

/**
 * Information about fields that need completion after migration
 */
export interface MigrationInfo {
  /** Whether migration was performed */
  migrated: boolean;
  /** List of new fields that need to be filled */
  newFields: string[];
  /** Step IDs that contain new fields */
  stepsWithNewFields: string[];
}

/**
 * Result of V1 to V2 migration
 */
export interface MigrationResult {
  /** Migrated V2 data */
  data: Partial<QuestionnaireDataV2>;
  /** Migration information */
  info: MigrationInfo;
}
