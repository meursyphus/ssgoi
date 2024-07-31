---
title: "SSGOI Basic Usage"
description: "Learn how to implement basic page transitions using SSGOI in your Svelte application"
order: 3
group: "Getting Started"
---

# SSGOI Basic Usage: Let's Get Those Pages Moving!

Welcome to the SSGOI basic usage guide! You've installed SSGOI, and now you're ready to make your pages transition smoother than a buttered dolphin. Let's dive in!

## Step 1: Import SSGOI

First things first, let's bring SSGOI into your Svelte app. In your main layout file (usually `src/routes/__layout.svelte` for SvelteKit), add this import:

```javascript
import { PageTransition } from 'ssgoi';
```

Congratulations! You've taken the first step towards transition greatness.

## Step 2: Set Up the Configuration

Now, let's tell SSGOI how you want your pages to move. Create a new file called `transitionConfig.js` in your `src/lib` folder:

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

This configuration is like a dance instructor for your pages. It's telling the home page to fade, the about page to slide, and everything else to fade. Fancy!

## Step 3: Wrap Your Content

Back in your layout file, wrap your main content with the `PageTransition` component:

```svelte
<script>
  import { PageTransition } from 'ssgoi';
  import transitionConfig from '$lib/transitionConfig';
</script>

<PageTransition {transitionConfig}>
  <slot />
</PageTransition>
```

You've just given your content the ability to dance in and out of view. It's like magic, but with more JavaScript!

## Step 4: Marvel at Your Work

That's it! Your pages should now transition smoothly when navigating. If they don't, don't panic! Check your configuration, make sure your routes are correct, and remember - even the smoothest operators hit a bump sometimes.

## Bonus: Dynamic Transitions

Feeling adventurous? Try a dynamic transition! Update your config like this:

```javascript
'/blog': {
  '*': () => {
    return Math.random() > 0.5 ? transitions.fade : transitions.slide;
  }
}
```

Now your blog page will randomly fade or slide. It's like a box of chocolates - you never know what you're gonna get!

## Wrapping Up

You've now mastered the basics of SSGOI. Your pages are transitioning, your users are amazed, and you're feeling smoother than ever. But wait, there's more! Check out our advanced guides to learn about custom transitions, optimizing performance, and more.

Remember, with SSGOI, every page load is an opportunity for pizzazz. Use this power wisely, and may your transitions always be smooth and your load times swift!
