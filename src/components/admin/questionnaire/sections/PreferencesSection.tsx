/**
 * PreferencesSection Component
 *
 * Displays relocation preferences (climate, community, etc.).
 */

import { QuestionnaireSection } from "../QuestionnaireSection";
import { QuestionnaireField } from "../QuestionnaireField";

interface PreferencesSectionProps {
  responses: Record<string, unknown>;
}

export function PreferencesSection({ responses }: PreferencesSectionProps) {
  const weatherPreference = responses.weatherPreference as string | undefined;
  const livingType = responses.livingType as string | undefined;
  const jewishCommunityImportance = responses.jewishCommunityImportance as
    | string
    | undefined;
  const israeliCommunityImportance = responses.israeliCommunityImportance as
    | string
    | undefined;

  const hasPreferences =
    weatherPreference ||
    livingType ||
    jewishCommunityImportance ||
    israeliCommunityImportance;
  const completionStatus = hasPreferences ? "complete" : "empty";

  return (
    <QuestionnaireSection title="העדפות" completionStatus={completionStatus}>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuestionnaireField
          label="מרחק מישראל"
          value={responses.distanceFromIsrael}
          fieldName="distanceFromIsrael"
        />
        <QuestionnaireField
          label="הפרש אזור זמן"
          value={responses.timeZoneDifference}
          fieldName="timeZoneDifference"
        />
        <QuestionnaireField
          label="העדפת מזג אוויר"
          value={weatherPreference}
          fieldName="weatherPreference"
        />
        <QuestionnaireField
          label="סוג מגורים"
          value={livingType}
          fieldName="livingType"
        />
        <QuestionnaireField
          label="חשיבות קהילה יהודית"
          value={jewishCommunityImportance}
          fieldName="jewishCommunityImportance"
        />
        <QuestionnaireField
          label="חשיבות קהילה ישראלית"
          value={israeliCommunityImportance}
          fieldName="israeliCommunityImportance"
        />
      </dl>
    </QuestionnaireSection>
  );
}

