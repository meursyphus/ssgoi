---
title: "SSGOI API Reference"
description: "Comprehensive guide to SSGOI's API, including functions, components, and configuration options"
order: 1
group: "Reference"
---

# SSGOI API Reference: Your Transition Spell Book 🧙‍♂️

Welcome to the SSGOI API Reference, where we unveil the secrets of smooth transitions! This is your comprehensive guide to all the magical incantations (functions), powerful artifacts (components), and mystical configurations that SSGOI offers. Let's dive into the arcane arts of page transitions!

## Table of Contents

1. [Core Functions](#core-functions)
2. [Components](#components)
3. [Transition Effects](#transition-effects)
4. [Configuration](#configuration)
5. [Utility Functions](#utility-functions)

## Core Functions

### `createTransitionConfig(config: TransitionConfigInput): TransitionConfig`

The grand architect of your transition realm. Use this to define how your pages should move.

```typescript
import { createTransitionConfig, transitions } from 'ssgoi';

const config = createTransitionConfig({
  '/': { '*': transitions.fade },
  '/blog': { 
    '/blog/:id': transitions.slide,
    '*': transitions.fade
  },
  '*': { '*': transitions.zoom }
});
```

Parameters:
- `config`: An object mapping routes to their respective transitions.

Returns:
- A `TransitionConfig` object to be used with the `PageTransition` component.

## Components

### `PageTransition`

The mystical portal through which your pages travel. Wrap your app's content with this component to enable transitions.

```svelte
<script>
  import { PageTransition } from 'ssgoi';
  import transitionConfig from './transitionConfig';
</script>

<PageTransition {transitionConfig}>
  <slot />
</PageTransition>
```

Props:
- `transitionConfig`: The configuration object created by `createTransitionConfig`.

## Transition Effects

SSGOI comes with a set of pre-defined transition effects, each more magical than the last!

### `transitions.fade`

Makes your page fade in and out like a ghost at a disco.

```typescript
transitions.fade({ duration?: number })
```

### `transitions.slide`

Slides your page in and out like it's on a cosmic treadmill.

```typescript
transitions.slide({ duration?: number, direction?: 'left' | 'right' | 'up' | 'down' })
```

### `transitions.zoom`

Zooms your page in and out like it's being viewed through a cosmic magnifying glass.

```typescript
transitions.zoom({ duration?: number, scale?: number })
```

### `transitions.flip`

Flips your page like a interdimensional pancake.

```typescript
transitions.flip({ duration?: number, direction?: 'x' | 'y' })
```

## Configuration

### `TransitionConfigInput`

The blueprint of your transition universe.

```typescript
type TransitionConfigInput = {
  [fromRoute: string]: {
    [toRoute: string]: TransitionEffect | TransitionFunction
  }
};

type TransitionFunction = (from: RouteInfo, to: RouteInfo) => TransitionEffect;

interface RouteInfo {
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
}
```

## Utility Functions

### `isMobile(): boolean`

A crystal ball to detect if the user is on a mobile device.

```typescript
import { isMobile } from 'ssgoi';

const config = createTransitionConfig({
  '*': { '*': isMobile() ? transitions.fade : transitions.slide }
});
```

Returns:
- `true` if the user is on a mobile device, `false` otherwise.

### `preloadCode(path: string): Promise<void>`

Summons the spirits of future pages to preload them.

```typescript
import { preloadCode } from 'ssgoi';

// Preload the about page
preloadCode('/about');
```

Parameters:
- `path`: The path of the page to preload.

Returns:
- A Promise that resolves when the preloading is complete.

---

And there you have it, brave transition wizard! You now possess the knowledge of SSGOI's most powerful spells and artifacts. Use them wisely, and may your transitions always be smooth and your users always be amazed!

Remember, with great transition power comes great transition responsibility. Now go forth and make the web a more magical place! 🌟🔮
