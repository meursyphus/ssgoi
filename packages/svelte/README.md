# @ssgoi/svelte

Svelte bindings for SSGOI - Native app-like page transitions for Svelte and SvelteKit applications.

## What is SSGOI?

SSGOI brings native app-like page transitions to the web. Transform your static page navigations into smooth, delightful experiences that users love.

### ✨ Key Features

- **🌍 Works Everywhere** - Unlike the browser's View Transition API, SSGOI works in all modern browsers (Chrome, Firefox, Safari)
- **🚀 SSR Ready** - Perfect compatibility with SvelteKit. No hydration issues, SEO-friendly
- **🎯 Use Your Router** - Keep your existing SvelteKit routing
- **💾 State Persistence** - Remembers animation state during navigation, even with browser back/forward
- **⚡ Svelte Optimized** - Built with Svelte 5 runes and modern patterns

## Installation

```bash
npm install @ssgoi/svelte
# or
yarn add @ssgoi/svelte
# or
pnpm add @ssgoi/svelte
```

## Quick Start

### 1. Wrap your app

```svelte
<!-- +layout.svelte -->
<script>
  import { Ssgoi } from '@ssgoi/svelte';
  import { fade } from '@ssgoi/svelte/view-transitions';
</script>

<Ssgoi config={{ defaultTransition: fade() }}>
  <div style="position: relative; min-height: 100vh;">
    <slot />
  </div>
</Ssgoi>
```

### 2. Wrap your pages

```svelte
<!-- +page.svelte -->
<script>
  import { SsgoiTransition } from '@ssgoi/svelte';
  import { page } from '$app/stores';
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

```javascript
const config = {
  transitions: [
    // Slide between tabs
    { from: '/home', to: '/about', transition: slide({ direction: 'left' }) },
    { from: '/about', to: '/home', transition: slide({ direction: 'right' }) },
    
    // Scale up when entering details
    { from: '/products', to: '/products/*', transition: scale() },
    
    // Pinterest-style image transitions
    { from: '/gallery', to: '/photo/*', transition: pinterest() }
  ],
  defaultTransition: fade()
};
```

### Symmetric Transitions

Automatically create bidirectional transitions:

```javascript
{
  from: '/home',
  to: '/about', 
  transition: slide({ direction: 'left' }),
  symmetric: true  // Automatically creates reverse transition
}
```

### Individual Element Animations

Animate specific elements during mount/unmount:

```svelte
<script>
  import { transition } from '@ssgoi/svelte';
  import { fadeIn, slideUp } from '@ssgoi/svelte/transitions';

  let showCard = $state(true);
</script>

{#if showCard}
  <div
    use:transition={{
      key: 'card',
      in: fadeIn(),
      out: slideUp()
    }}
  >
    <h2>Animated Card</h2>
  </div>
{/if}
```

## SvelteKit Example

```svelte
<!-- +layout.svelte -->
<script lang="ts">
  import { Ssgoi } from '@ssgoi/svelte';
  import { slide } from '@ssgoi/svelte/view-transitions';
  
  interface Props {
    children: () => any;
  }

  let { children }: Props = $props();

  const ssgoiConfig = {
    defaultTransition: slide({ direction: 'left' })
  };
</script>

<Ssgoi config={ssgoiConfig}>
  <div style="position: relative; min-height: 100vh;">
    {@render children()}
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
  <!-- Content -->
</SsgoiTransition>
```

### Actions

#### `use:transition`
Apply transitions to individual elements.

```svelte
<div
  use:transition={{
    key: 'unique-key',
    in: fadeIn(),
    out: fadeOut()
  }}
>
  Content
</div>
```

## Built-in Transitions

### Page Transitions (`@ssgoi/svelte/view-transitions`)
- `fade()` - Smooth opacity transition
- `slide()` - Directional sliding (left/right/up/down)
- `scale()` - Zoom in/out effect
- `hero()` - Shared element transitions
- `pinterest()` - Pinterest-style expand effect
- `ripple()` - Material Design ripple effect

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
  direction: 'left',
  spring: {
    stiffness: 300,  // 1-1000, higher = faster
    damping: 30      // 0-100, higher = less oscillation
  }
})
```

## Hero Transitions

Create seamless transitions between matching elements:

```svelte
<!-- List page -->
<a
  href={`/item/${item.id}`}
  data-hero-key={`item-${item.id}`}
>
  <img src={item.thumbnail} alt={item.name} />
</a>

<!-- Detail page -->
<div data-hero-key={`item-${item.id}`}>
  <img src={item.fullImage} alt={item.name} />
</div>
```

## Svelte 5 Support

SSGOI is built with full Svelte 5 support, including:

- Runes (`$state`, `$props`, `$derived`)
- New component syntax
- Improved performance
- Full TypeScript support

```svelte
<script lang="ts">
  import { transition } from '@ssgoi/svelte';
  
  let count = $state(0);
  let showBox = $state(true);
</script>

{#if showBox}
  <div
    use:transition={{
      key: `box-${count}`,
      in: (element) => ({
        spring: { stiffness: 300, damping: 30 },
        tick: (progress) => {
          element.style.opacity = progress.toString();
          element.style.transform = `scale(${progress})`;
        }
      })
    }}
  >
    Box {count}
  </div>
{/if}
```

## TypeScript Support

SSGOI is written in TypeScript and provides full type definitions:

```typescript
import type { SsgoiConfig, TransitionConfig } from '@ssgoi/svelte';

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

- Minimal bundle size (~16kb gzipped)
- Hardware-accelerated animations
- Automatic cleanup and memory management
- Smart preloading for instant transitions
- No virtual DOM overhead

## Contributing

We welcome contributions! Please see our [contributing guide](https://github.com/meursyphus/ssgoi/blob/main/CONTRIBUTING.md) for details.

## License

MIT © [MeurSyphus](https://github.com/meursyphus)