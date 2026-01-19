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

const EMPLOYMENT_STATUS_LABELS: Record<string, string> = {
  employed: "שכיר",
  self_employed: "עצמאי",
  business_owner: "בעל עסק",
  unemployed: "לא עובד/ת",
  student: "סטודנט/ית",
  retired: "פנסיונר/ית",
};

const EDUCATION_LEVEL_LABELS: Record<string, string> = {
  high_school: "תיכונית",
  vocational: "מקצועית",
  bachelor: "תואר ראשון",
  master: "תואר שני",
  doctorate: "דוקטורט",
  other: "אחר",
};

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
          value={
            employmentStatus
              ? EMPLOYMENT_STATUS_LABELS[employmentStatus] || employmentStatus
              : undefined
          }
        />
        <QuestionnaireField label="מקצוע" value={responses.profession} />
        <QuestionnaireField
          label="יכולת עבודה מרחוק"
          value={responses.remoteWorkCapable}
        />
        <QuestionnaireField
          label="רמת השכלה"
          value={
            educationLevel
              ? EDUCATION_LEVEL_LABELS[educationLevel] || educationLevel
              : undefined
          }
        />
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

