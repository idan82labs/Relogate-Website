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

const FAMILY_STATUS_LABELS: Record<string, string> = {
  single: "רווק/ה",
  married: "נשוי/אה",
  married_no_children: "נשוי/אה ללא ילדים",
  married_with_children: "נשוי/אה עם ילדים",
  common_law: "ידוע/ה בציבור",
  divorced: "גרוש/ה",
  divorced_no_children: "גרוש/ה ללא ילדים",
  divorced_with_children: "גרוש/ה עם ילדים",
  widowed: "אלמן/ה",
  widowed_no_children: "אלמן/ה ללא ילדים",
  widowed_with_children: "אלמן/ה עם ילדים",
};

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
          value={
            familyStatus
              ? FAMILY_STATUS_LABELS[familyStatus] || familyStatus
              : undefined
          }
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
            />
          </>
        )}
      </dl>
    </QuestionnaireSection>
  );
}

