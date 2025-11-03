# SSGOI

## What is SSGOI?

SSGOI brings native app-like page transitions to the web. Transform your static page navigations into smooth, delightful experiences that users love.

try this: [ssgoi.dev](https://ssgoi.dev)

![SSGOI Demo](./ssgoi.gif)

### ✨ Key Features

- **🌍 Works Everywhere** - Unlike the browser's View Transition API, SSGOI works in all modern browsers (Chrome, Firefox, Safari)
- **🚀 SSR Ready** - Perfect compatibility with Next.js, Nuxt, SvelteKit. No hydration issues, SEO-friendly
- **🎯 Use Your Router** - Keep your existing routing. React Router, Next.js App Router, SvelteKit - all work seamlessly
- **💾 State Persistence** - Remembers animation state during navigation, even with browser back/forward
- **🎨 Framework Agnostic** - One consistent API for Angular, React, Svelte, Vue, and more

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

#### 2. Wrap your pages

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
    // Scroll between pages
    { from: '/home', to: '/about', transition: scroll({ direction: 'up' }) },
    { from: '/about', to: '/home', transition: scroll({ direction: 'down' }) },
    
    // Drill when entering details
    { from: '/products', to: '/products/*', transition: drill({ direction: 'enter' }) },
    
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
  transition: fade(),
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

## Built-in Transitions

### Page Transitions
- `fade` - Smooth opacity transition
- `scroll` - Vertical scrolling (up/down)
- `drill` - Drill in/out effect (enter/exit)
- `hero` - Shared element transitions
- `pinterest` - Pinterest-style expand effect

### Element Transitions
- `fadeIn` / `fadeOut`
- `slideUp` / `slideDown` / `slideLeft` / `slideRight`
- `scaleIn` / `scaleOut`
- `bounce`
- `blur`
- `rotate`

## Framework Examples

### Angular

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Ssgoi } from '@ssgoi/angular';
import { fade } from '@ssgoi/angular/view-transitions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Ssgoi],
  template: `
    <ssgoi [config]="config">
      <div style="position: relative; min-height: 100vh">
        <router-outlet />
      </div>
    </ssgoi>
  `
})
export class AppComponent {
  config = {
    defaultTransition: fade()
  };
}

// home.component.ts
import { Component } from '@angular/core';
import { SsgoiTransition } from '@ssgoi/angular';

@Component({
  selector: 'app-home',
  imports: [SsgoiTransition],
  template: `
    <ssgoi-transition id="/">
      <h1>Welcome</h1>
      <!-- Your page content -->
    </ssgoi-transition>
  `
})
export class HomeComponent {}
```

### Next.js App Router

```tsx
// app/layout.tsx
import { Ssgoi } from '@ssgoi/react';
import { fade } from '@ssgoi/react/view-transitions';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Ssgoi config={{
          defaultTransition: fade()
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

All powered by a spring physics engine for natural, smooth motion.

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
- LLM Context: [ssgoi.dev/llm.txt](https://ssgoi.dev/llm.txt) for AI assistants

## Contributing

We welcome contributions! Please see our [contributing guide](CONTRIBUTING.md) for details.

## License

MIT © [MeurSyphus](https://github.com/meursyphus)
