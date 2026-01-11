# Visual Verification Rules

## Purpose

After implementing UI changes from Figma designs, use Playwright screenshots to verify the implementation matches the design. This allows visual comparison between your implementation and the Figma reference.

## Prerequisites

- Dev server must be running (`npm run dev`)
- Chromium browser installed (`npx playwright install --with-deps chromium`)

## Verification Workflow

### Step 1: Implement the Design

Make your code changes based on the Figma design reference.

### Step 2: Take Implementation Screenshots

Use the Playwright screenshot command to capture your implementation at **multiple screen sizes** to ensure responsive design works correctly.

```bash
# Basic verification (Figma frame sizes)
npx --yes playwright screenshot --viewport-size=375,812 --wait-for-timeout=1000 \
  http://localhost:3000/<page-path> docs/design/verify/<page>-mobile-375.png

npx --yes playwright screenshot --viewport-size=1440,900 --wait-for-timeout=1000 \
  http://localhost:3000/<page-path> docs/design/verify/<page>-desktop-1440.png
```

### Step 3: Multi-Resolution Testing

**IMPORTANT**: Always test at multiple common screen resolutions to catch responsive design issues.

#### Mobile Resolutions (Most Common 2024-2025)

| Device Type | Viewport | Command | Market Share |
|-------------|----------|---------|--------------|
| Small Android | 360x800 | `--viewport-size=360,800` | ~25% |
| iPhone SE/older | 375x667 | `--viewport-size=375,667` | ~15% |
| iPhone 14/15 | 390x844 | `--viewport-size=390,844` | ~20% |
| iPhone 14 Pro Max | 430x932 | `--viewport-size=430,932` | ~10% |
| Large Android | 412x915 | `--viewport-size=412,915` | ~15% |

#### Desktop Resolutions (Most Common 2024-2025)

| Resolution | Viewport | Command | Market Share |
|------------|----------|---------|--------------|
| HD | 1280x720 | `--viewport-size=1280,720` | ~10% |
| Laptop | 1366x768 | `--viewport-size=1366,768` | ~20% |
| HD+ | 1536x864 | `--viewport-size=1536,864` | ~10% |
| Full HD | 1920x1080 | `--viewport-size=1920,1080` | ~40% |
| 2K/QHD | 2560x1440 | `--viewport-size=2560,1440` | ~10% |

#### Tablet Resolutions

| Device | Viewport | Command |
|--------|----------|---------|
| iPad Mini | 768x1024 | `--viewport-size=768,1024` |
| iPad Pro 11" | 834x1194 | `--viewport-size=834,1194` |
| iPad Pro 12.9" | 1024x1366 | `--viewport-size=1024,1366` |
| Android Tablet | 800x1280 | `--viewport-size=800,1280` |

### Step 4: Quick Multi-Resolution Test Script

Run this sequence to test all critical breakpoints:

```bash
# Mobile devices
npx --yes playwright screenshot --viewport-size=360,800 --wait-for-timeout=1000 \
  http://localhost:3000/<page> docs/design/verify/<page>-mobile-360.png
npx --yes playwright screenshot --viewport-size=390,844 --wait-for-timeout=1000 \
  http://localhost:3000/<page> docs/design/verify/<page>-mobile-390.png
npx --yes playwright screenshot --viewport-size=430,932 --wait-for-timeout=1000 \
  http://localhost:3000/<page> docs/design/verify/<page>-mobile-430.png

# Tablets
npx --yes playwright screenshot --viewport-size=768,1024 --wait-for-timeout=1000 \
  http://localhost:3000/<page> docs/design/verify/<page>-tablet-768.png

# Desktop
npx --yes playwright screenshot --viewport-size=1366,768 --wait-for-timeout=1000 \
  http://localhost:3000/<page> docs/design/verify/<page>-desktop-1366.png
npx --yes playwright screenshot --viewport-size=1920,1080 --wait-for-timeout=1000 \
  http://localhost:3000/<page> docs/design/verify/<page>-desktop-1920.png
```

### Step 5: Compare with Figma Design

1. Read your implementation screenshot using the Read tool
2. Read the Figma cache image from `docs/design/figma_cache/<slug>/render@2x.png`
3. Compare visually, checking:
   - Layout and spacing
   - Typography (font size, weight, color)
   - Colors and backgrounds
   - Element positioning
   - Button/input styling
   - RTL text alignment

### Step 6: Iterate if Needed

If differences are found:
1. Identify the specific CSS/component changes needed
2. Make the adjustments
3. Take new screenshots at multiple resolutions
4. Compare again
5. Repeat until implementation matches design at all breakpoints

## Responsive Design Checklist

When testing multiple resolutions, verify:

- [ ] **No horizontal overflow**: Content doesn't extend beyond viewport
- [ ] **Text readability**: Font sizes appropriate for each screen size
- [ ] **Touch targets**: Buttons/links large enough on mobile (min 44x44px)
- [ ] **Spacing consistency**: Margins/padding scale appropriately
- [ ] **Image scaling**: Images resize without distortion
- [ ] **Navigation**: Menu works correctly at all sizes
- [ ] **Forms**: Input fields usable at all sizes
- [ ] **Breakpoint transitions**: Layout changes smoothly between breakpoints

