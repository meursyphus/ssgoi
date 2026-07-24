# @ssgoi/react

React bindings for SSGOI.

[![SSGOI live showcase](https://ssgoi.dev/readme.png)](https://ssgoi.dev)

[Live demos](https://ssgoi.dev) · [Hero, Zoom, Film, and Sheet in motion](https://ssgoi.dev/blog/view-transition-api-limitations)

```bash
npm install @ssgoi/react
```

Agent setup guide: https://ssgoi.dev/llms.txt

## Contents

- Next.js
- Persistent layouts and sliding tabs
- React Router
- TanStack Router
- Config
- Effect index

## Next.js

Keep one config and one `<Ssgoi>` above route boundaries.

```tsx
// app/ssgoi-provider.tsx
"use client";

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

export function SsgoiProvider({ children }) {
  return <Ssgoi config={config}>{children}</Ssgoi>;
}
```

Build the layout shell next:

```tsx
// app/layout.tsx
import { SsgoiProvider } from "./ssgoi-provider";

export default function RootLayout({ children }) {
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

## Persistent layouts

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

## React Router

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

## TanStack Router

Read the pathname from router state and place the boundary in a parent route:

```tsx
const pathname = useRouterState({
  select: (state) => state.location.pathname,
});
```

## Config

```ts
import { drill, slide, zoom } from "@ssgoi/react/view-transitions";

const config = {
  transitions: [
    { on: "/posts/**", except: "/posts", transition: drill() },
    { from: "/gallery", to: "/gallery/*", transition: zoom() },
    { ordered: ["/tabs/a", "/tabs/b"], transition: slide() },
  ],
};
```

- `on`: route family.
- `from`/`to`: precise pair.
- `ordered`: directional sequence.
- Patterns support exact paths, a `*` path segment, and suffix `**`.
- `priority` overrides path specificity.

## Effect index

- `fade`: unrelated pages.
- `drill`: list → detail.
- `slide`: ordered tabs.
- `axis`: sibling destinations.
- `sheet`: modal-like routes.
- `zoom`: card/image → detail.
- `hero`: shared elements and page chrome.
- `scroll`: vertical sequences.
- `strip`, `film`, `rotate`, `blind`, `jaemin`: expressive transitions.

References: https://ssgoi.dev/llms.txt#7-transition-index

## Low-level APIs

`transition()` and the auto-key plugins remain available for element-level
mount/unmount animations; they are separate from route boundaries.

## License

MIT
