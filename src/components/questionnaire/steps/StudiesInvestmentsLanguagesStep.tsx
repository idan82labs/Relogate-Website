"use client";

/**
 * StudiesInvestmentsLanguagesStep Component
 *
 * Step 8: Collects information about:
 * - Willingness to study abroad
 * - Willingness to invest in property
 * - Language proficiency (speaking and writing)
 *
 * Contains conditional fields for partner's preferences when applicable.
 */

import { motion, AnimatePresence } from "framer-motion";
import { siteContent } from "@/content/he";
import {
  RadioGroupField,
  LanguageSelectField,
} from "@/components/questionnaire/fields";
import { hasPartner } from "@/types/questionnaire";
import type { StepProps } from "./types";
import type { Language } from "@/types/questionnaire";

const content = siteContent.questionnaireV2.steps.studiesInvestmentsLanguages;
const languageOptions = siteContent.questionnaireV2.languageOptions;

export function StudiesInvestmentsLanguagesStep({
  data,
  onChange,
  errors = {},
  isSubmitting = false,
}: StepProps): React.ReactElement {
  const showPartnerFields = hasPartner(data.familyStatus);

  // Convert boolean options to string options for RadioGroupField
  const createBooleanOptions = (
    options: Array<{ value: boolean; label: string }>
  ) =>
    options.map((opt) => ({
      value: String(opt.value),
      label: opt.label,
    }));

  const openToStudyingOptions = createBooleanOptions(
    content.fields.openToStudyingAbroad.options
  );
  const partnerStudyingOptions = createBooleanOptions(
    content.fields.partnerOpenToStudyingAbroad.options
  );
  const investInPropertyOptions = createBooleanOptions(
    content.fields.willingToInvestInProperty.options
  );
  const has250kOptions = createBooleanOptions(
    content.fields.has250kEuroForInvestment.options
  );

  const handleInvestmentChange = (value: string) => {
    const willing = value === "true";
    onChange({
      willingToInvestInProperty: willing,
      // Clear investment amount when setting to "no"
      ...(willing ? {} : { has250kEuroForInvestment: undefined }),
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
        {/* Studies Section */}
        <div className="space-y-4">
          {/* Open to Studying Abroad */}
          <RadioGroupField
            name="openToStudyingAbroad"
            label={content.fields.openToStudyingAbroad.label}
            value={
              data.openToStudyingAbroad === undefined
                ? ""
                : String(data.openToStudyingAbroad)
            }
            onChange={(value) =>
              onChange({ openToStudyingAbroad: value === "true" })
            }
            options={openToStudyingOptions}
            direction="horizontal"
            error={errors.openToStudyingAbroad}
            disabled={isSubmitting}
          />

          {/* Partner Open to Studying Abroad (conditional) */}
          <AnimatePresence>
            {showPartnerFields && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RadioGroupField
                  name="partnerOpenToStudyingAbroad"
                  label={content.fields.partnerOpenToStudyingAbroad.label}
                  value={
                    data.partnerOpenToStudyingAbroad === undefined
                      ? ""
                      : String(data.partnerOpenToStudyingAbroad)
                  }
                  onChange={(value) =>
                    onChange({ partnerOpenToStudyingAbroad: value === "true" })
                  }
                  options={partnerStudyingOptions}
                  direction="horizontal"
                  error={errors.partnerOpenToStudyingAbroad}
                  disabled={isSubmitting}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Investments Section */}
        <div className="space-y-4">
          {/* Willing to Invest in Property */}
          <RadioGroupField
            name="willingToInvestInProperty"
            label={content.fields.willingToInvestInProperty.label}
            value={
              data.willingToInvestInProperty === undefined
                ? ""
                : String(data.willingToInvestInProperty)
            }
            onChange={handleInvestmentChange}
            options={investInPropertyOptions}
            direction="horizontal"
            error={errors.willingToInvestInProperty}
            disabled={isSubmitting}
          />

          {/* Has 250k EUR for Investment (conditional) */}
          <AnimatePresence>
            {data.willingToInvestInProperty === true && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RadioGroupField
                  name="has250kEuroForInvestment"
                  label={content.fields.has250kEuroForInvestment.label}
                  value={
                    data.has250kEuroForInvestment === undefined
                      ? ""
                      : String(data.has250kEuroForInvestment)
                  }
                  onChange={(value) =>
                    onChange({ has250kEuroForInvestment: value === "true" })
                  }
                  options={has250kOptions}
                  direction="horizontal"
                  error={errors.has250kEuroForInvestment}
                  disabled={isSubmitting}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Languages Section */}
        <div className="space-y-4">
          {/* Speaking Languages */}
          <LanguageSelectField
            name="speakingLanguages"
            label={content.fields.speakingLanguages.label}
            values={(data.speakingLanguages as string[]) || []}
            onChange={(values) =>
              onChange({ speakingLanguages: values as Language[] })
            }
            options={languageOptions}
            maxLanguages={content.fields.speakingLanguages.maxLanguages}
            error={errors.speakingLanguages}
            disabled={isSubmitting}
          />

          {/* Writing Languages */}
          <LanguageSelectField
            name="writingLanguages"
            label={content.fields.writingLanguages.label}
            values={(data.writingLanguages as string[]) || []}
            onChange={(values) =>
              onChange({ writingLanguages: values as Language[] })
            }
            options={languageOptions}
            maxLanguages={content.fields.writingLanguages.maxLanguages}
            error={errors.writingLanguages}
            disabled={isSubmitting}
          />

          {/* Partner Languages (conditional) */}
          <AnimatePresence>
            {showPartnerFields && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Partner Speaking Languages */}
                <LanguageSelectField
                  name="partnerSpeakingLanguages"
                  label={content.fields.partnerSpeakingLanguages.label}
                  values={(data.partnerSpeakingLanguages as string[]) || []}
                  onChange={(values) =>
                    onChange({ partnerSpeakingLanguages: values as Language[] })
                  }
                  options={languageOptions}
                  maxLanguages={
                    content.fields.partnerSpeakingLanguages.maxLanguages
                  }
                  error={errors.partnerSpeakingLanguages}
                  disabled={isSubmitting}
                />

                {/* Partner Writing Languages */}
                <LanguageSelectField
                  name="partnerWritingLanguages"
                  label={content.fields.partnerWritingLanguages.label}
                  values={(data.partnerWritingLanguages as string[]) || []}
                  onChange={(values) =>
                    onChange({ partnerWritingLanguages: values as Language[] })
                  }
                  options={languageOptions}
                  maxLanguages={
                    content.fields.partnerWritingLanguages.maxLanguages
                  }
                  error={errors.partnerWritingLanguages}
                  disabled={isSubmitting}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
