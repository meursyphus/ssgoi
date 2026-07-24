# @ssgoi/vue

Vue bindings for SSGOI - Native app-like page transitions for Vue applications.

try this: [ssgoi.dev](https://ssgoi.dev)

![https://ssgoi.dev](https://ssgoi.dev/ssgoi.gif)

## AI-Assisted Setup

Using Claude, Cursor, ChatGPT, or another AI assistant? Point it at:

```
https://ssgoi.dev/llms.txt
```

It has the full setup guide, every transition, the API, and troubleshooting — everything an agent needs to wire SSGOI into your app.

## What is SSGOI?

SSGOI brings native app-like page transitions to the web. Transform your static page navigations into smooth, delightful experiences that users love.

### ✨ Key Features

- **🌍 Works Everywhere** - Unlike the browser's View Transition API, SSGOI works in all modern browsers (Chrome, Firefox, Safari)
- **🚀 SSR Ready** - Perfect compatibility with Nuxt. No hydration issues, SEO-friendly
- **🎯 Use Your Router** - Keep your existing routing. Vue Router, Nuxt - all work seamlessly
- **💾 State Persistence** - Remembers animation state during navigation, even with browser back/forward
- **🖖 Vue Optimized** - Built specifically for Vue 3 with Composition API components

## Installation

```bash
npm install @ssgoi/vue
# or
yarn add @ssgoi/vue
# or
pnpm add @ssgoi/vue
```

## Quick Start

### 1. Wrap your app

```vue
<template>
  <Ssgoi :config="config">
    <!-- position: relative + z-index: 0 are required (the outgoing page is cloned with position:absolute) -->
    <div style="position: relative; z-index: 0">
      <!-- Your app -->
      <RouterView />
    </div>
  </Ssgoi>
</template>

<script setup>
import { Ssgoi } from "@ssgoi/vue";
import { fade } from "@ssgoi/vue/view-transitions";

const config = {
  transitions: [{ from: "/", to: "/about", transition: fade() }],
};
</script>
```

### 2. Mark your pages

```vue
<template>
  <main data-ssgoi-transition="/">
    <h1>Welcome</h1>
    <!-- Page content -->
  </main>
</template>
```

**That's it!** Your pages now transition smoothly with the configured effect.

## Advanced Transitions

### Route-based Transitions

Define different transitions for different routes:

```javascript
const config = {
  transitions: [
    // Scroll between tabs
    { ordered: ["/home", "/about"], transition: scroll() },

    // Drill in when entering details
    {
      on: "/products/**",
      except: "/products",
      transition: drill(),
    },

    // Shared element image transitions
    {
      from: "/gallery",
      to: "/photo/:id",
      transition: zoom({ type: "expand" }),
    },
  ],
};
```

The transition list is flat: route rules own matching and factories own effects.

## Nuxt 3 Example

```vue
<!-- app.vue -->
<template>
  <Ssgoi :config="config">
    <div style="position: relative; z-index: 0; min-height: 100vh">
      <NuxtPage />
    </div>
  </Ssgoi>
</template>

<script setup>
import { Ssgoi } from "@ssgoi/vue";
import { scroll } from "@ssgoi/vue/view-transitions";

const config = {
  transitions: [
    { ordered: ["/", "/about", "/products"], transition: scroll() },
  ],
};
</script>

<!-- pages/index.vue -->
<template>
  <main data-ssgoi-transition="/">
    <!-- Your page content -->
  </main>
</template>
```

## API Reference

### Components

#### `<Ssgoi>`

The provider component that manages transition context.

```vue
<Ssgoi :config="ssgoiConfig">
  <!-- children -->
</Ssgoi>
```

Props:

- `config` - Transition configuration object
- `host` - Optional external playback host for debug tooling

#### `data-ssgoi-transition`

Attribute for pages that should transition. Set it on the page boundary element
inside `<Ssgoi>`.

```vue
<main data-ssgoi-transition="/page-id">
  <!-- children -->
</main>
```

## Built-in Transitions

### Page Transitions (`@ssgoi/vue/view-transitions`)

- `fade()` - Calm cross-fade. Safe default for unrelated pages
- `drill()` - iOS-style hierarchical navigation (list → detail)
- `slide()` - Horizontal push for tabs / sequential flows
- `scroll()` - Vertical page scroll for onboarding / paginated views
- `axis()` - Material/Flutter shared-axis swap for sibling/tab routes
- `sheet()` - Bottom sheet that slides up (modal-like flows)
- `hero()` - Shared element transition (matching `data-hero-enter-key` / `data-hero-exit-key`)
- `zoom()` - Card-to-detail expansion (matching `data-zoom-enter-key` / `data-zoom-exit-key`)
- `strip()` - 3D Y-axis perspective flip
- `blind()` - Window-blinds wipe reveal
- `film()` - Cinematic shrink + tile (gallery / lightbox)
- `rotate()` - Card flip between siblings
- `jaemin()` - Playful rotated zoom for special moments

## Typed Preset Configuration

Transition presets are fully typed and use the core animation engine internally:

```javascript
{
  ordered: ["/products/all", "/products/fashion"],
  transition: slide(),
}
```

## TypeScript Support

SSGOI is written in TypeScript and provides full type definitions:

```typescript
import type { SsgoiConfig, TransitionConfig } from "@ssgoi/vue";

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