## Critical Breakpoints for This Project

This project uses `lg:` (1024px) as the mobile/desktop breakpoint:

| Range | Classification | Key Considerations |
|-------|---------------|-------------------|
| < 768px | Mobile | Single column, touch-friendly, 16px+ fonts |
| 768px - 1023px | Tablet | Transitional layout, may use mobile or desktop |
| >= 1024px | Desktop | Full desktop layout, multi-column |

## Command Reference

### Viewport Sizes (Primary Testing)

| Platform | Size | Command Flag | Use Case |
|----------|------|--------------|----------|
| Mobile (Figma) | 375x812 | `--viewport-size=375,812` | Match Figma mobile frames |
| Desktop (Figma) | 1440x900 | `--viewport-size=1440,900` | Match Figma desktop frames |
| Mobile Small | 360x800 | `--viewport-size=360,800` | Most common Android |
| Mobile Large | 430x932 | `--viewport-size=430,932` | Large iPhones |
| Laptop | 1366x768 | `--viewport-size=1366,768` | Budget laptops |
| Full HD | 1920x1080 | `--viewport-size=1920,1080` | Most common desktop |

### Common Options

| Option | Description |
|--------|-------------|
| `--wait-for-timeout=1000` | Wait 1s for animations to complete |
| `--full-page` | Capture entire scrollable area |
| `--device="iPhone 14"` | Use device preset instead of viewport |

### Output Directories

- **Implementation screenshots**: `docs/design/verify/`
- **Figma reference images**: `docs/design/figma_cache/<slug>/render@2x.png`

## Example Multi-Resolution Verification Session

```bash
# 1. Ensure dev server is running
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000

# 2. Take screenshots at multiple resolutions
# Mobile - small
npx --yes playwright screenshot --viewport-size=360,800 --wait-for-timeout=1000 \
  http://localhost:3000/questionnaire/countries docs/design/verify/countries-360.png

# Mobile - standard (Figma reference)
npx --yes playwright screenshot --viewport-size=375,812 --wait-for-timeout=1000 \
  http://localhost:3000/questionnaire/countries docs/design/verify/countries-375.png

# Mobile - large
npx --yes playwright screenshot --viewport-size=430,932 --wait-for-timeout=1000 \
  http://localhost:3000/questionnaire/countries docs/design/verify/countries-430.png

# Tablet
npx --yes playwright screenshot --viewport-size=768,1024 --wait-for-timeout=1000 \
  http://localhost:3000/questionnaire/countries docs/design/verify/countries-tablet.png

# Desktop - laptop
npx --yes playwright screenshot --viewport-size=1366,768 --wait-for-timeout=1000 \
  http://localhost:3000/questionnaire/countries docs/design/verify/countries-1366.png

# Desktop - Figma reference
npx --yes playwright screenshot --viewport-size=1440,900 --wait-for-timeout=1000 \
  http://localhost:3000/questionnaire/countries docs/design/verify/countries-1440.png

# Desktop - Full HD
npx --yes playwright screenshot --viewport-size=1920,1080 --wait-for-timeout=1000 \
  http://localhost:3000/questionnaire/countries docs/design/verify/countries-1920.png

# 3. Read each screenshot and verify layout works correctly
# Look for: overflow, clipping, misalignment, spacing issues
```

## Comparison Checklist

When comparing screenshots, verify:

- [ ] **Layout**: Elements positioned correctly
- [ ] **Spacing**: Margins and padding match
- [ ] **Typography**: Font size, weight, line-height correct
- [ ] **Colors**: Text, backgrounds, borders match design tokens
- [ ] **Alignment**: RTL text alignment correct
- [ ] **Buttons**: Size, border-radius, colors match
- [ ] **Inputs**: Styling and placeholder text correct
- [ ] **Progress bars**: Width, color, animation correct
- [ ] **Icons**: Size, color, rotation correct
- [ ] **No clipping**: Text and elements not cut off at edges
- [ ] **No overflow**: Content doesn't extend beyond viewport

## Naming Convention

Screenshot files should follow this pattern:
```
<page>-<width>.png
```

Examples:
- `countries-360.png` (small mobile)
- `countries-375.png` (standard mobile / Figma)
- `countries-430.png` (large mobile)
- `countries-768.png` (tablet)
- `countries-1366.png` (laptop)
- `countries-1440.png` (desktop / Figma)
- `countries-1920.png` (Full HD)

## Notes

- Always use `--wait-for-timeout=1000` to let Framer Motion animations complete
- The `docs/design/verify/` directory is gitignored - screenshots are temporary verification artifacts
- If Figma cache is missing, use the figma MCP tools or run `npm run figma:cache -- --all`
- **Test at minimum 3 resolutions**: small mobile (360), Figma reference (375/1440), and one larger (430/1920)
- Pay special attention to the 1024px breakpoint where mobile/desktop layouts switch

## Sources

Screen resolution statistics based on:
- [BrowserStack - Common Screen Resolutions](https://www.browserstack.com/guide/common-screen-resolutions)
- [Statcounter Global Stats](https://gs.statcounter.com/screen-resolution-stats)
