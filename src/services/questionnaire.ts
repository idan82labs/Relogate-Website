/**
 * Questionnaire Service
 *
 * Handles questionnaire data management. Currently stores in memory,
 * but designed for easy API integration later.
 *
 * To integrate with API:
 * 1. Replace the in-memory storage with API calls
 * 2. Update submitQuestionnaire to POST to your endpoint
 * 3. Add authentication headers if needed
 */

// Step configuration
export const QUESTIONNAIRE_STEPS = {
  countries: {
    path: "/questionnaire/countries",
    stepNumber: 1,
    next: "family-status",
  },
  "family-status": {
    path: "/questionnaire/family-status",
    stepNumber: 2,
    next: "personal-details",
  },
  "personal-details": {
    path: "/questionnaire/personal-details",
    stepNumber: 3,
    next: null,
  },
} as const;

export type StepName = keyof typeof QUESTIONNAIRE_STEPS;
export const TOTAL_STEPS = Object.keys(QUESTIONNAIRE_STEPS).length;

// Types
export interface QuestionnaireData {
  // Step 1: Country preferences
  preferredCountries: string[];

  // Step 2: Family status
  familyStatus: string;

  // Step 3: Personal details
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
  currentStep: number;
  data: Partial<QuestionnaireData>;
  isSubmitting: boolean;
  isComplete: boolean;
  error: string | null;
}

// Initial state
const initialData: Partial<QuestionnaireData> = {
  preferredCountries: [],
  familyStatus: "",
  fullName: "",
  email: "",
  phone: "",
  birthDate: "",
  citizenship: "",
  residenceCountry: "",
};

// In-memory storage (replace with API calls later)
let questionnaireState: QuestionnaireState = {
  currentStep: 1,
  data: { ...initialData },
  isSubmitting: false,
  isComplete: false,
  error: null,
};

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
   * Update questionnaire data (partial update)
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
        return !!data.familyStatus;
      case 3:
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
   * Submit questionnaire to API
   * TODO: Replace with actual API call
   */
  async submitQuestionnaire(): Promise<{ success: boolean; error?: string }> {
    questionnaireState.isSubmitting = true;
    questionnaireState.error = null;

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Replace with actual API call
      // const response = await fetch('/api/questionnaire', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(questionnaireState.data),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Failed to submit questionnaire');
      // }

      console.log("Questionnaire submitted:", questionnaireState.data);

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
      currentStep: 1,
      data: { ...initialData },
      isSubmitting: false,
      isComplete: false,
      error: null,
    };
  },
};

// Export types for components
export type { QuestionnaireData as QuestionnaireFormData };
