# @ssgoi/react

React bindings for SSGOI - Native app-like page transitions for React applications.

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
import { SsgoiTransitionBoundary } from "./ssgoi-transition-boundary";

const config = {
  transitions: [{ from: "/", to: "/about", transition: fade() }],
};

export default function App() {
  return (
    <div className="relative z-0 min-h-dvh bg-white">
      {/* Layout shell above: positioned ancestor + stacking context for the OUT clone. */}
      <Ssgoi config={config}>
        {/* Routed content marker. Layout positioning belongs to the outer wrapper. */}
        <SsgoiTransitionBoundary className="min-h-full bg-white">
          {/* Your app */}
        </SsgoiTransitionBoundary>
      </Ssgoi>
    </div>
  );
}
```

### 2. Keep pages unmarked

```tsx
export default function HomePage() {
  return (
    <main>
      <h1>Welcome</h1>
      {/* Page content */}
    </main>
  );
}
```

Create one router-specific `SsgoiTransitionBoundary` utility in your layout.
It reads the current pathname internally, sets the transition boundary key, and
uses that pathname as a logical page id matched by config such as
`/products/*`. Use `/products/**` when the parent path itself should match too.

Next.js implementation:

```tsx
"use client";

import { type ElementType, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function SsgoiTransitionBoundary({
  children,
  as,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  const pathname = usePathname();
  const Component = as ?? "div";

  return (
    <Component
      key={pathname}
      data-ssgoi-transition={pathname}
      className={className}
    >
      {children}
    </Component>
  );
}
```

React Router and TanStack Router use the same component body with their own
pathname hook.

**That's it!** Your configured pages now transition smoothly with a fade effect.

## Layout Requirements

The outer element wrapping the SSGOI provider / `<Ssgoi>` needs
`position: relative` and `z-index: 0` (`relative z-0` in Tailwind).

When a page leaves, SSGOI clones it back into the DOM with `position: absolute`
so it can animate out while the new page animates in. Without a positioned,
stacking-context ancestor the clone jumps to the wrong place or falls behind the
background. Add `overflow-x-clip` too if you use horizontal transitions
(`slide`, `drill`). Keep these layout classes on the outer wrapper, not on the
route boundary marker.

## Advanced Transitions

### Route-based Transitions

Transition factories return effect configs. Put each effect in a flat route rule:

```tsx
import { fade, drill, zoom } from "@ssgoi/react/view-transitions";

const config = {
  transitions: [
    // Calm cross-fade between tabs
    { from: "/home", to: "/about", transition: fade() },

    // iOS-style stack for the products section
    {
      on: "/products/**",
      except: "/products",
      transition: drill(),
    },

    // Card-to-detail zoom (needs matching data-zoom-*-key)
    {
      from: "/gallery",
      to: "/photo/:id",
      transition: zoom({ type: "expand" }),
    },
  ],
};
```

Route rules come in three shapes:

- **`{ on, except?, transition }`** — a route family / stack
- **`{ from, to, transition }`** — a precise bidirectional pair
- **`{ ordered, transition }`** — index order decides forward / backward

### Individual Element Animations

Animate specific elements during mount/unmount with `transition()`:

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
// app/ssgoi-provider.tsx
"use client";

import { type ReactNode } from "react";
import { Ssgoi } from "@ssgoi/react";
import { drill, fade } from "@ssgoi/react/view-transitions";
import { SsgoiTransitionBoundary } from "./ssgoi-transition-boundary";

const config = {
  transitions: [
    { on: "/post/**", except: "/post", transition: drill() },
    { from: "/", to: "/about", transition: fade() },
  ],
};

export function SsgoiProvider({ children }: { children: ReactNode }) {
  return (
    <Ssgoi config={config}>
      <SsgoiTransitionBoundary className="min-h-full bg-white">
        {children}
      </SsgoiTransitionBoundary>
    </Ssgoi>
  );
}

// app/layout.tsx
import { type ReactNode } from "react";
import { SsgoiProvider } from "./ssgoi-provider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <main className="relative z-0 min-h-screen bg-white">
          <SsgoiProvider>{children}</SsgoiProvider>
        </main>
      </body>
    </html>
  );
}
```

```tsx
// app/page.tsx
export default function Page() {
  return <main>{/* Your page content */}</main>;
}
```

## API Reference

### Components

#### `<Ssgoi>`

The provider component that manages transition context.

```tsx
<Ssgoi config={ssgoiConfig}>{children}</Ssgoi>
```

#### Route boundary

Use one route boundary utility inside `<Ssgoi>`. It sets
`data-ssgoi-transition` from the current pathname internally, so individual page
components do not need transition markers.

```tsx
<SsgoiTransitionBoundary className="min-h-full bg-white">
  {children}
</SsgoiTransitionBoundary>
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
