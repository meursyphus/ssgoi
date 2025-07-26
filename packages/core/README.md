# @ssgoi/core

Core animation engine for SSGOI - Spring physics-based page transitions.

## Installation

```bash
npm install @ssgoi/core
# or
yarn add @ssgoi/core
# or
pnpm add @ssgoi/core
```

## What is @ssgoi/core?

The core package provides the foundational animation engine that powers SSGOI's spring physics-based transitions. It includes:

- Spring physics animation engine
- Transition configuration types
- Transition context management
- Built-in transition presets

## Basic Usage

```typescript
import { createSsgoiTransitionContext } from '@ssgoi/core';
import { fade, slide } from '@ssgoi/core/view-transitions';

// Create transition context
const context = createSsgoiTransitionContext({
  defaultTransition: fade(),
  transitions: [
    { from: '/home', to: '/about', transition: slide({ direction: 'left' }) }
  ]
});
```

## Transition Structure

```typescript
interface TransitionConfig {
  spring?: {
    stiffness: number; // Spring stiffness (default: 300)
    damping: number;   // Damping ratio (default: 30)
  };
  tick?: (progress: number) => void;
  prepare?: (element: HTMLElement) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

interface Transition {
  in?: (element: HTMLElement) => TransitionConfig;
  out?: (element: HTMLElement) => TransitionConfig;
}
```

## Built-in Transitions

### View Transitions (`/view-transitions`)
- `fade()` - Opacity transition
- `slide()` - Directional slide (left/right/up/down)
- `scale()` - Scale transition
- `hero()` - Shared element transition
- `pinterest()` - Pinterest-style expansion
- `ripple()` - Material ripple effect

### Element Transitions (`/transitions`)
- `fade`, `fadeIn`, `fadeOut`
- `slide`, `slideUp`, `slideDown`, `slideLeft`, `slideRight`
- `scale`, `scaleIn`, `scaleOut`
- `bounce`, `blur`, `rotate`

## Spring Physics

All animations use spring physics for natural motion:

```typescript
// Customize spring behavior
slide({
  direction: 'left',
  spring: {
    stiffness: 300,  // 1-1000
    damping: 30      // 0-100
  }
})
```

## Framework Bindings

This is the core engine. For framework integration, use:
- React: `@ssgoi/react`
- Svelte: `@ssgoi/svelte`

## Documentation

Visit [https://ssgoi.dev](https://ssgoi.dev) for complete documentation.

## License

MIT © [MeurSyphus](https://github.com/meursyphus)