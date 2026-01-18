/**
 * Questionnaire Steps - Barrel Export
 *
 * Exports all step components and provides the STEP_COMPONENTS registry
 * for dynamic step rendering by the questionnaire orchestrator.
 */

// Types
export type { StepProps, StepComponent, StepId, StepConfig } from "./types";

// Step Components
export { IntroStep } from "./IntroStep";
export { PersonalDetailsStep } from "./PersonalDetailsStep";
export { FamilyStatusStep } from "./FamilyStatusStep";
export { RelocationGoalsStep } from "./RelocationGoalsStep";
export { CitizenshipStep } from "./CitizenshipStep";
export { EmploymentEducationStep } from "./EmploymentEducationStep";
export { IncomeStep } from "./IncomeStep";
export { PartnerDetailsStep } from "./PartnerDetailsStep";
export { StudiesInvestmentsLanguagesStep } from "./StudiesInvestmentsLanguagesStep";
export { PreferencesStep } from "./PreferencesStep";

// Import components for registry
import { IntroStep } from "./IntroStep";
import { PersonalDetailsStep } from "./PersonalDetailsStep";
import { FamilyStatusStep } from "./FamilyStatusStep";
import { RelocationGoalsStep } from "./RelocationGoalsStep";
import { CitizenshipStep } from "./CitizenshipStep";
import { EmploymentEducationStep } from "./EmploymentEducationStep";
import { IncomeStep } from "./IncomeStep";
import { PartnerDetailsStep } from "./PartnerDetailsStep";
import { StudiesInvestmentsLanguagesStep } from "./StudiesInvestmentsLanguagesStep";
import { PreferencesStep } from "./PreferencesStep";
import { shouldShowPartnerDetails } from "@/types/questionnaire";
import type { StepConfig } from "./types";

/**
 * Step Components Registry
 *
 * Ordered list of step configurations for the questionnaire flow.
 * Used by the orchestrator to render steps dynamically.
 *
 * Steps marked as conditional will have their shouldShow function evaluated
 * to determine if they should be displayed based on collected data.
 */
export const STEP_COMPONENTS: StepConfig[] = [
  {
    id: "intro",
    component: IntroStep,
  },
  {
    id: "personal-details",
    component: PersonalDetailsStep,
  },
  {
    id: "family-status",
    component: FamilyStatusStep,
  },
  {
    id: "relocation-goals",
    component: RelocationGoalsStep,
  },
  {
    id: "citizenship",
    component: CitizenshipStep,
  },
  {
    id: "employment-education",
    component: EmploymentEducationStep,
  },
  {
    id: "income",
    component: IncomeStep,
  },
  {
    id: "partner-details",
    component: PartnerDetailsStep,
    conditional: true,
    shouldShow: shouldShowPartnerDetails,
  },
  {
    id: "studies-investments-languages",
    component: StudiesInvestmentsLanguagesStep,
  },
  {
    id: "preferences",
    component: PreferencesStep,
  },
];

/**
 * Get total number of visible steps based on current data
 */
export function getVisibleStepCount(
  data: Parameters<typeof shouldShowPartnerDetails>[0]
): number {
  return STEP_COMPONENTS.filter(
    (step) => !step.conditional || step.shouldShow?.(data)
  ).length;
}

/**
 * Get visible steps based on current data
 */
export function getVisibleSteps(
  data: Parameters<typeof shouldShowPartnerDetails>[0]
): StepConfig[] {
  return STEP_COMPONENTS.filter(
    (step) => !step.conditional || step.shouldShow?.(data)
  );
}

/**
 * Get step by ID
 */
export function getStepById(id: string): StepConfig | undefined {
  return STEP_COMPONENTS.find((step) => step.id === id);
}

/**
 * Get step index by ID (returns index in visible steps)
 */
export function getStepIndex(
  id: string,
  data: Parameters<typeof shouldShowPartnerDetails>[0]
): number {
  const visibleSteps = getVisibleSteps(data);
  return visibleSteps.findIndex((step) => step.id === id);
}
