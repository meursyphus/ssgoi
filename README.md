# SSGOI

## What is SSGOI?

SSGOI brings native app-like page transitions to the web. Transform your static page navigations into smooth, delightful experiences that users love.

try this: [ssgoi.dev](https://ssgoi.dev)

![SSGOI Demo](./ssgoi.gif)

### ✨ Key Features

- **🌍 Works Everywhere** - Unlike the browser's View Transition API, SSGOI works in all modern browsers (Chrome, Firefox, Safari)
- **⚡ Blazing Fast** - Web Animation API + Spring physics pre-computed to keyframes. GPU-accelerated, main thread free
- **🚀 SSR Ready** - Perfect compatibility with Next.js, Nuxt, SvelteKit. No hydration issues, SEO-friendly
- **🎯 Use Your Router** - Keep your existing routing. React Router, Next.js App Router, SvelteKit - all work seamlessly
- **💾 State Persistence** - Remembers animation state during navigation, even with browser back/forward
- **🎨 Framework Agnostic** - One consistent API for Angular, React, Svelte, Vue, and more
- **🎭 TransitionScope** - Control animation behavior for grouped elements (skip redundant animations)

## Quick Start

### Installation

```bash
# Angular
npm install @ssgoi/angular

# React
npm install @ssgoi/react

# Svelte
npm install @ssgoi/svelte

# Vue
npm install @ssgoi/vue
```

### Add Transitions in 30 Seconds

#### 1. Wrap your app

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

#### 2. Wrap your pages

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
    // Scroll between pages
    { from: "/home", to: "/about", transition: scroll({ direction: "up" }) },
    { from: "/about", to: "/home", transition: scroll({ direction: "down" }) },

    // Drill when entering details
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
  transition: fade(),
  symmetric: true  // Automatically creates reverse transition
}
```

### Individual Element Animations

Animate specific elements during mount/unmount:

```tsx
import { transition } from "@ssgoi/react";
import { fade, slide } from "@ssgoi/react/transitions";

// With Auto Key Plugin - key is auto-generated based on file:line:column
function Card() {
  return (
    <div ref={transition(fade())}>
      <h2>Animated Card</h2>
    </div>
  );
}

// Without plugin - explicit key is required
function CardManual() {
  return (
    <div
      ref={transition({
        key: "card",
        ...fade(),
      })}
    >
      <h2>Animated Card</h2>
    </div>
  );
}

// For list items in .map(), just use JSX key - the plugin appends it automatically
function List({ items }) {
  return items.map((item) => (
    <div
      key={item.id} // JSX key is enough - plugin generates file:line:col:${key}
      ref={transition(fade())}
    >
      {item.name}
    </div>
  ));
}
```

#### Auto Key Plugin Setup (React)

The Auto Key Plugin automatically generates unique keys for transition elements, eliminating the need to manually specify keys:

```tsx
// next.config.ts
import SsgoiAutoKey from "@ssgoi/react/unplugin/webpack";

const nextConfig = {
  webpack: (config) => {
    config.plugins.push(SsgoiAutoKey());
    return config;
  },
};

export default nextConfig;
```

For other bundlers (Vite, Rollup, esbuild), see the [documentation](https://ssgoi.dev).

**Benefits:**

- No need to manually specify `key` for most cases
- Keys are automatically generated based on source location (`file:line:column`)
- Cleaner, more maintainable code

**Important:** For dynamic lists (`.map()`), the plugin automatically appends the JSX `key` prop to the generated transition key (e.g., `file:line:col:${key}`), so you only need to provide the JSX `key` - no explicit transition key required.

### TransitionScope

Control animation behavior for grouped elements. Skip redundant animations when parent and children mount/unmount together:

```tsx
import { TransitionScope, transition } from "@ssgoi/react";
import { fade } from "@ssgoi/react/transitions";

