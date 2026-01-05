# Styling Rules

## System

- **Tailwind CSS 4** via `@tailwindcss/postcss`
- **CSS Custom Properties** for design tokens (defined in `globals.css`)
- **Framer Motion** for animations

## Design Tokens

Always use tokens from `globals.css`, not magic numbers:

```css
/* Colors */
--color-ink: #1D1D1B          /* Primary text */
--color-primary: #215388      /* Brand blue, CTAs */
--color-accent-green: #239083 /* Secondary accent */
--color-navy: #203170         /* Dark accent */
--color-gray-100: #F7F7F7     /* Light backgrounds */
--color-gray-warm: #F9F6F1    /* Warm backgrounds */
--color-gray-200: #C6C6C6     /* Borders */
--color-gray-300: #B2B2B2     /* Disabled text */
--color-gray-400: #706F6F     /* Secondary text */

/* Spacing */
--container-max-width: 1400px
--container-padding: 20px
--header-height: 88px
--mobile-header-height: 52px

/* Animation */
--transition-fast: 150ms ease-out
--transition-normal: 250ms ease-out
--transition-slow: 350ms ease-out
```

## Usage Patterns

### Tailwind with CSS Vars
```tsx
// Preferred: Use CSS variable values directly in Tailwind
<div className="bg-[#215388] text-white">  // Hard-coded hex OK for component styles
<div className="text-[var(--color-ink)]">  // Or reference CSS var
```

### Classes from globals.css
```tsx
// Use predefined utility classes
<div className="container">        // max-width + padding
<main className="desktop-frame">   // 1440px max
```

## Responsive Breakpoints

- Mobile: `< 1024px` (detected via JS in page.tsx)
- Desktop: `>= 1024px`
- Tailwind prefix: `lg:` for desktop-specific styles

```tsx
<div className="py-8 lg:py-16">
<div className="grid lg:grid-cols-2">
```

## No Magic Numbers

```tsx
// Bad
<div className="p-[17px] gap-[13px]">

// Good - use standard scale or tokens
<div className="p-4 gap-3">
<div className="rounded-[10px]">  // OK if matching Figma spec
```

## Animation Patterns

### Framer Motion
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>

// Interactive
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
```

### CSS Animations
```tsx
// Use predefined classes
<div className="animate-fade-in">
<div className="animate-slide-up">
```

## RTL Considerations

- Root has `dir="rtl"`
- Use logical properties: `margin-inline`, `padding-inline`
- Flex/grid items auto-reverse in RTL
- `text-right` is default for RTL
