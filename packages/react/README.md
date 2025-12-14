# @ssgoi/react

React bindings for SSGOI - Native app-like page transitions for React applications.

try this: [ssgoi.dev](https://ssgoi.dev)

![https://ssgoi.dev](https://ssgoi.dev/ssgoi.gif)

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
import { Ssgoi } from "@ssgoi/react";
import { fade } from "@ssgoi/react/view-transitions";

export default function App() {
  return (
    <Ssgoi config={{ defaultTransition: fade() }}>
      <div style={{ position: "relative" }}>{/* Your app */}</div>
    </Ssgoi>
  );
}
```

### 2. Wrap your pages

```tsx
import { SsgoiTransition } from "@ssgoi/react";

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
    // Scroll between tabs
    { from: "/home", to: "/about", transition: scroll({ direction: "up" }) },
    { from: "/about", to: "/home", transition: scroll({ direction: "down" }) },

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
```

### Symmetric Transitions

Automatically create bidirectional transitions:

```tsx
{
  from: '/home',
  to: '/about',
  transition: scroll({ direction: 'up' }),
  symmetric: true  // Automatically creates reverse transition
}
```

### Individual Element Animations

Animate specific elements during mount/unmount:

```tsx
import { transition } from "@ssgoi/react";
import { fade, slide } from "@ssgoi/react/transitions";

function Card() {
  return (
    <div
      ref={transition({
        key: "card",
        in: fade(),
        out: slide({ direction: "up" }),
      })}
    >
      <h2>Animated Card</h2>
    </div>
  );
}
```

### Auto Key Plugin

The Auto Key Plugin automatically generates unique keys for your transitions based on the file location (`file:line:column`), eliminating the need to manually provide keys.

**Benefits:**

- **Automatic Key Generation**: No need to manually specify `key` in `transition()` calls
- **Collision-Free**: Keys are based on exact code location
- **Cleaner Code**: Less boilerplate in your components

**⚠️ Important**: For list items rendered with `.map()`, just use JSX key prop - the plugin automatically appends it to generate unique keys.

#### Setup with Next.js

```tsx
// next.config.ts
import type { NextConfig } from "next";
import SsgoiAutoKey from "@ssgoi/react/unplugin/webpack";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.plugins.push(SsgoiAutoKey());
    return config;
  },
};

export default nextConfig;
```

#### Setup with Vite

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import SsgoiAutoKey from "@ssgoi/react/unplugin/vite";

export default defineConfig({
  plugins: [react(), SsgoiAutoKey()],
});
```

#### Usage Examples

**WITH Auto Key Plugin (Recommended):**

```tsx
import { transition } from "@ssgoi/react";
import { fade, slide } from "@ssgoi/react/transitions";

function SimpleCard() {
  return (
    <div ref={transition(fade())}>
      <h2>Fades in on mount</h2>
    </div>
  );
}
```

**WITHOUT Auto Key Plugin:**

```tsx
// Explicit key required for transition state tracking
function Card() {
  return (
    <div
      ref={transition({
        key: "my-card",
        ...fade(),
      })}
    >
      <h2>Animated Card</h2>
    </div>
  );
}
```

**List Items:**

```tsx
// In .map() lists, just use JSX key - the plugin appends it automatically
function List() {
  return (
    <ul>
      {items.map((item) => (
        <li
          key={item.id} // JSX key is enough - plugin generates file:line:col:${key}
          ref={transition(fade())}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

## Next.js App Router Example

```tsx
// app/layout.tsx
import { Ssgoi } from "@ssgoi/react";
import { scroll } from "@ssgoi/react/view-transitions";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Ssgoi
          config={{
            defaultTransition: scroll({ direction: "up" }),
          }}
        >
          <div style={{ position: "relative", minHeight: "100vh" }}>
            {children}
          </div>
        </Ssgoi>
      </body>
    </html>
  );
}

// app/page.tsx
import { SsgoiTransition } from "@ssgoi/react";

export default function Page() {
  return <SsgoiTransition id="/">{/* Your page content */}</SsgoiTransition>;
}
```

## API Reference

### Components

#### `<Ssgoi>`

The provider component that manages transition context.

```tsx
<Ssgoi config={ssgoiConfig}>{children}</Ssgoi>
```

#### `<SsgoiTransition>`

Wrapper component for pages that should transition.

```tsx
<SsgoiTransition id="/page-id">{children}</SsgoiTransition>
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
<div
  ref={transition({
    key: "unique-key",
    in: fade(),
    out: fade(),
  })}
>
  Content
</div>
```

## Built-in Transitions

### Page Transitions (`@ssgoi/react/view-transitions`)

- `fade()` - Smooth opacity transition
- `scroll()` - Vertical scrolling (up/down)
- `drill()` - Drill in/out effect (enter/exit)
- `hero()` - Shared element transitions
- `pinterest()` - Pinterest-style expand effect

### Element Transitions (`@ssgoi/react/transitions`)

- `fade()` - Fade in/out
- `scale()` - Scale in/out
- `slide()` - Slide (direction: up/down/left/right)
- `rotate()` - Rotate
- `bounce()` - Bounce
- `blur()` - Blur
- `fly()` - Fly (custom x, y position)

## Spring Physics Configuration

All transitions use spring physics for natural motion:

```tsx
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

```tsx
import type { SsgoiConfig, TransitionConfig } from "@ssgoi/react";

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
