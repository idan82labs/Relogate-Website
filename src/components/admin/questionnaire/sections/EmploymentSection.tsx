/**
 * EmploymentSection Component
 *
 * Displays employment and education information.
 */

import { QuestionnaireSection } from "../QuestionnaireSection";
import { QuestionnaireField } from "../QuestionnaireField";

interface EmploymentSectionProps {
  responses: Record<string, unknown>;
}

export function EmploymentSection({ responses }: EmploymentSectionProps) {
  const employmentStatus = responses.employmentStatus as string | undefined;
  const educationLevel = responses.educationLevel as string | undefined;

  const completionStatus =
    employmentStatus || educationLevel
      ? employmentStatus && educationLevel
        ? "complete"
        : "partial"
      : "empty";

  return (
    <QuestionnaireSection
      title="תעסוקה והשכלה"
      completionStatus={completionStatus}
    >
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuestionnaireField
          label="סטטוס תעסוקה"
          value={employmentStatus}
          fieldName="employmentStatus"
        />
        {/* Profession is free text - no translation */}
        <QuestionnaireField label="מקצוע" value={responses.profession} />
        <QuestionnaireField
          label="יכולת עבודה מרחוק"
          value={responses.remoteWorkCapable}
        />
        <QuestionnaireField
          label="רמת השכלה"
          value={educationLevel}
          fieldName="education"
        />
        {/* Field of study is free text - no translation */}
        <QuestionnaireField
          label="תחום לימודים"
          value={responses.fieldOfStudy}
        />
        <QuestionnaireField
          label="שנות ניסיון"
          value={responses.yearsOfExperience}
        />
      </dl>
    </QuestionnaireSection>
  );
}

