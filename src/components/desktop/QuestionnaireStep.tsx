"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Button, QuestionProgress } from "@/components/shared";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface QuestionnaireStepProps {
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
 * QuestionnaireStep - Desktop wrapper for questionnaire steps
 * Provides consistent layout with progress, navigation, and content area
 */
export const QuestionnaireStep = ({
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
}: QuestionnaireStepProps) => {
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
      <Header />

      <main className="flex-1 relative flex flex-col">
        {/* Globe Watermark - centered in main area, more visible */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Image
            src="/globe-watermark.svg"
            alt=""
            width={500}
            height={500}
            className="object-contain opacity-20"
            aria-hidden="true"
          />
        </div>

        {/* Progress Bar Section - fixed at top */}
        <div className="container relative z-10 pt-8">
          {/* Back Button - positioned above progress bar, aligned right */}
          <div className="max-w-[800px] mx-auto mb-2">
            <motion.button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-[#C6C6C6] hover:text-[#706F6F] transition-colors ml-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Arrow before text in DOM = appears on RIGHT in RTL, rotated 45deg for bottom-right */}
              <Image
                src="/icons/arrow-right.svg"
                alt=""
                width={13}
                height={15}
                className="opacity-70 rotate-45"
              />
              <span className="text-[16px] font-medium">{navigation.back}</span>
            </motion.button>
          </div>

          {/* Progress Bar */}
          <div className="max-w-[800px] mx-auto">
            <QuestionProgress
              currentStep={currentStep}
              totalSteps={totalSteps}
              sections={sections}
            />
          </div>
        </div>

        {/* Content Area - centered in remaining space */}
        <div className="flex-1 flex items-center justify-center container relative z-10 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-[800px] w-full"
          >
            {/* Title - 36px font, single line, centered relative to progress bar */}
            <h1 className="text-[36px] font-medium text-[#1D1D1B] text-center mb-4 leading-[1.2] whitespace-nowrap">
              {title}
            </h1>

            {/* Inner content centered within the 800px container */}
            <div className="max-w-[600px] mx-auto">
              {/* Subtitle */}
              {subtitle && (
                <p className="text-[16px] text-[#706F6F] text-center mb-10">
                  {subtitle}
                </p>
              )}

              {/* Step Content */}
              <div className="mb-14">{children}</div>

              {/* Continue Button - always shows "שמור והמשך" with arrow pointing bottom-left */}
              <div className="flex justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={onContinue}
                disabled={!canContinue || isSubmitting}
                className="px-12 py-4 rounded-[100px] min-w-[212px] h-[60px]"
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
                  <span className="flex items-center justify-center gap-2 text-[21px] font-semibold">
                    {navigation.saveAndContinue}
                    {/* Arrow after text in DOM = appears on LEFT in RTL, rotated 135deg for bottom-left */}
                    <Image
                      src="/icons/arrow-right.svg"
                      alt=""
                      width={13}
                      height={13}
                      className="rotate-[135deg] brightness-0 invert"
                    />
                  </span>
                )}
              </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QuestionnaireStep;
