/**
 * IncomeSection Component
 *
 * Displays financial and income information.
 */

import { QuestionnaireSection } from "../QuestionnaireSection";
import { QuestionnaireField } from "../QuestionnaireField";

interface IncomeSectionProps {
  responses: Record<string, unknown>;
}

const INCOME_RANGE_LABELS: Record<string, string> = {
  under_10k: "עד 10,000 ₪",
  "10k_20k": "10,000 - 20,000 ₪",
  "20k_35k": "20,000 - 35,000 ₪",
  "35k_50k": "35,000 - 50,000 ₪",
  "50k_75k": "50,000 - 75,000 ₪",
  over_75k: "מעל 75,000 ₪",
};

const SAVINGS_RANGE_LABELS: Record<string, string> = {
  under_50k: "עד 50,000 $",
  "50k_100k": "50,000 - 100,000 $",
  "100k_250k": "100,000 - 250,000 $",
  "250k_500k": "250,000 - 500,000 $",
  over_500k: "מעל 500,000 $",
};

export function IncomeSection({ responses }: IncomeSectionProps) {
  const householdIncome = responses.householdIncome as string | undefined;
  const savings = responses.savings as string | undefined;

  const completionStatus =
    householdIncome || savings || responses.hasPassiveIncome !== undefined
      ? "complete"
      : "empty";

  return (
    <QuestionnaireSection title="הכנסות" completionStatus={completionStatus}>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuestionnaireField
          label="הכנסת משק בית"
          value={
            householdIncome
              ? INCOME_RANGE_LABELS[householdIncome] || householdIncome
              : undefined
          }
        />
        <QuestionnaireField
          label="הכנסה פסיבית"
          value={responses.hasPassiveIncome}
        />
        <QuestionnaireField
          label="פרטי הכנסה פסיבית"
          value={responses.passiveIncomeDetails}
        />
        <QuestionnaireField
          label="חסכונות"
          value={
            savings ? SAVINGS_RANGE_LABELS[savings] || savings : undefined
          }
        />
      </dl>
    </QuestionnaireSection>
  );
}

