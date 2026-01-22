/**
 * Hebrew Locale
 *
 * Complete Hebrew translations for the Relogate application.
 */

import type { Locale } from '../types';
import { questionnaire } from './questionnaire';
import { common } from './common';
import { personalArea } from './personal-area';
import { site } from './site';

export const he: Locale = {
  code: 'he',
  name: 'עברית',
  dir: 'rtl',
  questionnaire,
  common,
  personalArea,
  site,
};

// Re-export individual modules for direct access if needed
export { questionnaire, common, personalArea, site };
