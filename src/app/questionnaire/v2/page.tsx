"use client";

/**
 * QuestionnaireV2 Page
 *
 * Main entry point for the new 10-step questionnaire flow.
 * Supports both new questionnaires and update mode for schema migrations.
 */

import { Questionnaire } from "@/components/questionnaire";

export default function QuestionnaireV2Page() {
  return <Questionnaire mode="new" redirectUrl="/personal-area" />;
}
