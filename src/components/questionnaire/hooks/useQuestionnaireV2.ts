"use client";

/**
 * useQuestionnaireV2 Hook
 *
 * Comprehensive state management for the V2 questionnaire flow.
 * Supports both "new" and "update" modes for schema migrations.
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import { getAccessToken, isAuthenticated } from "@/services/auth";
import { STEP_COMPONENTS, getVisibleSteps } from "@/components/questionnaire/steps";
import type { QuestionnaireDataV2, StepValidation } from "@/types/questionnaire";
import type { StepId } from "@/components/questionnaire/steps/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// ============================================================================
// Types
// ============================================================================

export type QuestionnaireMode = "new" | "update";

export interface UseQuestionnaireV2Options {
  /** Mode: 'new' for fresh questionnaire, 'update' for completing new fields */
  mode?: QuestionnaireMode;
  /** Initial data (for update mode) */
  initialData?: Partial<QuestionnaireDataV2>;
  /** Questionnaire ID (for update mode) */
  questionnaireId?: string;
}

export interface UseQuestionnaireV2Return {
  // State
  data: Partial<QuestionnaireDataV2>;
  currentStepIndex: number;
  currentStepId: StepId;
  totalSteps: number;
  visibleSteps: typeof STEP_COMPONENTS;
  isLoading: boolean;
  isSubmitting: boolean;
  isSyncing: boolean;
  isComplete: boolean;
  error: string | null;
  errors: Record<string, string>;
  mode: QuestionnaireMode;

  // Actions
  updateData: (updates: Partial<QuestionnaireDataV2>) => void;
  goToNextStep: () => Promise<boolean>;
  goToPreviousStep: () => void;
  goToStep: (index: number) => void;
  validateCurrentStep: () => StepValidation;
  submit: () => Promise<{ success: boolean; error?: string }>;
  reset: () => void;
}

// ============================================================================
// API Helpers
// ============================================================================

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  const token = getAccessToken();

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API request failed:", error);
    return { success: false, error: "Network error" };
  }
}

// ============================================================================
// Validation Helpers
// ============================================================================

/** Get nested value from object by path (e.g., "personalDetails.fullName") */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce((current, key) => {
    return current && typeof current === "object"
      ? (current as Record<string, unknown>)[key]
      : undefined;
  }, obj as unknown);
}

