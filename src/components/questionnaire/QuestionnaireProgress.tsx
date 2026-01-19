"use client";

/**
 * QuestionnaireProgress Component
 *
 * Animated progress indicator for the V2 questionnaire.
 * Shows current step progress with section labels.
 */

import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import type { StepId } from "./steps/types";

interface QuestionnaireProgressProps {
  /** Current step index (0-indexed) */
  currentStepIndex: number;
  /** Total number of visible steps */
  totalSteps: number;
  /** Current step ID */
  currentStepId: StepId;
  /** Optional class name */
  className?: string;
}

const content = siteContent.questionnaireV2;

/** Map step IDs to progress sections */
const STEP_TO_SECTION: Record<StepId, keyof typeof content.progress> = {
  intro: "personalInfo",
  "personal-details": "personalInfo",
  "family-status": "personalInfo",
  "relocation-goals": "goals",
  citizenship: "eligibility",
  "employment-education": "eligibility",
  income: "eligibility",
  "partner-details": "eligibility",
  "studies-investments-languages": "eligibility",
  preferences: "preferences",
};

/**
 * QuestionnaireProgress - Progress bar for V2 questionnaire
 * Shows accumulated progress from right to left (RTL)
 */
export function QuestionnaireProgress({
  currentStepIndex,
  totalSteps,
  currentStepId,
  className = "",
}: QuestionnaireProgressProps): React.ReactElement {
  // Calculate progress percentage (accounting for intro being step 0)
  // The actual step is 1-indexed for display purposes
  const displayStep = currentStepIndex + 1;
  const progressPercentage = (displayStep / totalSteps) * 100;

  // Get section label for current step
  const sectionKey = STEP_TO_SECTION[currentStepId] || "personalInfo";
  const sectionLabel = content.progress[sectionKey];

  return (
    <div className={`relative ${className}`}>
      {/* Background line */}
      <div className="h-[1px] bg-[#C6C6C6] w-full" />

      {/* Progress bar (RTL: grows from right to left) */}
      <motion.div
        className="absolute top-0 h-[6px] bg-[#215388] -translate-y-1/2 right-0 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progressPercentage}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Section label and step counter */}
      <div className="flex justify-between items-center absolute top-3 w-full">
        {/* Section label - right aligned for RTL */}
        <motion.p
          key={sectionLabel}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-[12px] lg:text-[16px] font-normal text-[#215388]"
        >
          {sectionLabel}
        </motion.p>

        {/* Step counter - left aligned for RTL */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[12px] lg:text-[14px] text-[#706F6F]"
        >
          <span className="font-medium">{displayStep}</span>
          <span className="mx-1">{content.navigation.of}</span>
          <span>{totalSteps}</span>
        </motion.p>
      </div>
    </div>
  );
}

