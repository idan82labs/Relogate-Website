"use client";

import { useState, useCallback, useEffect } from "react";
import {
  questionnaireService,
  QuestionnaireData,
} from "@/services/questionnaire";
import { isAuthenticated } from "@/services/auth";

/**
 * React hook for managing questionnaire state
 *
 * Provides a clean interface for components to interact with
 * the questionnaire service, with reactive state updates.
 * Automatically syncs with backend API when user is authenticated.
 */
export function useQuestionnaire() {
  // Local state to trigger re-renders
  const [, forceUpdate] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Get current state from service
  const state = questionnaireService.getState();
  const data = questionnaireService.getData();

  // Refresh local state
  const refresh = useCallback(() => {
    forceUpdate({});
  }, []);

  // Load questionnaire from API on mount (for authenticated users)
  useEffect(() => {
    async function loadQuestionnaire() {
      if (isAuthenticated()) {
        await questionnaireService.loadFromApi();
        refresh();
      }
      setIsLoaded(true);
    }
    loadQuestionnaire();
  }, [refresh]);

  // Update data and refresh
  const updateData = useCallback(
    (updates: Partial<QuestionnaireData>) => {
      questionnaireService.updateData(updates);
      refresh();
    },
    [refresh]
  );

  // Set step, save to API, and refresh
  const setStep = useCallback(
    async (step: number) => {
      questionnaireService.setStep(step);

      // Save progress to API when changing steps
      if (isAuthenticated()) {
        await questionnaireService.saveToApi();
      }

      refresh();
    },
    [refresh]
  );

  // Check if step is valid
  const isStepValid = useCallback((step: number) => {
    return questionnaireService.isStepValid(step);
  }, []);

  // Check if spouse fields should show
  const showSpouseFields = useCallback(() => {
    return questionnaireService.showSpouseFields();
  }, []);

  // Submit questionnaire
  const submit = useCallback(async () => {
    const result = await questionnaireService.submitQuestionnaire();
    refresh();
    return result;
  }, [refresh]);

  // Reset questionnaire
  const reset = useCallback(() => {
    questionnaireService.reset();
    refresh();
  }, [refresh]);

  // Save current progress to API
  const saveProgress = useCallback(async () => {
    if (isAuthenticated()) {
      const result = await questionnaireService.saveToApi();
      refresh();
      return result;
    }
    return { success: true };
  }, [refresh]);

  return {
    // State
    currentStep: state.currentStep,
    data,
    isSubmitting: state.isSubmitting,
    isComplete: state.isComplete,
    isSyncing: state.isSyncing,
    error: state.error,
    isLoaded,
    questionnaireId: questionnaireService.getId(),

    // Actions
    updateData,
    setStep,
    isStepValid,
    showSpouseFields,
    submit,
    reset,
    saveProgress,
  };
}