/** Required fields for each step */
const STEP_REQUIRED_FIELDS: Record<StepId, string[]> = {
  intro: [],
  "personal-details": ["fullName", "birthDate", "phone", "email"],
  "family-status": ["familyStatus"],
  "relocation-goals": ["relocationReasons"],
  citizenship: ["citizenships"],
  "employment-education": ["employmentStatus", "remoteWorkCapable"],
  income: ["householdIncome", "hasPassiveIncome"],
  "partner-details": [],
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

/** Validate a single step */
function validateStep(
  stepId: StepId,
  data: Partial<QuestionnaireDataV2>
): StepValidation {
  const requiredFields = STEP_REQUIRED_FIELDS[stepId] || [];
  const errors: Record<string, string> = {};

  for (const field of requiredFields) {
    const value = getNestedValue(data as Record<string, unknown>, field);

    if (value === undefined || value === null || value === "") {
      errors[field] = "שדה חובה";
    } else if (Array.isArray(value) && value.length === 0) {
      errors[field] = "יש לבחור לפחות אפשרות אחת";
    }
  }

  // Conditional validations
  if (stepId === "family-status") {
    // Partner name required if partner is involved
    const processPartner = data.processPartner;
    if (processPartner && processPartner !== "alone" && !data.partnerName) {
      errors.partnerName = "שדה חובה";
    }
  }

  if (stepId === "income") {
    // Passive income amount required if has passive income
    if (data.hasPassiveIncome === true && !data.passiveIncomeAmount) {
      errors.passiveIncomeAmount = "יש לבחור סכום הכנסה פסיבית";
    }
  }

  if (stepId === "studies-investments-languages") {
    // Investment amount required if willing to invest
    if (
      data.willingToInvestInProperty === true &&
      data.has250kEuroForInvestment === undefined
    ) {
      errors.has250kEuroForInvestment = "יש לבחור אפשרות";
    }
  }

  if (stepId === "preferences") {
    // Additional considerations text required if has additional
    if (
      data.hasAdditionalConsiderations === true &&
      !data.additionalConsiderationsText
    ) {
      errors.additionalConsiderationsText = "יש להזין פירוט";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useQuestionnaireV2(
  options: UseQuestionnaireV2Options = {}
): UseQuestionnaireV2Return {
  const { mode = "new", initialData = {}, questionnaireId } = options;

  // State
  const [data, setData] = useState<Partial<QuestionnaireDataV2>>(initialData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [questId, setQuestId] = useState<string | null>(questionnaireId || null);

  // Calculate visible steps based on current data
  const visibleSteps = useMemo(() => getVisibleSteps(data), [data]);
  const totalSteps = visibleSteps.length;

  // Current step info
  const currentStep = visibleSteps[currentStepIndex];
  const currentStepId = currentStep?.id || "intro";

  // Load questionnaire from API on mount
  useEffect(() => {
    async function loadQuestionnaire() {
      if (!isAuthenticated()) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetchWithAuth<{
          questionnaire: {
            id: string;
            responses: Partial<QuestionnaireDataV2>;
            currentStep: string;
            status: string;
          };
        }>("/api/v1/questionnaire");

        if (response.success && response.data?.questionnaire) {
          const q = response.data.questionnaire;
          setQuestId(q.id);
          setData((prev) => ({ ...prev, ...q.responses }));
          setIsComplete(q.status === "completed");

          // Find current step index
          if (q.currentStep) {
            const stepIndex = visibleSteps.findIndex(
              (s) => s.id === q.currentStep
            );
            if (stepIndex >= 0) {
              setCurrentStepIndex(stepIndex);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load questionnaire:", err);
        setError("שגיאה בטעינת השאלון");
      } finally {
        setIsLoading(false);
      }
    }

    loadQuestionnaire();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update data (deep merge)
  const updateData = useCallback((updates: Partial<QuestionnaireDataV2>) => {
    setData((prev) => {
      const merged = { ...prev };
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
          (merged as Record<string, unknown>)[key] = value;
        }
      }
      return merged;
    });
    // Clear errors for updated fields
    setErrors((prev) => {
      const newErrors = { ...prev };
      for (const key of Object.keys(updates)) {
        delete newErrors[key];
      }
      return newErrors;
    });
  }, []);

  // Save progress to API
  const saveProgress = useCallback(async () => {
    if (!isAuthenticated() || !questId) {
      return { success: true };
    }

    setIsSyncing(true);

    try {
      const response = await fetchWithAuth(`/api/v1/questionnaire/${questId}`, {
        method: "PATCH",
        body: JSON.stringify({
          responses: data,
          currentStep: currentStepId,
        }),
      });

      setIsSyncing(false);
      return response;
    } catch (err) {
      console.error("Failed to save progress:", err);
      setIsSyncing(false);
      return { success: false, error: "שגיאה בשמירת ההתקדמות" };
    }
  }, [questId, data, currentStepId]);

  // Validate current step
  const validateCurrentStep = useCallback((): StepValidation => {
    const validation = validateStep(currentStepId, data);
    setErrors(validation.errors);
    return validation;
  }, [currentStepId, data]);

  // Go to next step
  const goToNextStep = useCallback(async (): Promise<boolean> => {
    // Validate current step
    const validation = validateCurrentStep();
    if (!validation.isValid) {
      return false;
    }

    // Save progress
    const saveResult = await saveProgress();
    if (!saveResult.success) {
      setError(saveResult.error || "שגיאה בשמירת ההתקדמות");
      return false;
    }

    // Move to next step
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setErrors({});
      setError(null);
      return true;
    }

    return true;
  }, [currentStepIndex, totalSteps, validateCurrentStep, saveProgress]);

  // Go to previous step
  const goToPreviousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setErrors({});
      setError(null);
    }
  }, [currentStepIndex]);

  // Go to specific step
  const goToStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSteps) {
        setCurrentStepIndex(index);
        setErrors({});
        setError(null);
      }
    },
    [totalSteps]
  );

  // Submit questionnaire
  const submit = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    // Validate current step first
    const validation = validateCurrentStep();
    if (!validation.isValid) {
      return { success: false, error: "יש למלא את כל השדות הנדרשים" };
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (isAuthenticated() && questId) {
        // Submit to API
        const response = await fetchWithAuth(
          `/api/v1/questionnaire/${questId}/complete`,
          {
            method: "POST",
            body: JSON.stringify({ responses: data }),
          }
        );

        if (!response.success) {
          throw new Error(response.error || "שגיאה בשליחת השאלון");
        }
      }

      setIsComplete(true);
      setIsSubmitting(false);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "שגיאה בשליחת השאלון";
      setError(errorMessage);
      setIsSubmitting(false);
      return { success: false, error: errorMessage };
    }
  }, [questId, data, validateCurrentStep]);

  // Reset questionnaire
  const reset = useCallback(() => {
    setData(initialData);
    setCurrentStepIndex(0);
    setIsComplete(false);
    setError(null);
    setErrors({});
  }, [initialData]);

  return {
    // State
    data,
    currentStepIndex,
    currentStepId,
    totalSteps,
    visibleSteps,
    isLoading,
    isSubmitting,
    isSyncing,
    isComplete,
    error,
    errors,
    mode,

    // Actions
    updateData,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    validateCurrentStep,
    submit,
    reset,
  };
}
