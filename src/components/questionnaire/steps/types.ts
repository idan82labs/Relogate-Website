/**
 * Step Component Types
 *
 * Shared types for all questionnaire step components.
 */

import type { QuestionnaireDataV2 } from "@/types/questionnaire";

/**
 * Props interface for all step components.
 * Each step receives the full data object and an onChange handler
 * to update specific fields.
 */
export interface StepProps {
  /** Current questionnaire data (partial, may have missing fields) */
  data: Partial<QuestionnaireDataV2>;
  /** Callback to update questionnaire data */
  onChange: (updates: Partial<QuestionnaireDataV2>) => void;
  /** Field-level validation errors keyed by field name */
  errors?: Record<string, string>;
  /** Whether the form is currently being submitted */
  isSubmitting?: boolean;
}

/**
 * Step component type for registry
 */
export type StepComponent = React.ComponentType<StepProps>;

/**
 * Step identifiers matching the questionnaire flow
 */
export type StepId =
  | "intro"
  | "personal-details"
  | "family-status"
  | "relocation-goals"
  | "citizenship"
  | "employment-education"
  | "income"
  | "partner-details"
  | "studies-investments-languages"
  | "preferences";

/**
 * Step configuration for the registry
 */
export interface StepConfig {
  /** Unique step identifier */
  id: StepId;
  /** Step component */
  component: StepComponent;
  /** Whether this step is conditional (depends on previous answers) */
  conditional?: boolean;
  /** Function to determine if step should be shown */
  shouldShow?: (data: Partial<QuestionnaireDataV2>) => boolean;
}
