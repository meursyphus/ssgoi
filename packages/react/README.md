# @ssgoi/react

Native app-like page transitions for React and Next.js. Make a web app, PWA or WebView app (Capacitor, Tauri, Ionic) feel like a native app without replacing your router.

[![SSGOI live showcase](https://ssgoi.dev/readme.png)](https://ssgoi.dev)

[Live demos](https://ssgoi.dev) · [Hero, Zoom, Film, and Sheet in motion](https://ssgoi.dev/blog/view-transition-api-limitations)

```bash
npm install @ssgoi/react
```

Agent setup guide: https://ssgoi.dev/llms.txt

## Router integration

Tell `<Ssgoi framework>` how to read your router once, then render
`SsgoiLayoutBoundary` from `@ssgoi/react` in the layouts that own routed
content. The root entry imports no router package: `framework.useRoute` is a
hook you write with your router's own hooks, returning the current route
(`{ pathname, ...anything }`) or `null` while the router isn't ready.

| Router                  | `useRoute`                                                       |
| ----------------------- | ---------------------------------------------------------------- |
| Next.js App Router      | `usePathname` + `useSelectedLayoutSegments` ([Next.js](#nextjs)) |
| React Router / Remix 2  | `() => useLocation()`                                            |
| TanStack Router / Start | the rendered leaf match ([TanStack Router](#tanstack-router))    |

Define the object at module scope so it stays stable. `SsgoiLayoutBoundary`
throws if the nearest `<Ssgoi>` has no `framework`.

The router subpaths `@ssgoi/react/nextjs`, `@ssgoi/react/remix`,
`@ssgoi/react/react-router` and `@ssgoi/react/tanstack-router` (and their
`SsgoiRouteBoundary`) still work but are deprecated and will be removed in
8.0.0.

See the [framework guide](https://ssgoi.dev/docs/frameworks/react) for wiring and limits.

## Contents

- Next.js
- Persistent layouts and sliding tabs
- React Router
- TanStack Router
- Config
- Effect index

## Tune or define motion

Built-in presets accept `{ override: { forward, backward } }` as their second
argument. Callbacks receive `{ animation, context }`, preserve the preset's
concrete animation type, and edit named children with
`animation.select("in").set({ integrator })`. Use `animation.set({ integrator })`
to retune the whole group. Springs use stiffness/damping; custom integrator
instances are accepted.

[Motion overrides](https://ssgoi.dev/docs/motion) ·
[Custom definitions and integrators](https://ssgoi.dev/docs/custom-transitions)

## Next.js

Keep one config and one `<Ssgoi>` above route boundaries.

```tsx
// app/ssgoi-provider.tsx
"use client";

import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { Ssgoi, type SsgoiFramework } from "@ssgoi/react";
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

const framework: SsgoiFramework = {
  useRoute: ({ parallelRoutesKey = "children" }) => {
    const pathname = usePathname();
    const selectedSegments = useSelectedLayoutSegments(parallelRoutesKey) ?? [];
    return pathname == null ? null : { pathname, selectedSegments };
  },
};

export function SsgoiProvider({ children }) {
  return (
    <Ssgoi config={config} framework={framework}>
      {children}
    </Ssgoi>
  );
}
```

Build the layout shell next:

```tsx
// app/layout.tsx
import { SsgoiLayoutBoundary } from "@ssgoi/react";
import { SsgoiProvider } from "./ssgoi-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <main className="relative z-0 min-h-dvh overflow-x-clip">
          <SsgoiProvider>
            <SsgoiLayoutBoundary>{children}</SsgoiLayoutBoundary>
          </SsgoiProvider>
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

`SsgoiLayoutBoundary` renders that element for you. By default both id and key
are the pathname. Its props:

- `as`: the element to render (default `div`); other props are forwarded.
- `boundary`: the boundary's identity. Omitted, the id is the pathname and the
  key is the id.
  - a string is a fixed key (lifetime), e.g. a persistent layout shell; the id
    stays the pathname: `boundary="products-layout"`.
  - `{ id?, key? }` fixes either; key still defaults to id:
    `boundary={{ id: "/feed" }}`.
  - a function of the route returns either form during render; a returned
    string is also the key. The route is the object `framework.useRoute`
    returned; annotate the parameter with that shape.
- `parallelRoutesKey`: passed to `framework.useRoute`; above, the Next.js slot
  to read, without `@`.
- `fallback`: shown while the URL suspends (Next.js Cache Components) or while
  `useRoute` returns `null`.

The legacy `<SsgoiTransition>` wrapper only added this attribute and is
deprecated (removed in 8.0.0). Set `data-ssgoi-transition` directly on the keyed application
boundary.

If the application needs its own policy layer, keep route logic behind semantic
names so layouts cannot invent inconsistent keys. A `boundary` function cannot
be passed from a server layout, so wrap it in a client component:

```tsx
// app/ssgoi-route-boundary.tsx
"use client";

import { type ReactNode } from "react";
import { SsgoiLayoutBoundary } from "@ssgoi/react";

type BoundaryName = "app-shell" | "main-content" | "project-content";
type Route = { pathname: string; selectedSegments: string[] };

const INTERCEPTION_PREFIX = /^(?:\(\.\.\.\)|\(\.\.\)|\(\.\))+/;

// Route groups are layout ownership, not URL; interception markers are dropped.
function pathOf(segments: string[], base = "") {
  const path = segments
    .filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")))
    .map((segment) => segment.replace(INTERCEPTION_PREFIX, ""))
    .filter(Boolean)
    .join("/");
  return `${base}/${path}`.replace(/\/$/, "") || "/";
}

const projectOf = (path: string) => path.match(/^\/projects\/[^/]+/)?.[0];

const resolvers = {
  "app-shell": ({ selectedSegments }: Route) => {
    const id = pathOf(selectedSegments);
    if (selectedSegments.includes("(main)")) return { id, key: "main-shell" };
    return { id, key: projectOf(id) ?? id };
  },
  "project-content": ({ pathname, selectedSegments }: Route) => ({
    id: pathOf(selectedSegments, projectOf(pathname)),
  }),
  "main-content": ({ selectedSegments }: Route) => ({
    id: pathOf(selectedSegments),
  }),
};

export function SsgoiRouteBoundary({
  children,
  name,
}: {
  children: ReactNode;
  name: BoundaryName;
}) {
  return (
    <SsgoiLayoutBoundary boundary={resolvers[name]}>
      {children}
    </SsgoiLayoutBoundary>
  );
}
```

## Persistent layouts

Place one named boundary in the common app layout, then add child boundaries
only around routed content that changes while its parent remains mounted.

```tsx
// app/layout.tsx — replace the boundary line from the shell example.
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
boundary’s id/key from `selectedSegments`, which the `useRoute` above reads
with `useSelectedLayoutSegments("children")` at the boundary's layout. Render a
boundary for the modal slot with `parallelRoutesKey="modal"`. A soft intercept
keeps the background key; direct entry to the same URL resolves to the detail
slot and receives a detail key.

Full pattern: https://ssgoi.dev/llms/bottom-nav.txt

## React Router

Return the location itself, so a `boundary` function also receives `search`, `hash` and
`state`. Render `<Ssgoi>` inside the router and the boundary in a layout route:

```tsx
import { Outlet, useLocation } from "react-router"; // Remix 2: "@remix-run/react"
import { Ssgoi, SsgoiLayoutBoundary, type SsgoiFramework } from "@ssgoi/react";

const framework: SsgoiFramework = { useRoute: () => useLocation() };

export default function Layout() {
  return (
    <Ssgoi config={config} framework={framework}>
      <SsgoiLayoutBoundary>
        <Outlet />
      </SsgoiLayoutBoundary>
    </Ssgoi>
  );
}
```

Query-only navigation keeps the boundary; pass a `boundary` function to key by
more than the pathname.

## TanStack Router

Key by the leaf match the outlet renders, not `location`: TanStack Router moves
`location` before pending matches render, so keying by it re-keys the boundary
while the outgoing page is still on screen. Index routes match as "/parent/",
so the location's own trailing-slash style wins.

```tsx
import { Outlet, useRouterState } from "@tanstack/react-router";
import { Ssgoi, SsgoiLayoutBoundary, type SsgoiFramework } from "@ssgoi/react";

const framework: SsgoiFramework = {
  useRoute: () => ({
    pathname: useRouterState({
      select: (state) => {
        const location = state.location.pathname;
        const leaf = state.matches.at(-1)?.pathname;
        if (!leaf) return location;
        return leaf.length > 1 && leaf.endsWith("/") && !location.endsWith("/")
          ? leaf.slice(0, -1)
          : leaf;
      },
    }),
  }),
};

<Ssgoi config={config} framework={framework}>
  <SsgoiLayoutBoundary>
    <Outlet />
  </SsgoiLayoutBoundary>
</Ssgoi>;
```

## Config

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
  `preserveScroll: { from: boolean, to: boolean }`, or share one position
  across the rule's pages with `preserveScroll: "shared"`.
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

`transition()` remains available for element-level mount/unmount animations;
it is separate from route boundaries. The `@ssgoi/react/unplugin` auto-key
plugins are deprecated and will be removed in 8.0.0.

## License

MIT
