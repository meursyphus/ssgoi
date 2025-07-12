---
title: "SSGOI Performance Optimization"
description: "Best practices for optimizing SSGOI transitions for smooth and efficient performance"
order: 5
group: "Advanced"
---

# SSGOI Performance Optimization: Smooth as Butter, Light as a Feather 🧈🪶

Want your transitions to be smoother than a freshly waxed slide? Let's optimize SSGOI for peak performance!

## The Performance Pillars 🏛️

1. Efficient animations
2. Minimal DOM manipulation
3. Smart asset management
4. Proper configuration

Let's dive into each of these!

## 1. Efficient Animations: The Need for Speed 🏎️

### Use GPU-accelerated properties

Stick to these properties for the smoothest animations:

- `transform`
- `opacity`

```typescript
const smoothTransition = () => ({
  in: (node, params) => ({
    duration: 300,
    css: (t) => `
      transform: translateX(${100 - t * 100}%);
      opacity: ${t};
    `
  })
});
```

Avoid properties that trigger layout recalculation like `width`, `height`, `top`, or `left`.

### Keep it Simple

Complex animations can be cool, but they can also be costly. Aim for simplicity:

```typescript
// Good 👍
const simpleTransition = transitions.fade({ duration: 300 });

// Potentially Costly 👎
const complexTransition = transitions.combine(
  transitions.rotate({ duration: 500 }),
  transitions.scale({ duration: 500 }),
  transitions.blur({ duration: 500 })
);
```

## 2. Minimal DOM Manipulation: Less is More 🧘‍♀️

### Use `will-change`

Tell the browser what's going to change:

```typescript
const optimizedTransition = () => ({
  in: (node, params) => {
    node.style.willChange = 'transform, opacity';
    return {
      duration: 300,
      css: (t) => `
        transform: translateX(${100 - t * 100}%);
        opacity: ${t};
      `,
      tick: (t, u) => {
        if (t === 1) node.style.willChange = 'auto';
      }
    };
  }
});
```

Remember to reset `will-change` after the transition to avoid unnecessary memory usage.

### Avoid Forced Synchronous Layouts

Don't read layout properties and then immediately change them:

```typescript
// Bad 👎
const badTransition = (node, params) => {
  const height = node.offsetHeight; // Forces layout
  node.style.height = `${height * 2}px`; // Triggers another layout
};

// Good 👍
const goodTransition = (node, params) => {
  requestAnimationFrame(() => {
    const height = node.offsetHeight;
    node.style.height = `${height * 2}px`;
  });
};
```

## 3. Smart Asset Management: Lightening the Load 🏋️‍♂️

### Preload Critical Resources

Use the `preloadCode` function to load the next page's JavaScript:

```typescript
import { preloadCode } from 'ssgoi';

// In your component
onMount(() => {
  preloadCode('/next-page');
});
```

### Optimize Images

For hero transitions involving images, ensure they're optimized:

1. Use appropriate sizes
2. Choose the right format (WebP for broad support)
3. Implement lazy loading for images below the fold

```html
<img src="optimized-image.webp" loading="lazy" alt="Description" />
```

## 4. Proper Configuration: The Right Tool for the Job 🔧

### Use Appropriate Transition Duration

Shorter durations often feel snappier:

```typescript
const snappyConfig = createTransitionConfig({
  transitions: [
    {
      from: '*',
      to: '*',
      transitions: transitions.fade({ duration: 150 }) // Quick and smooth
    }
  ]
});
```

### Implement Progressive Enhancement

Provide a fallback for browsers that don't support certain features:

```typescript
const progressiveTransition = () => {
  if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    return transitions.none(); // No transition for users who prefer reduced motion
  }
  return transitions.fade();
};
```

## Performance Monitoring: Keeping Score 📊

### Use Browser DevTools

1. Open your browser's DevTools
2. Go to the Performance tab
3. Record while performing transitions
4. Analyze for long tasks, layout thrashing, or excessive style recalculations

### Implement Real User Monitoring (RUM)

Consider using tools like Google Analytics or custom timing APIs to measure real-world performance:

```javascript
// Measure transition duration
const start = performance.now();
// ... perform transition ...
const duration = performance.now() - start;
console.log(`Transition took ${duration}ms`);
```

## The Optimization Checklist ✅

Before shipping, ensure you've considered:

- [ ] Using GPU-accelerated properties
- [ ] Keeping animations simple and purposeful
- [ ] Minimizing DOM manipulation
- [ ] Preloading critical resources
- [ ] Optimizing assets (especially images)
- [ ] Configuring appropriate transition durations
- [ ] Implementing progressive enhancement
- [ ] Monitoring performance in real-world scenarios

Remember, performance optimization is an ongoing process. Keep testing, keep measuring, and keep refining. Your users will thank you with smooth, joyful interactions! 🚀✨