# Testing Rules

## Current State

No test framework is currently installed in this repo.

## If Tests Are Added

When adding tests, prefer:

1. **Vitest** for unit/component tests (fast, ESM-native, works well with React)
2. **React Testing Library** for component testing
3. **Playwright** for E2E testing

## Recommended Structure

```
src/
├── components/
│   └── shared/
│       ├── Button.tsx
│       └── Button.test.tsx    # Co-locate tests
tests/
└── e2e/                       # E2E tests
    └── home.spec.ts
```

## Testing Priorities

Given this is a marketing site:

1. **Visual regression** - Ensure Figma-matching layouts don't break
2. **Accessibility** - Screen reader and keyboard navigation
3. **Responsive** - Mobile/desktop switching works correctly
4. **Animations** - Framer Motion transitions complete properly

## Running Tests

```bash
# When configured, typical commands would be:
npm test           # Unit tests
npm run test:e2e   # E2E tests
npm run test:cov   # Coverage
```

## Notes

- Component tests should mock `framer-motion` if animations cause flakiness
- RTL layout should be tested - ensure UI renders correctly in `dir="rtl"`
- Session storage mocking needed for splash screen tests
