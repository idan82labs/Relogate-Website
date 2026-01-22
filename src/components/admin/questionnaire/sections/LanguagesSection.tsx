/**
 * LanguagesSection Component
 *
 * Displays language abilities and study preferences.
 */

import { QuestionnaireSection } from "../QuestionnaireSection";
import { QuestionnaireField } from "../QuestionnaireField";

interface LanguagesSectionProps {
  responses: Record<string, unknown>;
}

export function LanguagesSection({ responses }: LanguagesSectionProps) {
  const speakingLanguages = responses.speakingLanguages as string[] | undefined;
  const writingLanguages = responses.writingLanguages as string[] | undefined;

  const completionStatus =
    (speakingLanguages && speakingLanguages.length > 0) ||
    (writingLanguages && writingLanguages.length > 0)
      ? "complete"
      : "empty";

  return (
    <QuestionnaireSection title="שפות" completionStatus={completionStatus}>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuestionnaireField label="שפות דיבור" value={speakingLanguages} fieldName="speakingLanguages" />
        <QuestionnaireField label="שפות כתיבה" value={writingLanguages} fieldName="writingLanguages" />
        <QuestionnaireField
          label="פתוח/ה ללמוד שפה חדשה"
          value={responses.willingToLearnLanguage}
        />
      </dl>
    </QuestionnaireSection>
  );
}

