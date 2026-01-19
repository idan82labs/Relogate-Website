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

const WEATHER_PREFERENCE_LABELS: Record<string, string> = {
  warm: "חם",
  cold: "קר",
  moderate: "ממוזג",
  no_preference: "אין העדפה",
};

const LIVING_TYPE_LABELS: Record<string, string> = {
  city: "עיר גדולה",
  suburb: "פרבר",
  small_town: "עיירה קטנה",
  rural: "כפרי",
  no_preference: "אין העדפה",
};

const IMPORTANCE_LABELS: Record<string, string> = {
  not_important: "לא חשוב",
  somewhat_important: "קצת חשוב",
  important: "חשוב",
  very_important: "מאוד חשוב",
};

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
        />
        <QuestionnaireField
          label="הפרש אזור זמן"
          value={responses.timeZoneDifference}
        />
        <QuestionnaireField
          label="העדפת מזג אוויר"
          value={
            weatherPreference
              ? WEATHER_PREFERENCE_LABELS[weatherPreference] ||
                weatherPreference
              : undefined
          }
        />
        <QuestionnaireField
          label="סוג מגורים"
          value={
            livingType
              ? LIVING_TYPE_LABELS[livingType] || livingType
              : undefined
          }
        />
        <QuestionnaireField
          label="חשיבות קהילה יהודית"
          value={
            jewishCommunityImportance
              ? IMPORTANCE_LABELS[jewishCommunityImportance] ||
                jewishCommunityImportance
              : undefined
          }
        />
        <QuestionnaireField
          label="חשיבות קהילה ישראלית"
          value={
            israeliCommunityImportance
              ? IMPORTANCE_LABELS[israeliCommunityImportance] ||
                israeliCommunityImportance
              : undefined
          }
        />
      </dl>
    </QuestionnaireSection>
  );
}

