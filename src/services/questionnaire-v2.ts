/**
 * Questionnaire V2 Service
 *
 * Service for managing V2 questionnaire data with full CRUD operations.
 * Supports migration from V1 format and identifies new fields for completion.
 */

import { api, ApiError, getHebrewErrorMessage } from "./api";
import {
  migrateV1ToV2,
  isV1Data,
  deepMerge,
  getNewFieldsToComplete,
  getStepsWithNewFields,
  getFirstIncompleteStep,
} from "./questionnaire-migration";
import { isAuthenticated } from "./auth";
import type {
  ApiQuestionnaire,
  ApiQuestionnaireResponse,
  MigrationInfo,
  isV1Response,
} from "@/types/questionnaire-api";
import type {
  QuestionnaireDataV2,
  QuestionnaireStatus,
} from "@/types/questionnaire";
import type { StepId } from "@/components/questionnaire/steps/types";

// ============================================================================
// Types
// ============================================================================

/**
 * Questionnaire V2 state
 */
export interface QuestionnaireV2State {
  /** Questionnaire ID */
  id: string | null;
  /** Questionnaire data */
  data: Partial<QuestionnaireDataV2>;
  /** Current step ID */
  currentStep: StepId;
  /** Questionnaire status */
  status: QuestionnaireStatus;
  /** Whether data is loading */
  isLoading: boolean;
  /** Whether data is syncing */
  isSyncing: boolean;
  /** Whether form is submitting */
  isSubmitting: boolean;
  /** Error message */
  error: string | null;
  /** Migration info (if migrated from V1) */
  migrationInfo: MigrationInfo | null;
}

/**
 * Listener callback type
 */
type Listener = (state: QuestionnaireV2State) => void;

// ============================================================================
// Initial State
// ============================================================================

const initialState: QuestionnaireV2State = {
  id: null,
  data: {},
  currentStep: "intro",
  status: "in_progress",
  isLoading: false,
  isSyncing: false,
  isSubmitting: false,
  error: null,
  migrationInfo: null,
};

// ============================================================================
// Service Implementation
// ============================================================================

/**
 * Create questionnaire V2 service instance
 */
