/**
 * QuestionnaireStatusBadge Component
 *
 * Displays questionnaire status (in_progress, completed, archived).
 */

type QuestionnaireStatus = "in_progress" | "completed" | "archived";

interface QuestionnaireStatusBadgeProps {
  status: QuestionnaireStatus;
  size?: "sm" | "md";
}

const STATUS_CONFIG: Record<
  QuestionnaireStatus,
  { label: string; colors: string }
> = {
  in_progress: {
    label: "בתהליך",
    colors: "bg-blue-100 text-blue-800",
  },
  completed: {
    label: "הושלם",
    colors: "bg-green-100 text-green-800",
  },
  archived: {
    label: "בארכיון",
    colors: "bg-gray-100 text-gray-800",
  },
};

export function QuestionnaireStatusBadge({
  status,
  size = "md",
}: QuestionnaireStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.colors} ${sizeClasses}`}
    >
      {config.label}
    </span>
  );
}

