# SSGOI + Next.js

Import `SsgoiRouteBoundary` from `@ssgoi/react/nextjs`. The router is an
optional peer and is loaded only by this entry.

```bash
pnpm install
pnpm dev
```

## Structure

- `src/components/ssgoi-config.ts`: one transition config.
- `src/components/demo-layout.tsx`: one root `<Ssgoi>`.
- `@ssgoi/react/nextjs`: shipped pathname boundary with Suspense.
- `src/app/*/layout.tsx`: boundaries placed at persistent layout levels.

The default boundary uses the pathname for its id and key. `routeKey` keeps a
layout shell mounted while its transition id follows the actual route.

## Product tabs

The products layout has two boundaries:

```tsx
<SsgoiRouteBoundary routeKey="products-layout">
  <ProductHeader />
  <ProductTabs />

  <SsgoiRouteBoundary>{children}</SsgoiRouteBoundary>
</SsgoiRouteBoundary>
```

- Category → category: inner boundary slides; header and tabs stay.
- Products → another section: the outer products layout leaves.

The constant outer key is safe here because `app/products/layout.tsx` itself
unmounts outside `/products`. If the boundary moves into a common app layout,
its resolve callback must return `"products-layout"` only for product category
paths and a different key for routes outside them.

Direction comes from the single config:

```ts
{
  ordered: PRODUCT_CATEGORIES.map((category) => category.path),
  transition: slide(),
}
```

`ordered` routes restore scroll automatically. `on` and `from`/`to` rules
restore the forward source and reset the forward destination.

## Other demos

- Posts: `drill` for list → detail.
- Gallery: expanding `zoom`.
- Profile: static `zoom`.

Full boundary guide: https://ssgoi.dev/llms.txt

```bash
pnpm lint
pnpm build
```
