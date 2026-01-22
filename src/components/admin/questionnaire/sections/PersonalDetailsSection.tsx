/**
 * PersonalDetailsSection Component
 *
 * Displays personal details from questionnaire responses.
 * Handles both V1 (nested personalDetails) and V2 (flat) formats.
 */

import { QuestionnaireSection } from "../QuestionnaireSection";
import { QuestionnaireField } from "../QuestionnaireField";

interface PersonalDetailsSectionProps {
  responses: Record<string, unknown>;
  schemaVersion: number;
}

const FIELD_LABELS: Record<string, string> = {
  fullName: "שם מלא",
  email: "אימייל",
  phone: "טלפון",
  birthDate: "תאריך לידה",
  citizenship: "אזרחות",
  additionalCitizenship: "אזרחות נוספת",
  residenceCountry: "ארץ מגורים",
};

// Fields that contain country codes and need translation
const COUNTRY_FIELDS = ["citizenship", "additionalCitizenship", "residenceCountry"];

export function PersonalDetailsSection({
  responses,
  schemaVersion,
}: PersonalDetailsSectionProps) {
  // Handle V1 nested format
  const personalDetails =
    schemaVersion === 1 && responses.personalDetails
      ? (responses.personalDetails as Record<string, unknown>)
      : responses;

  // Fields to display - personal text fields don't need translation
  const fields = [
    { key: "fullName", value: personalDetails.fullName },
    { key: "email", value: personalDetails.email },
    { key: "phone", value: personalDetails.phone },
    { key: "birthDate", value: personalDetails.birthDate },
    { key: "citizenship", value: personalDetails.citizenship },
    { key: "additionalCitizenship", value: personalDetails.additionalCitizenship },
    { key: "residenceCountry", value: personalDetails.residenceCountry },
  ];

  // Calculate completion status
  const requiredFields = ["fullName", "email", "phone", "birthDate"];
  const filledRequired = requiredFields.filter(
    (key) => personalDetails[key] !== undefined && personalDetails[key] !== ""
  ).length;
  const completionStatus =
    filledRequired === requiredFields.length
      ? "complete"
      : filledRequired > 0
        ? "partial"
        : "empty";

  return (
    <QuestionnaireSection
      title="פרטים אישיים"
      completionStatus={completionStatus}
    >
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, value }) => (
          <QuestionnaireField
            key={key}
            label={FIELD_LABELS[key] || key}
            value={value}
            fieldName={COUNTRY_FIELDS.includes(key) ? "citizenships" : undefined}
          />
        ))}
      </dl>
    </QuestionnaireSection>
  );
}

