# SSGOI

Native app-like page transitions for the web.

**[Try it live →](https://ssgoi.dev)**

![SSGOI Demo](./ssgoi.gif)

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
import { SsgoiTransitionBoundary } from "./ssgoi-transition-boundary";

const config = {
  transitions: [
    // iOS-style drill-in when entering a post, ease back out
    drill({ enter: "/post/*", exit: "*" }),
    // Calm cross-fade between top-level pages
    fade({ paths: ["/", "/about"] }),
  ],
};

export function SsgoiProvider({ children }: { children: ReactNode }) {
  return (
    <Ssgoi config={config}>
      {/* Routed content marker. Layout positioning belongs to the outer wrapper. */}
      <SsgoiTransitionBoundary className="min-h-full bg-black">
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

Then use it inside `<Ssgoi>`:

```tsx
<SsgoiTransitionBoundary className="min-h-full bg-black">
  {children}
</SsgoiTransitionBoundary>
```

React Router and TanStack Router use the same component body with their own
pathname hook.

The utility reads the current pathname internally and sets `key` plus
`data-ssgoi-transition`. This is a React convenience pattern: SSGOI only needs a
logical page id that matches config, and the utility uses the current pathname
as that id. Match dynamic descendants with wildcard config like `/post/*`. Use
`/docs/**` when the parent path itself should match too. **That's it.** Your
pages now transition like a native app.

This layout-level utility pattern is for React adapters. In SvelteKit,
Nuxt/Vue, Solid, Angular, and Qwik, mark each routed page boundary directly with
`data-ssgoi-transition`. Use a stable logical id such as `/gallery`; it does not
have to be the actual route pathname.

Why mark each page directly instead of using one shared boundary? SvelteKit and
Nuxt render slot/snippet content live, so a single route boundary in a parent
layout would let the outgoing page wrapper render the _incoming_ page's children
mid-navigation. Marking each page keeps the outgoing and incoming boundaries
cleanly separated. React's utility sidesteps this by keying the subtree on the
pathname.

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
- [SvelteKit](https://github.com/meursyphus/ssgoi/tree/main/templates/sveltekit)
- [Nuxt](https://github.com/meursyphus/ssgoi/tree/main/templates/nuxt)
- [Qwik City](https://github.com/meursyphus/ssgoi/tree/main/templates/qwik)

React templates use the pathname boundary utility. SvelteKit, Nuxt, Qwik,
Solid, and Angular mark each routed page directly with
`data-ssgoi-transition`.

---

## Transitions

Each transition is a factory you drop into `config.transitions`. They return path-transition groups, so nested arrays are flattened automatically.

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

// Symmetric — every pair animates the same ({ paths })
fade({ paths: ["/", "/about"] });
hero({ paths: ["/products", "/products/*"] }); // shared element
zoom({ paths: ["/gallery", "/photo/*"], type: "expand" }); // card → detail

// Directional — enter / exit get different physics ({ enter, exit })
drill({ enter: "/post/*", exit: "*" }); // iOS list → detail
sheet({ enter: "/compose", exit: "*" }); // bottom sheet

// Ordered — path order decides forward / back ({ paths })
slide({ paths: ["/tabs/a", "/tabs/b"] }); // horizontal tabs
scroll({ paths: ["/step-1", "/step-2"] }); // vertical onboarding
axis({ paths: ["/feed", "/profile"] }); // Material shared axis
```

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
