"use client";

/**
 * Questionnaire Component
 *
 * Main orchestrator for the V2 questionnaire flow.
 * Manages step navigation, state, validation, and API submission.
 */

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { siteContent } from "@/content/he";
import { useQuestionnaireV2, QuestionnaireMode } from "./hooks";
import { QuestionnaireLayout } from "./QuestionnaireLayout";
import type { QuestionnaireDataV2 } from "@/types/questionnaire";

interface QuestionnaireProps {
  /** Mode: 'new' for fresh questionnaire, 'update' for completing new fields */
  mode?: QuestionnaireMode;
  /** Initial data (for update mode) */
  initialData?: Partial<QuestionnaireDataV2>;
  /** Questionnaire ID (for update mode) */
  questionnaireId?: string;
  /** Callback on successful completion */
  onComplete?: () => void;
  /** Redirect URL after completion */
  redirectUrl?: string;
}

const content = siteContent.questionnaireV2;

/**
 * Loading Spinner
 */
function LoadingSpinner(): React.ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="w-12 h-12 border-4 border-[#215388] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#706F6F] text-sm">טוען...</p>
      </motion.div>
    </div>
  );
}

/**
 * Completion Screen
 */
function CompletionScreen({
  onContinue,
}: {
  onContinue: () => void;
}): React.ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto px-4"
      >
        {/* Success Icon */}
        <div className="w-20 h-20 bg-[#239083] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-[#1D1D1B] mb-4">
          השאלון הושלם בהצלחה!
        </h1>
        <p className="text-[#706F6F] mb-8">
          תודה על מילוי השאלון. נכין עבורכם דוח מותאם אישית בקרוב.
        </p>

        <button
          onClick={onContinue}
          className="bg-[#215388] text-white px-8 py-3 rounded-full font-medium hover:bg-[#1a4270] transition-colors"
        >
          המשך לאזור האישי
        </button>
      </motion.div>
    </div>
  );
}

/**
 * Questionnaire - Main orchestrator component
 */
export function Questionnaire({
  mode = "new",
  initialData,
  questionnaireId,
  onComplete,
  redirectUrl = "/personal-area",
}: QuestionnaireProps): React.ReactElement {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // Initialize questionnaire hook
  const {
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
    updateData,
    goToNextStep,
    goToPreviousStep,
    submit,
  } = useQuestionnaireV2({
    mode,
    initialData,
    questionnaireId,
  });

  // Detect viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle continue/submit
  const handleContinue = useCallback(async () => {
    const isLastStep = currentStepIndex === totalSteps - 1;

    if (isLastStep) {
      const result = await submit();
      if (result.success) {
        onComplete?.();
      }
    } else {
      await goToNextStep();
    }
  }, [currentStepIndex, totalSteps, submit, goToNextStep, onComplete]);

  // Handle back
  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      goToPreviousStep();
    } else {
      router.push("/questionnaire");
    }
  }, [currentStepIndex, goToPreviousStep, router]);

  // Handle completion redirect
  const handleCompletionContinue = useCallback(() => {
    router.push(redirectUrl);
  }, [router, redirectUrl]);

  // Loading state
  if (isLoading || isMobile === null) {
    return <LoadingSpinner />;
  }

  // Completion state
  if (isComplete) {
    return <CompletionScreen onContinue={handleCompletionContinue} />;
  }

  // Get current step configuration
  const currentStep = visibleSteps[currentStepIndex];
  if (!currentStep) {
    return <LoadingSpinner />;
  }

  // Get step content from Hebrew content
  const stepContent =
    content.steps[currentStepId as keyof typeof content.steps];
  const title = stepContent?.title || "";
  const subtitle = stepContent?.subtitle || "";

  // Render step component
  const StepComponent = currentStep.component;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <QuestionnaireLayout
      currentStepIndex={currentStepIndex}
      totalSteps={totalSteps}
      currentStepId={currentStepId}
      title={title}
      subtitle={subtitle}
      showBack={!isFirstStep}
      isLastStep={isLastStep}
      canContinue={true}
      isSubmitting={isSubmitting}
      isSyncing={isSyncing}
      onBack={handleBack}
      onContinue={handleContinue}
      isMobile={isMobile}
    >
      {/* Error display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step content with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <StepComponent
            data={data}
            onChange={updateData}
            errors={errors}
            isSubmitting={isSubmitting}
          />
        </motion.div>
      </AnimatePresence>
    </QuestionnaireLayout>
  );
}

