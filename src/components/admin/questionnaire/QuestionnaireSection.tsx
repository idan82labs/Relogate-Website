"use client";

/**
 * QuestionnaireSection Component
 *
 * Collapsible section wrapper for questionnaire data groups.
 * Shows completion indicator and expand/collapse functionality.
 */

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionnaireSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  completionStatus?: "complete" | "partial" | "empty";
}

function CompletionIndicator({
  status,
}: {
  status: "complete" | "partial" | "empty";
}) {
  const colors = {
    complete: "bg-green-500",
    partial: "bg-yellow-500",
    empty: "bg-gray-300",
  };

  const labels = {
    complete: "מלא",
    partial: "חלקי",
    empty: "ריק",
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-2 h-2 rounded-full ${colors[status]}`}
        aria-hidden="true"
      />
      <span className="text-xs text-[#706F6F]">{labels[status]}</span>
    </div>
  );
}

export function QuestionnaireSection({
  title,
  children,
  defaultOpen = true,
  completionStatus,
}: QuestionnaireSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-[#C6C6C6] rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#F7F7F7] hover:bg-[#F0F0F0] transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-[#1D1D1B]">{title}</h3>
          {completionStatus && (
            <CompletionIndicator status={completionStatus} />
          )}
        </div>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-[#706F6F]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 bg-white">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default QuestionnaireSection;
