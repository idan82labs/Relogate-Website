"use client";

/**
 * PartnerDetailsStep Component
 *
 * Step 7 (conditional): Collects partner's employment status, occupation,
 * education level, and remote work capability.
 * Only shown when user has a partner (married status).
 */

import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import {
  SelectField,
  TextField,
  RadioGroupField,
} from "@/components/questionnaire/fields";
import type { StepProps } from "./types";
import type { EmploymentStatus, EducationLevel } from "@/types/questionnaire";

const content = siteContent.questionnaireV2.steps.partnerDetails;

export function PartnerDetailsStep({
  data,
  onChange,
  errors = {},
  isSubmitting = false,
}: StepProps): React.ReactElement {
  // Convert boolean options to string options for RadioGroupField
  const remoteWorkOptions =
    content.fields.partnerRemoteWorkCapable.options.map((opt) => ({
      value: String(opt.value),
      label: opt.label,
    }));

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
        {/* Partner Employment Status */}
        <SelectField
          name="partnerEmploymentStatus"
          label={content.fields.partnerEmploymentStatus.label}
          placeholder={content.fields.partnerEmploymentStatus.placeholder}
          value={data.partnerEmploymentStatus || ""}
          onChange={(value) =>
            onChange({ partnerEmploymentStatus: value as EmploymentStatus })
          }
          options={content.fields.partnerEmploymentStatus.options}
          error={errors.partnerEmploymentStatus}
          disabled={isSubmitting}
        />

        {/* Partner Occupation */}
        <TextField
          name="partnerOccupation"
          label={content.fields.partnerOccupation.label}
          placeholder={content.fields.partnerOccupation.placeholder}
          value={data.partnerOccupation || ""}
          onChange={(value) => onChange({ partnerOccupation: value })}
          error={errors.partnerOccupation}
          disabled={isSubmitting}
          autoComplete="off"
        />

        {/* Partner Education Level */}
        <SelectField
          name="partnerEducation"
          label={content.fields.partnerEducation.label}
          placeholder={content.fields.partnerEducation.placeholder}
          value={data.partnerEducation || ""}
          onChange={(value) =>
            onChange({ partnerEducation: value as EducationLevel })
          }
          options={content.fields.partnerEducation.options}
          error={errors.partnerEducation}
          disabled={isSubmitting}
        />

        {/* Partner Remote Work Capable */}
        <RadioGroupField
          name="partnerRemoteWorkCapable"
          label={content.fields.partnerRemoteWorkCapable.label}
          hint={content.fields.partnerRemoteWorkCapable.hint}
          value={
            data.partnerRemoteWorkCapable === undefined
              ? ""
              : String(data.partnerRemoteWorkCapable)
          }
          onChange={(value) =>
            onChange({ partnerRemoteWorkCapable: value === "true" })
          }
          options={remoteWorkOptions}
          direction="horizontal"
          error={errors.partnerRemoteWorkCapable}
          disabled={isSubmitting}
        />
      </motion.div>
    </div>
  );
}