function Modal({ show }) {
  return (
    show && (
      <TransitionScope>
        <div className="modal">
          {/* scope: 'local' - skips animation when mounting/unmounting with parent */}
          <div ref={transition({ ...fade(), scope: "local" })}>
            This won't animate when modal opens/closes
          </div>
          {/* scope: 'global' (default) - always animates */}
          <div ref={transition({ ...fade() })}>This always animates</div>
        </div>
      </TransitionScope>
    )
  );
}
```

## Built-in Transitions

### Page Transitions

- `fade` - Smooth opacity transition
- `scroll` - Vertical scrolling (up/down)
- `drill` - Drill in/out effect (enter/exit)
- `hero` - Shared element transitions
- `pinterest` - Pinterest-style expand effect

### Element Transitions

- `fade()` - Fade in/out
- `scale()` - Scale in/out
- `slide()` - Slide (direction: up/down/left/right)
- `rotate()` - Rotate
- `bounce()` - Bounce
- `blur()` - Blur
- `fly()` - Fly (custom x, y position)

## Framework Examples

### Angular

```typescript
// app.component.ts
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Ssgoi } from "@ssgoi/angular";
import { fade } from "@ssgoi/angular/view-transitions";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, Ssgoi],
  template: `
    <ssgoi [config]="config">
      <div style="position: relative; min-height: 100vh">
        <router-outlet />
      </div>
    </ssgoi>
  `,
})
export class AppComponent {
  config = {
    defaultTransition: fade(),
  };
}

// home.component.ts
import { Component } from "@angular/core";
import { SsgoiTransition } from "@ssgoi/angular";

@Component({
  selector: "app-home",
  imports: [SsgoiTransition],
  template: `
    <ssgoi-transition id="/">
      <h1>Welcome</h1>
      <!-- Your page content -->
    </ssgoi-transition>
  `,
})
export class HomeComponent {}
```

### Next.js App Router

```tsx
// app/layout.tsx
import { Ssgoi } from "@ssgoi/react";
import { fade } from "@ssgoi/react/view-transitions";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Ssgoi
          config={{
            defaultTransition: fade(),
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

### SvelteKit

```svelte
<!-- +layout.svelte -->
<script>
  import { Ssgoi } from '@ssgoi/svelte';
  import { fade } from '@ssgoi/svelte/view-transitions';
</script>

<Ssgoi config={{ defaultTransition: fade() }}>
  <div style="position: relative; min-height: 100vh;">
    <slot />
  </div>
</Ssgoi>

<!-- +page.svelte -->
<script>
  import { SsgoiTransition } from '@ssgoi/svelte';
  import { page } from '$app/stores';
</script>

<SsgoiTransition id={$page.url.pathname}>
  <!-- Your page content -->
</SsgoiTransition>
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

SSGOI intercepts DOM lifecycle events to create smooth transitions:

1. **Route Change**: Your router changes the URL
2. **Exit Animation**: Current page animates out
3. **Enter Animation**: New page animates in
4. **State Sync**: Animation state persists across navigation

### Performance Architecture

SSGOI achieves 60fps animations through a unique approach:

- **Spring Physics Pre-computation**: Spring animations are calculated once and converted to Web Animation API keyframes
- **Off Main Thread**: Animations run on the compositor thread, keeping the main thread free for your app logic
- **GPU Acceleration**: Uses `transform` and `opacity` for hardware-accelerated rendering
- **State Memory**: Animation positions are preserved across navigation for seamless back/forward transitions

## Live Demos

Try out SSGOI with our framework-specific demo applications:

### React Demo

```bash
pnpm react-demo:dev
# Opens at http://localhost:3001
```

Explore Next.js App Router integration with various transition effects.

### Svelte Demo

```bash
pnpm svelte-demo:dev
# Opens at http://localhost:5174
```

See SvelteKit integration with smooth page transitions.

Visit the `/apps` directory to explore the demo source code and learn how to implement SSGOI in your own projects.

## Documentation

Visit [https://ssgoi.dev](https://ssgoi.dev) for:

- Detailed API reference
- Interactive examples
- Framework integration guides
- Custom transition recipes

### AI-Assisted Setup

If you're using an AI assistant (Claude, ChatGPT, Cursor, etc.) to help implement SSGOI:

1. **Reference the LLM context file:** Add `https://ssgoi.dev/llm.txt` to your AI assistant's context
2. **Or copy the content:** Download [llm.txt](https://ssgoi.dev/llm.txt) and paste it into your conversation

The LLM context file contains:
- Complete setup guides for Next.js and other frameworks
- Explanation of why `position: relative` and `z-index: 0` are required
- Troubleshooting guide for common issues
- API reference and code examples

**Tip for Cursor/AI IDE users:** Add this to your project rules or CLAUDE.md:
```
For page transitions, reference https://ssgoi.dev/llm.txt
```

## Contributing

We welcome contributions! Please see our [contributing guide](CONTRIBUTING.md) for details.

## License

MIT © [MeurSyphus](https://github.com/meursyphus)
