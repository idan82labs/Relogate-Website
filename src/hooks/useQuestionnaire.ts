"use client";

import { useState, useCallback } from "react";
import {
  questionnaireService,
  QuestionnaireData,
} from "@/services/questionnaire";

/**
 * React hook for managing questionnaire state
 *
 * Provides a clean interface for components to interact with
 * the questionnaire service, with reactive state updates.
 */
export function useQuestionnaire() {
  // Local state to trigger re-renders
  const [, forceUpdate] = useState({});

  // Get current state from service
  const state = questionnaireService.getState();
  const data = questionnaireService.getData();

  // Refresh local state
  const refresh = useCallback(() => {
    forceUpdate({});
  }, []);

  // Update data and refresh
  const updateData = useCallback(
    (updates: Partial<QuestionnaireData>) => {
      questionnaireService.updateData(updates);
      refresh();
    },
    [refresh]
  );

  // Set step and refresh
  const setStep = useCallback(
    (step: number) => {
      questionnaireService.setStep(step);
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

  return {
    // State
    currentStep: state.currentStep,
    data,
    isSubmitting: state.isSubmitting,
    isComplete: state.isComplete,
    error: state.error,

    // Actions
    updateData,
    setStep,
    isStepValid,
    showSpouseFields,
    submit,
    reset,
  };
}
