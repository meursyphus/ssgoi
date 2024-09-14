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
      transitions: transitions.fade(),
    },
    {
      from: '/blog',
      to: '/post/*',
      transitions: (context) => {
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

  let className = 'your-custom-class'; // Add your custom class here
</script>

<Ssgoi {onNavigate} {config} class={className}>
  <slot />
</Ssgoi>
```

This wraps your entire app with SSGOI, allowing it to manage transitions between pages. The `class` prop allows you to add custom styling to the SSGOI wrapper.

## 3. Add PageTransition to Your Pages 🎬

Finally, wrap the content of each page with the `PageTransition` component:

```svelte
<script lang="ts">
  import { PageTransition } from 'ssgoi';

  let className = 'your-custom-page-class'; // Add your custom class here
</script>

<PageTransition class={className}>
  <h1>Welcome to my awesome page!</h1>
  <p>This content will transition smoothly.</p>
</PageTransition>
```

Repeat this for all your pages to enable transitions. The `class` prop allows you to add custom styling to each page transition wrapper.

## Styling Your Transitions 🎨

The `PageTransition` component adds a `data-page-transition` attribute to its wrapper div. You can use this for more specific CSS targeting:

```css
[data-page-transition] {
  /* Your styles here */
}
```

This allows you to style the transition wrapper without affecting other parts of your app.

## And... Action! 🎉

That's it! Your Svelte app is now equipped with smooth page transitions. Navigate between pages to see the magic happen!

Remember:
- The `Ssgoi` component goes in your layout file.
- The `PageTransition` component goes in each individual page file.
- Customize your transitions in the `transitionConfig.ts` file.
- Use the `class` prop and `data-page-transition` attribute for styling.

Now go forth and create some transition magic! ✨🚀