"use client";

/**
 * EmploymentEducationStep Component
 *
 * Step 5: Collects employment status, occupation, education level,
 * and remote work capability.
 */

import { motion } from "framer-motion";
import { getQuestionnaireStepContent } from "@/locales/compat";
import {
  SelectField,
  TextField,
  RadioGroupField,
} from "@/components/questionnaire/fields";
import type { StepProps } from "./types";
import type { EmploymentStatus, EducationLevel } from "@/types/questionnaire";

const content = getQuestionnaireStepContent().employmentEducation;

export function EmploymentEducationStep({
  data,
  onChange,
  errors = {},
  isSubmitting = false,
}: StepProps): React.ReactElement {
  // Convert boolean options to string options for RadioGroupField
  const remoteWorkOptions = content.fields.remoteWorkCapable.options.map(
    (opt) => ({
      value: String(opt.value),
      label: opt.label,
    })
  );

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
        {/* Employment Status */}
        <SelectField
          name="employmentStatus"
          label={content.fields.employmentStatus.label}
          placeholder={content.fields.employmentStatus.placeholder}
          value={data.employmentStatus || ""}
          onChange={(value) =>
            onChange({ employmentStatus: value as EmploymentStatus })
          }
          options={content.fields.employmentStatus.options}
          required={content.fields.employmentStatus.required}
          error={errors.employmentStatus}
          disabled={isSubmitting}
        />

        {/* Occupation */}
        <TextField
          name="occupation"
          label={content.fields.occupation.label}
          placeholder={content.fields.occupation.placeholder}
          value={data.occupation || ""}
          onChange={(value) => onChange({ occupation: value })}
          error={errors.occupation}
          disabled={isSubmitting}
          autoComplete="organization-title"
        />

        {/* Education Level */}
        <SelectField
          name="education"
          label={content.fields.education.label}
          placeholder={content.fields.education.placeholder}
          value={data.education || ""}
          onChange={(value) =>
            onChange({ education: value as EducationLevel })
          }
          options={content.fields.education.options}
          error={errors.education}
          disabled={isSubmitting}
        />

        {/* Remote Work Capable */}
        <RadioGroupField
          name="remoteWorkCapable"
          label={content.fields.remoteWorkCapable.label}
          hint={content.fields.remoteWorkCapable.hint}
          value={
            data.remoteWorkCapable === undefined
              ? ""
              : String(data.remoteWorkCapable)
          }
          onChange={(value) =>
            onChange({ remoteWorkCapable: value === "true" })
          }
          options={remoteWorkOptions}
          direction="horizontal"
          error={errors.remoteWorkCapable}
          disabled={isSubmitting}
        />
      </motion.div>
    </div>
  );
}
