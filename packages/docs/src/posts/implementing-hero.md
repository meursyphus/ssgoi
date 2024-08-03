---
title: "Implementing Hero Transitions with SSGOI"
description: "Guide to creating smooth hero transitions between pages using SSGOI"
order: 4
group: "Advanced"
---

# Implementing Hero Transitions with SSGOI: Make Your Elements the Star! 🌟

Ready to take your transitions to the next level? Let's dive into the world of hero transitions with SSGOI!

## What are Hero Transitions? 🦸‍♂️

Hero transitions create a smooth animation between a small element on one page and a larger, focal element on another page. They provide a seamless visual connection that guides the user's attention and enhances the overall navigation experience.

## The Hero Component: Your Transition Superhero 🎭

SSGOI provides a `Hero` component to implement these magical transitions. Here's how to use it:

```svelte
<script lang="ts">
import { Hero } from 'ssgoi';
</script>

<Hero key="unique-identifier">
  <!-- Your content here -->
</Hero>
```

The `key` prop is crucial - it's how SSGOI knows which elements to transition between pages.

## Basic Hero Transition: A Tale of Two Pages 📘

Let's create a hero transition for a product in a list to its detail page.

Product List Page:
```svelte
<script lang="ts">
import { Hero, PageTransition } from 'ssgoi';

const products = [
  { id: 1, name: 'Super Gadget', image: '/gadget.jpg' },
  // ... more products
];
</script>

<PageTransition>
  <h1>Our Products</h1>
  {#each products as product}
    <Hero key={`product-${product.id}`}>
      <a href={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} />
        <h2>{product.name}</h2>
      </a>
    </Hero>
  {/each}
</PageTransition>
```

Product Detail Page:
```svelte
<script lang="ts">
import { Hero, PageTransition } from 'ssgoi';
import { page } from '$app/stores';

const product = {
  id: $page.params.id,
  name: 'Super Gadget',
  image: '/gadget.jpg',
  description: 'This gadget will change your life!'
};
</script>

<PageTransition>
  <Hero key={`product-${product.id}`}>
    <img src={product.image} alt={product.name} />
    <h1>{product.name}</h1>
  </Hero>
  <p>{product.description}</p>
</PageTransition>
```

## Advanced Hero Techniques: Leveling Up 🚀

### 1. Custom Transition Duration

You can customize the duration of your hero transition:

```svelte
<Hero key="my-hero" duration={500}>
  <!-- Content -->
</Hero>
```

### 2. Custom Easing

For a unique motion feel, provide a custom easing function:

```svelte
<script lang="ts">
import { cubicOut } from 'svelte/easing';
</script>

<Hero key="my-hero" easing={cubicOut}>
  <!-- Content -->
</Hero>
```

### 3. Transition Only Specific Properties

You can specify which CSS properties to transition:

```svelte
<Hero key="my-hero" properties={['transform', 'opacity']}>
  <!-- Content -->
</Hero>
```

This is useful for optimizing performance or creating specific visual effects.

## Handling Hero Transitions in Your Config 🛠️

When using hero transitions, it's often best to disable the page transition between the relevant routes:

```typescript
import { createTransitionConfig, transitions } from 'ssgoi';

const config = createTransitionConfig({
  transitions: [
    {
      from: '/products',
      to: '/product/*',
      transition: transitions.none()
    },
    // ... other transitions
  ],
  defaultTransition: transitions.fade()
});
```

This ensures that only the hero elements transition, creating a focused and smooth effect.

## Best Practices for Hero Transitions 🏆

1. **Keep it Simple**: Hero transitions are most effective when they're subtle and natural.
2. **Mind the Content**: Ensure that the content inside your Hero components is similar enough to transition smoothly.
3. **Performance Matters**: Be cautious when using hero transitions with large images or complex layouts.
4. **Test on Various Devices**: Hero transitions can behave differently on different screen sizes and devices.

## Troubleshooting Hero Transitions 🔍

- If your transition isn't working, double-check that the `key` prop matches exactly between pages.
- Ensure that the layout and styling of your hero elements are consistent between pages for the smoothest transition.
- If the transition seems jumpy, try adjusting the duration or easing, or simplify the content inside the Hero component.

Now you're ready to create captivating hero transitions that will make your users say "Wow!" 🎉 Remember, with great transition power comes great UX responsibility. Use your newfound skills wisely, and create experiences that truly shine! ✨