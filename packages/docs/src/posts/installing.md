---
title: "Installing SSGOI"
description: "Step-by-step guide to install SSGOI in your Svelte or SvelteKit project"
order: 2
group: "Getting Started"
---

# Installing SSGOI: Your First Step Towards Magical Transitions 🧙‍♂️

Ready to add some sparkle to your Svelte app? Let's get SSGOI installed and ready to cast its transition spells!

## The Installation Incantation 🪄

Open your terminal, navigate to your project directory, and chant this magical npm command:

```bash
npm install ssgoi
```

Alternatively, if you're using Yarn, wave your wand and say:

```bash
yarn add ssgoi
```

Voila! SSGOI is now a part of your project's magical arsenal.

## Post-Installation Setup 📜

After installation, you'll need to set up SSGOI in your project. Here's a quick preview of what's coming up:

1. Create a transition configuration file
2. Set up SSGOI in your main layout file
3. Use the `PageTransition` component in your pages

We'll dive deeper into these steps in the next section, but here's a sneak peek of what your main layout file might look like:

```svelte
<script lang="ts">
  import { onNavigate } from '$app/navigation';
  import { Ssgoi } from 'ssgoi';
  import config from './your-transition-config';
</script>

<Ssgoi {onNavigate} {config}>
  <slot />
</Ssgoi>
```

## What's Next? 🚀

```ascii
 [Installation Complete!]
          |
          v
   [Configuration]
          |
          v
    [Start Using]
```

Now that you've successfully summoned SSGOI into your project, it's time to learn how to wield its power! In the next section, we'll explore how to configure and use SSGOI to create stunning page transitions.

Ready to take the next step in your transition magic journey? Let's go! 💫