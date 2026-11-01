# SSGOI + Qwik City

The router helper used by this template is an experimental API.

```bash
pnpm install
pnpm dev
```

`src/lib/ssgoi-config.ts` exports one QRL config factory with the transitions
and the layout tree. The root route layout passes Qwik City's location store
as `framework`:

```tsx
const location = useLocation();
useSsgoi(root, { config$: ssgoiConfig$, framework: { location } });
```

`useSsgoiLayoutBoundary()` from `@ssgoi/qwik` takes no arguments. Call it in a
route layout or page and apply it to that component's own root. Its depth
comes from how many boundaries sit above it, and `config.layouts` decides
when the boundary at each depth stays mounted:

```tsx
const boundary = useSsgoiLayoutBoundary();
<div key={boundary.value.key} data-ssgoi-transition={boundary.value.id}>...</div>
```

```
src/routes/
  layout.tsx                  useSsgoi(root, { framework }) around <Slot />
  (top-level)/layout.tsx      depth 0 on its root; <Slot /> above the bottom nav
    posts/  pinterest/  profile/   depth 1 on each page's root
    products/layout.tsx       depth 1 on its root; header and category tabs
      all/  electronics/  fashion/  home/  beauty/   depth 2 (ProductGrid's root)
  (detail)/layout.tsx         depth 0 on its root
    posts/[id]/  pinterest/[id]/  profile/[id]/    depth 1 on each page's root
```

`(top-level)` and `(detail)` are Qwik City route groups: a `layout.tsx` inside
`(group)/` wraps the group's routes without adding a URL segment.

### Why the boundaries sit one level lower than in other templates

The other templates put the depth-0 boundary next to `<Ssgoi>` and a depth-1
boundary around each group layout's children. In Qwik that would put a keyed
element around a `<Slot />`, and the outgoing page loses its content
mid-transition: when that key changes, Qwik moves the projected content into
the new element, so a tab page leaving for a detail page animates as an
empty screen with only the bottom nav. So each boundary goes on the root of
the component that owns it. Qwik City swaps the group layout between a tab
and a detail page and removes the old one with its page still inside. The
group layouts' keys stay fixed while they are mounted, and the page roots
under them change.

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

- Tab to tab (`/posts` → `/pinterest`): the `(top-level)` layout stays; only
  the page root (depth 1) changes. The content fades and the bottom nav stays.
- Category to category (`/products/all` → `/products/fashion`): the products
  layout stays inside `/products/**`; the category root (depth 2) slides.
- Tab to detail (`/posts` → `/posts/1`): the `(top-level)` layout, bottom nav
  included, leaves as a whole and drills or zooms into the `(detail)` layout.
- Detail to detail (`/posts/1` → `/posts/2`): the `(detail)` layout stays; the
  page root (depth 1) is keyed by the route path, so City's reused page
  component still gets a new root.

A boundary's key is its depth's scope instance and falls back to the route
path past the declared scopes. Without `layouts`, every boundary follows the
route path. Use `/products/**`, not `/products/*`, in `TOP_LEVEL`: a `*`
segment is captured, so each category would get its own scope instance.

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
