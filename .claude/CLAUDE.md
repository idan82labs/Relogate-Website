# Relogate Marketing Site - Agent Memory

## Stack Summary

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.0.10 (App Router) |
| React | 19.2.1 |
| Language | TypeScript 5, strict mode |
| Styling | Tailwind CSS 4 (via @tailwindcss/postcss) |
| Animation | Framer Motion 12.23.26 |
| Fonts | Noto Sans Hebrew (Google), Satoshi (local) |
| Package Manager | npm |
| Lint | ESLint 9 + eslint-config-next |
| Visual Testing | Playwright (screenshots for design verification) |

## Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint

# Visual verification screenshot (mobile)
npx --yes playwright screenshot --viewport-size=375,812 --wait-for-timeout=1000 \
  http://localhost:3000/<page> docs/design/verify/<name>-mobile.png

# Visual verification screenshot (desktop)
npx --yes playwright screenshot --viewport-size=1440,900 --wait-for-timeout=1000 \
  http://localhost:3000/<page> docs/design/verify/<name>-desktop.png
```

## Repo Structure

```
src/
├── app/              # App Router (pages, layouts, globals.css)
├── components/
│   ├── desktop/      # Desktop-only components
│   ├── mobile/       # Mobile-only components
│   └── shared/       # Reusable components (Button, Card, etc.)
└── content/          # Localized content files (he.ts)

public/               # Static assets, fonts, images
docs/
└── design/
    ├── figma_urls.md           # Source of truth for Figma links
    ├── figma_cache/            # Cached screenshots + metadata
    └── verify/                 # Implementation screenshots for comparison
scripts/              # CLI utilities (figma-cache.mjs, screenshot.mjs)
```

## Rules of Engagement

- **Small diffs**: Make minimal, focused changes. One logical change per commit.
- **No new libs**: Do not add dependencies without explicit approval. Prefer Node built-ins.
- **Keep components small**: Under 200 lines. Extract sub-components when growing.
- **Accessibility baseline**: Focus states, ARIA attributes, semantic HTML. See `:focus-visible` in globals.css.
- **Prefer existing patterns**: Check `src/components/shared/` before creating new primitives.
- **RTL-first**: Site is Hebrew, uses `dir="rtl"`. Test layouts accordingly.
- **Content in content/**: All user-facing strings belong in `src/content/he.ts`.
- **Maintain documentation**: Keep documentation up-to-date when making significant changes:
  - Update `README.md` if adding new scripts or changing project structure
  - Update `docs/ARCHITECTURE.md` if adding new components or changing patterns
  - Update `docs/DEVELOPER_GUIDE.md` if changing workflows or setup steps
  - Update this file (`CLAUDE.md`) if changing tech stack or rules

## Figma Workflow (Agent-Managed Cache)

- **URLs**: Live in `docs/design/figma_urls.md` (do NOT copy URLs into rules files)
- **Cache**: Stored in `docs/design/figma_cache/<slug>/`
- **Agent manages cache directly** - no npm scripts needed
- **Workflow**:
  1. Pick a layer/frame from `figma_urls.md`
  2. Compute slug: `<sanitized-label>_<file_key>_<node_id>`
  3. Check if `docs/design/figma_cache/<slug>/render@2x.png` exists
  4. If cached: Read the image directly, skip MCP call
  5. If not cached: Call Figma MCP, save screenshot + meta.json to cache
- **Implementation**: Match layout, typography, spacing from Figma; reuse existing UI components; do not invent tokens.
- **See**: `.claude/rules/design/figma.md` for detailed caching instructions

## Visual Verification Workflow

After implementing UI changes, verify they match Figma designs using Playwright screenshots:

1. **Take screenshot** of your implementation:
   ```bash
   # Mobile
   npx --yes playwright screenshot --viewport-size=375,812 --wait-for-timeout=1000 \
     http://localhost:3000/questionnaire/countries docs/design/verify/countries-mobile.png
   ```

2. **Compare** with Figma cache:
   - Read implementation: `docs/design/verify/<page>-mobile.png`
   - Read Figma reference: `docs/design/figma_cache/<slug>/render@2x.png`

3. **Iterate** if differences found:
   - Identify specific CSS/layout issues
   - Make adjustments
   - Take new screenshot
   - Compare again

**Viewport sizes**: Mobile `375,812` | Desktop `1440,900`
**See**: `.claude/rules/design/visual-verification.md` for full documentation

## Design Tokens (from globals.css)

```css
--color-ink: #1D1D1B
--color-primary: #215388
--color-accent-green: #239083
--color-navy: #203170
--color-gray-100: #F7F7F7
--color-gray-warm: #F9F6F1
--color-gray-200: #C6C6C6
--color-gray-300: #B2B2B2
--color-gray-400: #706F6F

--container-max-width: 1400px
--header-height: 88px (desktop), 52px (mobile)
```

## Related Rules

- `.claude/rules/frontend/nextjs.md` - Routing & component rules
- `.claude/rules/frontend/typescript.md` - TS patterns
- `.claude/rules/frontend/styling.md` - Tailwind & tokens
- `.claude/rules/frontend/testing.md` - Test guidance
- `.claude/rules/design/figma.md` - Figma-to-code workflow
- `.claude/rules/design/visual-verification.md` - Playwright screenshot verification

## Project Documentation

- `README.md` - Project overview and quick start
- `docs/ARCHITECTURE.md` - Codebase architecture, components, styling system
- `docs/DEVELOPER_GUIDE.md` - Setup guide, Figma workflow, Claude Code usage
