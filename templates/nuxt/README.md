# SSGOI + Nuxt

Import `SsgoiRouteBoundary` from `@ssgoi/vue/nuxt`. The router is an
optional peer and is loaded only by this entry.

```bash
pnpm install
pnpm dev
```

`utils/ssgoi-config.ts` contains one config. `components/demo-layout.vue`
creates one `<Ssgoi>` and one centralized route boundary:

```vue
<Ssgoi :config="ssgoiConfig">
  <SsgoiRouteBoundary :resolve="({ pathname }) => ({ id: pathname, key: getRootTransitionId(pathname) })">
    <slot />
  </SsgoiRouteBoundary>
</Ssgoi>
```

The root boundary keeps a `/products` key for that route family while its id tracks the real pathname.
`pages/products.vue` remains mounted and wraps its `<NuxtPage />` in a second
boundary, so category navigation slides only the child content.

Effects:

- Posts: `drill`.
- Product tabs: ordered `slide`.
- Gallery and profile: `zoom`.

Guide: https://ssgoi.dev/llms/vue.txt

```bash
pnpm build
```

## Customize motion

Presets accept a second `{ override }` argument. This optional example retunes
only the backward direction; the template's default config remains unchanged.

```ts
import { drill, spring } from "@ssgoi/vue";

const tunedDrill = drill({}, {
  override: {
    backward({ animation }) {
      animation.set({ integrator: spring({ stiffness: 400, damping: 35 }) });
    },
  },
});
```

The core decides direction from route relationships and history. An explicit
list/detail rule also treats a fresh detail-to-list link as backward. Equal
from/to patterns use history direction. Keep zoom/hero enter and exit markers;
they identify expanded media and related thumbnails within those pages.

[Named groups and overlap](https://ssgoi.dev/docs/motion) ·
[Writing custom transitions with defineTransition](https://ssgoi.dev/docs/custom-transitions)
