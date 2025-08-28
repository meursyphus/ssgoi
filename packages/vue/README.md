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
- **🖖 Vue Optimized** - Built specifically for Vue 3 with Composition API and custom directives

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
import { Ssgoi } from '@ssgoi/vue';
import { fade } from '@ssgoi/vue/view-transitions';

const config = {
  defaultTransition: fade()
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
import { SsgoiTransition } from '@ssgoi/vue';
</script>
```

**That's it!** Your pages now transition smoothly with a fade effect.

## Advanced Transitions

### Route-based Transitions

Define different transitions for different routes:

```javascript
const config = {
  transitions: [
    // Scroll between tabs
    { from: '/home', to: '/about', transition: scroll({ direction: 'up' }) },
    { from: '/about', to: '/home', transition: scroll({ direction: 'down' }) },
    
    // Drill in when entering details
    { from: '/products', to: '/products/*', transition: drill({ direction: 'enter' }) },
    
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
  transition: scroll({ direction: 'up' }),
  symmetric: true  // Automatically creates reverse transition
}
```

### Individual Element Animations

Animate specific elements during mount/unmount:

#### Method 1: Using Vue Directive (Recommended)

```vue
<template>
  <div v-transition="{
    key: 'card',
    in: fadeIn(),
    out: slideUp()
  }">
    <h2>Animated Card</h2>
  </div>
</template>

<script setup>
import { vTransition as vTransitionDirective } from '@ssgoi/vue';
import { fadeIn, slideUp } from '@ssgoi/vue/transitions';

// Local directive registration
const vTransition = vTransitionDirective;
</script>
```

**Global Registration (in your main.ts/app.ts):**
```javascript
import { createApp } from 'vue';
import { vTransition } from '@ssgoi/vue';
import App from './App.vue';

const app = createApp(App);

// Register the directive globally
app.directive('transition', vTransition);

app.mount('#app');
```

#### Method 2: Using Composition API

```vue
<template>
  <div ref="cardRef">
    <h2>Animated Card</h2>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { transition } from '@ssgoi/vue';
import { fadeIn, slideUp } from '@ssgoi/vue/transitions';

const cardRef = ref();
let cleanup;

onMounted(() => {
  cleanup = transition({
    key: 'card',
    in: fadeIn(),
    out: slideUp()
  })(cardRef.value);
});

onUnmounted(() => {
  cleanup?.();
});
</script>
```

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
import { Ssgoi } from '@ssgoi/vue';
import { scroll } from '@ssgoi/vue/view-transitions';

const config = {
  defaultTransition: scroll({ direction: 'up' })
};
</script>

<!-- pages/index.vue -->
<template>
  <SsgoiTransition id="/">
    <!-- Your page content -->
  </SsgoiTransition>
</template>

<script setup>
import { SsgoiTransition } from '@ssgoi/vue';
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

#### `<SsgoiTransition>`
Wrapper component for pages that should transition.

```vue
<SsgoiTransition id="/page-id">
  <!-- children -->
</SsgoiTransition>
```

Props:
- `id` - Unique identifier for the page (required)

### Composables

#### `useSsgoi()`
Access transition context and state.

```javascript
import { useSsgoi } from '@ssgoi/vue';

const ssgoi = useSsgoi();
```

### Directives

#### `v-transition`
Apply transitions to individual elements.

```vue
<div v-transition="{
  key: 'unique-key',
  in: fadeIn(),
  out: fadeOut()
}">
  Content
</div>
```

### Functions

#### `transition()`
Apply transitions programmatically.

```javascript
const cleanup = transition({
  key: 'unique-key',
  in: fadeIn(),
  out: fadeOut()
})(element);
```

## Built-in Transitions

### Page Transitions (`@ssgoi/vue/view-transitions`)
- `fade()` - Smooth opacity transition
- `scroll()` - Vertical scrolling (up/down)
- `drill()` - Drill in/out effect (enter/exit)
- `hero()` - Shared element transitions
- `pinterest()` - Pinterest-style expand effect

### Element Transitions (`@ssgoi/vue/transitions`)
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

## TypeScript Support

SSGOI is written in TypeScript and provides full type definitions:

```typescript
import type { SsgoiConfig, TransitionConfig } from '@ssgoi/vue';

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