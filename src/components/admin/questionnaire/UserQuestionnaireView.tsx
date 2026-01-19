"use client";

/**
 * UserQuestionnaireView Component
 *
 * Main view component for displaying user questionnaire data in admin panel.
 * Supports both V1 and V2 questionnaire formats.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuestionnaireStatusBadge } from "./QuestionnaireStatusBadge";
import { QuestionnaireVersionBadge } from "./QuestionnaireVersionBadge";
import {
  PersonalDetailsSection,
  FamilyStatusSection,
  MigrationGoalsSection,
  CitizenshipSection,
  EmploymentSection,
  IncomeSection,
  LanguagesSection,
  PreferencesSection,
  BureaucracySection,
  StudiesInvestmentsSection,
} from "./sections";
import type { AdminQuestionnaire } from "@/services/admin";

interface UserQuestionnaireViewProps {
  questionnaire: AdminQuestionnaire;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function UserQuestionnaireView({
  questionnaire,
  user,
}: UserQuestionnaireViewProps) {
  const [showRawJson, setShowRawJson] = useState(false);

  const { responses, schemaVersion, status, currentStep, createdAt, completedAt } =
    questionnaire;

  return (
    <div className="space-y-6">
      {/* Header with badges */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#1D1D1B]">
              שאלון רילוקיישן
            </h2>
            {user && (
              <p className="text-[#706F6F] mt-1">
                {user.firstName} {user.lastName} ({user.email})
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <QuestionnaireStatusBadge status={status} />
            <QuestionnaireVersionBadge version={schemaVersion || 1} />
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-[#706F6F]">שלב נוכחי:</span>
            <span className="mr-2 text-[#1D1D1B] font-medium">
              {currentStep || "-"}
            </span>
          </div>
          <div>
            <span className="text-[#706F6F]">נוצר:</span>
            <span className="mr-2 text-[#1D1D1B]">{formatDate(createdAt)}</span>
          </div>
          <div>
            <span className="text-[#706F6F]">הושלם:</span>
            <span className="mr-2 text-[#1D1D1B]">
              {formatDate(completedAt)}
            </span>
          </div>
          <div>
            <span className="text-[#706F6F]">גרסה:</span>
            <span className="mr-2 text-[#1D1D1B]">V{schemaVersion || 1}</span>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        <PersonalDetailsSection
          responses={responses}
          schemaVersion={schemaVersion || 1}
        />

        <FamilyStatusSection
          responses={responses}
          schemaVersion={schemaVersion || 1}
        />

        <MigrationGoalsSection
          responses={responses}
          schemaVersion={schemaVersion || 1}
        />

        <CitizenshipSection
          responses={responses}
          schemaVersion={schemaVersion || 1}
        />

        <EmploymentSection responses={responses} />

        <IncomeSection responses={responses} />

        <LanguagesSection responses={responses} />

        <StudiesInvestmentsSection responses={responses} />

        <PreferencesSection responses={responses} />

        <BureaucracySection responses={responses} />
      </div>

      {/* Raw JSON Debug Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setShowRawJson(!showRawJson)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F7F7F7] transition-colors"
        >
          <span className="font-medium text-[#706F6F]">נתונים גולמיים (JSON)</span>
          <motion.svg
            animate={{ rotate: showRawJson ? 180 : 0 }}
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
          {showRawJson && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-6 pb-6">
                <pre
                  className="bg-[#1D1D1B] text-green-400 p-4 rounded-lg text-xs overflow-x-auto max-h-96"
                  dir="ltr"
                >
                  {JSON.stringify(responses, null, 2)}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

