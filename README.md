# Relogate Marketing Website

Marketing website for Relogate - an international company helping people relocate abroad.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| React | 19.2.1 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 12 |
| Fonts | Noto Sans Hebrew, Satoshi |

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main page with mobile/desktop detection
│   ├── layout.tsx         # Root layout with fonts
│   └── globals.css        # Design tokens & global styles
├── components/
│   ├── desktop/           # Desktop-specific components
│   ├── mobile/            # Mobile-specific components
│   └── shared/            # Reusable UI components
└── content/
    └── he.ts              # Hebrew content (all user-facing text)

docs/
├── ARCHITECTURE.md        # Codebase architecture documentation
├── DEVELOPER_GUIDE.md     # Setup guide for developers
└── design/
    ├── figma_urls.md      # Source of truth for Figma links
    └── figma_cache/       # Cached Figma screenshots & metadata

scripts/
└── figma_cache.mjs        # CLI for caching Figma assets

.claude/                   # Claude Code agent memory
├── CLAUDE.md             # Main agent context
└── rules/                # Domain-specific rules
```

## Key Features

- **RTL Support**: Site is in Hebrew with full RTL layout support
- **Responsive Design**: Separate mobile and desktop experiences
- **Splash Screen**: Animated intro for first-time visitors
- **Scroll Animations**: Framer Motion-powered scroll interactions
- **Figma Integration**: Design-to-code workflow with caching

## Documentation

- [Architecture Overview](docs/ARCHITECTURE.md) - Codebase structure, components, styling
- [Developer Guide](docs/DEVELOPER_GUIDE.md) - Setup, Figma workflow, Claude Code usage

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run figma:cache` | Cache all Figma URLs |
| `npm run figma:cache:one <id>` | Cache single Figma entry |

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Required for Figma caching
FIGMA_TOKEN=your-figma-personal-access-token
```

## Design Resources

Figma designs are tracked in `docs/design/figma_urls.md`. Use the caching system to avoid hitting Figma API repeatedly:

```bash
# Set your token
export FIGMA_TOKEN="your-token"

# Cache all designs
npm run figma:cache
```

See [Developer Guide](docs/DEVELOPER_GUIDE.md) for detailed Figma workflow.

## Contributing

1. Create a feature branch from `main`
2. Make changes following existing patterns
3. Ensure `npm run build` passes
4. Submit a pull request

## License

Proprietary - All rights reserved.
