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
- Claude Code CLI (for AI-assisted development with Figma MCP)

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
├── mobile_dev       # Mobile development integration
├── alex_dev         # Development integration
└── feature/*        # Feature branches
    fix/*            # Bug fix branches
    docs/*           # Documentation branches
```

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

This project uses a design-to-code workflow with Figma as the source of truth. The Claude agent automatically manages a local cache of Figma screenshots and metadata using MCP tools.

**No manual token setup or scripts required** - Figma MCP authentication is handled through Claude Code settings.

### Figma URLs

Design references are stored in `docs/design/figma_urls.md`:

```markdown
mobile header without: https://www.figma.com/design/9iC5uUB.../Relogate?node-id=270-1598
mobile HP2: https://www.figma.com/design/9iC5uUB.../Relogate?node-id=276-4579
HP Relogate: https://www.figma.com/design/9iC5uUB.../Relogate?node-id=167-1882
```

### Agent-Managed Cache

The Claude agent automatically:

1. Checks if a cached screenshot exists in `docs/design/figma_cache/<slug>/`
2. If cached: Uses the local image (no API call)
3. If not cached: Fetches via Figma MCP and saves to cache

Cache structure:
```
docs/design/figma_cache/
└── <slug>/
    ├── meta.json         # Metadata (url, nodeId, label)
    ├── render@2x.png     # Screenshot at 2x scale
    └── design_context.md # Optional: MCP design context
```

### Figma-to-Code Workflow

1. **Find the design**: Look up the relevant frame in `docs/design/figma_urls.md`

2. **Ask Claude**: Reference the design by label:
   ```
   "Implement the mobile HP2 design from Figma"
   ```

3. **Claude handles caching**: The agent checks cache, fetches if needed, and uses the screenshot for implementation

4. **Implement**: Claude matches colors, spacing, typography from the design

### Design Token Mapping

When implementing designs, map Figma values to CSS tokens:

| Figma Color | CSS Variable |
|-------------|--------------|
| `#1D1D1B` | `--color-ink` |
| `#215388` | `--color-primary` |
| `#239083` | `--color-accent-green` |
| `#203170` | `--color-navy` |
| `#F7F7F7` | `--color-gray-100` |
| `#F9F6F1` | `--color-gray-warm` |

## Claude Code Setup

### What is Claude Code?

Claude Code is Anthropic's AI coding assistant CLI. This project includes agent memory files that help Claude understand the codebase context.

### Installation

```bash
# Install Claude Code globally
npm install -g @anthropic-ai/claude-code

# Or use npx
npx @anthropic-ai/claude-code
```

### Agent Memory Structure

The `.claude/` directory contains agent context:

```
.claude/
├── CLAUDE.md              # Main agent memory
│   ├── Stack Summary      # Tech stack overview
│   ├── Commands           # Available npm scripts
│   ├── Repo Structure     # Directory layout
│   ├── Rules of Engagement # Coding guidelines
│   ├── Figma Workflow     # Design integration
│   └── Design Tokens      # Color/spacing values
│
└── rules/                 # Domain-specific rules
    ├── design/
    │   └── figma.md       # Figma workflow rules
    └── frontend/
        ├── styling.md     # Styling guidelines
        ├── typescript.md  # TS patterns
        └── testing.md     # Test guidance
```

### Using Claude Code with This Project

1. **Start Claude Code in the project root**:
   ```bash
   cd Relogate-Website
   claude
   ```

2. **Claude automatically loads**:
   - `.claude/CLAUDE.md` - Main context
   - `.claude/rules/**/*.md` - All rule files

3. **Working with Figma**:

   Claude Code has access to Figma MCP tools:
   ```
   mcp__figma__get_screenshot    # Render node as image
   mcp__figma__get_design_context # Get layout/styling hints
   mcp__figma__get_metadata      # Get node structure
   ```

   The agent automatically manages the cache - checking local files before calling MCP.

4. **Example prompts**:
   ```
   "Implement the mobile header from Figma"
   "Fix the scroll animation in BannerToInfoTransition"
   "Add a new FAQ item matching the existing pattern"
   ```

### Best Practices with Claude Code

1. **Reference Figma URLs**: Point to specific frames:
   ```
   "Implement the design from docs/design/figma_urls.md - HP Relogate"
   ```

2. **Request small changes**:
   ```
   "Update just the button color to match the primary token"
   ```

3. **Verify builds**:
   ```
   "Run npm run build after making changes"
   ```

### Configuring MCP for Figma

To use Figma MCP tools, configure your Claude Code MCP settings:

1. Create or edit `~/.claude/mcp.json` (or use Claude Code's MCP settings)

2. Add the Figma MCP server configuration

3. Restart Claude Code to load the MCP server

4. Verify Figma tools are available:
   ```
   /mcp
   ```

## Common Tasks

### Adding a New Component

1. Determine if desktop, mobile, or shared
2. Create component file in appropriate directory
3. Add to barrel export (`index.ts`)
4. Import in page or parent component

```tsx
// src/components/shared/NewComponent.tsx
export const NewComponent = ({ children }) => {
  return <div>{children}</div>;
};

// src/components/shared/index.ts
export { NewComponent } from './NewComponent';
```

### Adding New Content

All text goes in `src/content/he.ts`:

```typescript
export const siteContent = {
  // Add new section
  newSection: {
    title: "כותרת חדשה",
    description: "תיאור...",
  },
};
```

### Creating a New Page Section

1. Create component in `src/components/desktop/` or `src/components/mobile/`
2. Import content from `src/content/he.ts`
3. Add to page.tsx in correct order
4. Style using existing design tokens

### Implementing a Figma Design

1. Find the URL in `docs/design/figma_urls.md`
2. Ask Claude to implement:
   ```
   "Implement the mobile HP3 design from Figma"
   ```
3. Claude will check cache, fetch if needed, and implement

### Debugging Scroll Animations

The `BannerToInfoTransition` component uses scroll-based animations:

```tsx
const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ["start center", "end end"]
});

const value = useTransform(
  scrollYProgress,
  [0, 0.5, 1],      // Input range (scroll progress)
  [100, 50, 0]      // Output range (animated value)
);
```

Key parameters:
- `offset`: When animation starts/ends relative to viewport
- `useTransform`: Maps scroll progress to animated values
- Container height: Controls total scroll distance

## Troubleshooting

### Build Errors

**TypeScript errors**
- Check for missing types
- Run `npm run lint` for hints

**Missing dependencies**
- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules
  npm install
  ```

### Claude Code Issues

**MCP tools not available**
- Check MCP configuration
- Restart Claude Code

**Agent doesn't know project context**
- Ensure you're in the project root directory
- Check that `.claude/CLAUDE.md` exists
