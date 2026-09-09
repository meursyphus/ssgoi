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
