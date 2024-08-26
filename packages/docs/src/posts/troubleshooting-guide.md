---
title: "SSGOI Troubleshooting Guide"
description: "Common issues and their solutions when working with SSGOI in Svelte applications"
order: 1
group: "Support"
---

# SSGOI Troubleshooting Guide: Debugging Your Way to Smooth Transitions 🕵️‍♂️🔧

Even the smoothest transitions can hit a bump sometimes. Fear not, intrepid developer! This guide will help you troubleshoot common SSGOI issues faster than you can say "page transition"!

## Table of Contents

1. [Transitions Not Working](#transitions-not-working)
2. [Jerky or Stuttering Transitions](#jerky-or-stuttering-transitions)
3. [Incorrect Transition Applied](#incorrect-transition-applied)
4. [Hero Transitions Not Working](#hero-transitions-not-working)
5. [Performance Issues](#performance-issues)
6. [TypeScript Errors](#typescript-errors)

## Transitions Not Working

### Symptom
Your pages change, but there's no smooth transition between them.

### Possible Causes and Solutions

1. **SSGOI not properly set up in the layout**
   
   Check your main layout file (usually `__layout.svelte`):

   ```svelte
   <script>
   import { Ssgoi } from 'ssgoi';
   import { onNavigate } from '$app/navigation';
   import config from './transitionConfig';
   </script>

   <Ssgoi {onNavigate} {config}>
     <slot />
   </Ssgoi>
   ```

2. **Missing PageTransition component**
   
   Ensure each page is wrapped with the PageTransition component:

   ```svelte
   <script>
   import { PageTransition } from 'ssgoi';
   </script>

   <PageTransition>
     <!-- Your page content here -->
   </PageTransition>
   ```

3. **Incorrect configuration**
   
   Double-check your transition config:

   ```typescript
   const config = createTransitionConfig({
     transitions: [
       {
         from: '*',
         to: '*',
         transitions: transitions.fade()
       }
     ],
     defaultTransition: transitions.fade()
   });
   ```

## Jerky or Stuttering Transitions

### Symptom
Transitions are working but they're not smooth.

### Possible Causes and Solutions

1. **Using non-GPU-accelerated properties**
   
   Stick to `transform` and `opacity` for smooth animations:

   ```typescript
   const smoothTransition = () => ({
     duration: 300,
     css: (t) => `
       transform: translateX(${100 - t * 100}%);
       opacity: ${t};
     `
   });
   ```

2. **Transition duration too long**
   
   Try reducing the duration:

   ```typescript
   transitions.fade({ duration: 150 }) // Faster transition
   ```

3. **Heavy page content**
   
   Optimize your page load:
   - Lazy load images and heavy components
   - Minimize JavaScript bundles
   - Use code splitting

## Incorrect Transition Applied

### Symptom
Transitions are working, but not the ones you expected.

### Possible Causes and Solutions

1. **Route matching issues**
   
   Check your transition rules order and specificity:

   ```typescript
   const config = createTransitionConfig({
     transitions: [
       {
         from: '/blog/*',
         to: '/blog/*',
         transitions: transitions.slide()
       },
       {
         from: '*',
         to: '*',
         transitions: transitions.fade()
       }
     ],
     defaultTransition: transitions.fade()
   });
   ```

   More specific rules should come first.

2. **Symmetric transition misunderstanding**
   
   If you're using ``, remember it applies the transition both ways:

   ```typescript
   {
     from: '/home',
     to: '/about',
     transitions: transitions.slide(),
       // This will slide both ways
   }
   ```

## Hero Transitions Not Working

### Symptom
Regular transitions work, but hero transitions aren't smooth or don't work at all.

### Possible Causes and Solutions

1. **Mismatched keys**
   
   Ensure the `key` prop matches exactly on both pages:

   ```svelte
   <!-- Page 1 -->
   <Hero key="product-1">...</Hero>

   <!-- Page 2 -->
   <Hero key="product-1">...</Hero>
   ```

2. **Content mismatch**
   
   The content inside the Hero components should be similar for smooth transitions:

   ```svelte
   <!-- Page 1 -->
   <Hero key="product-1">
     <img src="/product-1.jpg" alt="Product 1" />
   </Hero>

   <!-- Page 2 -->
   <Hero key="product-1">
     <img src="/product-1-large.jpg" alt="Product 1" />
   </Hero>
   ```

3. **Page transition interfering**
   
   Disable page transitions for routes with hero transitions:

   ```typescript
   {
     from: '/products',
     to: '/product/*',
     transitions: transitions.none()
   }
   ```

## Performance Issues

### Symptom
Transitions are smooth on your dev machine but sluggish on other devices.

### Possible Causes and Solutions

1. **Too many animated elements**
   
   Reduce the number of elements being transitioned:

   ```svelte
   <Hero key="main-content">
     <!-- Only animate the main content, not every small detail -->
     <h1>{title}</h1>
     <p>{description}</p>
   </Hero>
   ```

2. **Complex CSS transitions**
   
   Simplify your transitions:

   ```typescript
   // Instead of this
   css: (t) => `
     transform: translateX(${t * 100}px) rotate(${t * 360}deg) scale(${t});
     opacity: ${t};
     box-shadow: 0 ${t * 10}px ${t * 20}px rgba(0,0,0,0.1);
   `

   // Try this
   css: (t) => `
     transform: translateX(${t * 100}px);
     opacity: ${t};
   `
   ```

3. **Large images or assets**
   
   Optimize your assets:
   - Use appropriate image sizes
   - Compress images
   - Consider using WebP format

## TypeScript Errors

### Symptom
You're getting TypeScript errors related to SSGOI.

### Possible Causes and Solutions

1. **Outdated type definitions**
   
   Update SSGOI to the latest version:

   ```bash
   npm update ssgoi
   ```

2. **Incorrect import statements**
   
   Ensure you're importing from 'ssgoi':

   ```typescript
   import { Ssgoi, PageTransition, createTransitionConfig, transitions } from 'ssgoi';
   ```

3. **Mismatched types**
   
   Check that your transition config matches the expected type:

   ```typescript
   const config: TransitionConfigInput = {
     transitions: [
       // ... your transitions
     ],
     defaultTransition: transitions.fade()
   };
   ```

Remember, troubleshooting is an art form. If you're still stuck after trying these solutions, don't hesitate to check the SSGOI documentation or reach out to the community. Happy debugging, and may your transitions always be smooth! 🚀🔧