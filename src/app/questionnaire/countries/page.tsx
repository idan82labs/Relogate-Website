"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { useQuestionnaire } from "@/hooks/useQuestionnaire";
import { QUESTIONNAIRE_STEPS, TOTAL_STEPS } from "@/services/questionnaire";
import { CountrySelector } from "@/components/shared";
import { QuestionnaireStep } from "@/components/desktop";
import { MobileQuestionnaireStep } from "@/components/mobile";

const STEP_NAME = "countries" as const;
const STEP_CONFIG = QUESTIONNAIRE_STEPS[STEP_NAME];

/**
 * Country preference step
 * Route: /questionnaire/countries
 */
export default function CountriesStepPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const { data, updateData, setStep } = useQuestionnaire();
  const { steps } = siteContent.questionTest;

  // Detect viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync step with service
  useEffect(() => {
    setStep(STEP_CONFIG.stepNumber);
  }, [setStep]);

  const handleContinue = () => {
    if (STEP_CONFIG.next) {
      router.push(QUESTIONNAIRE_STEPS[STEP_CONFIG.next].path);
    }
  };

  const handleBack = () => {
    router.push("/questionnaire");
  };

  // Loading state
  if (isMobile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-[#215388] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </motion.div>
      </div>
    );
  }

  const canContinue = (data.preferredCountries?.length || 0) > 0;

  const content = (
    <CountrySelector
      options={steps.countryPreference.options}
      selected={data.preferredCountries || []}
      onChange={(selected) => updateData({ preferredCountries: selected })}
      multiSelect
    />
  );

  const wrapperProps = {
    currentStep: STEP_CONFIG.stepNumber,
    totalSteps: TOTAL_STEPS,
    title: steps.countryPreference.title,
    subtitle: steps.countryPreference.hint,
    onContinue: handleContinue,
    onBack: handleBack,
    canContinue,
  };

  if (isMobile) {
    return (
      <MobileQuestionnaireStep {...wrapperProps}>
        {content}
      </MobileQuestionnaireStep>
    );
  }

  return <QuestionnaireStep {...wrapperProps}>{content}</QuestionnaireStep>;
}
