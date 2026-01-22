/**
 * FamilyStatusSection Component
 *
 * Displays family status and spouse details.
 */

import { QuestionnaireSection } from "../QuestionnaireSection";
import { QuestionnaireField } from "../QuestionnaireField";

interface FamilyStatusSectionProps {
  responses: Record<string, unknown>;
  schemaVersion: number;
}

export function FamilyStatusSection({
  responses,
  schemaVersion,
}: FamilyStatusSectionProps) {
  const familyStatus = responses.familyStatus as string | undefined;

  // Handle V1 spouse details (nested under spouseDetails)
  const spouseDetails =
    schemaVersion === 1 && responses.spouseDetails
      ? (responses.spouseDetails as Record<string, unknown>)
      : responses;

  const showSpouseFields =
    familyStatus === "married" ||
    familyStatus === "married_no_children" ||
    familyStatus === "married_with_children" ||
    familyStatus === "common_law";

  const completionStatus = familyStatus ? "complete" : "empty";

  return (
    <QuestionnaireSection
      title="מצב משפחתי"
      completionStatus={completionStatus}
    >
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuestionnaireField
          label="מצב משפחתי"
          value={familyStatus}
          fieldName="familyStatus"
        />
        <QuestionnaireField
          label="מספר ילדים"
          value={responses.numberOfChildren}
        />
        {showSpouseFields && (
          <>
            <QuestionnaireField
              label="תאריך לידה של בן/בת הזוג"
              value={
                schemaVersion === 1
                  ? spouseDetails.birthDate
                  : responses.partnerBirthDate
              }
            />
            <QuestionnaireField
              label="אזרחות בן/בת הזוג"
              value={
                schemaVersion === 1
                  ? spouseDetails.citizenship
                  : responses.partnerCitizenships
              }
              fieldName="citizenships"
            />
          </>
        )}
      </dl>
    </QuestionnaireSection>
  );
}

