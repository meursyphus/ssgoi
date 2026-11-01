# SSGOI + Nuxt

The router helper used by this template is an experimental API.

```bash
pnpm install
pnpm dev
```

One config (`utils/ssgoi-config.ts`) declares the transitions and the layout
tree. `SsgoiLayoutBoundary` takes no SSGOI props: its depth comes from how
many boundaries sit above it, and `config.layouts` decides when the boundary
at each depth stays mounted.

```
app.vue                       <NuxtLayout><NuxtPage /></NuxtLayout> inside demo-layout.vue
components/demo-layout.vue    <Ssgoi :framework> + depth-0 boundary
layouts/top-level.vue         depth-1 boundary around the tab content; bottom nav outside it
layouts/detail.vue            depth-1 boundary
pages/
  (top-level)/                definePageMeta({ layout: "top-level" })
    posts/index.vue  pinterest/index.vue  profile/index.vue
    shop.vue                  depth-2 boundary; header and category tabs outside it
    shop/index.vue (All)  electronics.vue  fashion.vue  home.vue  beauty.vue
  (detail)/                   definePageMeta({ layout: "detail" })
    posts/[id].vue  pinterest/[id].vue  profile/[id].vue
```

### Pathless groups in Nuxt

Nuxt's `pages/(group)/` folders drop the folder name from the URL, but unlike
SvelteKit or SolidStart they give the group no parent component:
`pages/(top-level).vue` would not wrap the pages inside `(top-level)/`. Nuxt's
tool for a shared shell that adds no URL segment is `layouts/`. So each group
folder only organizes files, and its pages pick their shell with
`definePageMeta({ layout })`. `<NuxtLayout>` keeps one layout instance while
consecutive pages use the same layout and swaps it when the layout changes,
which lines up with the depth-0 scopes below. `shop.vue` is an ordinary
nested page (it adds `/shop`), and its children inherit
`layout: "top-level"` through merged route meta.

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

```vue
<!-- components/demo-layout.vue -->
<Ssgoi :config="ssgoiConfig" :framework="framework">
  <SsgoiLayoutBoundary>
    <slot />
  </SsgoiLayoutBoundary>
</Ssgoi>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Ssgoi, SsgoiLayoutBoundary } from "@ssgoi/vue";

const router = useRouter();
const framework = {
  getRoute: () => ({ pathname: router.currentRoute.value.path }),
};
</script>

<!-- layouts/top-level.vue -->
<div>
  <SsgoiLayoutBoundary>
    <slot />
  </SsgoiLayoutBoundary>
  <BottomNav />
</div>
```

The package itself never imports `nuxt` or `vue-router`.

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

Guide: https://ssgoi.dev/llms/vue.txt

```bash
npx nuxi typecheck
pnpm build
```

## Customize motion

Presets accept a second `{ override }` argument. This optional example retunes
only the backward direction; the template's default config remains unchanged.

```ts
import { drill, spring } from "@ssgoi/vue";

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
