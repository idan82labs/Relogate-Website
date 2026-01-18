"use client";

/**
 * Questionnaire Update Page
 *
 * Entry point for updating an existing questionnaire with new fields.
 * Used when schema migrations add new required fields.
 */

import { Questionnaire } from "@/components/questionnaire";

export default function QuestionnaireUpdatePage() {
  return <Questionnaire mode="update" redirectUrl="/personal-area" />;
}
