# SSGOI + SolidStart

The router helper used by this template is an experimental API.

```bash
pnpm install
pnpm dev
```

One config (`src/ssgoi-config.ts`) declares the transitions and the layout
tree. `SsgoiLayoutBoundary` takes no SSGOI props: its depth comes from how
many boundaries sit above it, and `config.layouts` decides when the boundary
at each depth stays mounted.

```
src/app.tsx                   <Ssgoi framework> + depth-0 boundary in the router root
src/routes/
  (top-level).tsx             depth-1 boundary around the tab content; bottom nav outside it
  (top-level)/
    posts/  pinterest/  profile/
    shop.tsx                  depth-2 boundary; header and category tabs outside it
    shop/index.tsx (All)  electronics.tsx  fashion.tsx  home.tsx  beauty.tsx
  (detail).tsx                depth-1 boundary
  (detail)/
    posts/[postId].tsx  pinterest/[pinId].tsx  profile/[postId].tsx
```

`(top-level)` and `(detail)` are SolidStart route groups: `(group).tsx` is a
layout for the files in `(group)/` and adds no URL segment.

```ts
const TOP_LEVEL = ["/posts", "/shop/**", "/pinterest", "/profile"];

export const ssgoiConfig = {
  layouts: [
    { paths: TOP_LEVEL, layouts: [{ paths: "/shop/**" }] },
    { paths: "/**", except: TOP_LEVEL },
  ],
  transitions: [
    { from: TOP_LEVEL, to: TOP_LEVEL, transition: fade() },
    // drill, zoom, ordered slide ...
  ],
} satisfies SsgoiConfig;
```

```tsx
// src/app.tsx (inside <Router root>)
const location = useLocation();
const framework = { getRoute: () => ({ pathname: location.pathname }) };

<Ssgoi config={ssgoiConfig} framework={framework}>
  <SsgoiLayoutBoundary>{props.children}</SsgoiLayoutBoundary>
</Ssgoi>

// src/routes/(top-level).tsx
<div>
  <SsgoiLayoutBoundary>{props.children}</SsgoiLayoutBoundary>
  <BottomNav />
</div>
```

The package itself never imports `@solidjs/router`.

What moves:

- Tab to tab (`/posts` → `/pinterest`): every top-level page shares the depth-0
  scope, so only the depth-1 boundary changes. The content fades and the bottom
  nav stays.
- Category to category (`/shop` → `/shop/fashion`): depth 0 and 1
  stay inside `/shop/**`; the depth-2 boundary slides.
- Tab to detail (`/posts` → `/posts/1`): the depth-0 scope changes, so the whole
  top-level page, bottom nav included, drills or zooms away.
- Detail to detail (`/posts/1` → `/posts/2`): depth 0 stays in the detail scope;
  the depth-1 boundary changes.

A boundary's key is its depth's scope instance and falls back to the route
path past the declared scopes. Without `layouts`, every boundary follows the
route path. Use `/shop/**`, not `/shop/*`, in `TOP_LEVEL`: a `*`
segment is captured, so each category would get its own depth-0 instance.

Effects:

- Top-level tabs: `fade`.
- Posts: `drill`.
- Shop categories: ordered `slide`.
- Gallery and profile: `zoom`.

The single scroll container (`main#demo-content`) stays outside every boundary;
the bottom nav is `sticky` inside the top-level layout.

Guide: https://ssgoi.dev/llms/solid.txt

```bash
pnpm typecheck
pnpm build
```

## Customize motion

Presets accept a second `{ override }` argument. This optional example retunes
only the backward direction; the template's default config remains unchanged.

```ts
import { drill, spring } from "@ssgoi/solid";

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
