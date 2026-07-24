# SSGOI + Nuxt

```bash
pnpm install
pnpm dev
```

`utils/ssgoi-config.ts` contains one config. `components/demo-layout.vue`
creates one `<Ssgoi>`.

Pages mark their DOM roots:

```vue
<main data-ssgoi-transition="/posts">...</main>
```

`pages/products.vue` is the persistent outer boundary and renders child
category pages with `<NuxtPage />`. Child roots own category transitions;
leaving products uses the outer layout boundary.

Effects:

- Posts: `drill`.
- Product tabs: ordered `slide`.
- Gallery and profile: `zoom`.

Guide: https://ssgoi.dev/llms/vue.txt

```bash
pnpm build
```
