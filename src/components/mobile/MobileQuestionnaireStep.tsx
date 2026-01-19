"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Button, QuestionProgress } from "@/components/shared";
import { MobileFooter } from "./MobileFooter";
import { MobileHeader } from "./MobileHeader";

interface MobileQuestionnaireStepProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  onContinue: () => void;
  onBack?: () => void;
  canContinue?: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  children: React.ReactNode;
}

/**
 * MobileQuestionnaireStep - Mobile wrapper for questionnaire steps
 * Provides consistent layout with progress, navigation, and content area
 */
export const MobileQuestionnaireStep = ({
  currentStep,
  totalSteps,
  title,
  subtitle,
  onContinue,
  onBack,
  canContinue = true,
  isLastStep: _isLastStep = false,
  isSubmitting = false,
  children,
}: MobileQuestionnaireStepProps) => {
  const router = useRouter();
  const { questionTest } = siteContent;
  const { navigation, progress } = questionTest;

  // Define sections for progress indicator (RTL: right to left)
  // Section 0 = rightmost (eligibility), Section 1 = leftmost (preferences)
  const sections = [
    { label: progress.eligibility, steps: [1, 2] },
    { label: progress.preferences, steps: [3, 4] },
  ];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/questionnaire");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MobileHeader />

      <main className="flex-1 px-4 pt-4 pb-6 relative flex flex-col">
        {/* Globe Watermark - centered in main area, more visible */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <Image
            src="/globe-watermark.svg"
            alt=""
            width={280}
            height={280}
            className="object-contain opacity-20"
            aria-hidden="true"
          />
        </div>

        {/* Progress Bar Section - at top */}
        <div className="relative z-10">
          {/* Back Button - positioned above progress bar, aligned right */}
          <div className="w-full mb-2">
            <motion.button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 text-[#C6C6C6] hover:text-[#706F6F] transition-colors ml-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Arrow before text in DOM = appears on RIGHT in RTL, rotated 45deg for bottom-right */}
              <Image
                src="/icons/arrow-right.svg"
                alt=""
                width={9}
                height={9}
                className="opacity-70 rotate-45"
              />
              <span className="text-[12px] font-medium">{navigation.back}</span>
            </motion.button>
          </div>

          {/* Progress Bar - full width of padded container */}
          <div className="w-full">
            <QuestionProgress
              currentStep={currentStep}
              totalSteps={totalSteps}
              sections={sections}
            />
          </div>
        </div>

        {/* Content Area - centered in remaining space */}
        <div className="flex-1 flex items-center justify-center relative z-10 py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
          {/* Title - 16px font to fit single line on mobile, centered */}
          <h1 className="text-[16px] font-medium text-[#1D1D1B] text-center mb-3 leading-[1.3] w-full whitespace-nowrap">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-[14px] text-[#706F6F] text-center mb-8">
              {subtitle}
            </p>
          )}

          {/* Step Content */}
          <div className="mb-10">{children}</div>

          {/* Continue Button - always shows "שמור והמשך" with arrow pointing bottom-left */}
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={onContinue}
            disabled={!canContinue || isSubmitting}
            className="rounded-[100px] h-[50px]"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                שולח...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 text-[16px] font-semibold">
                {navigation.saveAndContinue}
                {/* Arrow after text in DOM = appears on LEFT in RTL, rotated 135deg for bottom-left */}
                <Image
                  src="/icons/arrow-right.svg"
                  alt=""
                  width={9}
                  height={9}
                  className="rotate-[135deg] brightness-0 invert"
                />
              </span>
            )}
          </Button>
          </motion.div>
        </div>
      </main>

      <MobileFooter />
    </div>
  );
};

export default MobileQuestionnaireStep;
