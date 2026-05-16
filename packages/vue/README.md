# @ssgoi/vue

Vue bindings for SSGOI - Native app-like page transitions for Vue applications.

try this: [ssgoi.dev](https://ssgoi.dev)

![https://ssgoi.dev](https://ssgoi.dev/ssgoi.gif)

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
    <div style="position: relative">
      <!-- Your app -->
      <RouterView />
    </div>
  </Ssgoi>
</template>

<script setup>
import { Ssgoi } from "@ssgoi/vue";
import { fade } from "@ssgoi/vue/view-transitions";

const config = {
  transitions: [fade({ paths: ["/", "/about"] })],
};
</script>
```

### 2. Wrap your pages

```vue
<template>
  <SsgoiTransition id="/">
    <h1>Welcome</h1>
    <!-- Page content -->
  </SsgoiTransition>
</template>

<script setup>
import { SsgoiTransition } from "@ssgoi/vue";
</script>
```

**That's it!** Your pages now transition smoothly with the configured effect.

## Advanced Transitions

### Route-based Transitions

Define different transitions for different routes:

```javascript
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
```

The route helpers return path transition groups, so nested arrays are accepted in `config.transitions`.

## Nuxt 3 Example

```vue
<!-- app.vue -->
<template>
  <Ssgoi :config="config">
    <div style="position: relative; min-height: 100vh">
      <NuxtPage />
    </div>
  </Ssgoi>
</template>

<script setup>
import { Ssgoi } from "@ssgoi/vue";
import { scroll } from "@ssgoi/vue/view-transitions";

const config = {
  transitions: [scroll({ paths: ["/", "/about", "/products"] })],
};
</script>

<!-- pages/index.vue -->
<template>
  <SsgoiTransition id="/">
    <!-- Your page content -->
  </SsgoiTransition>
</template>

<script setup>
import { SsgoiTransition } from "@ssgoi/vue";
</script>
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

#### `<SsgoiTransition>`

Wrapper component for pages that should transition.

```vue
<SsgoiTransition id="/page-id">
  <!-- children -->
</SsgoiTransition>
```

Props:

- `id` - Unique identifier for the page (required)

## Built-in Transitions

### Page Transitions (`@ssgoi/vue/view-transitions`)

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
