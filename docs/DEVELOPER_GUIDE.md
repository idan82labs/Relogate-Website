# Developer Guide

This guide covers setting up your development environment, working with Figma designs, and using Claude Code effectively with this project.

## Table of Contents

- [Initial Setup](#initial-setup)
- [Development Workflow](#development-workflow)
- [Figma Integration](#figma-integration)
- [Claude Code Setup](#claude-code-setup)
- [Common Tasks](#common-tasks)

## Initial Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Git
- Claude Code CLI (for AI-assisted development)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Relogate-Website

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development Workflow

### Branch Strategy

```
main                 # Production-ready code
└── dev              # Development integration
    ├── feature/*    # New features (feature/add-user-profile)
    ├── fix/*        # Bug fixes (fix/login-validation)
    └── chore/*      # Maintenance (chore/update-deps)
```

**Workflow:**
1. Create branch from `dev`: `git checkout -b feature/my-feature dev`
2. Make changes and commit
3. Push and create PR to `dev`
4. After review, merge to `dev`
5. Periodic releases: merge `dev` to `main`

### Running the Dev Server

```bash
npm run dev
```

The site runs at [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
# Build
npm run build

# Preview production build
npm start
```

### Code Quality

```bash
# Run linting
npm run lint
```

## Figma Integration

### Overview

This project uses Figma as the design source of truth. Screenshots are cached locally to reduce API calls.

### Figma Cache Setup

```bash
# Set your Figma Personal Access Token
export FIGMA_TOKEN="your-token-here"

# Cache all designs (run once, then as needed)
npm run figma:cache -- --all

# List available designs
npm run figma:cache -- --list
```

### Figma URLs

Design references are stored in `docs/design/figma_urls.md`:

```markdown
## Homepage
### Mobile
- mobile HP1: https://www.figma.com/design/.../Relogate?node-id=265-683
- mobile HP2: https://www.figma.com/design/.../Relogate?node-id=276-4579

### Desktop
- HP Relogate: https://www.figma.com/design/.../Relogate?node-id=167-1882
```

### Cache Structure

```
docs/design/figma_cache/
└── <slug>/
    ├── meta.json         # Metadata
    └── render@2x.png     # Screenshot at 2x scale
```

### Design Token Mapping

| Figma Color | CSS Variable |
|-------------|--------------|
| `#1D1D1B` | `--color-ink` |
| `#215388` | `--color-primary` |
| `#239083` | `--color-accent-green` |
| `#F7F7F7` | `--color-gray-100` |
| `#C6C6C6` | `--color-gray-200` |
| `#706F6F` | `--color-gray-400` |

## Claude Code Setup

### What is Claude Code?

Claude Code is Anthropic's AI coding assistant CLI that understands project context through CLAUDE.md files.

### Agent Memory Structure

```
.claude/
├── CLAUDE.md              # Main context (loaded automatically)
└── rules/                 # Domain-specific rules
    ├── design/
    │   ├── figma.md       # Figma workflow
    │   └── visual-verification.md
    └── frontend/
        ├── nextjs.md      # Next.js patterns
        ├── styling.md     # Tailwind/CSS
        ├── typescript.md  # TypeScript rules
        └── testing.md     # Test guidance
```

### Using Claude Code

1. **Start Claude Code**:
   ```bash
   cd Relogate-Website
   claude
   ```

2. **Effective prompts**:
   ```
   # Specific and actionable
   "Implement the mobile header matching docs/design/figma_cache/mobile-header/render@2x.png"

   # Reference existing patterns
   "Add a new step to the questionnaire following the pattern in QuestionnaireLayout.tsx"

   # Ask for exploration first
   "Read the services/auth.ts file and explain how authentication works"
   ```

3. **Plan before coding** (for complex tasks):
   ```
   "Create a plan for implementing user profile editing"
   ```

### Visual Verification

After implementing UI changes, verify with screenshots:

```bash
# Take screenshot at mobile resolution
npx playwright screenshot --viewport-size=375,812 --wait-for-timeout=1000 \
  http://localhost:3000/questionnaire docs/design/verify/questionnaire-mobile.png

# Compare with Figma cache
# Read both images in Claude to compare
```

## Common Tasks

### Adding a New Component

1. Determine location: `desktop/`, `mobile/`, `shared/`, or `questionnaire/`
2. Create component file
3. Add to barrel export (`index.ts`)
4. Import where needed

```tsx
// src/components/shared/NewComponent.tsx
"use client";

interface NewComponentProps {
  children: React.ReactNode;
}

export const NewComponent = ({ children }: NewComponentProps) => {
  return <div className="...">{children}</div>;
};

// src/components/shared/index.ts
export { NewComponent } from './NewComponent';
```

### Adding New Content

All Hebrew text goes in `src/content/he.ts`:

```typescript
export const siteContent = {
  newSection: {
    title: "כותרת חדשה",
    description: "תיאור...",
  },
};
```

### Working with Services

API calls go through the services layer:

```typescript
// src/services/my-service.ts
import { apiClient } from './api';

export async function fetchData() {
  return apiClient.get('/endpoint');
}

// Usage in component
import { fetchData } from '@/services/my-service';

useEffect(() => {
  fetchData().then(setData);
}, []);
```

### Adding a New Route

1. Create folder in `src/app/`
2. Add `page.tsx`
3. Optionally add `layout.tsx` for shared UI

```tsx
// src/app/new-route/page.tsx
"use client";

export default function NewPage() {
  return <div>New Page</div>;
}
```

### Working with the Questionnaire

The V2 questionnaire uses:
- `QuestionnaireLayout`: Responsive wrapper
- `QuestionnaireProgress`: Step indicator
- `QuestionnaireNavigation`: Back/Continue buttons
- `steps/`: Individual step components

To add a new step:
1. Create step component in `components/questionnaire/steps/`
2. Add step config in `steps/types.ts`
3. Register in the step flow

## Troubleshooting

### Build Errors

**TypeScript errors**
- Run `npm run lint` for specific issues
- Check import paths use `@/` alias

**Missing dependencies**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Development Server Issues

**Port already in use**
```bash
npx kill-port 3000
npm run dev
```

**Hot reload not working**
- Check for syntax errors in edited file
- Restart dev server

### Claude Code Issues

**Context seems wrong**
- Ensure you're in project root
- Check `.claude/CLAUDE.md` exists
- Use `/clear` to reset context

**MCP tools not available**
- Check MCP configuration in Claude Code settings
- Restart Claude Code
