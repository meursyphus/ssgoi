# SSGOI + Next.js

```bash
pnpm install
pnpm dev
```

## Structure

- `src/components/ssgoi-config.ts`: one transition config.
- `src/components/demo-layout.tsx`: one root `<Ssgoi>`.
- `src/components/ssgoi-route-boundary.tsx`: name → route id/key utility.
- `src/app/*/layout.tsx`: boundaries placed at persistent layout levels.

The template keeps route lifetime rules in the boundary resolver. Layouts pass
only a semantic name:

```tsx
const boundary = resolveBoundary(name, pathname);

<div key={boundary.key} data-ssgoi-transition={boundary.id}>
  {children}
</div>;
```

`page` uses the pathname for both values and remounts on every route change.
`products-shell` uses a stable key for the persistent products layout while
keeping the pathname as its transition id.

## Product tabs

The products layout has two boundaries:

```tsx
<SsgoiRouteBoundary name="products-shell">
  <ProductHeader />
  <ProductTabs />

  <SsgoiRouteBoundary name="page">{children}</SsgoiRouteBoundary>
</SsgoiRouteBoundary>
```

- Category → category: inner boundary slides; header and tabs stay.
- Products → another section: the outer products layout leaves.

The constant outer key is safe here because `app/products/layout.tsx` itself
unmounts outside `/products`. If the boundary moves into a common app layout,
its named resolver must return `"products-layout"` only for product category
paths and a different key for routes outside them.

Direction comes from the single config:

```ts
{
  ordered: PRODUCT_CATEGORIES.map((category) => category.path),
  transition: slide(),
}
```

## Other demos

- Posts: `drill` for list → detail.
- Gallery: expanding `zoom`.
- Profile: static `zoom`.

Full boundary guide: https://ssgoi.dev/llms.txt

```bash
pnpm lint
pnpm build
```
