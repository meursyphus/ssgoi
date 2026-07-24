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

### 1. Create the layout shell

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
        {/* Layout shell for the reinserted OUT page. */}
        <main className="relative z-0 min-h-dvh overflow-x-clip bg-black">
          <SsgoiProvider>{children}</SsgoiProvider>
        </main>
      </body>
    </html>
  );
}
```

Start with this shell before adding route boundaries. When React unmounts a
leaving page, SSGOI temporarily reinserts that detached DOM node with
`position: absolute` so its OUT animation can finish over the incoming page.
The wrapper establishes the coordinate and paint context for that node:

| Class             | Why                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------- |
| `relative`        | Gives the absolutely positioned OUT page the correct containing block                 |
| `z-0`             | Creates a local stacking context so the OUT page stays above the shell background     |
| `overflow-x-clip` | Prevents horizontal overflow flashes during `slide`, `drill`, and similar transitions |

These are layout-shell classes, not route-marker classes. Put them on the
element around `<Ssgoi>`, not on every page boundary.

### 2. Add a named route boundary

A React route boundary is a keyed DOM element marked with
`data-ssgoi-transition`:

```tsx
<div key={boundary.key} data-ssgoi-transition={boundary.id}>
  {children}
</div>
```

The two values have different jobs:

- Changing `key` tells React to unmount the old region and mount a new one.
- `data-ssgoi-transition` gives SSGOI the route id used to match transition
  rules.

SSGOI observes that real mount/unmount lifecycle; it does not perform the route
swap itself. The `SsgoiRouteBoundary` component may stay mounted in a common
layout while its keyed DOM child is replaced. The legacy `<SsgoiTransition>`
wrapper is deprecated because the attribute is the complete marker contract.

For a small app, both values can be the pathname. For an app with persistent
shells, keep route logic inside one resolver and let layouts select a semantic
boundary name:

```tsx
// app/ssgoi-route-boundary.tsx
"use client";

import { type ReactNode } from "react";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";

type BoundaryName = "app-shell" | "main-content" | "project-content";
type BoundaryIdentity = { id: string; key: string };

const INTERCEPTION_PREFIX = /^(?:\(\.\.\.\)|\(\.\.\)|\(\.\))+/;

function isRouteGroup(segment: string) {
  return segment.startsWith("(") && segment.endsWith(")");
}

function pathFromSegments(segments: string[]) {
  const path = segments
    .filter((segment) => !isRouteGroup(segment))
    .map((segment) => segment.replace(INTERCEPTION_PREFIX, ""))
    .filter(Boolean)
    .join("/");

  return path ? `/${path}` : null;
}

function resolveBoundary(
  name: BoundaryName,
  pathname: string,
  segments: string[],
): BoundaryIdentity {
  // This is the route rendered by this boundary's children slot. During a
  // soft-intercepted modal it remains the background route, unlike pathname.
  const ownedRoute = pathFromSegments(segments) ?? pathname;

  switch (name) {
    case "app-shell": {
      const routeGroup = segments.find(isRouteGroup);
      if (routeGroup === "(main)") {
        return { id: ownedRoute, key: "main-shell" };
      }

      const project = ownedRoute.match(/^\/projects\/[^/]+/)?.[0];
      return { id: ownedRoute, key: project ?? ownedRoute };
    }
    case "project-content": {
      const project = pathname.match(/^\/projects\/[^/]+/)?.[0];
      const child = pathFromSegments(segments);
      const id = project
        ? child
          ? `${project}${child}`
          : project
        : ownedRoute;
      return { id, key: id };
    }
    case "main-content":
      return { id: ownedRoute, key: ownedRoute };
  }
}

export function SsgoiRouteBoundary({
  children,
  name,
}: {
  children: ReactNode;
  name: BoundaryName;
}) {
  const pathname = usePathname();
  const segments = useSelectedLayoutSegments("children");
  const boundary = resolveBoundary(name, pathname, segments);

  return (
    <div key={boundary.key} data-ssgoi-transition={boundary.id}>
      {children}
    </div>
  );
}
```

`BoundaryName` and `resolveBoundary` are application code. They are not
`@ssgoi/react` props. The important part is that layout files choose ownership
by name instead of repeating ad hoc pathname/key functions.

Exposing a `scope(pathname)` callback can express the same key mapping, but it
is a low-level application pattern, not SSGOI API. A named resolver is the
recommended default because it keeps route ownership consistent across
layouts.

```tsx
// app/layout.tsx — replace the provider line from step 1.
// This boundary spans (main), (detail), and standalone app routes.
<SsgoiProvider>
  <SsgoiRouteBoundary name="app-shell">
    {children}
  </SsgoiRouteBoundary>
</SsgoiProvider>

// app/(main)/layout.tsx — the nav is inside the app shell, outside this child.
<>
  <SsgoiRouteBoundary name="main-content">
    {children}
  </SsgoiRouteBoundary>
  <BottomNav />
</>

// app/(detail)/projects/[id]/layout.tsx
<>
  <ProjectHeader />
  <ProjectTabs />
  <SsgoiRouteBoundary name="project-content">
    {children}
  </SsgoiRouteBoundary>
</>
```

Main → main changes only the inner content boundary, so the bottom nav stays
still. Main → detail changes the common app-shell key, so the whole main shell
and its nav leave together. Project tab navigation keeps the
`/projects/:id` app-shell key and changes only the project content boundary.
If parent and child leave together, SSGOI uses the outer changed boundary. Do
not create a nested `<Ssgoi>`.

With Next.js parallel or intercepting routes, `usePathname()` is the browser
URL and may point at a modal while the boundary’s background `children` slot
has not changed. The example resolves the owned route from
`useSelectedLayoutSegments("children")`. If the layout owns an `@modal` slot
and also needs an explicit flag,
`useSelectedLayoutSegment("modal") !== null` tells you that the modal slot is
active. A soft-intercepted modal therefore keeps the background key; opening
the same URL directly resolves to the detail slot and gets a detail key.

React Router and TanStack Router use the same key/id contract with their own
router state. SvelteKit, Nuxt, SolidStart, and Qwik City normally mark route and
persistent layout roots directly with `data-ssgoi-transition`; their routers
already own the DOM lifetime.

### Framework templates

Use the templates as reference implementations for each router/framework:

- [Next.js](https://github.com/meursyphus/ssgoi/tree/main/templates/nextjs)
- [React Router](https://github.com/meursyphus/ssgoi/tree/main/templates/react-router)
- [TanStack Router](https://github.com/meursyphus/ssgoi/tree/main/templates/tanstack-router)
- [SolidStart](https://github.com/meursyphus/ssgoi/tree/main/templates/solidstart)
- [SvelteKit](https://github.com/meursyphus/ssgoi/tree/main/templates/sveltekit)
- [Nuxt](https://github.com/meursyphus/ssgoi/tree/main/templates/nuxt)
- [Qwik City](https://github.com/meursyphus/ssgoi/tree/main/templates/qwik)

The Next.js template uses a named resolver. React Router and TanStack Router
use the same key/id contract with their router state. SolidStart, SvelteKit,
Nuxt, and Qwik mark route and layout roots directly.

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
