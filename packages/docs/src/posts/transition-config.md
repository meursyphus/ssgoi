---
title: "Configuring Transitions in SSGOI"
description: "Learn how to set up and customize page transitions for different routes in your SSGOI-powered Svelte app"
order: 2
group: "Advanced"
---

# Configuring Transitions in SSGOI: Your Page's Choreography Guide

Welcome to the SSGOI transition configuration guide! Here, we'll teach you how to make your pages dance like they're auditioning for "So You Think You Can Transition". Let's turn your app into a smooth operator!

## The Basics: Creating Your Config

First things first, let's create a configuration that would make even the pickiest choreographer proud. Here's how you do it:

```javascript
import { createTransitionConfig, transitions } from 'ssgoi';

const transitionConfig = createTransitionConfig({
  '/': {
    '*': transitions.fade
  },
  '/about': {
    '*': transitions.slide
  },
  '*': {
    '*': transitions.fade
  }
});

export default transitionConfig;
```

This config is telling your pages:
- Home page: "Fade in and out, like a mysterious fog"
- About page: "Slide in and out, like you're on a conveyor belt"
- All other pages: "When in doubt, fade it out"

## Route Matching: Playing Page Matchmaker

SSGOI uses a smart matching system for routes. It's like a dating app, but for your pages and transitions. Here's how it works:

- Exact matches take priority. If you specify '/about', it'll match '/about' exactly.
- Wildcard '*' is the catch-all. It's the "swipe right on everyone" of route matching.
- You can use parameters like '/blog/:id' to match dynamic routes.

## Transition Types: Choosing Your Page's Dance Move

SSGOI comes with a repertoire of transitions that would make any ballet dancer jealous:

- `transitions.fade`: For when your page wants to make a subtle entrance
- `transitions.slide`: Perfect for pages that like to make an entrance
- `transitions.zoom`: When your page needs to make a BIG impression
- `transitions.flip`: For pages that like to show off

Use them like this:

```javascript
'/cool-page': {
  '*': transitions.flip
}
```

Now your cool page will flip in and out like it's doing parkour!

## Dynamic Transitions: Keeping Your Pages on Their Toes

Want to spice things up? Use a function to decide the transition on the fly:

```javascript
'/blog': {
  '*': (from, to) => {
    return to.path.includes('article') ? transitions.slide : transitions.fade;
  }
}
```

This tells blog pages: "If you're going to an article, slide. Otherwise, just fade." It's like giving your pages a decision-making flowchart!

## Transition Parameters: Fine-tuning the Performance

Most transitions accept parameters. It's like adjusting the volume and bass on your page transitions:

```javascript
'/about': {
  '*': transitions.slide({ duration: 500, direction: 'left' })
}
```

Now your about page slides in from the left, taking half a second to do so. Smooth!

## The Grand Finale: Putting It All Together

Here's an example of a config that uses all these fancy techniques:

```javascript
import { createTransitionConfig, transitions } from 'ssgoi';

const transitionConfig = createTransitionConfig({
  '/': {
    '*': transitions.fade({ duration: 300 })
  },
  '/about': {
    '*': transitions.slide({ duration: 500, direction: 'left' })
  },
  '/blog': {
    '/blog/:id': (from, to) => {
      return from.path === '/' ? transitions.zoom : transitions.slide;
    },
    '*': transitions.fade
  },
  '*': {
    '*': transitions.fade
  }
});

export default transitionConfig;
```

With this configuration, your app is ready to put on a show that would make Broadway jealous!

Remember, with great transition power comes great transition responsibility. Use these tools wisely, and your users will be too mesmerized by your smooth transitions to ever leave your site!

Now go forth and make those pages dance!
