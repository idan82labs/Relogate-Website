/**
 * QuestionnaireVersionBadge Component
 *
 * Displays questionnaire schema version with optional update indicator.
 */

interface QuestionnaireVersionBadgeProps {
  version: number;
  latestVersion?: number;
  size?: "sm" | "md";
}

const CURRENT_SCHEMA_VERSION = 2;

export function QuestionnaireVersionBadge({
  version,
  latestVersion = CURRENT_SCHEMA_VERSION,
  size = "md",
}: QuestionnaireVersionBadgeProps) {
  const needsUpdate = version < latestVersion;

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center rounded-full font-medium ${sizeClasses} ${
          needsUpdate
            ? "bg-yellow-100 text-yellow-800"
            : "bg-purple-100 text-purple-800"
        }`}
      >
        V{version}
      </span>
      {needsUpdate && (
        <span className="text-xs text-yellow-600 flex items-center gap-1">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>צריך עדכון</span>
        </span>
      )}
    </div>
  );
}

