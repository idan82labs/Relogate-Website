"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { useQuestionnaire } from "@/hooks/useQuestionnaire";
import { useAuth } from "@/contexts/AuthContext";
import { QUESTIONNAIRE_STEPS, TOTAL_STEPS } from "@/services/questionnaire";
import { TextInput } from "@/components/shared";
import { QuestionnaireStep } from "@/components/desktop";
import { MobileQuestionnaireStep } from "@/components/mobile";

const STEP_NAME = "personal-details" as const;
const STEP_CONFIG = QUESTIONNAIRE_STEPS[STEP_NAME];

/**
 * Personal details step
 * Route: /questionnaire/personal-details
 */
export default function PersonalDetailsStepPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const { user } = useAuth();

  const {
    data,
    updateData,
    setStep,
    isStepValid,
    showSpouseFields,
    submit,
    isSubmitting,
    isLoaded,
  } = useQuestionnaire();
  const { steps } = siteContent.questionTest;
  const { fields } = steps.personalDetails;

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

  // Pre-fill personal details from user registration data
  useEffect(() => {
    if (!isLoaded || !user) return;

    const updates: Record<string, string> = {};

    // Pre-fill fullName from firstName + lastName
    if (!data.fullName && (user.firstName || user.lastName)) {
      const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
      if (fullName) {
        updates.fullName = fullName;
      }
    }

    // Pre-fill email
    if (!data.email && user.email) {
      updates.email = user.email;
    }

    // Pre-fill phone
    if (!data.phone && user.phone) {
      updates.phone = user.phone;
    }

    // Pre-fill birthDate
    if (!data.birthDate && user.birthDate) {
      updates.birthDate = user.birthDate;
    }

    // Only update if there are changes to make
    if (Object.keys(updates).length > 0) {
      updateData(updates);
    }
  }, [isLoaded, user, data.fullName, data.email, data.phone, data.birthDate, updateData]);

  const handleContinue = async () => {
    const result = await submit();
    if (result.success) {
      // Navigate to results page
      router.push("/questionnaire/results");
    }
  };

  const handleBack = () => {
    router.push(QUESTIONNAIRE_STEPS["family-status"].path);
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

  const shouldShowSpouse = showSpouseFields();
  const canContinue = isStepValid(STEP_CONFIG.stepNumber);

  const content = (
    <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
      <TextInput
        label={fields.fullName.label}
        value={data.fullName || ""}
        onChange={(value) => updateData({ fullName: value })}
        placeholder={fields.fullName.placeholder}
      />
      <TextInput
        label={fields.email.label}
        type="email"
        value={data.email || ""}
        onChange={(value) => updateData({ email: value })}
        placeholder={fields.email.placeholder}
      />
      <TextInput
        label={fields.phone.label}
        type="tel"
        value={data.phone || ""}
        onChange={(value) => updateData({ phone: value })}
        placeholder={fields.phone.placeholder}
      />
      <TextInput
        label={fields.birthDate.label}
        type="date"
        value={data.birthDate || ""}
        onChange={(value) => updateData({ birthDate: value })}
        placeholder={fields.birthDate.placeholder}
      />
      <TextInput
        label={fields.citizenship.label}
        value={data.citizenship || ""}
        onChange={(value) => updateData({ citizenship: value })}
        placeholder={fields.citizenship.placeholder}
      />
      <TextInput
        label={fields.residenceCountry.label}
        value={data.residenceCountry || ""}
        onChange={(value) => updateData({ residenceCountry: value })}
        placeholder={fields.residenceCountry.placeholder}
      />

      {shouldShowSpouse && (
        <>
          <TextInput
            label={fields.spouseBirthDate.label}
            type="date"
            value={data.spouseBirthDate || ""}
            onChange={(value) => updateData({ spouseBirthDate: value })}
            placeholder={fields.spouseBirthDate.placeholder}
          />
          <TextInput
            label={fields.spouseCitizenship.label}
            value={data.spouseCitizenship || ""}
            onChange={(value) => updateData({ spouseCitizenship: value })}
            placeholder={fields.spouseCitizenship.placeholder}
          />
        </>
      )}

      <TextInput
        label={fields.additionalCitizenship.label}
        value={data.additionalCitizenship || ""}
        onChange={(value) => updateData({ additionalCitizenship: value })}
        placeholder={fields.additionalCitizenship.placeholder}
        className={isMobile ? "" : "col-span-2"}
      />
    </div>
  );

  const wrapperProps = {
    currentStep: STEP_CONFIG.stepNumber,
    totalSteps: TOTAL_STEPS,
    title: steps.personalDetails.title,
    onContinue: handleContinue,
    onBack: handleBack,
    canContinue,
    isLastStep: true,
    isSubmitting,
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
