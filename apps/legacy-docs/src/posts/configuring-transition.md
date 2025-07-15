---
title: "Configuring SSGOI Transitions"
description: "Detailed guide on creating and customizing transition configurations in SSGOI"
order: 1
group: "Advanced"
---

# Configuring SSGOI Transitions: Mastering the Art of Smooth Navigation 🎨

Ready to take your SSGOI transitions to the next level? Let's dive into the details of configuring transitions!

## The Anatomy of a Transition Configuration 🧬

Here's the basic structure of an SSGOI transition configuration:

```typescript
const config = createTransitionConfig({
  transitions: [
    {
      from: string | string[],
      to: string | string[],
      transitions: TransitionFunction | TransitionObject,
      symmetric?: boolean
    },
    // ... more transition rules
  ],
  defaultTransition: TransitionFunction | TransitionObject
});
```

Let's break this down:

- `from` and `to`: Define the routes for which this transition applies.
- `transitions`: The transition effect to use.
- `symmetric`: If true, the same transition is used in both directions.
- `defaultTransition`: Applied when no specific rule matches.

## Route Matching: Playing Transition Matchmaker 💘

SSGOI uses a smart matching system for routes:

- Exact matches take priority: `/about` will match exactly `/about`.
- Use wildcards for flexibility: `/blog/*` matches any route starting with `/blog/`.
- Parameter matching: `/user/:id` matches routes like `/user/123`.

Example:

```typescript
{
  from: '/blog',
  to: '/blog/:id',
  transitions: transitions.slide()
}
```

This rule applies a slide transition when moving from the blog list to a specific blog post.

## Dynamic Transitions: Transitions with a Brain 🧠

Want your transitions to adapt on the fly? Use a function!

```typescript
{
  from: '*',
  to: '*',
  transitions: (from, to) => {
    return to.path.includes('error') ? transitions.shake() : transitions.fade();
  }
}
```

This applies a shake transition to error pages and a fade transition to everything else.

## Transition Parameters: Fine-tuning Your Magic ✨

Most transitions accept parameters for customization:

```typescript
transitions.fade({ duration: 300, easing: cubicInOut })
```

Common parameters include:
- `duration`: Length of the transition in milliseconds.
- `easing`: A function defining the rate of change over time.

## Putting It All Together: A Grand Transition Symphony 🎭

Here's an example of a more complex configuration:

```typescript
import { createTransitionConfig, transitions } from 'ssgoi';

const config = createTransitionConfig({
  transitions: [
    {
      from: '/',
      to: '/about',
      transitions: transitions.fade({ duration: 500 })
    },
    {
      from: '/blog',
      to: '/blog/:id',
      transitions: (from, to) => {
        return from.path === '/blog' 
          ? transitions.slideRight() 
          : transitions.slideLeft();
      }
    },
    {
      from: '*',
      to: '/error',
      transitions: transitions.shake()
    }
  ],
  defaultTransition: transitions.fade()
});

export default config;
```

This configuration creates a harmonious flow throughout your app, with custom transitions for specific routes and a fallback for everything else.

Remember, with great transition power comes great UX responsibility. Use these tools wisely to create a smooth, intuitive navigation experience for your users! 🚀✨