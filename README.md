# SSGOI

Native app-like page transitions for the web.

**[Try it live →](https://ssgoi.dev)**

[![SSGOI live showcase](./apps/docs/public/readme.png)](https://ssgoi.dev)

## Transitions in motion

|                                                                     Hero                                                                      |                                                                 Zoom                                                                 |                                                                    Sheet                                                                    |
| :-------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------: |
| <img src="./apps/docs/public/blog/view-transition-api-limitations/hero-mobile-full.gif" alt="Hero transition in Google Photos" width="260" /> | <img src="./apps/docs/public/blog/view-transition-api-limitations/zoom-blur.gif" alt="Zoom blur transition in Airbnb" width="260" /> | <img src="./apps/docs/public/blog/view-transition-api-limitations/sheet-blur-full.gif" alt="Sheet blur transition in Voyage" width="260" /> |

[See how Hero, Zoom, Film, and Sheet go beyond the View Transition API →](https://ssgoi.dev/blog/view-transition-api-limitations)

---

## AI-Assisted Setup

Using Claude, Cursor, ChatGPT, or other AI assistants? Let them set it up for you.

**Add this to your AI's context:**

```
https://ssgoi.dev/llms.txt
```

Contains complete setup guides, all transition types, troubleshooting, and API docs.

---

## Why SSGOI?

Web pages don't transition—they just swap. SSGOI changes that.

|                    | View Transition API | Other Libraries | SSGOI |
| ------------------ | :-----------------: | :-------------: | :---: |
| All browsers       |   ❌ Chrome only    |       ✅        |  ✅   |
| SSR support        |     ⚠️ Limited      |    ⚠️ Varies    |  ✅   |
| Spring physics     |         ❌          |     ⚠️ Some     |  ✅   |
| Router agnostic    |         ❌          |       ❌        |  ✅   |
| Back/forward state |         ❌          |       ❌        |  ✅   |

**60fps guaranteed** — Spring physics pre-computed to Web Animation API keyframes. GPU-accelerated, main thread free.

---

## Quick Start

```bash
npm install @ssgoi/react
```

### 1. Wrap your React app

```tsx
// app/ssgoi-provider.tsx
"use client";

import { type ReactNode } from "react";
import { Ssgoi } from "@ssgoi/react";
import { drill, fade } from "@ssgoi/react/view-transitions";

const config = {
  transitions: [
    {
      priority: -100,
      on: "/**",
      except: ["/", "/about"],
      transition: drill(),
    },
    { from: "/", to: "/about", transition: fade() },
  ],
};

export function SsgoiProvider({ children }: { children: ReactNode }) {
  return <Ssgoi config={config}>{children}</Ssgoi>;
}

// app/layout.tsx
import { type ReactNode } from "react";
import { SsgoiProvider } from "./ssgoi-provider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Layout shell: positioned ancestor + stacking context for the OUT clone. */}
        <main className="relative z-0 min-h-dvh overflow-x-clip bg-black">
          <SsgoiProvider>{children}</SsgoiProvider>
        </main>
      </body>
    </html>
  );
}
```

### 2. Use a React boundary utility

```tsx
// ssgoi-transition-boundary.tsx
"use client";

import { type ElementType, type Key, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type BoundaryScope = (pathname: string) => Key;

export function SsgoiTransitionBoundary({
  children,
  as,
  className,
  scope = (pathname) => pathname,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  scope?: BoundaryScope;
}) {
  const pathname = usePathname();
  const Component = as ?? "div";

  return (
    <Component
      key={scope(pathname)}
      data-ssgoi-transition={pathname}
      className={className}
    >
      {children}
    </Component>
  );
}
```

Place it in the layout that owns the routed region:

```tsx
<SsgoiTransitionBoundary className="min-h-full bg-black">
  {children}
</SsgoiTransitionBoundary>
```

React Router and TanStack Router use the same component body with their own
pathname hook.

The real pathname remains the transition id. `scope(pathname)` only controls
the React key. Return the same key for paths that share a persistent layout;
return the pathname to remount on each route change.

```tsx
<SsgoiTransitionBoundary scope={() => "products-layout"}>
  <ProductTabs />
  <SsgoiTransitionBoundary>{children}</SsgoiTransitionBoundary>
</SsgoiTransitionBoundary>
```

This keeps the product layout mounted while category content changes. If the
outer and inner boundaries leave together, SSGOI uses the outer changed
boundary. Do not create a nested `<Ssgoi>`.

SvelteKit, Nuxt, SolidStart, and Qwik City normally mark route and persistent
layout roots directly with `data-ssgoi-transition`; their routers already own
the DOM lifetime.

### Layout shell requirements

The outer element that wraps the SSGOI provider / `<Ssgoi>` is the layout shell.
Put `relative z-0` on that wrapper, and add `overflow-x-clip` when you use
horizontal transitions such as `slide` or `drill`.

Those classes are not route marker classes. Keep them off
`SsgoiTransitionBoundary`; the boundary should only identify routed content with
`key` and `data-ssgoi-transition`.

| Class             | Why                                                                             |
| ----------------- | ------------------------------------------------------------------------------- |
| `relative`        | The OUT page clone uses `position: absolute`, so it needs a positioned ancestor |
| `z-0`             | Creates a stacking context so the OUT page does not fall behind backgrounds     |
| `overflow-x-clip` | Prevents horizontal overflow flashing during slide/drill transitions            |

### Framework templates

Use the templates as reference implementations for each router/framework:

- [Next.js](https://github.com/meursyphus/ssgoi/tree/main/templates/nextjs)
- [React Router](https://github.com/meursyphus/ssgoi/tree/main/templates/react-router)
- [TanStack Router](https://github.com/meursyphus/ssgoi/tree/main/templates/tanstack-router)
- [SolidStart](https://github.com/meursyphus/ssgoi/tree/main/templates/solidstart)
- [SvelteKit](https://github.com/meursyphus/ssgoi/tree/main/templates/sveltekit)
- [Nuxt](https://github.com/meursyphus/ssgoi/tree/main/templates/nuxt)
- [Qwik City](https://github.com/meursyphus/ssgoi/tree/main/templates/qwik)

React templates use a router-specific pathname/key boundary utility.
SolidStart, SvelteKit, Nuxt, and Qwik mark route and layout roots directly.

---

## Transitions

Transition factories describe effects only. Route rules decide where an effect
applies and resolve its semantic `forward` / `backward` direction.

```tsx
import {
  fade,
  drill,
  slide,
  scroll,
  axis,
  sheet,
  hero,
  zoom,
} from "@ssgoi/react/view-transitions";

const config = {
  transitions: [
    { from: "/", to: "/about", transition: fade() },
    { from: "/products", to: "/products/:id", transition: hero() },
    {
      from: "/gallery",
      to: "/photo/:id",
      transition: zoom({ type: "expand" }),
    },
    { on: "/compose", transition: sheet() },
    {
      ordered: ["/tabs/a", "/tabs/b", "/tabs/c"],
      transition: slide(),
    },
  ],
};
```

Rule forms:

- `on` scopes a route family. Entering it is forward, leaving it is backward,
  and navigation inside it uses popstate/semantic history. Use `except` to keep
  top-level routes outside a catch-all stack.
- `from`/`to` describes a precise pair. It is bidirectional by default; arrays
  mean “any of these patterns”.
- `ordered` requires both routes to be in the list. Increasing index is forward
  and decreasing index is backward.

These selectors work with every effect; the usual convention is `drill` and
`sheet` with `on`, `slide`/`axis`/directional `scroll` with `ordered`, and
`zoom`/`hero` with `from`/`to`.

Higher `priority` wins first, then more-specific paths, then declaration order.
Use `:id` for one dynamic segment, `*` for exactly one arbitrary segment, and
suffix `**` for zero or more segments (`/docs/**` includes `/docs`).

**All built-in transitions:** `fade` · `drill` · `slide` · `scroll` · `axis` · `sheet` · `hero` · `zoom` · `strip` · `blind` · `film` · `rotate` · `jaemin`.

See them all live at [ssgoi.dev](https://ssgoi.dev) or in [llms.txt](https://ssgoi.dev/llms.txt).

---

## Packages

| Package          | Framework                 |
| ---------------- | ------------------------- |
| `@ssgoi/react`   | React, Next.js            |
| `@ssgoi/svelte`  | Svelte, SvelteKit         |
| `@ssgoi/vue`     | Vue, Nuxt                 |
| `@ssgoi/solid`   | Solid, SolidStart         |
| `@ssgoi/angular` | Angular                   |
| `@ssgoi/qwik`    | Qwik, Qwik City           |
| `@ssgoi/core`    | Framework-agnostic engine |

---

## Documentation

**[ssgoi.dev](https://ssgoi.dev)** — Full docs, interactive examples, and API reference.
**[ssgoi.dev/llms.txt](https://ssgoi.dev/llms.txt)** — Plain-text setup guide for AI assistants.

---

## License

MIT © [MeurSyphus](https://github.com/meursyphus)
