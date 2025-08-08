# @ssgoi/qwik

Qwik bindings for SSGOI - Native app-like page transitions for Qwik applications.

## Installation

```bash
npm install @ssgoi/qwik
```

## Quick Start

### 1. Wrap your app with Ssgoi

```tsx
import { component$ } from '@builder.io/qwik';
import { Ssgoi } from '@ssgoi/qwik';
import { fade } from '@ssgoi/qwik/view-transitions';

export default component$(() => {
  return (
    <Ssgoi config={{ defaultTransition: fade() }}>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        {/* Your app content */}
      </div>
    </Ssgoi>
  );
});
```

### 2. Wrap your pages with SsgoiTransition

```tsx
import { component$ } from '@builder.io/qwik';
import { SsgoiTransition } from '@ssgoi/qwik';

export const HomePage = component$(() => {
  return (
    <SsgoiTransition id="/">
      <h1>Welcome to Home Page</h1>
      {/* Page content */}
    </SsgoiTransition>
  );
});
```

## Advanced Usage

### Route-based Transitions

```tsx
import { slide, scale, pinterest } from '@ssgoi/qwik/view-transitions';

const config = {
  transitions: [
    { from: '/home', to: '/about', transition: slide({ direction: 'left' }) },
    { from: '/about', to: '/home', transition: slide({ direction: 'right' }) },
    { from: '/products', to: '/products/*', transition: scale() },
    { from: '/gallery', to: '/photo/*', transition: pinterest() }
  ],
  defaultTransition: fade()
};
```

### Individual Element Animations

```tsx
import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { transition } from '@ssgoi/qwik';
import { fadeIn, slideUp } from '@ssgoi/qwik/transitions';

export const AnimatedCard = component$(() => {
  return (
    <div ref={transition({
      key: 'card',
      in: fadeIn(),
      out: slideUp()
    })}>
      <h2>Animated Card</h2>
    </div>
  );
});
```

## Available Transitions

### Page Transitions
- `fade()` - Smooth opacity transition
- `slide()` - Directional sliding
- `scale()` - Zoom in/out effect
- `hero()` - Shared element transitions
- `pinterest()` - Pinterest-style expand
- `ripple()` - Material Design ripple

### Element Transitions
- `fadeIn()` / `fadeOut()`
- `slideUp()` / `slideDown()` / `slideLeft()` / `slideRight()`
- `scaleIn()` / `scaleOut()`
- `bounce()`
- `blur()`
- `rotate()`

## API Reference

### Ssgoi Component

The main provider component that manages page transitions.

```tsx
interface SsgoiProps {
  config: SsgoiConfig;
}
```

### SsgoiTransition Component

Wraps pages or sections that should animate during navigation.

```tsx
interface SsgoiTransitionProps {
  id: string; // Unique identifier, typically the route path
}
```

### transition Hook

Used to animate individual elements on mount/unmount.

```tsx
function transition(config: TransitionConfig): (element: Element) => void
```

## License

MIT