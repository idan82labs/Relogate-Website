#!/usr/bin/env node

/**
 * Screenshot Utility Reference for Visual Verification
 *
 * This is a quick reference for the Playwright screenshot command.
 * Use this to capture implementation screenshots for comparison with Figma designs.
 *
 * COMMAND SYNTAX:
 *   npx --yes playwright screenshot [options] <url> <filename>
 *
 * VIEWPORT SIZES (must match Figma frames):
 *   Mobile:  --viewport-size=375,812  (iPhone 14)
 *   Desktop: --viewport-size=1440,900 (Desktop frame)
 *
 * OUTPUT DIRECTORY:
 *   Save all verification screenshots to: docs/design/verify/
 *
 * EXAMPLES:
 *
 *   # Mobile screenshot
 *   npx --yes playwright screenshot --viewport-size=375,812 --wait-for-timeout=1000 \
 *     http://localhost:3000/questionnaire/countries \
 *     docs/design/verify/countries-mobile.png
 *
 *   # Desktop screenshot
 *   npx --yes playwright screenshot --viewport-size=1440,900 --wait-for-timeout=1000 \
 *     http://localhost:3000/questionnaire/countries \
 *     docs/design/verify/countries-desktop.png
 *
 *   # Full page capture (scrollable content)
 *   npx --yes playwright screenshot --viewport-size=375,812 --full-page \
 *     http://localhost:3000 \
 *     docs/design/verify/homepage-mobile-full.png
 *
 * USEFUL OPTIONS:
 *   --wait-for-timeout=1000   Wait 1s for animations to complete
 *   --full-page               Capture entire scrollable area
 *   --device="iPhone 14"      Use device preset instead of viewport-size
 *
 * COMPARISON WORKFLOW:
 *   1. Take screenshot of implementation
 *   2. Read the screenshot using Read tool
 *   3. Read the Figma cache image from docs/design/figma_cache/<slug>/render@2x.png
 *   4. Compare visually and note differences
 *   5. Make adjustments based on comparison
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const VERIFY_DIR = path.join(ROOT_DIR, "docs", "design", "verify");

// Ensure verify directory exists
if (!fs.existsSync(VERIFY_DIR)) {
  fs.mkdirSync(VERIFY_DIR, { recursive: true });
}

console.log(`
Screenshot Utility for Visual Verification
==========================================

Command Syntax:
  npx --yes playwright screenshot [options] <url> <filename>

Quick Commands:
---------------

# Mobile (375x812)
npx --yes playwright screenshot --viewport-size=375,812 --wait-for-timeout=1000 \\
  http://localhost:3000/questionnaire/countries \\
  docs/design/verify/countries-mobile.png

# Desktop (1440x900)
npx --yes playwright screenshot --viewport-size=1440,900 --wait-for-timeout=1000 \\
  http://localhost:3000/questionnaire/countries \\
  docs/design/verify/countries-desktop.png

# Full page
npx --yes playwright screenshot --viewport-size=375,812 --full-page \\
  http://localhost:3000 \\
  docs/design/verify/homepage-full.png

Available Options:
------------------
  --viewport-size=W,H         Set viewport (375,812 for mobile, 1440,900 for desktop)
  --wait-for-timeout=MS       Wait for animations (use 1000 for Framer Motion)
  --full-page                 Capture entire scrollable area
  --device="iPhone 14"        Use device preset

Output Directory:
-----------------
  Screenshots: docs/design/verify/
  Figma cache: docs/design/figma_cache/
`);
