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

const RELOCATION_REASON_LABELS: Record<string, string> = {
  economic_quality_of_life: "איכות חיים כלכלית",
  personal_security: "ביטחון אישי",
  better_education: "חינוך טוב יותר",
  better_future_for_family: "עתיד טוב יותר למשפחה",
  professional_development: "התפתחות מקצועית",
  real_estate_opportunity: "הזדמנות נדל״ן",
  academic_opportunity: "הזדמנות אקדמית",
  adventure: "הרפתקה",
  life_change: "שינוי בחיים",
  just_exploring: "רק בודק/ת אפשרויות",
};

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

  // Format relocation reasons
  const formattedReasons =
    schemaVersion === 1
      ? relocationReason
      : relocationReasons?.map(
          (reason) => RELOCATION_REASON_LABELS[reason] || reason
        );

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
          value={formattedReasons}
        />
        <QuestionnaireField
          label="מדינות מועדפות"
          value={preferredCountries}
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

export default MigrationGoalsSection;
