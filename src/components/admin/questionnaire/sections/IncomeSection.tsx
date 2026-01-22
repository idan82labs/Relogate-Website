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

export function IncomeSection({ responses }: IncomeSectionProps) {
  const householdIncome = responses.householdIncome as string | undefined;
  const passiveIncomeAmount = responses.passiveIncomeAmount as string | undefined;

  const completionStatus =
    householdIncome || passiveIncomeAmount || responses.hasPassiveIncome !== undefined
      ? "complete"
      : "empty";

  return (
    <QuestionnaireSection title="הכנסות" completionStatus={completionStatus}>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuestionnaireField
          label="הכנסת משק בית"
          value={householdIncome}
          fieldName="householdIncome"
        />
        <QuestionnaireField
          label="הכנסה פסיבית"
          value={responses.hasPassiveIncome}
        />
        <QuestionnaireField
          label="גובה הכנסה פסיבית"
          value={passiveIncomeAmount}
          fieldName="passiveIncomeAmount"
        />
      </dl>
    </QuestionnaireSection>
  );
}

