"use client";

/**
 * QuestionnaireLayout Component
 *
 * Responsive layout wrapper for the V2 questionnaire.
 * Handles desktop and mobile layouts with proper header, footer, and content areas.
 */

import { motion } from "framer-motion";
import { Header } from "@/components/desktop/Header";
import { Footer } from "@/components/desktop/Footer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { MobileFooter } from "@/components/mobile/MobileFooter";
import { QuestionnaireProgress } from "./QuestionnaireProgress";
import { QuestionnaireNavigation } from "./QuestionnaireNavigation";
import type { StepId } from "./steps/types";

interface QuestionnaireLayoutProps {
  /** Current step index (0-indexed) */
  currentStepIndex: number;
  /** Total number of visible steps */
  totalSteps: number;
  /** Current step ID */
  currentStepId: StepId;
  /** Step title */
  title: string;
  /** Step subtitle */
  subtitle?: string;
  /** Whether to show back button */
  showBack?: boolean;
  /** Whether this is the last step */
  isLastStep?: boolean;
  /** Whether continue/submit is enabled */
  canContinue?: boolean;
  /** Whether form is submitting */
  isSubmitting?: boolean;
  /** Whether syncing with API */
  isSyncing?: boolean;
  /** Callback when back is clicked */
  onBack?: () => void;
  /** Callback when continue is clicked */
  onContinue: () => void;
  /** Whether mobile layout */
  isMobile: boolean;
  /** Step content */
  children: React.ReactNode;
}

/**
 * Desktop Layout
 */
function DesktopLayout({
  currentStepIndex,
  totalSteps,
  currentStepId,
  title,
  subtitle,
  showBack,
  isLastStep,
  canContinue,
  isSubmitting,
  isSyncing,
  onBack,
  onContinue,
  children,
}: Omit<QuestionnaireLayoutProps, "isMobile">): React.ReactElement {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 relative flex flex-col">
        {/* Globe Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/globe-watermark.svg"
            alt=""
            className="w-[500px] h-[500px] object-contain opacity-20"
            aria-hidden="true"
          />
        </div>

        {/* Progress Bar Section */}
        <div className="container relative z-10 pt-8">
          {/* Back Button */}
          {showBack && onBack && (
            <div className="max-w-[800px] mx-auto mb-2">
              <motion.button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 text-[#C6C6C6] hover:text-[#706F6F] transition-colors ml-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                disabled={isSubmitting || isSyncing}
              >
                <img
                  src="/icons/arrow-right.svg"
                  alt=""
                  width={13}
                  height={15}
                  className="opacity-70 rotate-45"
                />
                <span className="text-[16px] font-medium">חזור</span>
              </motion.button>
            </div>
          )}

          {/* Progress Bar */}
          <div className="max-w-[800px] mx-auto">
            <QuestionnaireProgress
              currentStepIndex={currentStepIndex}
              totalSteps={totalSteps}
              currentStepId={currentStepId}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center container relative z-10 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-[800px] w-full"
          >
            {/* Title */}
            <h1 className="text-[36px] font-medium text-[#1D1D1B] text-center mb-4 leading-[1.2]">
              {title}
            </h1>

            {/* Inner content */}
            <div className="max-w-[600px] mx-auto">
              {/* Subtitle */}
              {subtitle && (
                <p className="text-[16px] text-[#706F6F] text-center mb-10">
                  {subtitle}
                </p>
              )}

              {/* Step Content */}
              <div className="mb-14">{children}</div>

              {/* Navigation */}
              <QuestionnaireNavigation
                showBack={false}
                isLastStep={isLastStep}
                canContinue={canContinue}
                isSubmitting={isSubmitting}
                isSyncing={isSyncing}
                onBack={onBack}
                onContinue={onContinue}
                isMobile={false}
              />
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/**
 * Mobile Layout
 */
function MobileLayout({
  currentStepIndex,
  totalSteps,
  currentStepId,
  title,
  subtitle,
  showBack,
  isLastStep,
  canContinue,
  isSubmitting,
  isSyncing,
  onBack,
  onContinue,
  children,
}: Omit<QuestionnaireLayoutProps, "isMobile">): React.ReactElement {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MobileHeader />

      <main className="flex-1 px-4 pt-4 pb-6 relative flex flex-col">
        {/* Globe Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <img
            src="/globe-watermark.svg"
            alt=""
            className="w-[280px] h-[280px] object-contain opacity-20"
            aria-hidden="true"
          />
        </div>

        {/* Progress Bar Section */}
        <div className="relative z-10">
          {/* Back Button */}
          {showBack && onBack && (
            <div className="w-full mb-2">
              <motion.button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1 text-[#C6C6C6] hover:text-[#706F6F] transition-colors ml-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                disabled={isSubmitting || isSyncing}
              >
                <img
                  src="/icons/arrow-right.svg"
                  alt=""
                  width={9}
                  height={9}
                  className="opacity-70 rotate-45"
                />
                <span className="text-[12px] font-medium">חזור</span>
              </motion.button>
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full">
            <QuestionnaireProgress
              currentStepIndex={currentStepIndex}
              totalSteps={totalSteps}
              currentStepId={currentStepId}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center relative z-10 py-4 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {/* Title */}
            <h1 className="text-[16px] font-medium text-[#1D1D1B] text-center mb-3 leading-[1.3] w-full">
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

            {/* Navigation */}
            <QuestionnaireNavigation
              showBack={false}
              isLastStep={isLastStep}
              canContinue={canContinue}
              isSubmitting={isSubmitting}
              isSyncing={isSyncing}
              onBack={onBack}
              onContinue={onContinue}
              isMobile={true}
            />
          </motion.div>
        </div>
      </main>

      <MobileFooter />
    </div>
  );
}

/**
 * QuestionnaireLayout - Main export
 * Renders desktop or mobile layout based on isMobile prop
 */
export function QuestionnaireLayout({
  isMobile,
  ...props
}: QuestionnaireLayoutProps): React.ReactElement {
  return isMobile ? <MobileLayout {...props} /> : <DesktopLayout {...props} />;
}

export default QuestionnaireLayout;
