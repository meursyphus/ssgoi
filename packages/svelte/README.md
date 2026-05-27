# @ssgoi/svelte

Svelte bindings for SSGOI - Native app-like page transitions for Svelte and SvelteKit.

try this: [ssgoi.dev](https://ssgoi.dev)

![https://ssgoi.dev](https://ssgoi.dev/ssgoi.gif)

## What is SSGOI?

SSGOI brings native app-like page transitions to the web. Transform your static page navigations into smooth, delightful experiences that users love.

### ✨ Key Features

- **🌍 Works Everywhere** - Unlike the browser's View Transition API, SSGOI works in all modern browsers (Chrome, Firefox, Safari)
- **🚀 SSR Ready** - Perfect compatibility with SvelteKit. No hydration issues, SEO-friendly
- **🎯 Use Your Router** - Keep your existing routing. SvelteKit's built-in router works seamlessly
- **💾 State Persistence** - Remembers animation state during navigation, even with browser back/forward
- **🧩 Svelte Native** - Built specifically for Svelte components

## Installation

```bash
npm install @ssgoi/svelte
# or
yarn add @ssgoi/svelte
# or
pnpm add @ssgoi/svelte
```

## Quick Start

### 1. Wrap your app layout

```svelte
<!-- +layout.svelte -->
<script>
  import { Ssgoi } from "@ssgoi/svelte";
  import { fade } from "@ssgoi/svelte/view-transitions";

  const config = {
    transitions: [fade({ paths: ["/", "/about"] })],
  };
</script>

<Ssgoi {config}>
  <!-- ⚠️ Important: position: relative is required! -->
  <div style="position: relative; min-height: 100vh;">
    <slot />
  </div>
</Ssgoi>
```

### 2. Mark your pages

```svelte
<!-- +page.svelte -->
<script>
  import { page } from "$app/stores";
</script>

<main data-ssgoi-transition={$page.url.pathname}>
  <h1>Welcome</h1>
  <!-- Page content -->
</main>
```

**That's it!** Your pages now transition smoothly with the configured effect.

## Advanced Transitions

### Route-based Transitions

Define different transitions for different routes:

```svelte
<script>
  import { Ssgoi } from "@ssgoi/svelte";
  import { scroll, drill, zoom } from "@ssgoi/svelte/view-transitions";

  const config = {
    transitions: [
      // Scroll between tabs
      scroll({ paths: ["/home", "/about"] }),

      // Drill in when entering details
      drill({ enter: "/products/*", exit: "/products" }),

      // Shared element image transitions
      zoom({ paths: ["/gallery", "/photo/*"], type: "expand" }),
    ],
  };
</script>

<Ssgoi {config}>
  <slot />
</Ssgoi>
```

The route helpers return path transition groups, so nested arrays are accepted in `config.transitions`.

## SvelteKit App Example

```svelte
<!-- +layout.svelte -->
<script>
  import { Ssgoi } from '@ssgoi/svelte';
  import { scroll } from '@ssgoi/svelte/view-transitions';

  const config = {
    transitions: [scroll({ paths: ['/', '/about', '/products'] })]
  };
</script>

<Ssgoi {config}>
  <div style="position: relative; min-height: 100vh;">
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/products">Products</a>
    </nav>
    <slot />
  </div>
</Ssgoi>

<!-- +page.svelte -->
<script>
  import { page } from '$app/stores';
</script>

<main data-ssgoi-transition={$page.url.pathname}>
  <!-- Your page content -->
</main>
```

## API Reference

### Components

#### `<Ssgoi>`

The provider component that manages transition context.

```svelte
<Ssgoi config={ssgoiConfig}>
  <slot />
</Ssgoi>
```

Props:

- `config` - Transition configuration object
- `host` - Optional external playback host for debug tooling

#### `data-ssgoi-transition`

Attribute for pages that should transition. Set it on the page boundary element
inside `<Ssgoi>`.

```svelte
<main data-ssgoi-transition="/page-id">
  <slot />
</main>
```

## Built-in Transitions

### Page Transitions (`@ssgoi/svelte/view-transitions`)

- `fade()` - Smooth opacity transition
- `scroll()` - Vertical scrolling (up/down)
- `drill()` - Drill in/out effect (enter/exit)
- `hero()` - Shared element transitions
- `slide()` - Ordered horizontal page transitions
- `zoom()` - Shared element zoom transitions

## Typed Preset Configuration

Transition presets are fully typed and use the core animation engine internally:

```javascript
slide({
  paths: ["/products/all", "/products/fashion"],
});
```

## TypeScript Support

SSGOI is written in TypeScript and provides full type definitions:

```typescript
import type { SsgoiConfig, TransitionConfig } from "@ssgoi/svelte";

const config: SsgoiConfig = {
  // Full type safety
};
```

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- All modern mobile browsers

## Performance

- Minimal bundle size (~8kb gzipped)
- Hardware-accelerated animations
- Automatic cleanup and memory management
- Smart preloading for instant transitions

## Documentation

Visit [https://ssgoi.dev](https://ssgoi.dev) for:

- Complete API reference
- Interactive examples
- Advanced patterns
- Migration guides

## Contributing

We welcome contributions! Please see our [contributing guide](https://github.com/meursyphus/ssgoi/blob/main/CONTRIBUTING.md) for details.

## License

MIT © [MeurSyphus](https://github.com/meursyphus)
