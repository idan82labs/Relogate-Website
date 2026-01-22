"use client";

/**
 * QuestionnaireNavigation Component
 *
 * Navigation controls for the V2 questionnaire.
 * Back button, Continue/Submit button with loading states.
 */

import Image from "next/image";
import { motion } from "framer-motion";
import { getQuestionnaireNavigation } from "@/locales/compat";
import { Button } from "@/components/shared";

interface QuestionnaireNavigationProps {
  /** Whether back button should be shown */
  showBack?: boolean;
  /** Whether this is the last step (shows Submit instead of Continue) */
  isLastStep?: boolean;
  /** Whether the continue/submit button should be enabled */
  canContinue?: boolean;
  /** Whether form is submitting */
  isSubmitting?: boolean;
  /** Whether syncing with API */
  isSyncing?: boolean;
  /** Callback when back is clicked */
  onBack?: () => void;
  /** Callback when continue/submit is clicked */
  onContinue: () => void;
  /** Whether mobile layout */
  isMobile?: boolean;
  /** Optional class name */
  className?: string;
}

const content = getQuestionnaireNavigation();

/**
 * Spinner Component
 */
function LoadingSpinner(): React.ReactElement {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
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
  );
}

/**
 * QuestionnaireNavigation - Navigation buttons for the questionnaire
 */
export function QuestionnaireNavigation({
  showBack = true,
  isLastStep = false,
  canContinue = true,
  isSubmitting = false,
  isSyncing = false,
  onBack,
  onContinue,
  isMobile = false,
  className = "",
}: QuestionnaireNavigationProps): React.ReactElement {
  const isLoading = isSubmitting || isSyncing;
  const buttonText = isLastStep ? content.submit : content.saveAndContinue;
  const loadingText = isSubmitting ? "שולח..." : "שומר...";

  return (
    <div className={`${className}`}>
      {/* Back Button - Above the progress bar in desktop, inline in mobile */}
      {showBack && onBack && !isMobile && (
        <motion.button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-[#C6C6C6] hover:text-[#706F6F] transition-colors mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          disabled={isLoading}
        >
          <Image
            src="/icons/arrow-right.svg"
            alt=""
            width={isMobile ? 9 : 13}
            height={isMobile ? 9 : 15}
            className="opacity-70 rotate-45"
          />
          <span
            className={`font-medium ${isMobile ? "text-[12px]" : "text-[16px]"}`}
          >
            {content.back}
          </span>
        </motion.button>
      )}

      {/* Continue/Submit Button */}
      <div className={`flex ${isMobile ? "flex-col gap-3" : "justify-center"}`}>
        {/* Mobile back button */}
        {showBack && onBack && isMobile && (
          <motion.button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center gap-1 text-[#C6C6C6] hover:text-[#706F6F] transition-colors py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            disabled={isLoading}
          >
            <Image
              src="/icons/arrow-right.svg"
              alt=""
              width={9}
              height={9}
              className="opacity-70 rotate-45"
            />
            <span className="text-[12px] font-medium">{content.back}</span>
          </motion.button>
        )}

        <Button
          variant="primary"
          size={isMobile ? "md" : "lg"}
          fullWidth={isMobile}
          onClick={onContinue}
          disabled={!canContinue || isLoading}
          className={`rounded-[100px] ${
            isMobile
              ? "h-[50px]"
              : "px-12 py-4 min-w-[212px] h-[60px]"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingSpinner />
              {loadingText}
            </span>
          ) : (
            <span
              className={`flex items-center justify-center gap-2 font-semibold ${
                isMobile ? "text-[16px]" : "text-[21px]"
              }`}
            >
              {buttonText}
              <Image
                src="/icons/arrow-right.svg"
                alt=""
                width={isMobile ? 9 : 13}
                height={isMobile ? 9 : 13}
                className="rotate-[135deg] brightness-0 invert"
              />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

