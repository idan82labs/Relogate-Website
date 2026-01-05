# TypeScript Rules

## Strictness

- `strict: true` enabled in tsconfig.json
- `noEmit: true` (Next.js handles compilation)
- Target: ES2017

## Path Aliases

```typescript
// Use @/* for src imports
import { Button } from "@/components/shared";
import { siteContent } from "@/content/he";
```

## Typing Patterns

### Props
```typescript
// Interface for component props
interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}
```

### Extending HTML/Motion Props
```typescript
// Extend existing types, omit conflicting props
interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: ButtonVariant;
}
```

### Type Exports from Content
```typescript
// Export inferred types from content objects
export type SiteContent = typeof siteContent;
export type NavItem = (typeof siteContent.nav.items)[number];
```

## Avoid

- **`any`**: Use `unknown` or proper types
- **Excessive generics**: Keep simple unless truly needed
- **Type assertions**: Prefer type guards over `as`

## Prefer

- **Union types** over enums: `type Size = "sm" | "md" | "lg"`
- **Inference**: Let TS infer when obvious; explicit for public APIs
- **`readonly`**: For props that shouldn't be mutated
- **Discriminated unions**: For complex state

## React-Specific

```typescript
// Children type
children: React.ReactNode

// Event handlers
onClick: () => void
onChange: (e: React.ChangeEvent<HTMLInputElement>) => void

// Refs with forwardRef
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {})
Button.displayName = "Button";
```
