# @ssgoi/vue

Native app-like page transitions for Vue and Nuxt. Make a web app, PWA or WebView app (Capacitor, Tauri, Ionic) feel like a native app without replacing your router.

[![SSGOI live showcase](https://ssgoi.dev/readme.png)](https://ssgoi.dev)

[Live demos](https://ssgoi.dev) · [Hero, Zoom, Film, and Sheet in motion](https://ssgoi.dev/blog/view-transition-api-limitations)

```bash
npm install @ssgoi/vue
```

Agent setup guide: https://ssgoi.dev/llms/vue.txt

## Layout boundary

Pass a reactive route getter to `<Ssgoi>` once, then wrap routed content in
`SsgoiLayoutBoundary`.

```vue
<script setup lang="ts">
import { useRouter } from "vue-router"; // Nuxt: auto-imported
import { Ssgoi, SsgoiLayoutBoundary } from "@ssgoi/vue";

const router = useRouter();
const framework = {
  getRoute: () => ({ pathname: router.currentRoute.value.path }),
};
</script>

<template>
  <Ssgoi :config="config" :framework="framework">
    <SsgoiLayoutBoundary>
      <RouterView />
    </SsgoiLayoutBoundary>
  </Ssgoi>
</template>
```

Each boundary marks the current path with `data-ssgoi-transition`. Nest them
freely: depth is automatic. Declare which paths share a layout in
`config.layouts`; the scope matched at a boundary's depth keeps its DOM, and
past the declared scopes a boundary remounts on every path change (the default
without `layouts`).

```ts
const TOP_LEVEL = ["/home", "/search", "/profile"];
const config = {
  layouts: [
    { paths: TOP_LEVEL }, // tabs share one depth-0 layout
    {
      paths: "/**",
      except: TOP_LEVEL,
      layouts: [{ paths: "/products/**" }], // depth-1 scope inside details
    },
  ],
  transitions: [/* ... */],
};
```

The first matching scope at each level wins. Single-segment captures (`*`,
`:id`, `[id]`) split instances, so `/projects/:id/**` keeps one layout per
project; `**` tails do not. `SsgoiLayoutBoundary` takes no SSGOI props (`as`
sets the element) and throws without `framework` on `<Ssgoi>`.

`SsgoiRouteBoundary` from `@ssgoi/vue/vue-router` and `@ssgoi/vue/nuxt` is
deprecated; use `SsgoiLayoutBoundary` with `framework` instead.

See the [framework guide](https://ssgoi.dev/docs/frameworks/vue) for wiring and limits.

## Root

```vue
<script setup lang="ts">
import { Ssgoi } from "@ssgoi/vue";
import { drill } from "@ssgoi/vue/view-transitions";

const router = useRouter();
const framework = {
  getRoute: () => ({ pathname: router.currentRoute.value.path }),
};
const config = {
  transitions: [{ on: "/posts/**", except: "/posts", transition: drill() }],
};
</script>

<template>
  <main class="ssgoi-shell">
    <Ssgoi :config="config" :framework="framework">
      <NuxtPage />
    </Ssgoi>
  </main>
</template>

<style>
.ssgoi-shell {
  position: relative;
  z-index: 0;
  min-height: 100dvh;
  overflow-x: clip;
}
</style>
```

## Route boundary

Mark page roots:

```vue
<template>
  <section data-ssgoi-transition="/posts">Posts</section>
</template>
```

Dynamic route:

```vue
<section :data-ssgoi-transition="`/posts/${route.params.id}`">
  ...
</section>
```

## Persistent layouts

Use the parent page/layout as the outer boundary and child page roots as inner
boundaries:

```vue
<template>
  <section :data-ssgoi-transition="route.path">
    <ProductTabs />
    <NuxtPage />
  </section>
</template>
```

Nuxt keeps the parent during child navigation. Leaving the parent uses the
outer boundary; changing a child route uses the child boundary.

If a Vue Router layout reuses the same component where a fresh DOM boundary is
required, use a resolved key:

```vue
<section :key="resolveKey(route.path)" :data-ssgoi-transition="route.path">
  <RouterView />
</section>
```

## Config

```ts
import { drill, slide, zoom } from "@ssgoi/vue/view-transitions";

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

Scroll is automatic: `on` and `from`/`to` restore `from` and reset `to`;
`ordered` restores both. Override with
`preserveScroll: { from: boolean, to: boolean }`, or share one position across
the rule's pages with `preserveScroll: "shared"`.

## Effect index

- `fade`: unrelated pages.
- `drill`: list → detail.
- `slide` or `axis`: ordered tabs.
- `sheet`: modal-like routes.
- `zoom` or `hero`: shared-element details.
- `scroll`: vertical sequences.

All effects: https://ssgoi.dev/llms.txt#7-transition-index

`SsgoiTransition` is deprecated. Use the data attribute directly.

## License

MIT
