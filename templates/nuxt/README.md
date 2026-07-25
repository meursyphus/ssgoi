# SSGOI + Nuxt

```bash
pnpm install
pnpm dev
```

`utils/ssgoi-config.ts` contains one config. `components/demo-layout.vue`
creates one `<Ssgoi>` and one centralized route boundary:

```vue
<Ssgoi :config="ssgoiConfig">
  <SsgoiTransitionBoundary :get-id="getRootTransitionId">
    <slot />
  </SsgoiTransitionBoundary>
</Ssgoi>
```

The root boundary maps every `/products/*` URL to `/products`.
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
