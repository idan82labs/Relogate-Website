"use client";

/**
 * IntroStep Component
 *
 * Welcome screen for the questionnaire. Introduces the user to
 * the process and sets expectations before they begin.
 */

import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import type { StepProps } from "./types";

const content = siteContent.questionnaireV2;

export function IntroStep({ isSubmitting }: StepProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#215388]/10 flex items-center justify-center"
        >
          <svg
            className="w-10 h-10 text-[#215388]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl font-bold text-[#1D1D1B] mb-4"
        >
          {content.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-[#706F6F] mb-8 leading-relaxed"
        >
          {content.subtitle}
        </motion.p>

        {/* Progress preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center gap-4 text-sm text-[#706F6F]"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#215388]" />
            <span>{content.progress.personalInfo}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#239083]" />
            <span>{content.progress.goals}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#203170]" />
            <span>{content.progress.preferences}</span>
          </div>
        </motion.div>
      </motion.div>

      {isSubmitting && (
        <div className="mt-4 text-[#706F6F]">
          <span className="animate-pulse">...</span>
        </div>
      )}
    </div>
  );
}
