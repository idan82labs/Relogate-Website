# Relogate Frontend

Relocation platform with marketing site, questionnaire system, user dashboard, and admin interface.

## Stack

| Tech | Version | Notes |
|------|---------|-------|
| Next.js | 16 | App Router |
| React | 19 | Client components for animations |
| TypeScript | 5 | Strict mode |
| Tailwind CSS | 4 | Via @tailwindcss/postcss |
| Framer Motion | 12 | Animations |

## Commands

```bash
npm run dev      # Development server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```

## Directory Structure

```
src/
├── app/                  # Routes (questionnaire/, personal-area/, admin/, login/)
├── components/
│   ├── desktop/          # Desktop components (≥1024px)
│   ├── mobile/           # Mobile components (<1024px)
│   ├── questionnaire/    # V2 questionnaire components
│   └── shared/           # Reusable: Button, Card, AuthGuard, ResponseEditor
├── contexts/             # AuthContext
├── services/             # API layer: auth.ts, questionnaire-v2.ts, reports.ts
├── hooks/                # useAuth, useQuestionnaire
├── types/                # TypeScript definitions
└── content/he.ts         # All Hebrew text
```

## Key Patterns

### API Calls
All API calls go through `src/services/`. Do not call APIs directly from components.

```tsx
// Good
import { authService } from '@/services/auth';
await authService.login(credentials);

// Bad - direct fetch in component
await fetch('/api/login', ...);
```

### Components
- Check `shared/` before creating new components
- Keep under 200 lines
- Use barrel exports (`index.ts`)
- Mark client components with `"use client"`

### Content
- All Hebrew text in `src/content/he.ts`
- Import as: `import { siteContent } from "@/content/he"`

### Styling
- Use design tokens from `globals.css` when available
- Direct hex values OK when matching Figma exactly
- Site is RTL (`dir="rtl"`)

## Design Tokens

```css
--color-ink: #1D1D1B          /* Text */
--color-primary: #215388      /* Brand blue */
--color-accent-green: #239083 /* Secondary */
--color-gray-100: #F7F7F7     /* Backgrounds */
--color-gray-200: #C6C6C6     /* Borders */
--color-gray-400: #706F6F     /* Muted text */
```

## Figma Workflow

1. Design URLs in `docs/design/figma_urls.md`
2. Cache screenshots: `npm run figma:cache -- --all` (requires FIGMA_TOKEN)
3. Cached images in `docs/design/figma_cache/<slug>/render@2x.png`
4. Match Figma exactly: colors, spacing, typography

## Visual Verification

After UI changes, take screenshots to compare with Figma:

```bash
npx playwright screenshot --viewport-size=375,812 --wait-for-timeout=1000 \
  http://localhost:3000/<page> docs/design/verify/<name>-mobile.png
```

## Rules

1. **Small diffs**: One logical change per commit
2. **No new dependencies** without approval
3. **Services layer**: All API calls through `src/services/`
4. **RTL-first**: Test layouts in right-to-left
5. **Existing patterns**: Prefer `shared/` components
6. **Type everything**: No `any`, explicit function signatures

## Context Management

### Commands
- `/compact` - Summarize conversation to free context (use at ~70% usage)
- `/clear` - Reset context completely (use when switching topics)
- `/context` - Check current context usage

### Excluded Directories
Skip these directories to reduce token usage:
- `node_modules/`, `.next/`, `dist/`, `.git/`
- `docs/design/figma_cache/` (large binary files)
- `docs/design/verify/` (screenshot artifacts)

### Efficient File Reading
- Read specific files, not entire directories
- Use glob patterns to find files: `src/components/**/*.tsx`
- Prefer targeted searches over broad exploration

### Session Strategy
- One focused task per session
- Compact before context exceeds 70%
- Clear context when switching between unrelated tasks
- For multi-file changes, batch related edits together

### Subagent Delegation
Use Task tool for complex searches to preserve main context:
- Codebase exploration → `subagent_type=Explore`
- Multi-step investigations → `subagent_type=general-purpose`
