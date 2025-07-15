---
title: "SSGOI API Reference"
description: "Detailed API documentation for the SSGOI library"
order: 4
group: "Advanced"
---

# SSGOI API Reference

This document provides a comprehensive reference for the SSGOI (Svelte Smooth Go Transition Library) API.

## Table of Contents

1. [Configuration](#configuration)
2. [Built-in Transitions](#built-in-transitions)
3. [Hero Transitions](#hero-transitions)

## Configuration

### createTransitionConfig Function

Creates a configuration object for your transitions.

```typescript
import { createTransitionConfig, transitions } from 'ssgoi';

const config = createTransitionConfig({
  transitions: [
    {
      from: '/home',
      to: '/about',
      transitions: transitions.fade()
    }
  ],
  defaultTransition: transitions.fade()
});
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| transitions | TransitionRule[] | Array of transition rules |
| defaultTransition | TransitionFunction | Default transition to use when no rules match |

## Built-in Transitions

SSGOI provides several built-in transition effects.

### fade

Simple opacity transition.

```typescript
transitions.fade({
  duration?: number,  // default: 300
  delay?: number,     // default: 0
  easing?: Function   // default: linear
})
```

### scroll

Scroll-based transitions in two directions.

```typescript
transitions.scrollUpToDown({
  velocity?: number,  // default: 1.2
  delay?: number,     // default: 0
  easing?: Function   // default: linear
})

transitions.scrollDownToUp({
  velocity?: number,  // default: 1.2
  delay?: number,     // default: 0
  easing?: Function   // default: linear
})
```

### ripple

Circular reveal/hide transition.

```typescript
transitions.ripple({
  duration?: number,  // default: 500
  delay?: number,     // default: 0
  easing?: Function   // default: linear
})
```

### none

No transition effect.

```typescript
transitions.none({
  duration?: number,  // default: 0
  delay?: number,     // default: 0
  easing?: Function   // default: linear
})
```

### pinterest

Pinterest-style transitions for image galleries.

```typescript
transitions.pinterest.enter({
  duration?: number,  // default: 500
  delay?: number,     // default: 0
  easing?: Function   // default: cubicOut
})

transitions.pinterest.exit({
  duration?: number,  // default: 500
  delay?: number,     // default: 0
  easing?: Function   // default: cubicOut
})
```

### hero

Hero transitions between elements.

```typescript
transitions.hero({
  duration?: number,  // default: 500
  delay?: number,     // default: 0
  easing?: Function   // default: cubicOut
})
```

## Hero Transitions

Hero transitions allow smooth animations between related elements across different pages.

### Usage

Add the `data-hero-key` attribute to elements you want to transition between:

```svelte
<!-- Page 1 -->
<div data-hero-key="product-1">
  <img src="/product-thumb.jpg" alt="Product thumbnail" />
</div>

<!-- Page 2 -->
<div data-hero-key="product-1">
  <img src="/product-full.jpg" alt="Product full size" />
</div>
```

Configure the transition in your config:

```typescript
const config = createTransitionConfig({
  transitions: [
    {
      from: '/products',
      to: '/product/*',
      transitions: transitions.hero()
    }
  ],
  defaultTransition: transitions.fade()
});
```

Note: For best results with hero transitions, make sure the elements with matching `data-hero-key` attributes have similar content and proportions.