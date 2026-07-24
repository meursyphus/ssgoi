# @ssgoi/vue

Vue and Nuxt bindings for SSGOI.

[![SSGOI live showcase](https://ssgoi.dev/readme.png)](https://ssgoi.dev)

[Live demos](https://ssgoi.dev) · [Hero, Zoom, Film, and Sheet in motion](https://ssgoi.dev/blog/view-transition-api-limitations)

```bash
npm install @ssgoi/vue
```

Agent setup guide: https://ssgoi.dev/llms/vue.txt

## Root

```vue
<script setup lang="ts">
import { Ssgoi } from "@ssgoi/vue";
import { drill } from "@ssgoi/vue/view-transitions";

const config = {
  transitions: [{ on: "/posts/**", except: "/posts", transition: drill() }],
};
</script>

<template>
  <main class="ssgoi-shell">
    <Ssgoi :config="config">
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
    { on: "/posts/**", except: "/posts", transition: drill() },
    { from: "/gallery", to: "/gallery/*", transition: zoom() },
    { ordered: ["/tabs/a", "/tabs/b"], transition: slide() },
  ],
};
```

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
