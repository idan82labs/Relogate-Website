"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Button, GlobeWatermark, QuestionProgress } from "@/components/shared";
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
  isLastStep = false,
  isSubmitting = false,
  children,
}: QuestionnaireStepProps) => {
  const router = useRouter();
  const { questionTest } = siteContent;
  const { navigation, progress } = questionTest;

  // Define sections for progress indicator
  const sections = [
    { label: progress.preferences, steps: [1, 2] },
    { label: progress.eligibility, steps: [3] },
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

      <main className="flex-1 relative">
        {/* Globe Watermark */}
        <GlobeWatermark position="center" size={600} className="top-[20%]" />

        <div className="container relative z-10 pt-8 pb-16">
          {/* Progress Bar */}
          <div className="max-w-[800px] mx-auto mb-8">
            <QuestionProgress
              currentStep={currentStep}
              totalSteps={totalSteps}
              sections={sections}
            />
          </div>

          {/* Back Button */}
          <motion.button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 text-[#C6C6C6] hover:text-[#706F6F] transition-colors mb-8 mr-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Chevron icon pointing right for RTL */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="rotate-90"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[16px]">{navigation.back}</span>
          </motion.button>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-[600px] mx-auto"
          >
            {/* Title */}
            <h1 className="text-[40px] font-medium text-[#1D1D1B] text-center mb-4 leading-[1.2]">
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-[16px] text-[#706F6F] text-center mb-8">
                {subtitle}
              </p>
            )}

            {/* Step Content */}
            <div className="mb-12">{children}</div>

            {/* Continue Button */}
            <div className="flex justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={onContinue}
                disabled={!canContinue || isSubmitting}
                className="px-12 py-4 text-[18px] rounded-[100px] min-w-[200px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
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
                ) : isLastStep ? (
                  navigation.saveAndContinue
                ) : (
                  <>
                    {navigation.continue}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="mr-2 rotate-180"
                    >
                      <path
                        d="M12.5 5L7.5 10L12.5 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QuestionnaireStep;
