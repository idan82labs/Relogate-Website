"use client";

/**
 * CitizenshipStep Component
 *
 * Step 4: Collects citizenship information for the user and optionally
 * their partner. Uses multi-select with max 3 citizenships each.
 */

import { motion, AnimatePresence } from "framer-motion";
import { getQuestionnaireStepContent, getCountryOptions } from "@/locales/compat";
import { MultiSelectField } from "@/components/questionnaire/fields";
import { hasPartner } from "@/types/questionnaire";
import type { StepProps } from "./types";

const content = getQuestionnaireStepContent().citizenship;
const countryOptions = getCountryOptions();

export function CitizenshipStep({
  data,
  onChange,
  errors = {},
  isSubmitting = false,
}: StepProps): React.ReactElement {
  const showPartnerCitizenships = hasPartner(data.familyStatus);

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
        className="space-y-6"
      >
        {/* User Citizenships */}
        <MultiSelectField
          name="citizenships"
          label={content.fields.citizenships.label}
          values={data.citizenships || []}
          onChange={(values) => onChange({ citizenships: values })}
          options={countryOptions}
          maxSelections={content.fields.citizenships.maxSelections}
          hint={content.fields.citizenships.hint}
          variant="button"
          columns={2}
          error={errors.citizenships}
          required
          disabled={isSubmitting}
        />

        {/* Partner Citizenships (conditional) */}
        <AnimatePresence>
          {showPartnerCitizenships && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MultiSelectField
                name="partnerCitizenships"
                label={content.fields.partnerCitizenships.label}
                values={data.partnerCitizenships || []}
                onChange={(values) =>
                  onChange({ partnerCitizenships: values })
                }
                options={countryOptions}
                maxSelections={content.fields.partnerCitizenships.maxSelections}
                hint={content.fields.partnerCitizenships.hint}
                variant="button"
                columns={2}
                error={errors.partnerCitizenships}
                disabled={isSubmitting}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
