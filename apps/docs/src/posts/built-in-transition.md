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
transitions.fade({ 
  duration?: number,   // default: 300 
  delay?: number,      // default: 0
  easing?: Function    // default: linear
})
```

Example:
```typescript
transitions.fade({ duration: 300 })
```

### 2. Scroll Transitions 📜

Smooth scroll-based transitions for directional page changes.

```typescript
// Scroll from bottom to top
transitions.scrollUpToDown({ 
  velocity?: number,   // default: 1.2
  delay?: number,      // default: 0
  easing?: Function    // default: linear
})

// Scroll from top to bottom
transitions.scrollDownToUp({ 
  velocity?: number,   // default: 1.2
  delay?: number,      // default: 0
  easing?: Function    // default: linear
})
```

Example:
```typescript
transitions.scrollUpToDown({ velocity: 1.5 })
```

### 3. Ripple Transition 🌊

Creates a circular reveal/hide effect, like a ripple in water.

```typescript
transitions.ripple({ 
  duration?: number,   // default: 500
  delay?: number,      // default: 0
  easing?: Function    // default: linear
})
```

Example:
```typescript
transitions.ripple({ duration: 400 })
```

### 4. Pinterest Transition 📌

Perfect for image gallery transitions with elements that match between pages. Works in pairs using `data-pinterest-key` attributes.

```typescript
// Gallery to detail view & detail to gallery view
transitions.pinterest.enter({
  duration?: number,   // default: 500
  delay?: number,      // default: 0
  easing?: Function    // default: cubicOut
})
```

Usage example:
```svelte
<!-- Gallery page -->
<div class="gallery">
  {#each images as image}
    <div data-pinterest-key={image.id}>
      <img src={image.thumbnail} alt={image.title} />
    </div>
  {/each}
</div>

<!-- Detail page -->
<div data-pinterest-key={currentImage.id}>
  <img src={currentImage.fullSize} alt={currentImage.title} />
</div>
```

Configuration:
```typescript
{
  from: '/gallery',
  to: '/image/*',
  transitions: transitions.pinterest.enter()
},
{
  from: '/image/*',
  to: '/gallery',
  transitions: transitions.pinterest.enter()  // Same transition for both directions
}
```

### 5. Hero Transition 🦸‍♂️

Smooth transitions between related elements across pages using `data-hero-key` attributes.

```typescript
transitions.hero({ 
  duration?: number,   // default: 500
  delay?: number,      // default: 0
  easing?: Function    // default: cubicOut
})
```

Usage example:
```svelte
<!-- List page -->
<div class="product-list">
  {#each products as product}
    <div data-hero-key={product.id}>
      <img src={product.thumbnail} alt={product.name} />
    </div>
  {/each}
</div>

<!-- Detail page -->
<div data-hero-key={currentProduct.id}>
  <img src={currentProduct.fullSize} alt={currentProduct.name} />
</div>
```

Configuration:
```typescript
{
  from: '/products',
  to: '/product/*',
  transitions: transitions.hero()
}
```

### 6. None Transition 🎭

Sometimes, no transition is the best transition. Use this when you want an instant change:

```typescript
transitions.none({
  duration?: number,   // default: 0
  delay?: number,      // default: 0
  easing?: Function    // default: linear
})
```

## Transition Parameters: Fine-tuning Your Effects 🎛️

Most transitions accept these common parameters:

- `duration`: Length of the transition in milliseconds
- `delay`: Delay before the transition starts
- `easing`: A function that defines the rate of change over time

Example of custom easing:
```typescript
import { cubicOut } from 'svelte/easing';

transitions.fade({ 
  duration: 400, 
  easing: cubicOut 
})
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
      transitions: transitions.fade({ duration: 300 })
    },
    {
      from: '/blog',
      to: '/blog/*',
      transitions: transitions.scrollUpToDown()
    },
    {
      from: '/gallery',
      to: '/image/*',
      transitions: transitions.pinterest.enter()
    },
    {
      from: '/image/*',
      to: '/gallery',
      transitions: transitions.pinterest.enter()  // Same transition for symmetry
    },
    {
      from: '/products',
      to: '/product/*',
      transitions: transitions.hero()
    }
  ],
  defaultTransition: transitions.fade()
});
```

Remember, the key to great transitions is subtlety. When using hero or pinterest transitions, make sure to:
1. Always include matching `data-hero-key` or `data-pinterest-key` attributes on both pages
2. Keep the content within the matched elements similar for smooth transitions
3. Consider using the same transition in both directions for consistent user experience

Choose the right transition for each navigation context, and your users will enjoy a smooth, intuitive journey through your app! 🚀✨