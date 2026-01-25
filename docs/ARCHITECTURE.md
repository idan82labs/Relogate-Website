# Architecture Overview

This document describes the codebase architecture for the Relogate platform - a relocation assistance application with marketing site, questionnaire system, user dashboard, and admin interface.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Application Layers](#application-layers)
- [Route Structure](#route-structure)
- [Components](#components)
- [Services Layer](#services-layer)
- [State Management](#state-management)
- [Styling System](#styling-system)
- [Content Management](#content-management)

## Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.10 | React framework with App Router |
| React | 19.2.1 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |
| Framer Motion | 12.x | Animations |

### Key Architectural Decisions

- **App Router**: Next.js 16 App Router with client components for animations
- **Services Layer**: Centralized API integration via service modules
- **React Contexts**: Auth and app state management
- **RTL-First**: Hebrew language with right-to-left layout
- **Responsive Split**: Separate mobile/desktop component trees

## Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage (mobile/desktop detection)
│   ├── layout.tsx                # Root layout (fonts, metadata)
│   ├── providers.tsx             # Context providers wrapper
│   ├── globals.css               # Design tokens & base styles
│   ├── questionnaire/            # V1 questionnaire flow
│   │   └── v2/                   # V2 questionnaire (primary)
│   ├── personal-area/            # User dashboard
│   │   └── report/               # Report viewer
│   ├── admin/                    # Admin interface
│   │   ├── login/                # Admin authentication
│   │   └── reports/              # Report management
│   ├── login/                    # User login
│   ├── register/                 # User registration
│   └── api/                      # API routes
│       └── log/                  # Logging endpoint
│
├── components/
│   ├── desktop/                  # Desktop-specific components
│   │   ├── Header.tsx            # Navigation header
│   │   ├── Hero.tsx              # Hero section
│   │   ├── Footer.tsx            # Site footer
│   │   ├── QuestionnaireLanding.tsx
│   │   ├── QuestionnaireStep.tsx
│   │   └── ResultsPage.tsx       # Report results view
│   │
│   ├── mobile/                   # Mobile-specific components
│   │   ├── MobileHeader.tsx
│   │   ├── MobileFooter.tsx
│   │   ├── MobileHomepage.tsx
│   │   ├── MobileQuestionnaireLanding.tsx
│   │   ├── MobileQuestionnaireStep.tsx
│   │   └── MobileResultsPage.tsx
│   │
│   ├── questionnaire/            # V2 questionnaire components
│   │   ├── QuestionnaireLayout.tsx
│   │   ├── QuestionnaireNavigation.tsx
│   │   ├── QuestionnaireProgress.tsx
│   │   └── steps/                # Individual step components
│   │
│   └── shared/                   # Reusable UI components
│       ├── Button.tsx            # Button variants
│       ├── Card.tsx              # Card container
│       ├── Accordion.tsx         # Expandable sections
│       ├── AuthGuard.tsx         # Route protection
│       ├── ResponseEditor.tsx    # Admin report editor
│       └── ResponsePreview.tsx   # Report preview
│
├── contexts/                     # React Context providers
│   ├── AuthContext.tsx           # Authentication state
│   └── index.ts                  # Context exports
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Authentication hook
│   └── useQuestionnaire.ts       # Questionnaire state
│
├── services/                     # API integration layer
│   ├── api.ts                    # Base API client
│   ├── auth.ts                   # Authentication service
│   ├── questionnaire.ts          # V1 questionnaire API
│   ├── questionnaire-v2.ts       # V2 questionnaire API
│   ├── questionnaire-migration.ts # V1→V2 migration
│   ├── questionnaire-status.ts   # Questionnaire status checks
│   ├── reports.ts                # Reports API (admin)
│   ├── userReports.ts            # Reports API (user)
│   ├── notifications.ts          # Notification service
│   ├── payments.ts               # Stripe payment service
│   ├── blog.ts                   # Blog/press articles
│   └── admin.ts                  # Admin management service
│
├── types/                        # TypeScript definitions
│   ├── api.ts                    # API response types
│   ├── questionnaire.ts          # Questionnaire types
│   └── report.ts                 # Report types
│
├── utils/                        # Utility functions
│   └── validation.ts             # Form validation helpers
│
├── lib/                          # Shared libraries
│   └── markdown.ts               # Markdown rendering
│
└── content/
    └── he.ts                     # Hebrew content strings
```

## Application Layers

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION                          │
│  Components (desktop/, mobile/, shared/, questionnaire/) │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT                      │
│         Contexts (AuthContext) + Custom Hooks            │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    SERVICES LAYER                        │
│     API integration (services/*.ts) + Business Logic     │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    BACKEND API                           │
│          Express server (separate repository)            │
└─────────────────────────────────────────────────────────┘
```

## Route Structure

### Public Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | page.tsx | Homepage (mobile/desktop detection) |
| `/login` | login/page.tsx | User authentication |
| `/register` | register/page.tsx | User registration |
| `/blog` | blog/page.tsx | Blog listing |
| `/blog/[slug]` | blog/[slug]/page.tsx | Blog post detail |
| `/press` | press/page.tsx | Press articles |
| `/press/[slug]` | press/[slug]/page.tsx | Press article detail |

### Questionnaire Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/questionnaire` | questionnaire/page.tsx | V1 questionnaire landing |
| `/questionnaire/v2` | questionnaire/v2/page.tsx | V2 questionnaire flow |
| `/questionnaire/results` | questionnaire/results/page.tsx | Results display |

### User Routes (Protected)

| Route | Component | Description |
|-------|-----------|-------------|
| `/personal-area` | personal-area/page.tsx | User dashboard |
| `/personal-area/report` | personal-area/report/page.tsx | Report viewer |
| `/personal-area/checkout` | personal-area/checkout/page.tsx | Payment checkout |
| `/personal-area/checkout/success` | personal-area/checkout/success/page.tsx | Payment success |

### Admin Routes (Admin Only)

| Route | Component | Description |
|-------|-----------|-------------|
| `/admin` | admin/page.tsx | Admin dashboard |
| `/admin/login` | admin/login/page.tsx | Admin authentication |
| `/admin/users` | admin/users/page.tsx | User management |
| `/admin/users/[userId]/questionnaire` | admin/users/.../page.tsx | View user questionnaire |
| `/admin/reports` | admin/reports/page.tsx | Report management |
| `/admin/reports/[id]` | admin/reports/[id]/page.tsx | Single report view |
| `/admin/reports/[id]/edit` | admin/reports/[id]/edit/page.tsx | Edit report |
| `/admin/reports/[id]/preview` | admin/reports/[id]/preview/page.tsx | Preview report |
| `/admin/reports/[id]/responses/new` | admin/reports/.../new/page.tsx | Add destination |
| `/admin/reports/[id]/responses/[responseId]` | admin/reports/.../page.tsx | View destination |
| `/admin/reports/[id]/responses/[responseId]/edit` | admin/reports/.../edit/page.tsx | Edit destination |
| `/admin/payments` | admin/payments/page.tsx | Payment management |

## Components

### Component Organization

Components are split by platform and purpose:

- **desktop/**: Full-width layouts for screens ≥1024px
- **mobile/**: Touch-optimized layouts for screens <1024px
- **questionnaire/**: V2 questionnaire-specific components
- **shared/**: Platform-agnostic reusable components

### Key Shared Components

| Component | Purpose |
|-----------|---------|
| `Button` | Primary, secondary, outline, ghost variants |
| `Card` | Container with shadow and border radius |
| `Accordion` | Expandable content sections |
| `AuthGuard` | Route protection wrapper |
| `ResponseEditor` | Admin interface for editing reports |
| `ResponsePreview` | Report content preview |
| `CountryCard` | Country recommendation card |
| `MatchScoreCircle` | Circular score visualization |

## Services Layer

The services layer (`src/services/`) handles all API communication:

### API Client (`api.ts`)

Base configuration for API requests:
- Base URL from environment
- Error handling
- Response type definitions

### Authentication (`auth.ts`)

- Login/logout
- Session management
- User state

### Questionnaire Services

- `questionnaire.ts`: V1 questionnaire API
- `questionnaire-v2.ts`: V2 questionnaire API with enhanced features
- `questionnaire-migration.ts`: Migration utilities between versions

### Reports

- `reports.ts`: Admin report management (create, edit, publish)
- `userReports.ts`: User report viewing

### Payments (`payments.ts`)

- Stripe checkout integration
- Payment status checking
- Payment history

### Blog (`blog.ts`)

- Blog post fetching
- Press article fetching
- Category filtering

### Admin (`admin.ts`)

- User management (list, create, update, deactivate)
- Payment oversight
- Questionnaire viewing

### Notifications (`notifications.ts`)

- Fetch user notifications
- Mark as read
- Unread count

## State Management

### Authentication Context

```typescript
// src/contexts/AuthContext.tsx
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  login: (credentials) => Promise<void>;
  logout: () => void;
}
```

### Local State Patterns

- **useState**: Component-local state
- **useReducer**: Complex state transitions (questionnaire steps)
- **sessionStorage**: Persistent session data (splash screen, form progress)

## Styling System

### Design Tokens (`globals.css`)

```css
:root {
  /* Colors */
  --color-ink: #1D1D1B;           /* Primary text */
  --color-primary: #215388;        /* Brand blue */
  --color-accent-green: #239083;   /* Secondary accent */
  --color-gray-100: #F7F7F7;       /* Light backgrounds */
  --color-gray-200: #C6C6C6;       /* Borders */
  --color-gray-400: #706F6F;       /* Secondary text */

  /* Layout */
  --container-max-width: 1400px;
  --header-height: 88px;
  --mobile-header-height: 52px;

  /* Animation */
  --transition-fast: 150ms ease-out;
  --transition-normal: 250ms ease-out;
}
```

### Tailwind Usage

```tsx
// Design token reference
<div className="bg-[var(--color-primary)]">

// Direct hex (when matching Figma exactly)
<div className="bg-[#215388]">

// Predefined utility class
<div className="container">
```

### RTL Support

- Root `dir="rtl"` on `<html>`
- Logical properties for margins/padding
- Flex/grid auto-reverse in RTL context

## Content Management

All user-facing Hebrew text in `src/content/he.ts`:

```typescript
export const siteContent = {
  meta: { title: "...", description: "..." },
  nav: { items: [...] },
  hero: { title: "...", cta: "..." },
  questionnaireV2: { steps: [...], navigation: {...} },
  // ... all sections
};
```

Access in components:
```tsx
import { siteContent } from "@/content/he";
const { hero, questionnaireV2 } = siteContent;
```

## Best Practices

### Component Guidelines

1. Keep components under 200 lines
2. Use barrel exports (`index.ts`) per folder
3. Check `shared/` before creating new components
4. Mark client components with `"use client"`

### Service Guidelines

1. All API calls through services layer
2. Type all request/response data
3. Handle errors consistently
4. Return typed responses

### Styling Guidelines

1. Use design tokens from `globals.css`
2. Tailwind for layout utilities
3. RTL-aware logical properties
4. Match Figma specifications exactly
