/**
 * Questionnaire Service (V1 - Legacy)
 *
 * Handles questionnaire data management with backend API integration.
 * Falls back to local storage for non-authenticated users.
 *
 * NOTE: This is the legacy V1 questionnaire service (4-step flow).
 * For the new 10-step questionnaire, use questionnaire-v2.ts or import
 * from the barrel export: import { questionnaireServiceV2 } from "@/services"
 */

import { getAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Step configuration
export const QUESTIONNAIRE_STEPS = {
  countries: {
    path: "/questionnaire/countries",
    stepNumber: 1,
    next: "relocation-reason",
  },
  "relocation-reason": {
    path: "/questionnaire/relocation-reason",
    stepNumber: 2,
    next: "family-status",
  },
  "family-status": {
    path: "/questionnaire/family-status",
    stepNumber: 3,
    next: "personal-details",
  },
  "personal-details": {
    path: "/questionnaire/personal-details",
    stepNumber: 4,
    next: null,
  },
} as const;

export type StepName = keyof typeof QUESTIONNAIRE_STEPS;
export const TOTAL_STEPS = Object.keys(QUESTIONNAIRE_STEPS).length;

// Step name to path mapping
const STEP_TO_PATH: Record<string, StepName> = {
  'countries': 'countries',
  'relocation-reason': 'relocation-reason',
  'family-status': 'family-status',
  'personal-details': 'personal-details',
};

// Types
export interface QuestionnaireData {
  // Step 1: Country preferences
  preferredCountries: string[];

  // Step 2: Relocation reason
  relocationReason: string;

  // Step 3: Family status
  familyStatus: string;

  // Step 4: Personal details
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  citizenship: string;
  spouseBirthDate?: string;
  spouseCitizenship?: string;
  additionalCitizenship?: string;
  residenceCountry: string;
}

export interface QuestionnaireState {
  id: string | null;
  currentStep: number;
  data: Partial<QuestionnaireData>;
  isSubmitting: boolean;
  isComplete: boolean;
  isSyncing: boolean;
  error: string | null;
}

// API response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface ApiQuestionnaire {
  id: string;
  userId: string;
  schemaVersion: number;
  responses: {
    version: number;
    preferredCountries?: string[];
    relocationReason?: string;
    familyStatus?: string;
    personalDetails?: {
      fullName?: string;
      email?: string;
      phone?: string;
      birthDate?: string;
      citizenship?: string;
      residenceCountry?: string;
      additionalCitizenship?: string;
    };
    spouseDetails?: {
      birthDate?: string;
      citizenship?: string;
    };
  };
  status: 'in_progress' | 'completed' | 'archived';
  currentStep: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

// Initial state
const initialData: Partial<QuestionnaireData> = {
  preferredCountries: [],
  relocationReason: "",
  familyStatus: "",
  fullName: "",
  email: "",
  phone: "",
  birthDate: "",
  citizenship: "",
  residenceCountry: "",
};

// In-memory state
let questionnaireState: QuestionnaireState = {
  id: null,
  currentStep: 1,
  data: { ...initialData },
  isSubmitting: false,
  isComplete: false,
  isSyncing: false,
  error: null,
};

/**
 * Convert API response to local data format
 */
function apiToLocalData(api: ApiQuestionnaire): Partial<QuestionnaireData> {
  return {
    preferredCountries: api.responses.preferredCountries ?? [],
    relocationReason: api.responses.relocationReason ?? "",
    familyStatus: api.responses.familyStatus ?? "",
    fullName: api.responses.personalDetails?.fullName ?? "",
    email: api.responses.personalDetails?.email ?? "",
    phone: api.responses.personalDetails?.phone ?? "",
    birthDate: api.responses.personalDetails?.birthDate ?? "",
    citizenship: api.responses.personalDetails?.citizenship ?? "",
    residenceCountry: api.responses.personalDetails?.residenceCountry ?? "",
    additionalCitizenship: api.responses.personalDetails?.additionalCitizenship,
    spouseBirthDate: api.responses.spouseDetails?.birthDate,
    spouseCitizenship: api.responses.spouseDetails?.citizenship,
  };
}

/**
 * Convert local data to API format
 */
function localToApiData(data: Partial<QuestionnaireData>): ApiQuestionnaire['responses'] {
  return {
    version: 1,
    preferredCountries: data.preferredCountries,
    relocationReason: data.relocationReason,
    familyStatus: data.familyStatus,
    personalDetails: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      birthDate: data.birthDate,
      citizenship: data.citizenship,
      residenceCountry: data.residenceCountry,
      additionalCitizenship: data.additionalCitizenship,
    },
    spouseDetails: data.spouseBirthDate || data.spouseCitizenship ? {
      birthDate: data.spouseBirthDate,
      citizenship: data.spouseCitizenship,
    } : undefined,
  };
}

/**
 * Get step number from step name
 */
function stepNameToNumber(stepName: string): number {
  const step = STEP_TO_PATH[stepName];
  if (step && QUESTIONNAIRE_STEPS[step]) {
    return QUESTIONNAIRE_STEPS[step].stepNumber;
  }
  return 1;
}

/**
 * Get step name from step number
 */
function stepNumberToName(stepNumber: number): string {
  const entries = Object.entries(QUESTIONNAIRE_STEPS);
  const step = entries.find(([_, config]) => config.stepNumber === stepNumber);
  return step ? step[0] : 'countries';
}

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAccessToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  return response.json();
}

