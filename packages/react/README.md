# @ssgoi/react

Native app-like page transitions for React and Next.js. Make a web app, PWA or WebView app (Capacitor, Tauri, Ionic) feel like a native app without replacing your router.

[![SSGOI live showcase](https://ssgoi.dev/readme.png)](https://ssgoi.dev)

[Live demos](https://ssgoi.dev) · [Hero, Zoom, Film, and Sheet in motion](https://ssgoi.dev/blog/view-transition-api-limitations)

```bash
npm install @ssgoi/react
```

Agent setup guide: https://ssgoi.dev/llms.txt

## Router integration

Tell `<Ssgoi framework>` how to read your router once, describe your layout
tree in `config.layouts`, and put a prop-less `SsgoiLayoutBoundary` from
`@ssgoi/react` in each layout that owns routed content. The root entry imports
no router package: `framework.useRoute` is a hook you write with your router's
own hooks, returning `{ pathname, renderedPath? }` or `null` while the router
isn't ready. The first boundary calls it once for every boundary inside it.

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

const TOP_LEVEL = ["/", "/search", "/profile"];

const config = {
  layouts: [
    { paths: TOP_LEVEL },
    {
      paths: "/**",
      except: TOP_LEVEL,
      layouts: [{ paths: "/products/**" }],
    },
  ],
  transitions: [
    { on: "/posts/**", except: "/posts", transition: drill() },
    {
      ordered: ["/products/all", "/products/electronics", "/products/fashion"],
      transition: slide(),
    },
  ],
};

const INTERCEPTION_PREFIX = /^(?:\(\.\.\.\)|\(\.\.\)|\(\.\))+/;

const framework: SsgoiFramework = {
  useRoute: () => {
    const pathname = usePathname();
    // The page the children slot renders. During a soft intercept it is still
    // the background page, so no background boundary moves.
    const segments = useSelectedLayoutSegments();
    if (pathname == null) return null;
    const renderedPath = `/${segments
      .filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")))
      .map((segment) => segment.replace(INTERCEPTION_PREFIX, ""))
      .filter(Boolean)
      .join("/")}`;
    return { pathname, renderedPath };
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

Render the provider in the root layout with the depth-0 boundary:

```tsx
// app/layout.tsx
import { SsgoiLayoutBoundary } from "@ssgoi/react";
import { SsgoiProvider } from "./ssgoi-provider";

export default function RootLayout({ children, modal }) {
  return (
    <html>
      <body>
        <main className="relative z-0 min-h-dvh overflow-x-clip">
          <SsgoiProvider>
            <SsgoiLayoutBoundary>{children}</SsgoiLayoutBoundary>
            {modal}
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

Put the first `SsgoiLayoutBoundary` in the same layout as `<Ssgoi>`:
`renderedPath` is computed relative to that layout. That boundary reads the
route for every boundary inside it, within its own `Suspense`, so Next.js Cache
Components can suspend on the URL. Until the route is known it renders nothing,
while content outside it (such as `{modal}`) renders as usual.

### Route boundary

A React route boundary is a keyed element marked with a route id:

```tsx
<div key={key} data-ssgoi-transition={routePath}>
  {children}
</div>
```

- Changing `key` makes React unmount the old region and mount the new one.
- The attribute identifies those regions for SSGOI config matching.
- `<Ssgoi>` observes that lifecycle and runs OUT/IN; it does not navigate or
  change the key.

`SsgoiLayoutBoundary` renders that element for you and takes no SSGOI props:
`as` picks the element (default `div`) and every other prop is forwarded.

- Its depth is the number of boundaries above it: 0 in the root layout, 1 in a
  layout under it, and so on.
- `routePath` is `renderedPath ?? pathname`; it is the id of every boundary.
- The key at depth N is the depth-N scope instance `config.layouts` resolves for
  `routePath`, or `routePath` itself when there is none. Without
  `config.layouts`, every boundary keys by the route.

The legacy `<SsgoiTransition>` wrapper only added this attribute and is
deprecated (removed in 8.0.0). Set `data-ssgoi-transition` directly on the keyed
application boundary.

## Persistent layouts

`config.layouts` mirrors the layouts that own boundaries. Siblings in one array
are tried in order and the first match wins (`except` excludes paths); a scope's
`layouts` is the next depth inside it. Patterns use the transition-rule syntax.
`*`, `:id` and `[id]` segments make one instance per value, so
`{ paths: "/projects/:id/**" }` keeps `/projects/1/files` and
`/projects/1/members` in one layout and gives `/projects/2` another; `**`
tails do not.

```text
app/
  layout.tsx                  # <Ssgoi> + depth-0 boundary, {modal} outside it
  (top-level)/layout.tsx      # depth-1 boundary + bottom nav outside it
  (top-level)/page.tsx
  (top-level)/search/page.tsx
  (detail)/layout.tsx         # depth-1 boundary
  (detail)/posts/[id]/page.tsx
  (detail)/products/layout.tsx  # depth-2 boundary + category tabs
  @modal/(.)posts/[id]/page.tsx
```

```tsx
// app/(top-level)/layout.tsx
import { SsgoiLayoutBoundary } from "@ssgoi/react";

export default function TopLevelLayout({ children }) {
  return (
    <>
      <SsgoiLayoutBoundary>{children}</SsgoiLayoutBoundary>
      <BottomNav />
    </>
  );
}
```

With the config above:

- Tab → tab (`/` → `/search`): the depth-0 key stays, so the bottom nav stays;
  only the depth-1 content changes.
- Top level → detail (`/search` → `/posts/1`): the depth-0 key changes; the
  whole top level, bottom nav included, leaves.
- Detail → detail and category → category under `/products/**`: the enclosing
  layouts stay; the boundary one level deeper changes, so `slide` moves only
  the category content.
- A soft intercept (`/posts/1` opened over `/search`) keeps `renderedPath` at
  `/search`, so nothing in the background moves; the `{modal}` slot sits
  outside every boundary and animates by itself. Direct entry to `/posts/1`
  renders the detail page and keys it as one.

Full pattern: https://ssgoi.dev/llms/bottom-nav.txt

## React Router

Render `<Ssgoi>` inside the router and the boundary in a layout route:

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

Query-only navigation keeps the boundary. Nested layout routes add deeper
boundaries, keyed by `config.layouts` as above.

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

Pathless `_layout` routes add deeper boundaries, keyed by `config.layouts`.

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

- `layouts`: the layout tree for `SsgoiLayoutBoundary` keys (see
  [Persistent layouts](#persistent-layouts)).
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
