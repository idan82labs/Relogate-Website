"use client";

/**
 * PreferencesStep Component
 *
 * Step 9: Collects location and lifestyle preferences including:
 * - Distance from Israel
 * - Time zone preferences
 * - Weather preferences
 * - Community preferences (Jewish, Israeli)
 * - Living type preferences
 * - Additional considerations
 * - Previous visa attempts
 * - Criminal record disclosure
 */

import { motion, AnimatePresence } from "framer-motion";
import { siteContent } from "@/content/he";
import {
  SelectField,
  RadioGroupField,
  TextAreaField,
} from "@/components/questionnaire/fields";
import type { StepProps } from "./types";
import type {
  DistancePreference,
  TimeZonePreference,
  WeatherPreference,
  CommunityImportance,
  LivingTypePreference,
  VisaAttemptStatus,
} from "@/types/questionnaire";

const content = siteContent.questionnaireV2.steps.preferences;

export function PreferencesStep({
  data,
  onChange,
  errors = {},
  isSubmitting = false,
}: StepProps): React.ReactElement {
  // Convert options for RadioGroupField
  const createRadioOptions = (
    options: Array<{ value: string | boolean; label: string }>
  ) =>
    options.map((opt) => ({
      value: String(opt.value),
      label: opt.label,
    }));

  const jewishCommunityOptions = createRadioOptions(
    content.fields.jewishCommunityImportance.options
  );
  const israeliCommunityOptions = createRadioOptions(
    content.fields.israeliCommunityImportance.options
  );
  const additionalConsiderationsOptions = createRadioOptions(
    content.fields.hasAdditionalConsiderations.options
  );
  const criminalRecordOptions = createRadioOptions(
    content.fields.hasCriminalRecord.options
  );

  const handleAdditionalConsiderationsToggle = (value: string) => {
    const hasAdditional = value === "true";
    onChange({
      hasAdditionalConsiderations: hasAdditional,
      // Clear text when setting to "no"
      ...(hasAdditional ? {} : { additionalConsiderationsText: undefined }),
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
        className="space-y-6"
      >
        {/* Location Preferences Section */}
        <div className="space-y-4">
          {/* Distance from Israel */}
          <SelectField
            name="distanceFromIsrael"
            label={content.fields.distanceFromIsrael.label}
            placeholder={content.fields.distanceFromIsrael.placeholder}
            value={data.distanceFromIsrael || ""}
            onChange={(value) =>
              onChange({ distanceFromIsrael: value as DistancePreference })
            }
            options={content.fields.distanceFromIsrael.options}
            error={errors.distanceFromIsrael}
            disabled={isSubmitting}
          />

          {/* Time Zone Difference */}
          <SelectField
            name="timeZoneDifference"
            label={content.fields.timeZoneDifference.label}
            placeholder={content.fields.timeZoneDifference.placeholder}
            value={data.timeZoneDifference || ""}
            onChange={(value) =>
              onChange({ timeZoneDifference: value as TimeZonePreference })
            }
            options={content.fields.timeZoneDifference.options}
            error={errors.timeZoneDifference}
            disabled={isSubmitting}
          />

          {/* Weather Preference */}
          <SelectField
            name="weatherPreference"
            label={content.fields.weatherPreference.label}
            placeholder={content.fields.weatherPreference.placeholder}
            value={data.weatherPreference || ""}
            onChange={(value) =>
              onChange({ weatherPreference: value as WeatherPreference })
            }
            options={content.fields.weatherPreference.options}
            error={errors.weatherPreference}
            disabled={isSubmitting}
          />

          {/* Living Type */}
          <SelectField
            name="livingType"
            label={content.fields.livingType.label}
            placeholder={content.fields.livingType.placeholder}
            value={data.livingType || ""}
            onChange={(value) =>
              onChange({ livingType: value as LivingTypePreference })
            }
            options={content.fields.livingType.options}
            error={errors.livingType}
            disabled={isSubmitting}
          />
        </div>

        {/* Community Preferences Section */}
        <div className="space-y-4">
          {/* Jewish Community Importance */}
          <RadioGroupField
            name="jewishCommunityImportance"
            label={content.fields.jewishCommunityImportance.label}
            value={data.jewishCommunityImportance || ""}
            onChange={(value) =>
              onChange({
                jewishCommunityImportance: value as CommunityImportance,
              })
            }
            options={jewishCommunityOptions}
            direction="vertical"
            error={errors.jewishCommunityImportance}
            disabled={isSubmitting}
          />

          {/* Israeli Community Importance */}
          <RadioGroupField
            name="israeliCommunityImportance"
            label={content.fields.israeliCommunityImportance.label}
            value={data.israeliCommunityImportance || ""}
            onChange={(value) =>
              onChange({
                israeliCommunityImportance: value as CommunityImportance,
              })
            }
            options={israeliCommunityOptions}
            direction="vertical"
            error={errors.israeliCommunityImportance}
            disabled={isSubmitting}
          />
        </div>

        {/* Additional Considerations Section */}
        <div className="space-y-4">
          {/* Has Additional Considerations */}
          <RadioGroupField
            name="hasAdditionalConsiderations"
            label={content.fields.hasAdditionalConsiderations.label}
            value={
              data.hasAdditionalConsiderations === undefined
                ? ""
                : String(data.hasAdditionalConsiderations)
            }
            onChange={handleAdditionalConsiderationsToggle}
            options={additionalConsiderationsOptions}
            direction="horizontal"
            error={errors.hasAdditionalConsiderations}
            disabled={isSubmitting}
          />

          {/* Additional Considerations Text (conditional) */}
          <AnimatePresence>
            {data.hasAdditionalConsiderations === true && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TextAreaField
                  name="additionalConsiderationsText"
                  label={content.fields.additionalConsiderationsText.label}
                  placeholder={
                    content.fields.additionalConsiderationsText.placeholder
                  }
                  value={data.additionalConsiderationsText || ""}
                  onChange={(value) =>
                    onChange({ additionalConsiderationsText: value })
                  }
                  rows={4}
                  error={errors.additionalConsiderationsText}
                  disabled={isSubmitting}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bureaucracy Section */}
        <div className="space-y-4">
          {/* Previous Visa Attempt */}
          <SelectField
            name="previousVisaAttempt"
            label={content.fields.previousVisaAttempt.label}
            placeholder={content.fields.previousVisaAttempt.placeholder}
            value={data.previousVisaAttempt || ""}
            onChange={(value) =>
              onChange({ previousVisaAttempt: value as VisaAttemptStatus })
            }
            options={content.fields.previousVisaAttempt.options}
            error={errors.previousVisaAttempt}
            disabled={isSubmitting}
          />

          {/* Criminal Record */}
          <RadioGroupField
            name="hasCriminalRecord"
            label={content.fields.hasCriminalRecord.label}
            value={
              data.hasCriminalRecord === undefined
                ? ""
                : String(data.hasCriminalRecord)
            }
            onChange={(value) =>
              onChange({ hasCriminalRecord: value === "true" })
            }
            options={criminalRecordOptions}
            direction="horizontal"
            error={errors.hasCriminalRecord}
            disabled={isSubmitting}
          />
        </div>
      </motion.div>
    </div>
  );
}
