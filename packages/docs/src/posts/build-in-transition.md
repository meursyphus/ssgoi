---
title: "SSGOI Built-in Transitions"
description: "Explore the variety of pre-built transition effects in SSGOI and learn how to use them"
order: 2
group: "Advanced"
---

# SSGOI Built-in Transitions: Your Transition Toolbox 🧰

SSGOI comes packed with a variety of built-in transitions to make your pages move with style. Let's explore these magical effects!

## The Transition Lineup 🌟

### 1. Fade Transition 🌓

The classic fade effect. Perfect for subtle, elegant transitions.

```typescript
transitions.fade({ duration?: number, easing?: (t: number) => number })
```

Example:
```typescript
transitions.fade({ duration: 300 })
```

### 2. Slide Transition 🏂

Slides your page in and out. Great for implying directional navigation.

```typescript
transitions.slide({ duration?: number, direction?: 'left' | 'right' | 'up' | 'down' })
```

Example:
```typescript
transitions.slide({ duration: 400, direction: 'left' })
```

### 3. Scale Transition 🔍

Scales your page in or out. Useful for zoom-like effects.

```typescript
transitions.scale({ duration?: number, start?: number, opacity?: boolean })
```

Example:
```typescript
transitions.scale({ duration: 500, start: 0.8, opacity: true })
```

### 4. Flip Transition 🔄

Flips your page like a card. Adds a 3D feel to your transitions.

```typescript
transitions.flip({ duration?: number, direction?: 'x' | 'y' })
```

Example:
```typescript
transitions.flip({ duration: 600, direction: 'y' })
```

### 5. Blur Transition 👁️

Blurs your page in and out. Creates a dreamy, soft transition effect.

```typescript
transitions.blur({ duration?: number, amount?: number })
```

Example:
```typescript
transitions.blur({ duration: 300, amount: 5 })
```

## Combining Transitions: The Transition Mixologist 🍹

Want to get fancy? You can combine transitions for more complex effects!

```typescript
transitions.combine(transitions.fade(), transitions.slide())
```

This will create a transition that both fades and slides simultaneously.

## The "None" Transition: The Invisible Magician 🎩✨

Sometimes, no transition is the best transition. Use the `none` transition when you want an instant change:

```typescript
transitions.none()
```

## Transition Parameters: Fine-tuning Your Effects 🎛️

Most transitions accept these common parameters:

- `duration`: Length of the transition in milliseconds.
- `easing`: A function that defines the rate of change over time.

Example of custom easing:
```typescript
import { cubicInOut } from 'svelte/easing';

transitions.fade({ duration: 400, easing: cubicInOut })
```

## Putting It All Together: A Transition Symphony 🎭

Here's an example of how you might use various transitions in your config:

```typescript
import { createTransitionConfig, transitions } from 'ssgoi';

const config = createTransitionConfig({
  transitions: [
    {
      from: '/',
      to: '/about',
      transition: transitions.fade({ duration: 300 }),
      
    },
    {
      from: '/blog',
      to: '/blog/*',
      transition: transitions.slide({ direction: 'left' })
    },
    {
      from: '/gallery',
      to: '/gallery/*',
      transition: transitions.scale({ start: 0.8, opacity: true })
    },
    {
      from: '*',
      to: '/404',
      transition: transitions.blur({ amount: 10 })
    }
  ],
  defaultTransition: transitions.fade()
});
```

This configuration creates a rich, varied transition experience across your app.

Remember, the key to great transitions is subtlety. Use these effects to enhance your user's experience, not distract from it. Now go forth and transition responsibly! 🚀✨