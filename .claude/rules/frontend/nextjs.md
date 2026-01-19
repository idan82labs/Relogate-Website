# Next.js Rules

## Routing

- **App Router**: Using Next.js 16 App Router (`src/app/`)
- **Pages**: Each route is a folder with `page.tsx`
- **Layouts**: Shared UI in `layout.tsx`; root layout sets HTML lang="he" dir="rtl"

## Route Structure

| Route | Purpose |
|-------|---------|
| `/` | Homepage (mobile/desktop detection) |
| `/login`, `/register` | Authentication |
| `/questionnaire` | V1 questionnaire |
| `/questionnaire/v2` | V2 questionnaire (primary) |
| `/personal-area` | User dashboard |
| `/personal-area/report` | Report viewer |
| `/admin` | Admin dashboard |
| `/admin/reports/[id]` | Report management |

## Server vs Client Components

- **Default**: Components are Server Components unless marked otherwise
- **Client Components**: Add `"use client"` directive at top of file when using:
  - React hooks (useState, useEffect, useCallback, etc.)
  - Browser APIs (window, document, sessionStorage)
  - Event handlers (onClick, onChange, etc.)
  - Framer Motion animations
  - Context consumers (useAuth, etc.)

## File Organization

```
src/
├── app/                    # Routes
│   ├── layout.tsx          # Root layout (fonts, HTML structure)
│   ├── providers.tsx       # Context providers wrapper
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles + design tokens
│   ├── questionnaire/      # Questionnaire routes
│   ├── personal-area/      # User dashboard routes
│   ├── admin/              # Admin routes
│   └── api/                # API routes (logging, etc.)
├── components/
│   ├── desktop/            # Desktop-only components
│   ├── mobile/             # Mobile-only components
│   ├── questionnaire/      # V2 questionnaire components
│   └── shared/             # Platform-agnostic components
├── contexts/               # React Context providers
├── services/               # API integration layer
├── hooks/                  # Custom React hooks
└── content/
    └── he.ts               # Hebrew content
```

## Patterns

- **Barrel exports**: Each component folder has `index.ts` exporting all components
- **Responsive split**: Desktop/mobile views handled in `page.tsx` via viewport detection (1024px breakpoint)
- **Services layer**: All API calls go through `src/services/`, not direct fetch
- **Auth context**: Use `useAuth` hook from `@/contexts` for auth state
- **Session storage**: Used for splash screen tracking, form progress

## Component Rules

- Reusable components → `src/components/shared/`
- Desktop-specific → `src/components/desktop/`
- Mobile-specific → `src/components/mobile/`
- V2 questionnaire → `src/components/questionnaire/`
- Export from barrel file after creating

## Authentication

Routes requiring auth use `AuthGuard` wrapper:

```tsx
import { AuthGuard } from '@/components/shared';

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <PageContent />
    </AuthGuard>
  );
}
```

## Loading & Error States

- Loading state uses animated placeholder (see `page.tsx`)
- Wrap conditional renders with `AnimatePresence` for smooth transitions
- Use Suspense boundaries for async components when needed
