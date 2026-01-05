# Next.js Rules

## Routing

- **App Router**: Using Next.js 16 App Router (`src/app/`)
- **Pages**: Each route is a folder with `page.tsx`
- **Layouts**: Shared UI in `layout.tsx`; root layout sets HTML lang="he" dir="rtl"

## Server vs Client Components

- **Default**: Components are Server Components unless marked otherwise
- **Client Components**: Add `"use client"` directive at top of file when using:
  - React hooks (useState, useEffect, useCallback, etc.)
  - Browser APIs (window, document, sessionStorage)
  - Event handlers (onClick, onChange, etc.)
  - Framer Motion animations

## File Organization

```
src/
├── app/                    # Routes only
│   ├── layout.tsx          # Root layout (fonts, HTML structure)
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles + design tokens
├── components/
│   ├── desktop/            # Desktop-only: Header, Hero, Footer, etc.
│   ├── mobile/             # Mobile-only: MobileHome, Splash, etc.
│   └── shared/             # Platform-agnostic: Button, Card, Icon, etc.
└── content/
    └── he.ts               # Hebrew content (all user-facing strings)
```

## Patterns in This Repo

- **Barrel exports**: Each component folder has `index.ts` exporting all components
- **Responsive split**: Desktop/mobile views handled in `page.tsx` via viewport detection
- **No API routes**: Static marketing site; no `/api` endpoints
- **Session storage**: Used for splash screen tracking (`relogate_visited`)

## Component Rules

- Put new reusable components in `src/components/shared/`
- Desktop-specific sections go in `src/components/desktop/`
- Mobile-specific sections go in `src/components/mobile/`
- Export from barrel file after creating

## Loading & Error States

- Loading state uses animated placeholder (see `page.tsx` lines 92-124)
- Wrap conditional renders with `AnimatePresence` for smooth transitions
- No dedicated loading.tsx or error.tsx files yet (add if needed)
