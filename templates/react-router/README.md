# SSGOI + React Router

The router helper used by this template is an experimental API.

Pass a `useRoute` built on React Router's `useLocation` to
`<Ssgoi framework>`, declare the layout tree in `config.layouts`, and place
`SsgoiLayoutBoundary` (from `@ssgoi/react`, no props) in each layout route
that should animate. The package itself never imports `react-router`.

```bash
pnpm install
pnpm dev
```

## Structure

```
app/root.tsx                      <Ssgoi> + depth-0 boundary (demo-layout.tsx)
app/routes.ts
  layout top-level.layout.tsx     depth-1 boundary, bottom nav outside it
    posts  pinterest  profile
    layout products_.layout.tsx   header + category tabs, depth-2 boundary
  layout detail.layout.tsx        depth-1 boundary
    posts/:postId  pinterest/:pinId  profile/:postId
```

- Tab → tab: only the depth-1 content changes; the bottom nav stays.
- Tab → detail: the depth-0 boundary changes, so the whole top level,
  bottom nav included, leaves.
- Detail → detail (a related post): only the detail boundary changes.
- Category → category: only the depth-2 boundary slides; the products header
  and tabs stay.

`app/components/ssgoi-config.ts` mirrors that tree:

```ts
const TOP_LEVEL = ["/posts", "/products/**", "/pinterest", "/profile"];

export const ssgoiConfig = {
  layouts: [
    { paths: TOP_LEVEL, layouts: [{ paths: "/products/**" }] },
    { paths: "/**", except: TOP_LEVEL },
  ],
  transitions: [
    /* drill, zoom, category slide */
    { from: TOP_LEVEL, to: TOP_LEVEL, transition: fade() },
  ],
};
```

A boundary's depth is the number of boundaries above it. At depth N it keys by
the scope chosen at level N of `layouts` (the first sibling whose `paths`
match), so it stays mounted while the route stays inside that scope. With no
scope at that level it keys by the route path. Every boundary's transition id
is the route path.

`app/components/demo-layout.tsx` owns `<Ssgoi>` and the depth-0 boundary:

```tsx
import { useLocation } from "react-router";
import { Ssgoi, SsgoiLayoutBoundary, type SsgoiFramework } from "@ssgoi/react";

const framework: SsgoiFramework = { useRoute: () => useLocation() };

<Ssgoi config={ssgoiConfig} framework={framework}>
  <SsgoiLayoutBoundary className="min-h-full flex flex-col">
    {children}
  </SsgoiLayoutBoundary>
</Ssgoi>;
```

Effects:

- Posts: `drill`.
- Product tabs: ordered `slide`.
- Gallery and profile: `zoom`.
- Tab ↔ tab: `fade` on the depth-1 content.

Guide: https://ssgoi.dev/llms/frameworks/react-router.txt

```bash
pnpm typecheck
pnpm build
```

## Customize motion

Presets accept a second `{ override }` argument. This optional example retunes
only the backward direction; the template's default config remains unchanged.

```ts
import { drill, spring } from "@ssgoi/react";

const tunedDrill = drill(
  {},
  {
    override: {
      backward({ animation }) {
        animation.set({ integrator: spring({ stiffness: 400, damping: 35 }) });
      },
    },
  },
);
```

The core decides direction from route relationships and history. An explicit
list/detail rule also treats a fresh detail-to-list link as backward. Equal
from/to patterns use history direction. Keep zoom/hero enter and exit markers;
they identify expanded media and related thumbnails within those pages.

[Named groups and overlap](https://ssgoi.dev/docs/motion) ·
[Writing custom transitions with defineTransition](https://ssgoi.dev/docs/custom-transitions)
