/**
 * BureaucracySection Component
 *
 * Displays bureaucratic information (visa attempts, criminal record, etc.).
 */

import { QuestionnaireSection } from "../QuestionnaireSection";
import { QuestionnaireField } from "../QuestionnaireField";

interface BureaucracySectionProps {
  responses: Record<string, unknown>;
}

export function BureaucracySection({ responses }: BureaucracySectionProps) {
  const hasPreviousVisaAttempt = responses.previousVisaAttempt !== undefined;
  const hasCriminalRecord = responses.hasCriminalRecord !== undefined;

  const completionStatus =
    hasPreviousVisaAttempt || hasCriminalRecord ? "complete" : "empty";

  return (
    <QuestionnaireSection
      title="ביורוקרטיה"
      completionStatus={completionStatus}
    >
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuestionnaireField
          label="ניסיון קודם לקבלת ויזה"
          value={responses.previousVisaAttempt}
          fieldName="previousVisaAttempt"
        />
        {/* Free text - no translation */}
        <QuestionnaireField
          label="פרטי ניסיון קודם"
          value={responses.previousVisaDetails}
        />
        <QuestionnaireField
          label="רקע פלילי"
          value={responses.hasCriminalRecord}
          fieldName="hasCriminalRecord"
        />
        {/* Free text - no translation */}
        <QuestionnaireField
          label="פרטי רקע פלילי"
          value={responses.criminalRecordDetails}
        />
      </dl>
    </QuestionnaireSection>
  );
}

