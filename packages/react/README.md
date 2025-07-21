# @ssgoi/react

React bindings for SSGOI - Native app-like page transitions for React applications.

## What is SSGOI?

SSGOI brings native app-like page transitions to the web. Transform your static page navigations into smooth, delightful experiences that users love.

### ✨ Key Features

- **🌍 Works Everywhere** - Unlike the browser's View Transition API, SSGOI works in all modern browsers (Chrome, Firefox, Safari)
- **🚀 SSR Ready** - Perfect compatibility with Next.js. No hydration issues, SEO-friendly
- **🎯 Use Your Router** - Keep your existing routing. React Router, Next.js App Router - all work seamlessly
- **💾 State Persistence** - Remembers animation state during navigation, even with browser back/forward
- **⚛️ React Optimized** - Built specifically for React with hooks and modern patterns

## Installation

```bash
npm install @ssgoi/react
# or
yarn add @ssgoi/react
# or
pnpm add @ssgoi/react
```

## Quick Start

### 1. Wrap your app

```tsx
import { Ssgoi } from '@ssgoi/react';
import { fade } from '@ssgoi/react/view-transitions';

export default function App() {
  return (
    <Ssgoi config={{ defaultTransition: fade() }}>
      <div style={{ position: 'relative' }}>
        {/* Your app */}
      </div>
    </Ssgoi>
  );
}
```

### 2. Wrap your pages

```tsx
import { SsgoiTransition } from '@ssgoi/react';

export default function HomePage() {
  return (
    <SsgoiTransition id="/">
      <h1>Welcome</h1>
      {/* Page content */}
    </SsgoiTransition>
  );
}
```

**That's it!** Your pages now transition smoothly with a fade effect.

## Advanced Transitions

### Route-based Transitions

Define different transitions for different routes:

```tsx
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

```tsx
{
  from: '/home',
  to: '/about', 
  transition: slide({ direction: 'left' }),
  symmetric: true  // Automatically creates reverse transition
}
```

### Individual Element Animations

Animate specific elements during mount/unmount:

```tsx
import { transition } from '@ssgoi/react';
import { fadeIn, slideUp } from '@ssgoi/react/transitions';

function Card() {
  return (
    <div ref={transition({
      key: 'card',
      in: fadeIn(),
      out: slideUp()
    })}>
      <h2>Animated Card</h2>
    </div>
  );
}
```

## Next.js App Router Example

```tsx
// app/layout.tsx
import { Ssgoi } from '@ssgoi/react';
import { slide } from '@ssgoi/react/view-transitions';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Ssgoi config={{
          defaultTransition: slide({ direction: 'left' })
        }}>
          <div style={{ position: 'relative', minHeight: '100vh' }}>
            {children}
          </div>
        </Ssgoi>
      </body>
    </html>
  );
}

// app/page.tsx
import { SsgoiTransition } from '@ssgoi/react';

export default function Page() {
  return (
    <SsgoiTransition id="/">
      {/* Your page content */}
    </SsgoiTransition>
  );
}
```

## API Reference

### Components

#### `<Ssgoi>`
The provider component that manages transition context.

```tsx
<Ssgoi config={ssgoiConfig}>
  {children}
</Ssgoi>
```

#### `<SsgoiTransition>`
Wrapper component for pages that should transition.

```tsx
<SsgoiTransition id="/page-id">
  {children}
</SsgoiTransition>
```

### Hooks

#### `useTransition()`
Access transition state and controls.

```tsx
const { isTransitioning, direction } = useTransition();
```

### Functions

#### `transition()`
Apply transitions to individual elements.

```tsx
<div ref={transition({
  key: 'unique-key',
  in: fadeIn(),
  out: fadeOut()
})}>
  Content
</div>
```

## Built-in Transitions

### Page Transitions (`@ssgoi/react/view-transitions`)
- `fade()` - Smooth opacity transition
- `slide()` - Directional sliding (left/right/up/down)
- `scale()` - Zoom in/out effect
- `hero()` - Shared element transitions
- `pinterest()` - Pinterest-style expand effect
- `ripple()` - Material Design ripple effect

### Element Transitions (`@ssgoi/react/transitions`)
- `fadeIn()` / `fadeOut()`
- `slideUp()` / `slideDown()` / `slideLeft()` / `slideRight()`
- `scaleIn()` / `scaleOut()`
- `bounce()`
- `blur()`
- `rotate()`

## Spring Physics Configuration

All transitions use spring physics for natural motion:

```tsx
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

```tsx
import type { SsgoiConfig, TransitionConfig } from '@ssgoi/react';

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

## Contributing

We welcome contributions! Please see our [contributing guide](https://github.com/meursyphus/ssgoi/blob/main/CONTRIBUTING.md) for details.

## License

MIT © [MeurSyphus](https://github.com/meursyphus)