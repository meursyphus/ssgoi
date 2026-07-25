# @ssgoi/react

React bindings for SSGOI.

Native app-like page transitions for mobile web apps.

**Router agnostic · Cross-browser · SSR ready · Web Animations API powered**

[Live showcase](https://ssgoi.dev) · [Documentation](https://ssgoi.dev/docs)

|                                                               Drill                                                                |                                                                                    Sheet                                                                                    |
| :--------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://ssgoi.dev/readme-drill.gif" alt="Drill transition opening and closing a chat in a mobile web app" width="280" /> | <img src="https://ssgoi.dev/blog/view-transition-api-limitations/sheet-blur-full.gif" alt="Sheet transition opening a compose screen above a mobile web app" width="280" /> |
|                                          Navigate through a mobile app with spatial depth                                          |                                                                Present focused tasks above the current page                                                                 |

## Why SSGOI?

|                                    |                                                                             |
| ---------------------------------- | --------------------------------------------------------------------------- |
| **Router agnostic**                | Keep your existing router and let it own navigation.                        |
| **Cross-browser**                  | Use the same transitions across Chrome, Safari, Firefox, and Edge.          |
| **Optimized motion**               | Spring physics are precomputed into Web Animations API keyframes.           |
| **Beyond the View Transition API** | Build transitions that need live DOM, runtime layers, and precise geometry. |
| **Easy to adopt**                  | Add SSGOI by changing only 2–3 files.                                       |

---

## Set it up with one link

Give the guide for your router to Claude, Codex, Cursor, or another coding
agent:

- [Next.js](https://ssgoi.dev/llms/frameworks/nextjs.txt)
- [React Router](https://ssgoi.dev/llms/frameworks/react-router.txt)
- [TanStack Router](https://ssgoi.dev/llms/frameworks/tanstack-router.txt)

Each guide contains complete files, route-boundary ownership, persistent
layouts, and troubleshooting guidance.

---

## Or add it in just 2–3 files

```bash
npm install @ssgoi/react
```

### Next.js

Keep one config and one `<Ssgoi>` above route boundaries.

```tsx
// app/ssgoi-provider.tsx
"use client";

import { type ReactNode } from "react";
import { Ssgoi } from "@ssgoi/react";
import { drill, slide } from "@ssgoi/react/view-transitions";

const config = {
  transitions: [
    { on: "/posts/**", except: "/posts", transition: drill() },
    {
      ordered: ["/products/all", "/products/electronics", "/products/fashion"],
      transition: slide(),
    },
  ],
};

export function SsgoiProvider({ children }: { children: ReactNode }) {
  return <Ssgoi config={config}>{children}</Ssgoi>;
}
```

Build the layout shell next:

```tsx
// app/layout.tsx
import { type ReactNode } from "react";
import { SsgoiProvider } from "./ssgoi-provider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <main className="relative z-0 min-h-dvh overflow-x-clip">
          <SsgoiProvider>{children}</SsgoiProvider>
        </main>
      </body>
    </html>
  );
}
```

When React removes an outgoing route, SSGOI temporarily reinserts that
detached DOM node with `position: absolute`. `relative` gives it a containing
block, `z-0` creates the local stacking context, and `overflow-x-clip` prevents
horizontal transition flashes. These classes belong on the shell around
`<Ssgoi>`, not on route boundaries.

### Route boundary

A React route boundary is a keyed element marked with a route id:

```tsx
<div key={boundary.key} data-ssgoi-transition={boundary.id}>
  {children}
</div>
```

- Changing `key` makes React unmount the old region and mount the new one.
- The attribute identifies those regions for SSGOI config matching.
- `<Ssgoi>` observes that lifecycle and runs OUT/IN; it does not navigate or
  change the key.

The legacy `<SsgoiTransition>` wrapper only added this attribute and is
deprecated. Set `data-ssgoi-transition` directly on the keyed application
boundary.

Create a router-aware utility in the application. Keep its route logic behind
semantic names so layouts cannot invent inconsistent keys:

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

### Persistent layouts

Place one named boundary in the common app layout, then add child boundaries
only around routed content that changes while its parent remains mounted.

```tsx
// app/layout.tsx — replace the provider line from the shell example.
<SsgoiProvider>
  <SsgoiRouteBoundary name="app-shell">{children}</SsgoiRouteBoundary>
</SsgoiProvider>
```

```tsx
// app/(main)/layout.tsx
export default function MainLayout({ children }) {
  return (
    <>
      <SsgoiRouteBoundary name="main-content">{children}</SsgoiRouteBoundary>
      <BottomNav />
    </>
  );
}
```

- Main → main: only the inner content boundary changes; the nav stays.
- Main → detail: the common app-shell key changes; the nav leaves with it.
- Project tab → project tab: the current project base-path key stays; a project
  content boundary can change below its header and tabs.

Use Next.js route groups to describe layout ownership, not to duplicate the
outer boundary:

```text
app/
  layout.tsx                 # one <Ssgoi> + one named app-shell boundary
  (main)/layout.tsx
  (main)/page.tsx
  (main)/search/page.tsx
  (detail)/post/[id]/page.tsx
```

For Next.js parallel and intercepting routes, the browser pathname may point at
a modal while the background `children` slot has not changed. Resolve that
boundary’s id/key from `useSelectedLayoutSegments("children")`. In the layout
that owns `@modal`, `useSelectedLayoutSegment("modal") !== null` is an explicit
active-modal check. A soft intercept keeps the background key; direct entry to
the same URL resolves to the detail slot and receives a detail key.

Full pattern: https://ssgoi.dev/llms/bottom-nav.txt

### React Router

Replace `usePathname()` with `useLocation()` and render the boundary in a
nested layout route:

```tsx
const { pathname } = useLocation();

return (
  <div key={pathname} data-ssgoi-transition={pathname}>
    <Outlet />
  </div>
);
```

### TanStack Router

Read the pathname from router state and place the boundary in a parent route:

```tsx
const pathname = useRouterState({
  select: (state) => state.location.pathname,
});
```

### Config

```ts
import { drill, slide, zoom } from "@ssgoi/react/view-transitions";

const config = {
  transitions: [
    {
      on: "/posts/**",
      except: "/posts",
      transition: drill(),
    },
    {
      from: "/gallery",
      to: "/gallery/*",
      transition: zoom(),
    },
    {
      ordered: ["/tabs/a", "/tabs/b"],
      transition: slide(),
    },
  ],
};
```

- `on`: route family.
- `from`/`to`: precise pair.
- `ordered`: directional sequence.
- Scroll is automatic: `on` and `from`/`to` restore `from` and reset `to`;
  `ordered` restores both. Override with
  `preserveScroll: { from: boolean, to: boolean }`.
- Patterns support exact paths, a `*` path segment, and suffix `**`.
- `priority` overrides path specificity.

### Effect index

- `fade`: unrelated pages.
- `drill`: list → detail.
- `slide`: ordered tabs.
- `axis`: sibling destinations.
- `sheet`: modal-like routes.
- `zoom`: card/image → detail.
- `hero`: shared elements and page chrome.
- `scroll`: vertical sequences.
- `strip`, `film`, `rotate`, `blind`, `jaemin`: expressive transitions.

References: https://ssgoi.dev/llms/transitions.txt

### Low-level APIs

`transition()` and the auto-key plugins remain available for element-level
mount/unmount animations; they are separate from route boundaries.

---

## Compatibility

SSGOI depends on the broadly available Web Animations API instead of requiring
the View Transition API.

| <img src="https://ssgoi.dev/logos/chrome.svg" alt="Chrome" width="36" /><br />Chrome 84+ | <img src="https://ssgoi.dev/logos/safari.svg" alt="Safari" width="36" /><br />Safari 13.1+ | <img src="https://ssgoi.dev/logos/firefox.svg" alt="Firefox" width="36" /><br />Firefox 75+ | <img src="https://ssgoi.dev/logos/edge.svg" alt="Edge" width="36" /><br />Edge 84+ |
| :--------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------: |

It observes the DOM lifecycle your framework already owns, so routing and SSR
stay with your existing stack.

| <img src="https://ssgoi.dev/logos/nextjs.svg" alt="Next.js" width="42" /><br />Next.js | <img src="https://ssgoi.dev/logos/react-router.svg" alt="React Router" width="42" /><br />React Router | <img src="https://ssgoi.dev/logos/tanstack.svg" alt="TanStack Router" width="42" /><br />TanStack Router | <img src="https://ssgoi.dev/logos/svelte.svg" alt="SvelteKit" width="42" /><br />SvelteKit | <img src="https://ssgoi.dev/logos/nuxt.svg" alt="Nuxt" width="42" /><br />Nuxt |
| :------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------: |

React · Svelte · Vue · Solid · Angular · Qwik · framework-agnostic core

[See complete compatibility and framework guides →](https://ssgoi.dev/docs/compatibility)

---

## Why SSGOI doesn't use the View Transition API

SSGOI owns the geometry, temporary visual layers, live outgoing DOM, and
navigation policy needed to turn complex motion into reusable presets.

|                                                                                     Zoom                                                                                      |                                                                              Film                                                                               |                                                                               Sheet                                                                                |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://ssgoi.dev/blog/view-transition-api-limitations/zoom-blur.gif" alt="Zoom transition that transforms and clips a detail page around its image" width="240" /> | <img src="https://ssgoi.dev/blog/view-transition-api-limitations/film.gif" alt="Film transition with runtime visual pieces and multiple springs" width="320" /> | <img src="https://ssgoi.dev/blog/view-transition-api-limitations/sheet-blur-full.gif" alt="Sheet transition with a live backdrop between two pages" width="240" /> |
|                                                                 The whole detail page unfolds from its image                                                                  |                                                         Runtime scene, live video, and multiple springs                                                         |                                                             A live backdrop sits between the two pages                                                             |

[Read why SSGOI doesn't use the View Transition API →](https://ssgoi.dev/blog/view-transition-api-limitations)

---

## License

MIT Licensed © [MeurSyphus](https://github.com/meursyphus)
