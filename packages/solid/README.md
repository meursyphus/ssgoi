# @ssgoi/solid

Solid bindings for SSGOI - Native app-like page transitions for Solid and SolidStart.

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
- **🚀 SSR Ready** - Perfect compatibility with SolidStart. No hydration issues, SEO-friendly
- **🎯 Use Your Router** - Keep your existing routing. `@solidjs/router` and SolidStart work seamlessly
- **💾 State Persistence** - Remembers animation state during navigation, even with browser back/forward
- **⚡ Solid Native** - Built on Solid's fine-grained reactivity, so change detection stays minimal

## Installation

```bash
npm install @ssgoi/solid
# or
yarn add @ssgoi/solid
# or
pnpm add @ssgoi/solid
```

## Quick Start

### 1. Wrap your app

```tsx
import { Ssgoi } from "@ssgoi/solid";
import { fade } from "@ssgoi/solid/view-transitions";

const config = {
  transitions: [{ from: "/", to: "/about", transition: fade() }],
};

export default function App(props) {
  return (
    <Ssgoi config={config}>
      {/* position: relative + z-index: 0 are required (see below) */}
      <div style="position: relative; z-index: 0; min-height: 100vh">
        {props.children}
      </div>
    </Ssgoi>
  );
}
```

### 2. Mark your pages

Set `data-ssgoi-transition` on each page boundary element inside `<Ssgoi>`:

```tsx
export default function Home() {
  return (
    <main data-ssgoi-transition="/">
      <h1>Welcome</h1>
      {/* Page content */}
    </main>
  );
}
```

**That's it!** Your pages now transition smoothly with the configured effect.

> **Why `position: relative; z-index: 0`?** When a page leaves, SSGOI clones it back into the DOM with `position: absolute` so it can animate out while the new page animates in. The clone needs a positioned, stacking-context ancestor or it jumps / falls behind the background. Add `overflow-x-clip` too if you use horizontal transitions (`slide`, `drill`).

## Advanced Transitions

Transition factories return effect configs. Put each effect in a flat route rule:

```tsx
import { Ssgoi } from "@ssgoi/solid";
import { fade, drill, zoom } from "@ssgoi/solid/view-transitions";

const config = {
  transitions: [
    // Calm cross-fade between tabs
    { from: "/", to: "/about", transition: fade() },

    // iOS-style drill-in when entering a detail page
    { from: "/products", to: "/products/*", transition: drill() },

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

## SolidStart Example

Wrap your root component once, then mark each route:

```tsx
// src/app.tsx
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Ssgoi } from "@ssgoi/solid";
import { scroll } from "@ssgoi/solid/view-transitions";

const config = {
  transitions: [
    { ordered: ["/", "/about", "/products"], transition: scroll() },
  ],
};

export default function App() {
  return (
    <Router
      root={(props) => (
        <Ssgoi config={config}>
          <div style="position: relative; z-index: 0; min-height: 100vh">
            {props.children}
          </div>
        </Ssgoi>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
```

```tsx
// src/routes/index.tsx
export default function Index() {
  return <main data-ssgoi-transition="/">{/* Your page content */}</main>;
}
```

## API Reference

### `<Ssgoi>`

The provider component that manages transition context.

```tsx
<Ssgoi config={ssgoiConfig}>{/* children */}</Ssgoi>
```

Props:

- `config: SsgoiConfig` - transition configuration object
- `host?: HostAnimation` - optional external playback host for debug tooling

### `data-ssgoi-transition`

Attribute for pages that should transition. Set it on the page boundary element inside `<Ssgoi>` — the value (commonly the route path) uniquely identifies the view.

```tsx
<main data-ssgoi-transition="/page-id">{/* children */}</main>
```

## Built-in Transitions

Import from `@ssgoi/solid/view-transitions`:

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

## TypeScript Support

SSGOI is written in TypeScript and provides full type definitions:

```typescript
import type { SsgoiConfig } from "@ssgoi/solid";

const config: SsgoiConfig = {
  // Full type safety
};
```

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- All modern mobile browsers

## License

MIT © [MeurSyphus](https://github.com/meursyphus)

## Links

- [Documentation](https://ssgoi.dev)
- [GitHub](https://github.com/meursyphus/ssgoi)
- [Issues](https://github.com/meursyphus/ssgoi/issues)
