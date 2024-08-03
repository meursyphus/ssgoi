---
title: "SSGOI Basic Usage"
description: "Learn how to implement basic page transitions using SSGOI in your Svelte application"
order: 3
group: "Getting Started"
---

# SSGOI Basic Usage: Crafting Your First Transition 🎭

Ready to see some magic? Let's create your first SSGOI transition! Follow these steps to add smooth transitions to your Svelte app.

## 1. Create a Transition Configuration 🛠️

First, let's set up your transition rules. Create a new file called `transitionConfig.ts` in your project:

```typescript
import { createTransitionConfig, transitions } from 'ssgoi';

const config = createTransitionConfig({
  transitions: [
    {
      from: '/home',
      to: '/about',
      transition: transitions.fade(),
      
    },
    {
      from: '/blog',
      to: '/post/*',
      transition: (context) => {
        return context.isMobile ? transitions.slideRight() : transitions.fade()
      }
    }
  ],
  defaultTransition: transitions.fade()
});

export default config;
```

This configuration sets up fade transitions between home and about pages, and slide transitions between blog and post pages.

## 2. Set Up SSGOI in Your Layout 🏗️

Now, let's integrate SSGOI into your main layout file (usually `__layout.svelte` in SvelteKit):

```svelte
<script lang="ts">
  import { onNavigate } from '$app/navigation';
  import { Ssgoi } from 'ssgoi';
  import config from './transitionConfig';
</script>

<Ssgoi {onNavigate} {config}>
  <slot />
</Ssgoi>
```

This wraps your entire app with SSGOI, allowing it to manage transitions between pages.

## 3. Add PageTransition to Your Pages 🎬

Finally, wrap the content of each page with the `PageTransition` component:

```svelte
<script lang="ts">
  import { PageTransition } from 'ssgoi';
</script>

<PageTransition>
  <h1>Welcome to my awesome page!</h1>
  <p>This content will transition smoothly.</p>
</PageTransition>
```

Repeat this for all your pages to enable transitions.

## And... Action! 🎉

That's it! Your Svelte app is now equipped with smooth page transitions. Navigate between pages to see the magic happen!

Remember:
- The `Ssgoi` component goes in your layout file.
- The `PageTransition` component goes in each individual page file.
- Customize your transitions in the `transitionConfig.ts` file.

Now go forth and create some transition magic! ✨🚀