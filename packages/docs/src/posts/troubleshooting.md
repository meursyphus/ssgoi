---
title: "SSGOI Troubleshooting Guide"
description: "Navigate common issues and find solutions when working with SSGOI in your Svelte applications"
order: 7
group: "Advanced"
---

<!-- # SSGOI Troubleshooting Guide: When Your Transitions Go Rogue!

Welcome to the SSGOI emergency room! Here, we'll diagnose and treat the most common ailments that might afflict your transitions. Don't worry, we've got the cure for your transition troubles!

## Symptom 1: "My transitions are slower than a snail on vacation!"

**Diagnosis**: Your transitions might be overworked and underpaid.

**Treatment**:
1. Check your transition duration. Are you trying to recreate the slow-motion scenes from The Matrix?
   ```javascript
   // Too slow
   transitions.fade({ duration: 5000 })
   
   // Just right
   transitions.fade({ duration: 300 })
   ```

2. Simplify your CSS. Are you transitioning every property known to mankind?
   ```javascript
   // Too much
   css: (t) => `
     transform: translateX(${t * 100}px) rotate(${t * 360}deg) scale(${t});
     opacity: ${t};
     box-shadow: 0 ${t * 10}px ${t * 20}px rgba(0,0,0,0.1);
   `
   
   // Keep it simple
   css: (t) => `
     transform: translateX(${t * 100}px);
     opacity: ${t};
   `
   ```

3. Profile your transitions using your browser's dev tools. Look for any bottlenecks in the Performance tab.

## Symptom 2: "My transitions are jumpier than a kangaroo on a trampoline!"

**Diagnosis**: Your transitions might be suffering from layout thrashing.

**Treatment**:
1. Stick to `transform` and `opacity` for your transitions. These properties are the comfort food of browsers.

2. Avoid properties that cause layout recalculation like `width`, `height`, `top`, or `left`.

3. Use `will-change` to give the browser a heads-up, but use it sparingly:
   ```javascript
   const smoothTransition = {
     in: (node, params) => {
       node.style.willChange = 'transform, opacity';
       return {
         // ... transition logic ...
         tick: (t, u) => {
           if (t === 1) node.style.willChange = '';
         }
       };
     }
   };
   ```

## Symptom 3: "My transitions are more out of sync than a boy band with no rhythm!"

**Diagnosis**: Your transitions might be suffering from timing issues.

**Treatment**:
1. Ensure all your transitions have the same duration:
   ```javascript
   const consistentTransitions = {
     in: (node, params) => ({ duration: 300, ... }),
     out: (node, params) => ({ duration: 300, ... })
   };
   ```

2. If you're using dynamic transitions, make sure they're consistently timed:
   ```javascript
   const dynamicButConsistent = (from, to) => {
     const duration = 300; // Consistent duration
     return from.path.includes('blog') 
       ? transitions.fade({ duration })
       : transitions.slide({ duration });
   };
   ```

## Symptom 4: "My transitions are more confusing than a chameleon in a bag of Skittles!"

**Diagnosis**: Your transition logic might be overly complex.

**Treatment**:
1. Simplify your transition config. Are you trying to use a different transition for every possible route combination?

2. Stick to a few key transitions and use them consistently:
   ```javascript
   const simpleConfig = createTransitionConfig({
     '/': { '*': transitions.fade },
     '/blog': { '*': transitions.slide },
     '*': { '*': transitions.fade } // Fallback
   });
   ```

3. If you need complex logic, consider moving it to a separate function for clarity:
   ```javascript
   const getTransition = (from, to) => {
     if (to.path.includes('error')) return transitions.shake;
     if (from.path === '/') return transitions.zoom;
     return transitions.fade;
   };

   const config = createTransitionConfig({
     '*': { '*': getTransition }
   });
   ```

## Symptom 5: "My transitions are more invisible than my childhood imaginary friend!"

**Diagnosis**: Your transitions might not be applied correctly.

**Treatment**:
1. Double-check that you've wrapped your app content with the `PageTransition` component:
   ```svelte
   <script>
     import { PageTransition } from 'ssgoi';
     import transitionConfig from './transitionConfig';
   </script>

   <PageTransition {transitionConfig}>
     <slot />
   </PageTransition>
   ```

2. Ensure your transition config is correctly imported and passed to the `PageTransition` component.

3. Check that your routes in the transition config match your actual routes.

## Symptom 6: "My transitions are more random than a cat walking on a keyboard!"

**Diagnosis**: You might have conflicting or overlapping transition definitions.

**Treatment**:
1. Review your transition config for any conflicting definitions:
   ```javascript
   // Problematic: Overlapping definitions
   const confusingConfig = createTransitionConfig({
     '/blog': { '*': transitions.fade },
     '/blog/:id': { '*': transitions.slide }, // Which one applies?
     '*': { '*': transitions.zoom }
   });

   // Better: Clear hierarchy
   const clearConfig = createTransitionConfig({
     '/blog': { 
       '/blog/:id': transitions.slide,
       '*': transitions.fade
     },
     '*': { '*': transitions.zoom }
   });
   ```

2. Use more specific routes before general ones.

3. Consider using a function to determine the transition if you need complex logic:
   ```javascript
   const smartConfig = createTransitionConfig({
     '*': { '*': (from, to) => {
       if (to.path.startsWith('/blog')) {
         return to.path.includes('/post') ? transitions.slide : transitions.fade;
       }
       return transitions.zoom;
     }}
   });
   ```

Remember, in the world of SSGOI, every bug squashed is a smooth transition earned! Keep these treatments handy, and your transitions will be running as smoothly as a greased-up cheetah on roller skates in no time!

Now go forth and transition with confidence! 🚀✨ -->
