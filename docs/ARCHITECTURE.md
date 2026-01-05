# Architecture Overview

This document describes the codebase architecture for the Relogate marketing website.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Application Flow](#application-flow)
- [Components](#components)
- [Styling System](#styling-system)
- [Content Management](#content-management)
- [Configuration Files](#configuration-files)

## Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.10 | React framework with App Router |
| React | 19.2.1 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |
| Framer Motion | 12.x | Animations |

### Key Choices

- **App Router**: Using Next.js 16's App Router for modern React Server Components support
- **Client Components**: Most components are `"use client"` due to animation requirements
- **CSS Variables**: Design tokens defined as CSS custom properties for consistency
- **RTL-First**: Hebrew language with right-to-left text direction

## Directory Structure

```
relogate-website/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx             # Main entry point
│   │   ├── layout.tsx           # Root layout (fonts, metadata)
│   │   └── globals.css          # Design tokens & base styles
│   │
│   ├── components/
│   │   ├── desktop/             # Desktop-only components
│   │   │   ├── index.ts         # Barrel export
│   │   │   ├── Header.tsx       # Navigation header
│   │   │   ├── Hero.tsx         # Hero section
│   │   │   ├── SplashScreen.tsx # Intro animation
│   │   │   ├── AboutSection.tsx # About content
│   │   │   ├── BannerToInfoTransition.tsx # Scroll animation
│   │   │   ├── HowItWorks.tsx   # Process steps
│   │   │   ├── Testimonials.tsx # Customer reviews
│   │   │   ├── ArticlesCarousel.tsx # Press mentions
│   │   │   ├── FAQ.tsx          # Accordion Q&A
│   │   │   ├── Contact.tsx      # Contact info
│   │   │   └── Footer.tsx       # Site footer
│   │   │
│   │   ├── mobile/              # Mobile-only components
│   │   │   ├── index.ts         # Barrel export
│   │   │   ├── Splash.tsx       # Mobile splash
│   │   │   ├── WelcomeIntro.tsx # Intro sequence
│   │   │   ├── MobileHome.tsx   # Main mobile view
│   │   │   ├── MobileHeader.tsx # Mobile navigation
│   │   │   └── MobileHowItWorks.tsx
│   │   │
│   │   └── shared/              # Reusable components
│   │       ├── index.ts         # Barrel export
│   │       ├── Button.tsx       # Primary, secondary, ghost variants
│   │       ├── Card.tsx         # Card container
│   │       ├── Accordion.tsx    # Expandable sections
│   │       ├── Icon.tsx         # SVG icon wrapper
│   │       ├── Stars.tsx        # Rating stars
│   │       └── GlobeWatermark.tsx # Decorative element
│   │
│   └── content/
│       └── he.ts                # Hebrew content strings
│
├── public/                      # Static assets
│   ├── fonts/                   # Satoshi font files
│   ├── *.svg, *.png, *.jpg     # Images
│   └── favicon.ico
│
├── docs/                        # Documentation
│   ├── ARCHITECTURE.md         # This file
│   ├── DEVELOPER_GUIDE.md      # Developer setup guide
│   └── design/
│       ├── figma_urls.md       # Figma frame URLs
│       └── figma_cache/        # Cached screenshots
│
├── scripts/
│   └── figma_cache.mjs         # Figma caching CLI
│
└── .claude/                     # Claude Code agent memory
    ├── CLAUDE.md               # Main agent context
    └── rules/                  # Domain rules
        ├── design/figma.md
        └── frontend/
            ├── styling.md
            ├── typescript.md
            └── testing.md
```

## Application Flow

### Entry Point (`src/app/page.tsx`)

The main page handles:

1. **Viewport Detection**: Determines mobile (`< 1024px`) vs desktop
2. **Session Management**: Tracks returning visitors via `sessionStorage`
3. **Phase Control**: Manages splash → intro → main content transitions

```
┌─────────────────────────────────────────┐
│              page.tsx                    │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Is Mobile? (<1024px)            │   │
│  └────────────┬────────────────────┘   │
│               │                         │
│       ┌───────┴───────┐                │
│       ▼               ▼                │
│   Mobile Flow    Desktop Flow          │
│                                         │
│   splash →       SplashScreen →        │
│   intro →        Main Content          │
│   MobileHome                           │
└─────────────────────────────────────────┘
```

### Desktop Section Order

1. `Header` - Fixed navigation
2. `Hero` - Title and CTA
3. `AboutSection` - Introduction
4. `BannerToInfoTransition` - Scroll-based animation
5. `HowItWorks` - 3-step process
6. `Testimonials` - Customer reviews carousel
7. `ArticlesCarousel` - Press mentions
8. `FAQ` - Accordion questions
9. `Contact` - Contact information
10. `Footer` - Links and copyright

## Components

### Shared Components (`src/components/shared/`)

Reusable UI primitives:

| Component | Props | Description |
|-----------|-------|-------------|
| `Button` | `variant`, `size`, `children` | Primary/secondary/ghost buttons |
| `Card` | `children`, `className` | Basic card container |
| `Accordion` | `title`, `children`, `defaultOpen` | Expandable section |
| `Icon` | `name`, `size` | SVG icon wrapper |
| `Stars` | `rating` | Star rating display |
| `GlobeWatermark` | `className` | Decorative background globe |

### Desktop Components (`src/components/desktop/`)

Page sections with scroll-based animations:

- **`BannerToInfoTransition`**: Complex scroll animation using Framer Motion's `useScroll` and `useTransform`. Animates image size and text fade-in based on scroll position.

### Mobile Components (`src/components/mobile/`)

Touch-optimized mobile experience with separate layout and navigation.

## Styling System

### Design Tokens (`src/app/globals.css`)

CSS custom properties define the design system:

```css
:root {
  /* Colors */
  --color-ink: #1D1D1B;           /* Primary text */
  --color-primary: #215388;        /* Brand blue */
  --color-accent-green: #239083;   /* Secondary accent */
  --color-navy: #203170;           /* Dark accent */
  --color-gray-100: #F7F7F7;       /* Light backgrounds */
  --color-gray-warm: #F9F6F1;      /* Warm backgrounds */
  --color-gray-200: #C6C6C6;       /* Borders */
  --color-gray-300: #B2B2B2;       /* Disabled text */
  --color-gray-400: #706F6F;       /* Secondary text */

  /* Layout */
  --container-max-width: 1400px;
  --container-padding: 20px;
  --header-height: 88px;
  --mobile-header-height: 52px;

  /* Animation */
  --transition-fast: 150ms ease-out;
  --transition-normal: 250ms ease-out;
  --transition-slow: 350ms ease-out;
}
```

### Tailwind Integration

Tailwind CSS 4 is configured via `@tailwindcss/postcss`. The `@theme inline` directive exposes CSS variables to Tailwind:

```css
@theme inline {
  --color-ink: #1D1D1B;
  --color-primary: #215388;
  /* ... */
}
```

Usage in components:

```tsx
// Using design tokens
<div className="bg-[var(--color-primary)]">

// Using Tailwind with hardcoded values (when matching Figma)
<div className="bg-[#215388]">

// Using predefined classes
<div className="container">  // Applies max-width + padding
```

### Animation Patterns

#### Framer Motion (Complex Animations)

```tsx
import { motion, useScroll, useTransform } from "framer-motion";

// Scroll-based animation
const { scrollYProgress } = useScroll({ target: ref });
const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

<motion.div style={{ opacity }}>
```

#### CSS Animations (Simple Transitions)

```tsx
<div className="animate-fade-in">
<div className="animate-slide-up">
```

### RTL Support

The site is Hebrew (RTL). Key patterns:

```tsx
// Root direction
<html dir="rtl">

// Component-level override
<div dir="rtl" className="text-right">

// Logical properties
className="margin-inline-start-4"  // Instead of margin-left
```

## Content Management

All user-facing text is centralized in `src/content/he.ts`:

```typescript
export const siteContent = {
  meta: { title: "...", description: "..." },
  nav: { items: [...], cta: "..." },
  hero: { title: "...", subtitle: "..." },
  // ... all sections
};

// Type exports for TypeScript
export type SiteContent = typeof siteContent;
```

Usage in components:

```tsx
import { siteContent } from "@/content/he";

const { hero } = siteContent;
<h1>{hero.title}</h1>
```

## Configuration Files

### `next.config.ts`

Minimal Next.js configuration:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

### `tsconfig.json`

TypeScript with strict mode and path aliases:

```json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### `postcss.config.mjs`

PostCSS with Tailwind CSS 4:

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

### `eslint.config.mjs`

ESLint 9 with Next.js config:

```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [...compat.extends("next/core-web-vitals")];

export default eslintConfig;
```

## Best Practices

### Component Guidelines

1. **Keep components under 200 lines** - Extract sub-components when growing
2. **Use barrel exports** - Each component folder has `index.ts`
3. **Prefer existing components** - Check `shared/` before creating new
4. **Client components only when needed** - Use `"use client"` directive

### Styling Guidelines

1. **Use design tokens** - Reference CSS variables, not magic numbers
2. **Tailwind for layout** - Use utility classes for spacing, flex, grid
3. **RTL-aware** - Use logical properties when possible

### Content Guidelines

1. **Centralize text** - All strings in `content/he.ts`
2. **Type exports** - Export types for content structures
3. **Match Figma labels** - Keep content keys aligned with design
