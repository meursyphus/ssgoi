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
      transitions: transitions.fade(),
      symmetric: true
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
    <Ssgoi {onNavigate} {config}>
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

2. The `Ssgoi` component wraps the `<slot />` in the `<main>` section. This is where your page content will be rendered.

3. We pass the `onNavigate` function and your `config` to the `Ssgoi` component. This allows SSGOI to handle transitions based on your configuration when navigation occurs.

4. The layout includes a basic structure with a header (containing navigation), main content area, and footer. You can customize this structure to fit your app's needs.

By setting up SSGOI in your layout like this, you ensure that all your page transitions are handled consistently throughout your application. The `Ssgoi` component will apply the appropriate transitions based on your configuration whenever the user navigates between pages.

Remember to create and import your transition configuration file (`your-transition-config.js` in this example) where you define your transition rules using `createTransitionConfig` as shown in the earlier examples.

### 3. Wrap your page with Page Transitions

Page transitions in SSGOI are applied using the `PageTransition` component. This component should wrap the content of each individual page in your application, not the entire app layout. It acts as a boilerplate for each page, ensuring smooth transitions between pages.

Example usage in a page component:

```svelte
<script lang="ts">
  import { PageTransition } from 'ssgoi';

  const posts = [
    { id: 1, title: 'First Post', content: 'This is the first post content.' },
    { id: 2, title: 'Second Post', content: 'This is the second post content.' },
  ];
</script>

<PageTransition>
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
3. You don't need to pass any props to `PageTransition`. The transition logic is handled by the `Ssgoi` component in your main layout.

By using `PageTransition` in each of your page components, you ensure that SSGOI can properly manage the entering and exiting transitions for each page in your application.

## Hero Transitions

SSGOI supports hero transitions, which allow for smooth transitions of specific elements between pages. When using hero transitions, it's important to have matching `Hero` components on both the source and destination pages with the same `key` prop.

Example usage:

1. Color Gallery Page (source):

```svelte
<script lang="ts">
  import { PageTransition, Hero } from 'ssgoi';

  const colors = [
    { name: 'Red', hex: 'FF0000' },
    { name: 'Green', hex: '00FF00' },
    { name: 'Blue', hex: '0000FF' },
  ];
</script>

<PageTransition>
  <div class="color-gallery">
    <h1>Color Gallery</h1>
    <div class="container">
      {#each colors as color (color.hex)}
        <Hero key={'#' + color.hex}>
          <a href="/color/{color.hex}" class="color-card">
            <div style="background: #{color.hex};" class="color-box"></div>
            <div class="color-info">
              <h2>{color.name}</h2>
              <p>#{color.hex}</p>
            </div>
          </a>
        </Hero>
      {/each}
    </div>
  </div>
</PageTransition>
```

2. Color Detail Page (destination):

```svelte
<script lang="ts">
  import { PageTransition, Hero } from 'ssgoi';
  import { page } from '$app/stores';

  const color = '#' + $page.params.color;
</script>

<PageTransition>
  <Hero key={color}>
    <div class="color-detail" style="background-color: {color};">
      <h1>{color}</h1>
      <a href="/demo/image">Back to Gallery</a>
    </div>
  </Hero>
</PageTransition>

<style>
  .color-detail {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
  }
  a {
    margin-top: 1rem;
    color: white;
  }
</style>
```

In these examples, the `Hero` component is used on both pages with the same `key` prop (the color hex value). This allows SSGOI to create a smooth transition between the color card in the gallery and the full-screen color display on the detail page.

### Hero API

The `Hero` component accepts the following props:

- `key: string` (required): A unique identifier for the hero element. This should match between the source and destination pages for the transition to work correctly.
- `duration?: number` (optional): The duration of the hero transition in milliseconds. Default is 300ms.
- `easing?: (t: number) => number` (optional): An easing function for the transition. Default is a cubic bezier easing.

When using hero transitions, it's recommended to set the page transition to `none` for the pages involved in the hero transition. This can be done in your transition configuration:

```typescript
const config = createTransitionConfig({
  transitions: [
    {
      from: '/demo/image',
      to: '/color/*',
      transitions: transitions.none(),
    },
    {
      from: '/color/*',
      to: '/demo/image',
      transitions: transitions.none(),
    },
    // Other transitions...
  ],
  defaultTransition: transitions.fade()
});
```

By following these guidelines, you can create smooth and engaging hero transitions in your Svelte application using SSGOI.


By following these guidelines, you can create smooth and engaging transitions in your Svelte application using SSGOI.

## Documentation

For more detailed usage and API documentation, please refer to our [official documentation](https://ssgoi.pages.dev).

## Contributing

We welcome bug reports, feature requests, and pull requests! Before contributing, please read our [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.