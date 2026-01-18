"use client";

/**
 * RelocationGoalsStep Component
 *
 * Step 3: Collects the user's main reasons for considering relocation.
 * Uses multi-select checkboxes for choosing multiple reasons.
 */

import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { MultiSelectField } from "@/components/questionnaire/fields";
import type { StepProps } from "./types";
import type { RelocationReason } from "@/types/questionnaire";

const content = siteContent.questionnaireV2.steps.relocationGoals;

export function RelocationGoalsStep({
  data,
  onChange,
  errors = {},
  isSubmitting = false,
}: StepProps): React.ReactElement {
  const handleChange = (values: string[]) => {
    onChange({ relocationReasons: values as RelocationReason[] });
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
      >
        <MultiSelectField
          name="relocationReasons"
          label={content.fields.relocationReasons.label}
          values={data.relocationReasons || []}
          onChange={handleChange}
          options={content.fields.relocationReasons.options}
          hint={content.hint}
          variant="checkbox"
          columns={1}
          error={errors.relocationReasons}
          disabled={isSubmitting}
        />
      </motion.div>
    </div>
  );
}
