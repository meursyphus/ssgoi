# SSGOI + SvelteKit

The router helper used by this template is an experimental API.

```bash
pnpm install
pnpm dev
```

One config (`src/lib/ssgoi-config.ts`) declares the transitions and the
layout tree. `SsgoiLayoutBoundary` takes no SSGOI props: its depth comes from
how many boundaries sit above it, and `config.layouts` decides when the
boundary at each depth stays mounted.

```
src/routes/
  +layout.svelte              <Ssgoi framework> + depth-0 boundary (demo-layout.svelte)
  (top-level)/+layout.svelte  depth-1 boundary around the tab content; bottom nav outside it
    posts/  pinterest/  profile/
    products/+layout.svelte   depth-2 boundary; header and category tabs outside it
      all/  electronics/  fashion/  home/  beauty/
  (detail)/+layout.svelte     depth-1 boundary
    posts/[id]/  pinterest/[id]/  profile/[id]/
```

`(top-level)` and `(detail)` are SvelteKit route groups: they add a layout
without adding a URL segment.

```ts
const TOP_LEVEL = ["/posts", "/products/**", "/pinterest", "/profile"];

export const ssgoiConfig = {
  layouts: [
    { paths: TOP_LEVEL, layouts: [{ paths: "/products/**" }] },
    { paths: "/**", except: TOP_LEVEL },
  ],
  transitions: [
    { from: TOP_LEVEL, to: TOP_LEVEL, transition: fade() },
    // drill, zoom, ordered slide ...
  ],
} satisfies SsgoiConfig;
```

```svelte
<!-- src/lib/components/demo-layout.svelte -->
<Ssgoi
  config={ssgoiConfig}
  framework={{
    getRoute: () => ({ pathname: page.url.pathname }),
    onNavigate,
  }}
>
  <SsgoiLayoutBoundary>
    {@render children()}
  </SsgoiLayoutBoundary>
</Ssgoi>

<!-- src/routes/(top-level)/+layout.svelte -->
<SsgoiLayoutBoundary>
  {@render children()}
</SsgoiLayoutBoundary>
<BottomNav />
```

`page` comes from `$app/state` and `onNavigate` from `$app/navigation`; the
package itself never imports `@sveltejs/kit`. On SvelteKit < 2.12 (no
`$app/state`), use the store instead:
`getRoute: () => ({ pathname: get(page).url.pathname })`
with `page` from `$app/stores` and `get` from `svelte/store`.

What moves:

- Tab to tab (`/posts` → `/pinterest`): every top-level page shares the depth-0
  scope, so only the depth-1 boundary changes. The content fades and the bottom
  nav stays.
- Category to category (`/products/all` → `/products/fashion`): depth 0 and 1
  stay inside `/products/**`; the depth-2 boundary slides.
- Tab to detail (`/posts` → `/posts/1`): the depth-0 scope changes, so the whole
  top-level page, bottom nav included, drills or zooms away.
- Detail to detail (`/posts/1` → `/posts/2`): depth 0 stays in the detail scope;
  the depth-1 boundary changes.

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
the bottom nav is `sticky` inside the top-level layout.

Guide: https://ssgoi.dev/llms/svelte.txt

```bash
pnpm check
pnpm build
```

## Customize motion

Presets accept a second `{ override }` argument. This optional example retunes
only the backward direction; the template's default config remains unchanged.

```ts
import { drill, spring } from "@ssgoi/svelte";

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
