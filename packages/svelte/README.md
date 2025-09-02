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
- **🧩 Svelte Native** - Built specifically for Svelte with actions and stores

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
</script>

<Ssgoi config={{ defaultTransition: fade() }}>
  <!-- ⚠️ Important: position: relative is required! -->
  <div style="position: relative; min-height: 100vh;">
    <slot />
  </div>
</Ssgoi>
```

### 2. Wrap your pages

```svelte
<!-- +page.svelte -->
<script>
  import { SsgoiTransition } from "@ssgoi/svelte";
  import { page } from "$app/stores";
</script>

<SsgoiTransition id={$page.url.pathname}>
  <h1>Welcome</h1>
  <!-- Page content -->
</SsgoiTransition>
```

**That's it!** Your pages now transition smoothly with a fade effect.

## Advanced Transitions

### Route-based Transitions

Define different transitions for different routes:

```svelte
<script>
  import { Ssgoi } from "@ssgoi/svelte";
  import {
    scroll,
    fade,
    drill,
    pinterest,
  } from "@ssgoi/svelte/view-transitions";

  const config = {
    transitions: [
      // Scroll between tabs
      { from: "/home", to: "/about", transition: scroll({ direction: "up" }) },
      {
        from: "/about",
        to: "/home",
        transition: scroll({ direction: "down" }),
      },

      // Drill in when entering details
      {
        from: "/products",
        to: "/products/*",
        transition: drill({ direction: "enter" }),
      },

      // Pinterest-style image transitions
      { from: "/gallery", to: "/photo/*", transition: pinterest() },
    ],
    defaultTransition: fade(),
  };
</script>

<Ssgoi {config}>
  <slot />
</Ssgoi>
```

### Symmetric Transitions

Automatically create bidirectional transitions:

```svelte
{
  from: '/home',
  to: '/about',
  transition: scroll({ direction: 'up' }),
  symmetric: true  // Automatically creates reverse transition
}
```

### Individual Element Animations

Animate specific elements during mount/unmount:

```svelte
<script>
  import { transition } from "@ssgoi/svelte";
  import { fadeIn, slideUp } from "@ssgoi/svelte/transitions";
</script>

<div
  use:transition={{
    key: "card",
    in: fadeIn(),
    out: slideUp(),
  }}
>
  <h2>Animated Card</h2>
</div>
```

## SvelteKit App Example

```svelte
<!-- +layout.svelte -->
<script>
  import { Ssgoi } from '@ssgoi/svelte';
  import { scroll } from '@ssgoi/svelte/view-transitions';
</script>

<Ssgoi config={{
  defaultTransition: scroll({ direction: 'up' })
}}>
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
  import { SsgoiTransition } from '@ssgoi/svelte';
  import { page } from '$app/stores';
</script>

<SsgoiTransition id={$page.url.pathname}>
  <!-- Your page content -->
</SsgoiTransition>
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

#### `<SsgoiTransition>`

Wrapper component for pages that should transition.

```svelte
<SsgoiTransition id="/page-id">
  <slot />
</SsgoiTransition>
```

### Actions

#### `use:transition`

Apply transitions to individual elements.

```svelte
<div
  use:transition={{
    key: "unique-key",
    in: fadeIn(),
    out: fadeOut(),
  }}
>
  Content
</div>
```

### Stores

#### `transitioning`

Access transition state.

```svelte
<script>
  import { transitioning } from "@ssgoi/svelte";
</script>

{#if $transitioning}
  <p>Transitioning...</p>
{/if}
```

## Built-in Transitions

### Page Transitions (`@ssgoi/svelte/view-transitions`)

- `fade()` - Smooth opacity transition
- `scroll()` - Vertical scrolling (up/down)
- `drill()` - Drill in/out effect (enter/exit)
- `hero()` - Shared element transitions
- `pinterest()` - Pinterest-style expand effect

### Element Transitions (`@ssgoi/svelte/transitions`)

- `fadeIn()` / `fadeOut()`
- `slideUp()` / `slideDown()` / `slideLeft()` / `slideRight()`
- `scaleIn()` / `scaleOut()`
- `bounce()`
- `blur()`
- `rotate()`

## Spring Physics Configuration

All transitions use spring physics for natural motion:

```javascript
slide({
  direction: "left",
  spring: {
    stiffness: 300, // 1-1000, higher = faster
    damping: 30, // 0-100, higher = less oscillation
  },
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
