"use client";

import { motion } from "framer-motion";

interface ProgressSection {
  label: string;
  steps: number[];
}

interface QuestionProgressProps {
  currentStep: number;
  totalSteps: number;
  sections: ProgressSection[];
  className?: string;
}

/**
 * QuestionProgress - Accumulated progress indicator for questionnaire steps
 * Shows a horizontal line with accumulated fill (RTL: fills from right to left)
 * Progress: Step 1 = 25%, Step 2 = 50%, Step 3 = 75%, Step 4 = 100%
 */
export const QuestionProgress = ({
  currentStep,
  totalSteps,
  sections,
  className = "",
}: QuestionProgressProps) => {
  // Find active section based on current step
  const activeSection = sections.find((section) =>
    section.steps.includes(currentStep)
  );

  // Calculate accumulated progress percentage (RTL: fills from right)
  // 4 states: 25%, 50%, 75%, 100% - full at last step
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={`relative ${className}`}>
      {/* Background line */}
      <div className="h-[1px] bg-[#C6C6C6] w-full" />

      {/* Accumulated progress bar (RTL: grows from right to left) */}
      <motion.div
        className="absolute top-0 h-[6px] bg-[#215388] -translate-y-1/2 right-0"
        initial={{ width: 0 }}
        animate={{ width: `${progressPercentage}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Section label - fixed at start of progress bar (right edge in RTL) */}
      {activeSection && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-3 right-0 text-[12px] lg:text-[16px] font-normal text-[#215388]"
        >
          {activeSection.label}
        </motion.p>
      )}
    </div>
  );
};

