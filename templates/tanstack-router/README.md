# SSGOI + TanStack Router

The router helper used by this template is an experimental API.

Pass a `useRoute` that reads TanStack Router's rendered leaf match to
`<Ssgoi framework>`, declare the layout tree in `config.layouts`, and place
`SsgoiLayoutBoundary` (from `@ssgoi/react`, no props) in each route component
that should animate. The package itself never imports `@tanstack/react-router`.

```bash
pnpm install
pnpm dev
```

## Structure

```
app/routes/
  __root.tsx                    <Ssgoi> + depth-0 boundary (demo-layout.tsx)
  _top-level.tsx                depth-1 boundary, bottom nav outside it
    _top-level.posts.tsx  _top-level.pinterest.tsx  _top-level.profile.tsx
    _top-level.shop.tsx         header + category tabs, depth-2 boundary
      _top-level.shop.index.tsx (All)  _top-level.shop.electronics.tsx ...
  _detail.tsx                   depth-1 boundary
    _detail.posts.$postId.tsx  _detail.pinterest.$pinId.tsx  _detail.profile.$postId.tsx
```

- Tab → tab: only the depth-1 content changes; the bottom nav stays.
- Tab → detail: the depth-0 boundary changes, so the whole top level,
  bottom nav included, leaves.
- Detail → detail (a related post): only the detail boundary changes.
- Category → category (`/shop` is All, then `/shop/electronics`, ...): only
  the depth-2 boundary slides; the shop header
  and tabs stay.

`app/components/ssgoi-config.ts` mirrors that tree:

```ts
const TOP_LEVEL = ["/posts", "/shop/**", "/pinterest", "/profile"];

export const ssgoiConfig = {
  layouts: [
    { paths: TOP_LEVEL, layouts: [{ paths: "/shop/**" }] },
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
import { useRouterState } from "@tanstack/react-router";
import { Ssgoi, SsgoiLayoutBoundary, type SsgoiFramework } from "@ssgoi/react";

// Key by the leaf match the outlet renders, not location (location moves
// before pending matches render; index routes match "/parent/").
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

<Ssgoi config={ssgoiConfig} framework={framework}>
  <SsgoiLayoutBoundary className="min-h-full flex flex-col">
    {children}
  </SsgoiLayoutBoundary>
</Ssgoi>;
```

`_top-level` and `_detail` are pathless layout routes, so they group routes
without adding a URL segment.

Effects:

- Posts: `drill`.
- Product tabs: ordered `slide`.
- Gallery and profile: `zoom`.
- Tab ↔ tab: `fade` on the depth-1 content.

Guide: https://ssgoi.dev/llms/frameworks/tanstack-router.txt

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
