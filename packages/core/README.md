# SSGOI

The framework-agnostic animation engine behind [SSGOI](https://ssgoi.dev) — native app-like page transitions for the web.

> Most apps should install a framework binding (`@ssgoi/react`, `@ssgoi/svelte`, `@ssgoi/vue`, `@ssgoi/solid`, `@ssgoi/angular`), which depend on this package. Install `@ssgoi/core` directly only when building a custom integration.

try this: [ssgoi.dev](https://ssgoi.dev)

![SSGOI Demo](https://ssgoi.dev/ssgoi.gif)

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
- **🚀 SSR Ready** - Perfect compatibility with Next.js, Nuxt, SvelteKit, SolidStart. No hydration issues, SEO-friendly
- **🎯 Use Your Router** - Keep your existing routing. React Router, Next.js App Router, SvelteKit - all work seamlessly
- **💾 State Persistence** - Remembers animation state during navigation, even with browser back/forward
- **🎨 Framework Agnostic** - One consistent API for React, Svelte, Vue, Solid, Angular, and more

## Quick Start

### Installation

```bash
# Pick the binding for your framework
npm install @ssgoi/react
# or @ssgoi/svelte, @ssgoi/vue, @ssgoi/solid, @ssgoi/angular
```

### Add Transitions in 30 Seconds

#### 1. Wrap your React app

```tsx
import { Ssgoi } from "@ssgoi/react";
import { fade } from "@ssgoi/react/view-transitions";
import { SsgoiTransitionBoundary } from "./ssgoi-transition-boundary";

const config = {
  transitions: [fade({ paths: ["/", "/about"] })],
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

#### 2. Keep React pages unmarked

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

For React adapters, create one router-specific `SsgoiTransitionBoundary` utility
in your layout. It reads the current pathname internally, sets the transition
boundary key, and uses that pathname as a logical page id matched by config such
as `/products/*`. Use `/products/**` when the parent path itself should match
too.

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

For SvelteKit, Nuxt/Vue, Solid, and Angular, mark each routed page boundary
directly with `data-ssgoi-transition` instead of using a layout-level utility.
The value can be a hard-coded logical id; it only has to match your config.

**That's it!** Your configured pages now transition smoothly with a fade effect.

## Advanced Transitions

### Route-based Transitions

Each transition factory returns a path-transition group. Drop the results straight into `config.transitions` — nested arrays are flattened automatically:

```tsx
import { fade, drill, zoom } from "@ssgoi/react/view-transitions";

const config = {
  transitions: [
    // Calm cross-fade between tabs
    fade({ paths: ["/home", "/about"] }),

    // iOS-style drill-in when entering details
    drill({ enter: "/products/*", exit: "/products" }),

    // Card-to-detail zoom (needs matching data-zoom-*-key)
    zoom({ paths: ["/gallery", "/photo/*"], type: "expand" }),
  ],
};
```

Transitions come in three shapes:

- **`{ paths }`** — symmetric: every pair animates with the same physics (`fade`, `hero`, `zoom`, `blind`, `film`, `rotate`, `strip`, `jaemin`)
- **`{ enter, exit, type? }`** — directional: enter and exit get different physics (`drill`, `sheet`)
- **`{ paths }`** — ordered: path order decides forward / back direction (`slide`, `scroll`, `axis`)

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

## Built-in Transitions

### Page Transitions (`@ssgoi/<framework>/view-transitions`)

- `fade` - Calm cross-fade. Safe default for unrelated pages
- `drill` - iOS-style hierarchical navigation (list → detail)
- `slide` - Horizontal push for tabs / sequential flows
- `scroll` - Vertical page scroll for onboarding / paginated views
- `axis` - Material/Flutter shared-axis swap for sibling/tab routes
- `sheet` - Bottom sheet that slides up (modal-like flows)
- `hero` - Shared element transition (matching `data-hero-*-key`)
- `zoom` - Card-to-detail expansion (matching `data-zoom-*-key`)
- `strip` - 3D Y-axis perspective flip
- `blind` - Window-blinds wipe reveal
- `film` - Cinematic shrink + tile (gallery / lightbox)
- `rotate` - Card flip between siblings
- `jaemin` - Playful rotated zoom for special moments

### Element Transitions (`@ssgoi/<framework>/transitions`)

For mount/unmount of individual elements (not whole pages):

- `fade` - Fade in/out
- `scale` - Scale in/out
- `slide` - Slide (direction: up/down/left/right)
- `rotate` - Rotate
- `bounce` - Bounce
- `blur` - Blur
- `fly` - Fly (custom x, y position)

## Layout Requirements

The outer element wrapping the SSGOI provider / `<Ssgoi>` needs
`position: relative` and `z-index: 0`.

When a page leaves, SSGOI clones it back into the DOM with `position: absolute`
so it can animate out while the new page animates in. Without a positioned,
stacking-context ancestor the clone jumps to the wrong place or falls behind the
background. Add `overflow-x-clip` too if you use horizontal transitions
(`slide`, `drill`). Keep these layout classes on the outer wrapper, not on the
route boundary marker.

```tsx
<div className="relative z-0 overflow-x-clip">
  <Ssgoi config={config}>{children}</Ssgoi>
</div>
```

## Why SSGOI?

### vs View Transition API

- ✅ Works in all browsers, not just Chrome
- ✅ More animation options with spring physics
- ✅ Better developer experience

### vs Other Animation Libraries

- ✅ Built specifically for page transitions
- ✅ SSR-first design
- ✅ No router lock-in
- ✅ Minimal bundle size

## How It Works

SSGOI orchestrates two simultaneous animations on every route change:

1. **Route Change**: Your router changes the URL
2. **Exit (OUT)**: SSGOI clones the leaving page with `position: absolute` and animates it out
3. **Enter (IN)**: The new page mounts in place and animates in
4. **State Sync**: Animation state persists across navigation, including browser back/forward

All powered by a spring physics engine — springs are pre-computed into Web Animations API keyframes, so animations run at 60fps off the main thread.

## Documentation

Visit [https://ssgoi.dev](https://ssgoi.dev) for:

- Detailed API reference
- Interactive examples
- Framework integration guides
- Custom transition recipes

## Contributing

We welcome contributions! Please see our [contributing guide](https://github.com/meursyphus/ssgoi/blob/main/CONTRIBUTING.md) for details.

## License

MIT © [MeurSyphus](https://github.com/meursyphus)
