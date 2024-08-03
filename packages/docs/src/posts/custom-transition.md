---
title: "Creating Custom Transitions in SSGOI"
description: "Learn how to create your own unique transition effects in SSGOI"
order: 3
group: "Advanced"
---

# Creating Custom Transitions in SSGOI: Be the Transition Artist 🎨

Ready to paint your own transition masterpiece? Let's dive into creating custom transitions with SSGOI!

## The Anatomy of a Custom Transition 🧬

A custom transition in SSGOI is a function that returns an object with `in` and `out` properties. Each of these properties is a function that returns a Svelte transition object.

Here's the basic structure:

```typescript
const myCustomTransition = () => ({
  in: (node, params) => ({
    duration: 300,
    css: (t, u) => `/* Your CSS magic here */`
  }),
  out: (node, params) => ({
    duration: 300,
    css: (t, u) => `/* More CSS wizardry */`
  })
});
```

Let's break it down:
- `node`: The HTML element being transitioned.
- `params`: Any parameters passed to the transition.
- `t`: Goes from 0 to 1 during the transition.
- `u`: Goes from 1 to 0 (it's 1 - t).

## Your First Custom Transition: The Wobble 🌀

Let's create a fun "wobble" transition:

```typescript
const wobble = () => ({
  in: (node, params) => ({
    duration: 300,
    css: (t) => `
      transform: scale(${1 - Math.cos(t * Math.PI) * 0.1});
      opacity: ${t};
    `
  }),
  out: (node, params) => ({
    duration: 300,
    css: (t, u) => `
      transform: scale(${1 + Math.sin(u * Math.PI) * 0.1});
      opacity: ${u};
    `
  })
});
```

This transition makes elements grow and shrink slightly as they appear or disappear.

## Adding Parameters: The Flexible Artist 🎭

Let's make our wobble transition more flexible:

```typescript
const wobble = (intensity = 0.1, duration = 300) => ({
  in: (node, params) => ({
    duration,
    css: (t) => `
      transform: scale(${1 - Math.cos(t * Math.PI) * intensity});
      opacity: ${t};
    `
  }),
  out: (node, params) => ({
    duration,
    css: (t, u) => `
      transform: scale(${1 + Math.sin(u * Math.PI) * intensity});
      opacity: ${u};
    `
  })
});
```

Now you can customize the wobble:

```typescript
transitions.wobble(0.2, 500)  // More intense wobble, longer duration
```

## Advanced Techniques: The Transition Maestro 🎻

### 1. Using JavaScript Animations

For more complex animations, you can use the `tick` function instead of `css`:

```typescript
const complexAnimation = () => ({
  in: (node, params) => ({
    duration: 1000,
    tick: (t, u) => {
      // Perform complex calculations
      node.style.transform = `/* Complex transform */`;
      node.style.opacity = t;
    }
  }),
  // ... out transition
});
```

### 2. Asymmetric Transitions

Your in and out transitions don't have to match:

```typescript
const asymmetricTransition = () => ({
  in: (node, params) => ({
    duration: 300,
    css: (t) => `transform: translateX(${100 - t * 100}%); opacity: ${t};`
  }),
  out: (node, params) => ({
    duration: 600,
    css: (t, u) => `transform: scale(${u}); opacity: ${u};`
  })
});
```

### 3. Transition Composition

You can compose transitions for more complex effects:

```typescript
const composedTransition = () => {
  const slide = transitions.slide();
  const fade = transitions.fade();
  
  return {
    in: (node, params) => {
      slide.in(node, params);
      return fade.in(node, params);
    },
    out: (node, params) => {
      slide.out(node, params);
      return fade.out(node, params);
    }
  };
};
```

## Using Your Custom Transition 🚀

Once you've created your masterpiece, use it in your config like any other transition:

```typescript
import { createTransitionConfig } from 'ssgoi';
import { wobble, asymmetricTransition } from './myCustomTransitions';

const config = createTransitionConfig({
  transitions: [
    {
      from: '/home',
      to: '/about',
      transition: wobble(0.2, 500),
    },
    {
      from: '/blog',
      to: '/blog/*',
      transition: asymmetricTransition(),
    }
  ],
  defaultTransition: transitions.fade()
});
```

And there you have it! You're now a certified SSGOI transition artist. Remember, the key to great transitions is subtlety and purpose. Use your new powers wisely, and create transitions that enhance your user's experience! 🎨✨