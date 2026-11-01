# SSGOI + Qwik City

The router helper used by this template is an experimental API.

```bash
pnpm install
pnpm dev
```

`src/lib/ssgoi-config.ts` exports one QRL config factory with the transitions
and the layout tree. The root route layout passes Qwik City's location store
as `framework` and holds the depth-0 boundary:

```tsx
const location = useLocation();
useSsgoi(root, { config$: ssgoiConfig$, framework: { location } });
const boundary = useSsgoiLayoutBoundary();

<main ref={root}>
  <div key={boundary.value.key} data-ssgoi-transition={boundary.value.id}>
    <Slot />
  </div>
</main>
```

`useSsgoiLayoutBoundary()` from `@ssgoi/qwik` takes no arguments. Its depth
comes from how many boundaries sit above it, and `config.layouts` decides
when the boundary at each depth stays mounted. Pages carry no markers.

```
src/routes/
  layout.tsx                  useSsgoi(root, { framework }) + depth-0 boundary
  (top-level)/layout.tsx      depth-1 boundary around <Slot />; bottom nav outside it
    posts/  pinterest/  profile/
    products/layout.tsx       depth-2 boundary; header and category tabs outside it
      all/  electronics/  fashion/  home/  beauty/
  (detail)/layout.tsx         depth-1 boundary
    posts/[id]/  pinterest/[id]/  profile/[id]/
```

`(top-level)` and `(detail)` are Qwik City route groups: a `layout.tsx` inside
`(group)/` wraps the group's routes without adding a URL segment.

```ts
export const TOP_LEVEL = ["/posts", "/products/**", "/pinterest", "/profile"];

export const ssgoiConfig$ = $(() => ({
  layouts: [
    { paths: TOP_LEVEL, layouts: [{ paths: "/products/**" }] },
    { paths: "/**", except: TOP_LEVEL },
  ],
  transitions: [
    { from: TOP_LEVEL, to: TOP_LEVEL, transition: fade() },
    // drill, zoom, ordered slide ...
  ],
}));
```

`TOP_LEVEL` is exported so the `$()` factory can capture it.

What moves:

- Tab to tab (`/posts` → `/pinterest`): every top-level page shares the depth-0
  scope, so only the depth-1 boundary changes. The content fades and the bottom
  nav stays.
- Category to category (`/products/all` → `/products/fashion`): depth 0 and 1
  stay inside `/products/**`; the depth-2 boundary slides.
- Tab to detail (`/posts` → `/posts/1`): the depth-0 scope changes, so the whole
  top-level page, bottom nav included, drills or zooms away.
- Detail to detail (`/posts/1` → `/posts/2`): depth 0 stays in the detail scope;
  the depth-1 boundary is keyed by the route path, so City's reused page
  component still gets a new root.

A boundary's key is its depth's scope instance and falls back to the route
path past the declared scopes. Without `layouts`, every boundary follows the
route path. Use `/products/**`, not `/products/*`, in `TOP_LEVEL`: a `*`
segment is captured, so each category would get its own depth-0 instance.

Effects:

- Top-level tabs: `fade`.
- Posts: `drill`.
- Product tabs: ordered `slide`.
- Gallery and profile: `zoom`.

The single scroll container (`main#demo-content`) stays outside every boundary;
the bottom nav is `sticky` inside the `(top-level)` layout.

Guide: https://ssgoi.dev/llms/qwik.txt

```bash
pnpm build.types
pnpm build
```

## Customize motion

Presets accept a second `{ override }` argument. This optional example retunes
only the backward direction; the template's default config remains unchanged.

```ts
import { drill, spring } from "@ssgoi/qwik";

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