function createQuestionnaireServiceV2() {
  let state: QuestionnaireV2State = { ...initialState };
  const listeners = new Set<Listener>();

  /**
   * Notify all subscribers of state change
   */
  function notify(): void {
    listeners.forEach((listener) => listener({ ...state }));
  }

  /**
   * Update state and notify subscribers
   */
  function setState(updates: Partial<QuestionnaireV2State>): void {
    state = { ...state, ...updates };
    notify();
  }

  /**
   * Process API questionnaire response and handle V1 migration if needed
   */
  function processQuestionnaire(questionnaire: ApiQuestionnaire): void {
    const { id, responses, currentStep, status, schemaVersion } = questionnaire;

    let data: Partial<QuestionnaireDataV2>;
    let migrationInfo: MigrationInfo | null = null;

    // Check if V1 data and needs migration
    if (schemaVersion === 1 || isV1Data(responses)) {
      const migrationResult = migrateV1ToV2(responses);
      data = migrationResult.data;
      migrationInfo = migrationResult.info;
    } else {
      // V2 data - use directly
      data = responses as Partial<QuestionnaireDataV2>;
    }

    setState({
      id,
      data,
      currentStep: (currentStep as StepId) || "intro",
      status: status as QuestionnaireStatus,
      migrationInfo,
      isLoading: false,
      error: null,
    });
  }

  return {
    /**
     * Subscribe to state changes
     */
    subscribe(listener: Listener): () => void {
      listeners.add(listener);
      // Immediately call with current state
      listener({ ...state });
      // Return unsubscribe function
      return () => listeners.delete(listener);
    },

    /**
     * Get current state
     */
    getState(): QuestionnaireV2State {
      return { ...state };
    },

    /**
     * Load questionnaire from API
     * Creates new one if doesn't exist
     */
    async load(): Promise<{
      success: boolean;
      error?: string;
    }> {
      if (!isAuthenticated()) {
        setState({ isLoading: false });
        return { success: true };
      }

      setState({ isLoading: true, error: null });

      try {
        const response = await api.get<ApiQuestionnaireResponse>(
          "/api/v1/questionnaire"
        );

        if (response.success && response.data?.questionnaire) {
          processQuestionnaire(response.data.questionnaire);
          return { success: true };
        }

        // No questionnaire found - that's OK, user will create one
        setState({ isLoading: false });
        return { success: true };
      } catch (error) {
        console.error("Failed to load questionnaire:", error);
        const errorMessage = getHebrewErrorMessage(error);
        setState({ isLoading: false, error: errorMessage });
        return { success: false, error: errorMessage };
      }
    },

    /**
     * Create new questionnaire
     */
    async create(
      initialData?: Partial<QuestionnaireDataV2>
    ): Promise<{
      success: boolean;
      error?: string;
    }> {
      if (!isAuthenticated()) {
        return { success: false, error: "יש להתחבר כדי ליצור שאלון" };
      }

      setState({ isLoading: true, error: null });

      try {
        const response = await api.post<ApiQuestionnaireResponse>(
          "/api/v1/questionnaire",
          {
            responses: initialData || {},
            schemaVersion: 2,
          }
        );

        if (response.success && response.data?.questionnaire) {
          processQuestionnaire(response.data.questionnaire);
          return { success: true };
        }

        setState({ isLoading: false });
        return {
          success: false,
          error: response.error || "שגיאה ביצירת השאלון",
        };
      } catch (error) {
        console.error("Failed to create questionnaire:", error);
        const errorMessage = getHebrewErrorMessage(error);
        setState({ isLoading: false, error: errorMessage });
        return { success: false, error: errorMessage };
      }
    },

    /**
     * Update questionnaire data locally
     * Call save() to persist to API
     */
    updateData(updates: Partial<QuestionnaireDataV2>): void {
      const newData = deepMerge(
        state.data as Record<string, unknown>,
        updates as Record<string, unknown>
      ) as Partial<QuestionnaireDataV2>;

      setState({ data: newData, error: null });
    },

    /**
     * Set current step
     */
    setCurrentStep(step: StepId): void {
      setState({ currentStep: step });
    },

    /**
     * Save current state to API
     */
    async save(): Promise<{
      success: boolean;
      error?: string;
    }> {
      if (!isAuthenticated() || !state.id) {
        return { success: true };
      }

      setState({ isSyncing: true, error: null });

      try {
        const response = await api.patch<ApiQuestionnaireResponse>(
          `/api/v1/questionnaire/${state.id}`,
          {
            responses: state.data,
            currentStep: state.currentStep,
          }
        );

        setState({ isSyncing: false });

        if (!response.success) {
          const errorMessage = response.error || "שגיאה בשמירת ההתקדמות";
          setState({ error: errorMessage });
          return { success: false, error: errorMessage };
        }

        return { success: true };
      } catch (error) {
        console.error("Failed to save questionnaire:", error);
        const errorMessage = getHebrewErrorMessage(error);
        setState({ isSyncing: false, error: errorMessage });
        return { success: false, error: errorMessage };
      }
    },

    /**
     * Submit questionnaire (mark as completed)
     */
    async submit(): Promise<{
      success: boolean;
      error?: string;
    }> {
      if (!isAuthenticated() || !state.id) {
        return { success: false, error: "יש להתחבר כדי לשלוח את השאלון" };
      }

      setState({ isSubmitting: true, error: null });

      try {
        const response = await api.post<ApiQuestionnaireResponse>(
          `/api/v1/questionnaire/${state.id}/complete`,
          {
            responses: state.data,
          }
        );

        if (response.success) {
          setState({
            isSubmitting: false,
            status: "completed",
          });
          return { success: true };
        }

        const errorMessage = response.error || "שגיאה בשליחת השאלון";
        setState({ isSubmitting: false, error: errorMessage });
        return { success: false, error: errorMessage };
      } catch (error) {
        console.error("Failed to submit questionnaire:", error);
        const errorMessage = getHebrewErrorMessage(error);
        setState({ isSubmitting: false, error: errorMessage });
        return { success: false, error: errorMessage };
      }
    },

    /**
     * Get questionnaire status info
     */
    getStatus(): {
      isComplete: boolean;
      hasNewFields: boolean;
      newFields: string[];
      stepsWithNewFields: string[];
      firstIncompleteStep: StepId;
    } {
      const newFields = getNewFieldsToComplete(state.data);
      const stepsWithNewFields = getStepsWithNewFields(state.data);
      const firstIncompleteStep = getFirstIncompleteStep(state.data);

      return {
        isComplete: state.status === "completed" && newFields.length === 0,
        hasNewFields: newFields.length > 0,
        newFields,
        stepsWithNewFields,
        firstIncompleteStep,
      };
    },

    /**
     * Reset service to initial state
     */
    reset(): void {
      state = { ...initialState };
      notify();
    },

    /**
     * Clear error
     */
    clearError(): void {
      setState({ error: null });
    },
  };
}

// ============================================================================
// Singleton Export
// ============================================================================

/**
 * Singleton instance of the questionnaire V2 service
 */
export const questionnaireServiceV2 = createQuestionnaireServiceV2();

// ============================================================================
// Hooks-friendly helpers
// ============================================================================

/**
 * Load questionnaire or create new one if doesn't exist
 */
export async function loadOrCreateQuestionnaire(
  initialData?: Partial<QuestionnaireDataV2>
): Promise<{ success: boolean; error?: string }> {
  // First try to load existing
  const loadResult = await questionnaireServiceV2.load();

  if (!loadResult.success) {
    return loadResult;
  }

  // If no questionnaire exists, create one
  const state = questionnaireServiceV2.getState();
  if (!state.id && isAuthenticated()) {
    return questionnaireServiceV2.create(initialData);
  }

  return { success: true };
}

/**
 * Check if user needs to complete new fields
 * (e.g., after schema migration)
 */
export function needsFieldCompletion(): boolean {
  const status = questionnaireServiceV2.getStatus();
  return status.hasNewFields;
}

/**
 * Get steps that need completion
 */
export function getStepsNeedingCompletion(): StepId[] {
  const status = questionnaireServiceV2.getStatus();
  return status.stepsWithNewFields as StepId[];
}