// Service functions
export const questionnaireService = {
  /**
   * Get current questionnaire state
   */
  getState(): QuestionnaireState {
    return { ...questionnaireState };
  },

  /**
   * Get questionnaire data
   */
  getData(): Partial<QuestionnaireData> {
    return { ...questionnaireState.data };
  },

  /**
   * Load questionnaire from API (or create new one)
   */
  async loadFromApi(): Promise<void> {
    const token = getAccessToken();
    if (!token) {
      return;
    }

    questionnaireState.isSyncing = true;
    questionnaireState.error = null;

    try {
      const response = await apiRequest<{ questionnaire: ApiQuestionnaire }>(
        '/api/v1/questionnaire'
      );

      if (response.success && response.data?.questionnaire) {
        const api = response.data.questionnaire;
        questionnaireState = {
          ...questionnaireState,
          id: api.id,
          currentStep: stepNameToNumber(api.currentStep),
          data: apiToLocalData(api),
          isComplete: api.status === 'completed',
          isSyncing: false,
        };
      }
    } catch (error) {
      console.error('Failed to load questionnaire:', error);
      questionnaireState.error = 'Failed to load questionnaire';
      questionnaireState.isSyncing = false;
    }
  },

  /**
   * Update questionnaire data (partial update)
   * Also syncs to API if authenticated
   */
  updateData(updates: Partial<QuestionnaireData>): void {
    questionnaireState = {
      ...questionnaireState,
      data: {
        ...questionnaireState.data,
        ...updates,
      },
    };
  },

  /**
   * Save current state to API
   */
  async saveToApi(): Promise<{ success: boolean; error?: string }> {
    const token = getAccessToken();
    if (!token || !questionnaireState.id) {
      return { success: true }; // No API save needed
    }

    questionnaireState.isSyncing = true;

    try {
      const response = await apiRequest<{ questionnaire: ApiQuestionnaire }>(
        `/api/v1/questionnaire/${questionnaireState.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            responses: localToApiData(questionnaireState.data),
            currentStep: stepNumberToName(questionnaireState.currentStep),
          }),
        }
      );

      questionnaireState.isSyncing = false;

      if (!response.success) {
        return { success: false, error: response.error || 'Failed to save' };
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to save questionnaire:', error);
      questionnaireState.isSyncing = false;
      return { success: false, error: 'Network error' };
    }
  },

  /**
   * Set current step
   */
  setStep(step: number): void {
    questionnaireState.currentStep = step;
  },

  /**
   * Check if step is valid (has required data)
   */
  isStepValid(step: number): boolean {
    const { data } = questionnaireState;

    switch (step) {
      case 1:
        return (data.preferredCountries?.length ?? 0) > 0;
      case 2:
        // Relocation reason is optional (text input)
        return true;
      case 3:
        return !!data.familyStatus;
      case 4:
        return !!(
          data.fullName &&
          data.email &&
          data.phone &&
          data.birthDate &&
          data.citizenship &&
          data.residenceCountry
        );
      default:
        return false;
    }
  },

  /**
   * Check if spouse fields should be shown
   */
  showSpouseFields(): boolean {
    const { familyStatus } = questionnaireState.data;
    return familyStatus === "married" || familyStatus === "common_law";
  },

  /**
   * Submit questionnaire to API (marks as completed)
   */
  async submitQuestionnaire(): Promise<{ success: boolean; error?: string }> {
    questionnaireState.isSubmitting = true;
    questionnaireState.error = null;

    const token = getAccessToken();

    try {
      if (token && questionnaireState.id) {
        // Submit to API
        const response = await apiRequest<{ questionnaire: ApiQuestionnaire }>(
          `/api/v1/questionnaire/${questionnaireState.id}/complete`,
          {
            method: 'POST',
            body: JSON.stringify({
              responses: localToApiData(questionnaireState.data),
            }),
          }
        );

        if (!response.success) {
          throw new Error(response.error || 'Failed to submit questionnaire');
        }
      }

      questionnaireState.isComplete = true;
      questionnaireState.isSubmitting = false;

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      questionnaireState.error = errorMessage;
      questionnaireState.isSubmitting = false;

      return { success: false, error: errorMessage };
    }
  },

  /**
   * Reset questionnaire to initial state
   */
  reset(): void {
    questionnaireState = {
      id: null,
      currentStep: 1,
      data: { ...initialData },
      isSubmitting: false,
      isComplete: false,
      isSyncing: false,
      error: null,
    };
  },

  /**
   * Get questionnaire ID
   */
  getId(): string | null {
    return questionnaireState.id;
  },

  /**
   * Check if questionnaire is syncing with API
   */
  isSyncing(): boolean {
    return questionnaireState.isSyncing;
  },
};

// Export types for components
export type { QuestionnaireData as QuestionnaireFormData };

// ============================================================================
// V2 Re-exports (for convenience)
// ============================================================================

/**
 * Re-export V2 service for gradual migration
 * Consumers can use: import { questionnaireServiceV2 } from "@/services/questionnaire"
 */
export {
  questionnaireServiceV2,
  loadOrCreateQuestionnaire,
  needsFieldCompletion,
  getStepsNeedingCompletion,
} from "./questionnaire-v2";
export type { QuestionnaireV2State } from "./questionnaire-v2";
