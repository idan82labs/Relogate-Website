"use client";

/**
 * PersonalDetailsStep Component
 *
 * Step 1: Collects basic personal information including
 * full name, birth date, phone, email, and gender.
 */

import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import {
  TextField,
  DateField,
  PhoneField,
  EmailField,
  SelectField,
} from "@/components/questionnaire/fields";
import type { StepProps } from "./types";

const content = siteContent.questionnaireV2.steps.personalDetails;

export function PersonalDetailsStep({
  data,
  onChange,
  errors = {},
  isSubmitting = false,
}: StepProps): React.ReactElement {
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
        {/* Full Name */}
        <TextField
          name="fullName"
          label={content.fields.fullName.label}
          placeholder={content.fields.fullName.placeholder}
          value={data.fullName || ""}
          onChange={(value) => onChange({ fullName: value })}
          required={content.fields.fullName.required}
          error={errors.fullName}
          disabled={isSubmitting}
          autoComplete="name"
        />

        {/* Birth Date */}
        <DateField
          name="birthDate"
          label={content.fields.birthDate.label}
          placeholder={content.fields.birthDate.placeholder}
          value={data.birthDate || ""}
          onChange={(value) => onChange({ birthDate: value })}
          required={content.fields.birthDate.required}
          error={errors.birthDate}
          disabled={isSubmitting}
        />

        {/* Phone */}
        <PhoneField
          name="phone"
          label={content.fields.phone.label}
          placeholder={content.fields.phone.placeholder}
          value={data.phone || ""}
          onChange={(value) => onChange({ phone: value })}
          required={content.fields.phone.required}
          error={errors.phone}
          disabled={isSubmitting}
        />

        {/* Email */}
        <EmailField
          name="email"
          label={content.fields.email.label}
          placeholder={content.fields.email.placeholder}
          value={data.email || ""}
          onChange={(value) => onChange({ email: value })}
          required={content.fields.email.required}
          error={errors.email}
          disabled={isSubmitting}
        />

        {/* Gender (optional) */}
        <SelectField
          name="gender"
          label={content.fields.gender.label}
          placeholder={content.fields.gender.placeholder}
          value={data.gender || ""}
          onChange={(value) =>
            onChange({
              gender: value as "male" | "female" | "prefer_not_to_say",
            })
          }
          options={content.fields.gender.options}
          error={errors.gender}
          disabled={isSubmitting}
        />
      </motion.div>
    </div>
  );
}
