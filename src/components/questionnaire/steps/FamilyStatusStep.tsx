"use client";

/**
 * FamilyStatusStep Component
 *
 * Step 2: Collects family status information including
 * marital status, process partners, and children details.
 * Contains conditional fields based on family status selection.
 */

import { motion, AnimatePresence } from "framer-motion";
import { siteContent } from "@/content/he";
import {
  SelectField,
  TextField,
  ChildrenField,
} from "@/components/questionnaire/fields";
import { hasPartner, hasChildren } from "@/types/questionnaire";
import type { StepProps } from "./types";
import type { FamilyStatus, ProcessPartner, ChildInfo } from "@/types/questionnaire";

const content = siteContent.questionnaireV2.steps.familyStatus;

export function FamilyStatusStep({
  data,
  onChange,
  errors = {},
  isSubmitting = false,
}: StepProps): React.ReactElement {
  const showPartnerFields = hasPartner(data.familyStatus);
  const showChildrenField = hasChildren(data.familyStatus);

  // Convert ChildInfo[] to ChildData[] format expected by ChildrenField
  const childrenData = (data.children || []).map((child, index) => ({
    id: `child-${index}`,
    name: child.name,
    age: child.age as number | "",
  }));

  const handleChildrenChange = (
    children: Array<{ id: string; name: string; age: number | "" }>
  ) => {
    const childInfos: ChildInfo[] = children.map((child) => ({
      name: child.name,
      age: typeof child.age === "number" ? child.age : 0,
    }));
    onChange({ children: childInfos });
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
        {/* Family Status */}
        <SelectField
          name="familyStatus"
          label={content.fields.familyStatus.label}
          placeholder={content.fields.familyStatus.placeholder}
          value={data.familyStatus || ""}
          onChange={(value) => {
            const familyStatus = value as FamilyStatus;
            onChange({ familyStatus });
            // Clear conditional fields when family status changes
            if (!hasPartner(familyStatus)) {
              onChange({
                familyStatus,
                processPartner: undefined,
                partnerName: undefined,
              });
            }
            if (!hasChildren(familyStatus)) {
              onChange({
                familyStatus,
                children: undefined,
              });
            }
          }}
          options={content.fields.familyStatus.options}
          required={content.fields.familyStatus.required}
          error={errors.familyStatus}
          disabled={isSubmitting}
        />

        {/* Process Partner (conditional - shown when married) */}
        <AnimatePresence>
          {showPartnerFields && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <SelectField
                name="processPartner"
                label={content.fields.processPartner.label}
                placeholder={content.fields.processPartner.placeholder}
                value={data.processPartner || ""}
                onChange={(value) =>
                  onChange({ processPartner: value as ProcessPartner })
                }
                options={content.fields.processPartner.options}
                error={errors.processPartner}
                disabled={isSubmitting}
              />

              {/* Partner Name (conditional - shown when partner involved) */}
              {data.processPartner && data.processPartner !== "alone" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <TextField
                    name="partnerName"
                    label={content.fields.partnerName.label}
                    placeholder={content.fields.partnerName.placeholder}
                    value={data.partnerName || ""}
                    onChange={(value) => onChange({ partnerName: value })}
                    error={errors.partnerName}
                    disabled={isSubmitting}
                    autoComplete="off"
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Children Field (conditional - shown when has children) */}
        <AnimatePresence>
          {showChildrenField && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChildrenField
                name="children"
                label={content.fields.children.label}
                children={childrenData}
                onChange={handleChildrenChange}
                maxChildren={content.fields.children.maxChildren}
                error={errors.children}
                disabled={isSubmitting}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
