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
 * QuestionProgress - Progress indicator for questionnaire steps
 * Shows a horizontal line with highlighted section and label
 */
export const QuestionProgress = ({
  currentStep,
  sections,
  className = "",
}: QuestionProgressProps) => {
  // Find active section based on current step
  const activeSection = sections.find((section) =>
    section.steps.includes(currentStep)
  );

  // Calculate progress position
  const getSectionPosition = (section: ProgressSection) => {
    const sectionIndex = sections.indexOf(section);
    const totalSections = sections.length;
    const segmentWidth = 100 / totalSections;
    return {
      left: `${sectionIndex * segmentWidth}%`,
      width: `${segmentWidth}%`,
    };
  };

  return (
    <div className={`relative ${className}`}>
      {/* Background line */}
      <div className="h-[1px] bg-[#C6C6C6] w-full" />

      {/* Active section highlight */}
      {activeSection && (
        <motion.div
          className="absolute top-0 h-[6px] bg-[#215388] -translate-y-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={getSectionPosition(activeSection)}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Section label */}
      {activeSection && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-3 text-[16px] font-medium text-[#215388]"
          style={{
            right: `calc(100% - ${
              parseFloat(getSectionPosition(activeSection).left) +
              parseFloat(getSectionPosition(activeSection).width) / 2
            }%)`,
            transform: "translateX(50%)",
          }}
        >
          {activeSection.label}
        </motion.p>
      )}
    </div>
  );
};

export default QuestionProgress;
