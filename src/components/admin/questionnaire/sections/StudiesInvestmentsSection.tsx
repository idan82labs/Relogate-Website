/**
 * StudiesInvestmentsSection Component
 *
 * Displays study abroad and investment preferences.
 */

import { QuestionnaireSection } from "../QuestionnaireSection";
import { QuestionnaireField } from "../QuestionnaireField";

interface StudiesInvestmentsSectionProps {
  responses: Record<string, unknown>;
}

export function StudiesInvestmentsSection({
  responses,
}: StudiesInvestmentsSectionProps) {
  const hasOpenToStudying = responses.openToStudyingAbroad !== undefined;
  const hasWillingToInvest = responses.willingToInvestInProperty !== undefined;

  const completionStatus =
    hasOpenToStudying || hasWillingToInvest ? "complete" : "empty";

  return (
    <QuestionnaireSection
      title="לימודים והשקעות"
      completionStatus={completionStatus}
    >
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuestionnaireField
          label="פתוח/ה ללימודים בחו״ל"
          value={responses.openToStudyingAbroad}
        />
        <QuestionnaireField
          label="תחומי עניין ללימודים"
          value={responses.studyInterests}
        />
        <QuestionnaireField
          label="מעוניין/ת להשקיע בנדל״ן"
          value={responses.willingToInvestInProperty}
        />
        <QuestionnaireField
          label="תקציב השקעה"
          value={responses.investmentBudget}
        />
      </dl>
    </QuestionnaireSection>
  );
}

export default StudiesInvestmentsSection;
