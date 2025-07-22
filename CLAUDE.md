# SSGOI Project Guide

## Overview

SSGOI (쓱오이) is a universal page transition library that brings native app-like transitions to web applications. It provides smooth, delightful page transitions that work across all modern browsers, unlike the browser's View Transition API which only works in Chrome.

## Project Structure

```
ssgoi/
├── packages/          # Core library packages
│   ├── core/         # Core transition engine and animations
│   ├── react/        # React-specific implementation
│   └── svelte/       # Svelte-specific implementation
├── apps/             # Demo applications and documentation
│   ├── docs/         # Documentation website (Next.js)
│   ├── react-demo/   # React/Next.js demo app
│   └── svelte-demo/  # SvelteKit demo app
└── [config files]    # Root configuration files
```

## Package Architecture Pattern

Each package follows a consistent structure:

### Core Package (`@ssgoi/core`)
```
packages/core/
├── src/
│   ├── lib/
│   │   ├── animator.ts              # Animation engine
│   │   ├── transition.ts            # Core transition logic
│   │   ├── transitions/             # Element transitions (fade, slide, etc.)
│   │   │   ├── blur.ts
│   │   │   ├── bounce.ts
│   │   │   ├── fade.ts
│   │   │   ├── rotate.ts
│   │   │   ├── scale.ts
│   │   │   └── slide.ts
│   │   └── view-transitions/        # Page transitions
│   │       ├── fade.ts
│   │       ├── hero.ts
│   │       ├── pinterest.ts
│   │       └── ripple.ts
│   └── components/                  # Shared components
```

### Framework Packages (`@ssgoi/react`, `@ssgoi/svelte`)
```
packages/[framework]/
├── src/
│   └── lib/
│       ├── context.[tsx|ts]         # Framework context provider
│       ├── ssgoi.[tsx|svelte]       # Main wrapper component
│       ├── ssgoi-transition.[tsx|svelte]  # Transition wrapper
│       ├── transition.ts            # Framework-specific transition hook
│       ├── transitions/             # Re-exports from core
│       └── view-transitions/        # Re-exports from core
```

## Key Components

### 1. **Ssgoi Provider**
- Wraps the entire application
- Manages global transition configuration
- Handles route change detection

### 2. **SsgoiTransition**
- Wraps individual pages/components
- Requires unique `id` prop (typically the route path)
- Manages enter/exit animations

### 3. **transition() Hook**
- For animating individual elements
- Supports mount/unmount animations
- Framework-specific implementation

## Transition Types

### View Transitions (Page-level)
- `fade()` - Smooth opacity transition
- `slide()` - Directional sliding
- `scale()` - Zoom in/out effect
- `hero()` - Shared element transitions
- `pinterest()` - Pinterest-style expand
- `ripple()` - Material Design ripple

### Element Transitions (Component-level)
- `fadeIn()` / `fadeOut()`
- `slideUp()` / `slideDown()` / `slideLeft()` / `slideRight()`
- `scaleIn()` / `scaleOut()`
- `bounce()`
- `blur()`
- `rotate()`

## Development Commands

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run specific demo
pnpm react-demo:dev    # http://localhost:3001
pnpm svelte-demo:dev   # http://localhost:5174
pnpm docs:dev          # Documentation site

# Run tests
pnpm test

# Lint and typecheck
pnpm lint
pnpm typecheck
```

## Important Patterns

### 1. **Consistent API Across Frameworks**
All framework implementations follow the same API pattern:
- Same component names (`Ssgoi`, `SsgoiTransition`)
- Same configuration structure
- Same transition names and options

### 2. **Spring-based Animations**
Uses Popmotion for physics-based animations, providing natural motion.

### 3. **SSR-First Design**
- No hydration issues
- SEO-friendly
- Works with all SSR frameworks (Next.js, Nuxt, SvelteKit)

### 4. **Router Agnostic**
- Works with any routing solution
- Doesn't interfere with existing navigation
- State persistence across browser back/forward

## Configuration Example

```typescript
const config = {
  // Default transition for all routes
  defaultTransition: fade(),
  
  // Route-specific transitions
  transitions: [
    {
      from: '/home',
      to: '/about',
      transition: slide({ direction: 'left' }),
      symmetric: true  // Auto-creates reverse transition
    },
    {
      from: '/products',
      to: '/products/*',  // Wildcard support
      transition: scale()
    }
  ]
};
```

## File Naming Conventions

- Use lowercase with hyphens for all files
- TypeScript files: `.ts` or `.tsx`
- Svelte components: `.svelte`
- Keep consistent naming across packages

## Testing Approach

When implementing new features:
1. Test in both React and Svelte demos
2. Verify SSR functionality
3. Check browser back/forward navigation
4. Test with different routers

## Common Tasks

### Adding a New Transition
1. Create transition in `packages/core/src/lib/transitions/`
2. Export from `packages/core/src/lib/transitions/index.ts`
3. Re-export in framework packages
4. Add demo usage in demo apps

### Updating Documentation
1. Documentation is in `apps/docs/content/`
2. Supports both English and Korean
3. Uses MDX format
4. Follow existing file structure

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- No IE11 support

## Key Technical Details

- Uses DOM lifecycle events for transition timing
- Maintains animation state during navigation
- Leverages spring physics for smooth motion
- Minimal bundle size focus
- Tree-shakeable exports

## Contributing Guidelines

1. Follow existing code patterns
2. Maintain TypeScript strict mode
3. Add tests for new features
4. Update documentation
5. Test in all demo apps
6. Ensure SSR compatibility

## License

MIT © MeurSyphus