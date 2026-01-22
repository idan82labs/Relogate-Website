/**
 * MigrationGoalsSection Component
 *
 * Displays relocation reasons and preferred countries.
 */

import { QuestionnaireSection } from "../QuestionnaireSection";
import { QuestionnaireField } from "../QuestionnaireField";

interface MigrationGoalsSectionProps {
  responses: Record<string, unknown>;
  schemaVersion: number;
}

export function MigrationGoalsSection({
  responses,
  schemaVersion,
}: MigrationGoalsSectionProps) {
  // V1 has relocationReason (string), V2 has relocationReasons (array)
  const relocationReason = responses.relocationReason as string | undefined;
  const relocationReasons = responses.relocationReasons as string[] | undefined;
  const preferredCountries = responses.preferredCountries as
    | string[]
    | undefined;

  // Determine completion
  const hasReasons =
    (relocationReason && relocationReason.length > 0) ||
    (relocationReasons && relocationReasons.length > 0);
  const hasCountries = preferredCountries && preferredCountries.length > 0;
  const completionStatus =
    hasReasons && hasCountries
      ? "complete"
      : hasReasons || hasCountries
        ? "partial"
        : "empty";

  return (
    <QuestionnaireSection
      title="מטרות רילוקיישן"
      completionStatus={completionStatus}
    >
      <dl className="grid grid-cols-1 gap-4">
        <QuestionnaireField
          label="סיבות הרילוקיישן"
          value={schemaVersion === 1 ? relocationReason : relocationReasons}
          fieldName="relocationReasons"
        />
        <QuestionnaireField
          label="מדינות מועדפות"
          value={preferredCountries}
          fieldName="citizenships"
        />
        {schemaVersion === 1 && relocationReason && (
          <QuestionnaireField
            label="סיבה (טקסט חופשי)"
            value={relocationReason}
          />
        )}
      </dl>
    </QuestionnaireSection>
  );
}

