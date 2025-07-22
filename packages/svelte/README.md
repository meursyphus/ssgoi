# @ssgoi/svelte

Svelte bindings for SSGOI - Native app-like page transitions for Svelte and SvelteKit.

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
  import { Ssgoi } from '@ssgoi/svelte';
  import { fade } from '@ssgoi/svelte/view-transitions';
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
  import { SsgoiTransition } from '@ssgoi/svelte';
  import { page } from '$app/stores';
</script>

<SsgoiTransition id={$page.url.pathname}>
  <h1>Welcome</h1>
  <!-- Page content -->
</SsgoiTransition>
```

## Route-based Transitions

```svelte
<script>
  import { Ssgoi } from '@ssgoi/svelte';
  import { slide, fade } from '@ssgoi/svelte/view-transitions';

  const config = {
    transitions: [
      { from: '/home', to: '/about', transition: slide({ direction: 'left' }) },
      { from: '/about', to: '/home', transition: slide({ direction: 'right' }) },
      { from: '/products', to: '/products/*', transition: fade() }
    ],
    defaultTransition: fade()
  };
</script>

<Ssgoi {config}>
  <slot />
</Ssgoi>
```

## Individual Element Transitions

```svelte
<script>
  import { transition } from '@ssgoi/svelte';
  import { fadeIn, slideUp } from '@ssgoi/svelte/transitions';
</script>

<div use:transition={{
  key: 'unique-key',
  in: fadeIn(),
  out: slideUp()
}}>
  Content
</div>
```

## API Reference

### Components

- `<Ssgoi>` - Provider component for transition context
- `<SsgoiTransition>` - Wrapper for pages that should transition

### Actions

- `use:transition` - Apply transitions to individual elements

### Configuration

```typescript
interface SsgoiConfig {
  transitions: Array<{
    from: string;
    to: string;
    transition: Transition;
    symmetric?: boolean;
  }>;
  defaultTransition?: Transition;
}
```

## Built-in Transitions

### View Transitions (`/view-transitions`)
- `fade()`, `slide()`, `scale()`
- `hero()`, `pinterest()`, `ripple()`

### Element Transitions (`/transitions`)
- `fadeIn()`, `fadeOut()`
- `slideUp()`, `slideDown()`, `slideLeft()`, `slideRight()`
- `scaleIn()`, `scaleOut()`
- `bounce()`, `blur()`, `rotate()`

## Spring Configuration

```javascript
slide({
  direction: 'left',
  spring: {
    stiffness: 300,  // 1-1000
    damping: 30      // 0-100
  }
})
```

## Documentation

Visit [https://ssgoi.dev](https://ssgoi.dev) for:
- Complete API reference
- Interactive examples
- Advanced patterns
- Migration guides

## License

MIT © [MeurSyphus](https://github.com/meursyphus)