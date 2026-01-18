"use client";

/**
 * IncomeStep Component
 *
 * Step 6: Collects household income and passive income information.
 * Shows passive income amount field conditionally when user has passive income.
 */

import { motion, AnimatePresence } from "framer-motion";
import { siteContent } from "@/content/he";
import { SelectField, RadioGroupField } from "@/components/questionnaire/fields";
import type { StepProps } from "./types";
import type { IncomeRange, PassiveIncomeRange } from "@/types/questionnaire";

const content = siteContent.questionnaireV2.steps.income;

export function IncomeStep({
  data,
  onChange,
  errors = {},
  isSubmitting = false,
}: StepProps): React.ReactElement {
  // Convert boolean options to string options for RadioGroupField
  const hasPassiveIncomeOptions = content.fields.hasPassiveIncome.options.map(
    (opt) => ({
      value: String(opt.value),
      label: opt.label,
    })
  );

  const handleHasPassiveIncomeChange = (value: string) => {
    const hasPassive = value === "true";
    onChange({
      hasPassiveIncome: hasPassive,
      // Clear passive income amount when setting to "no"
      ...(hasPassive ? {} : { passiveIncomeAmount: undefined }),
    });
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-8"
      >
        <h2 className="text-xl font-bold text-[#1D1D1B] mb-2">
          {content.title}
        </h2>
        <p className="text-[#706F6F] text-sm">{content.subtitle}</p>
      </motion.div>

      {/* Fields */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-4"
      >
        {/* Household Income */}
        <SelectField
          name="householdIncome"
          label={content.fields.householdIncome.label}
          placeholder={content.fields.householdIncome.placeholder}
          value={data.householdIncome || ""}
          onChange={(value) =>
            onChange({ householdIncome: value as IncomeRange })
          }
          options={content.fields.householdIncome.options}
          required={content.fields.householdIncome.required}
          error={errors.householdIncome}
          disabled={isSubmitting}
        />

        {/* Has Passive Income */}
        <RadioGroupField
          name="hasPassiveIncome"
          label={content.fields.hasPassiveIncome.label}
          value={
            data.hasPassiveIncome === undefined
              ? ""
              : String(data.hasPassiveIncome)
          }
          onChange={handleHasPassiveIncomeChange}
          options={hasPassiveIncomeOptions}
          direction="horizontal"
          error={errors.hasPassiveIncome}
          disabled={isSubmitting}
        />

        {/* Passive Income Amount (conditional) */}
        <AnimatePresence>
          {data.hasPassiveIncome === true && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SelectField
                name="passiveIncomeAmount"
                label={content.fields.passiveIncomeAmount.label}
                placeholder={content.fields.passiveIncomeAmount.placeholder}
                value={data.passiveIncomeAmount || ""}
                onChange={(value) =>
                  onChange({ passiveIncomeAmount: value as PassiveIncomeRange })
                }
                options={content.fields.passiveIncomeAmount.options}
                error={errors.passiveIncomeAmount}
                disabled={isSubmitting}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
