---
title: "SSGOI API Reference"
description: "Detailed API documentation for the SSGOI library"
order: 4
group: "Advanced"
---

# SSGOI API Reference

This document provides a comprehensive reference for the SSGOI (Svelte Smooth Go Transition Library) API.

## Table of Contents

1. [Ssgoi Component](#ssgoi-component)
2. [PageTransition Component](#pagetransition-component)
3. [createTransitionConfig Function](#createtransitionconfig-function)
4. [Built-in Transitions](#built-in-transitions)

## Ssgoi Component

The `Ssgoi` component is the main wrapper for your entire Svelte application.

### Props

| Prop | Type | Description |
|------|------|-------------|
| onNavigate | Function | SvelteKit's navigation function |
| config | TransitionConfig | Your transition configuration |
| class | string | (Optional) Custom class for styling |

### Usage

```svelte
<script lang="ts">
  import { onNavigate } from '$app/navigation';
  import { Ssgoi } from 'ssgoi';
  import config from './transitionConfig';

  let className = 'your-custom-class';
</script>

<Ssgoi {onNavigate} {config} class={className}>
  <slot />
</Ssgoi>
```

## PageTransition Component

The `PageTransition` component wraps the content of each individual page.

### Props

| Prop | Type | Description |
|------|------|-------------|
| class | string | (Optional) Custom class for styling |

### Usage

```svelte
<script lang="ts">
  import { PageTransition } from 'ssgoi';

  let className = 'your-custom-page-class';
</script>

<PageTransition class={className}>
  <!-- Your page content here -->
</PageTransition>
```

### Additional Features

The `PageTransition` component adds a `data-page-transition` attribute to its wrapper div, which can be used for CSS targeting:

```css
[data-page-transition] {
  /* Your styles here */
}
```

## createTransitionConfig Function

This function creates a configuration object for your transitions.

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| config | TransitionConfigInput | An object containing your transition rules |

### Returns

| Type | Description |
|------|-------------|
| TransitionConfig | A configuration object for use with the Ssgoi component |

### Usage

```typescript
import { createTransitionConfig, transitions } from 'ssgoi';

const config = createTransitionConfig({
  transitions: [
    {
      from: '/home',
      to: '/about',
      transitions: transitions.fade()
    },
    // More transition rules...
  ],
  defaultTransition: transitions.fade()
});
```

## Built-in Transitions

SSGOI provides several built-in transition effects.

### fade

```typescript
transitions.fade(options?: { duration?: number })
```

### slide

```typescript
transitions.slide(options?: { duration?: number, direction?: 'left' | 'right' | 'up' | 'down' })
```

### scale

```typescript
transitions.scale(options?: { duration?: number, start?: number, opacity?: boolean })
```

### flip

```typescript
transitions.flip(options?: { duration?: number, direction?: 'x' | 'y' })
```

### blur

```typescript
transitions.blur(options?: { duration?: number, amount?: number })
```

Each transition function returns a `TransitionFunction` that can be used in your transition configuration.

---

For more detailed usage examples and advanced features, please refer to our other documentation pages.