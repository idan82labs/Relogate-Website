/**
 * CitizenshipSection Component
 *
 * Displays citizenship and residence information.
 */

import { QuestionnaireSection } from "../QuestionnaireSection";
import { QuestionnaireField } from "../QuestionnaireField";

interface CitizenshipSectionProps {
  responses: Record<string, unknown>;
  schemaVersion: number;
}

export function CitizenshipSection({
  responses,
  schemaVersion,
}: CitizenshipSectionProps) {
  // V1 has citizenship (string), V2 has citizenships (array)
  const citizenships = responses.citizenships as string[] | undefined;

  // Extract from V1 nested personalDetails
  const personalDetails =
    schemaVersion === 1 && responses.personalDetails
      ? (responses.personalDetails as Record<string, unknown>)
      : responses;

  const v1Citizenship = personalDetails.citizenship as string | undefined;
  const v1AdditionalCitizenship = personalDetails.additionalCitizenship as
    | string
    | undefined;

  // Build citizenships list for V1
  const allCitizenships =
    schemaVersion === 1
      ? [v1Citizenship, v1AdditionalCitizenship].filter(Boolean)
      : citizenships;

  const completionStatus =
    allCitizenships && allCitizenships.length > 0 ? "complete" : "empty";

  return (
    <QuestionnaireSection title="אזרחות" completionStatus={completionStatus}>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuestionnaireField label="אזרחויות" value={allCitizenships} />
        <QuestionnaireField
          label="זכאות לאזרחות נוספת"
          value={responses.eligibleForAdditionalCitizenship}
        />
        <QuestionnaireField
          label="פרטי זכאות"
          value={responses.additionalCitizenshipDetails}
        />
      </dl>
    </QuestionnaireSection>
  );
}

