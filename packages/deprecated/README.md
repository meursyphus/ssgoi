# SSGOI - Legacy Svelte Package (Deprecated)

> ⚠️ **This package is deprecated and no longer maintained.** Please use the new framework-specific packages instead.

## 🚀 New Packages Available

SSGOI has evolved! We now offer dedicated packages for multiple frameworks with improved APIs and better performance:

### React
```bash
npm install @ssgoi/react
```

### Svelte
```bash
npm install @ssgoi/svelte
```

### Coming Soon
- `@ssgoi/vue` - Vue.js support
- `@ssgoi/solid` - SolidJS support  
- `@ssgoi/qwik` - Qwik support

## Why Upgrade?

The new packages offer:
- ✨ **Better Performance** - Powered by a new spring physics engine
- 🎯 **Framework-Specific APIs** - Optimized for each framework's best practices
- 🌍 **Universal Browser Support** - Works in Chrome, Firefox, Safari
- 🚀 **SSR Ready** - Perfect for Next.js, Nuxt, SvelteKit
- 💾 **State Persistence** - Remembers animation state during navigation
- 📦 **Smaller Bundle Size** - More efficient code splitting

## Migration Guide

### For Svelte Users

Old (deprecated):
```svelte
<script>
import { Ssgoi, PageTransition } from 'ssgoi';
import { createTransitionConfig, transitions } from 'ssgoi';

const config = createTransitionConfig({
    transitions: [
        {
            from: '/home',
            to: '/about',
            transitions: transitions.fade()
        }
    ],
    defaultTransition: transitions.fade()
});
</script>

<Ssgoi {onNavigate} {config}>
    <PageTransition>
        <!-- Your content -->
    </PageTransition>
</Ssgoi>
```

New (@ssgoi/svelte):
```svelte
<script>
import { Ssgoi, SsgoiTransition } from '@ssgoi/svelte';
import { fade } from '@ssgoi/svelte/view-transitions';
</script>

<Ssgoi config={{ defaultTransition: fade() }}>
    <SsgoiTransition id={$page.url.pathname}>
        <!-- Your content -->
    </SsgoiTransition>
</Ssgoi>
```

## Learn More

- 📖 [Documentation](https://ssgoi.dev)
- 🎮 [Live Demos](https://github.com/meursyphus/ssgoi#live-demos)
- 💻 [GitHub Repository](https://github.com/meursyphus/ssgoi)

## Legacy Documentation

If you need to reference the old API while migrating, the original documentation is preserved below.

---

<details>
<summary>Click to view legacy documentation</summary>

# SSGOI - Svelte Smooth Go Transition Library

SSGOI (쓱고이) is a powerful and easy-to-use page transition library for Svelte and SvelteKit applications. Make your pages go "쓱!" (swoosh) like a model on a digital catwalk!

## What's in a name?

SSGOI combines two fantastic ideas:

- "쓱" (sseuk): A Korean onomatopoeia for a quick, smooth movement - just like our page transitions!
- "すごい" (sugoi): Japanese for "amazing" - because that's what your users will say when they see these transitions!

## Features

- 🚀 Simple setup for complex page transitions
- 🎨 Various built-in transition effects
- 📱 Dynamic transitions based on runtime conditions
- 🔧 Create custom transition effects
- 🔒 TypeScript support for type safety
- 🎭 Easy styling with class and data attributes

## Installation

```bash
npm install ssgoi
```

## Basic Usage

### 1. Create a transition configuration:

```typescript
import { createTransitionConfig, transitions } from 'ssgoi';

const config = createTransitionConfig({
    transitions: [
        {
            from: '/home',
            to: '/about',
            transitions: transitions.fade()
        },
        {
            from: '/blog',
            to: '/post/*',
            transitions: (from, to) => {
                return from.path === '/blog' ? transitions.slideRight() : transitions.slideLeft();
            }
        }
    ],
    defaultTransition: transitions.fade()
});
```

### 2. Setting up SSGOI in Your Layout

To use SSGOI effectively, you should set it up in your app's main layout file. This ensures that transitions are applied consistently across your entire application.

Here's a simplified example of how to set up SSGOI in your layout:

```svelte
<script lang="ts">
    import { onNavigate } from '$app/navigation';
    import { Ssgoi } from 'ssgoi';
    import config from './your-transition-config';

    let className = 'your-custom-class'; // Add your custom class here
</script>

<div class="app-layout">
    <header>
        <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </nav>
    </header>

    <main>
        <Ssgoi {onNavigate} {config} class={className}>
            <slot />
        </Ssgoi>
    </main>

    <footer>
        <p>&copy; 2023 Your App Name</p>
    </footer>
</div>

<style>
    .app-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        flex-grow: 1;
    }

    /* Add more styles as needed */
</style>
```

In this setup:

1. We import the necessary components and functions: `Ssgoi` from the SSGOI library, `onNavigate` from SvelteKit's navigation module, and your transition configuration.

2. We add a `className` variable to pass a custom class to the `Ssgoi` component.

3. The `Ssgoi` component wraps the `<slot />` in the `<main>` section. This is where your page content will be rendered.

4. We pass the `onNavigate` function, your `config`, and the `className` to the `Ssgoi` component. This allows SSGOI to handle transitions based on your configuration when navigation occurs, and applies your custom class for styling.

5. The layout includes a basic structure with a header (containing navigation), main content area, and footer. You can customize this structure to fit your app's needs.

### 3. Wrap your page with Page Transitions

Page transitions in SSGOI are applied using the `PageTransition` component. This component should wrap the content of each individual page in your application, not the entire app layout. It acts as a boilerplate for each page, ensuring smooth transitions between pages.

Example usage in a page component:

```svelte
<script lang="ts">
    import { PageTransition } from 'ssgoi';

    const posts = [
        { id: 1, title: 'First Post', content: 'This is the first post content.' },
        { id: 2, title: 'Second Post', content: 'This is the second post content.' }
    ];

    let className = 'your-custom-page-class'; // Add your custom class here
</script>

<PageTransition class={className}>
    <div class="posts-container">
        <h1>Featured Posts</h1>
        {#each posts as post (post.id)}
            <article class="post">
                <h2>{post.title}</h2>
                <p>{post.content}</p>
            </article>
        {/each}
    </div>
</PageTransition>

<style>
    .posts-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 1rem;
    }
    .post {
        margin-bottom: 1rem;
    }
</style>
```

Important notes:

1. The `PageTransition` component should be used in each individual page component, not in the main layout.
2. It wraps the entire content of the page, allowing SSGOI to manage the transition effects when navigating to and from this page.
3. You can pass a custom class to the `PageTransition` component for styling purposes.
4. The `PageTransition` component adds a `data-page-transition` attribute to the wrapper div, allowing for easy CSS selection and styling.

By using `PageTransition` in each of your page components, you ensure that SSGOI can properly manage the entering and exiting transitions for each page in your application.

## Documentation

For more detailed usage and API documentation, please refer to our [official documentation](https://ssgoi.pages.dev).

## Contributing

We welcome bug reports, feature requests, and pull requests! Before contributing, please read our [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

</details>