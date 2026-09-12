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

## Shared boundary contract

This template uses the shipped adapter directly in every routed section;
there is no local keyed-DOM wrapper. The React Router, TanStack Router,
SvelteKit, and Nuxt templates use their corresponding router entries with
the same `{ id, key? }` resolver contract.

For an application with named boundaries, keep its policy in a client component:

```tsx
<SsgoiRouteBoundary
  resolve={(location) => resolveBoundary("app-shell", location)}
  fallback={<div className="min-h-px" aria-hidden="true" />}
>
  {children}
</SsgoiRouteBoundary>
```

`resolveBoundary` is application code, not an extra library API. Next.js passes
both `pathname` and the owning layout's `selectedSegments`. Use
`selectedSegmentsToPath(selectedSegments, projectBase)` from the same entry for
a nested slot; a soft `@modal` navigation must keep its background's slot id
and key even though the browser URL changes. An empty slot is the index route.
The adapter includes Suspense for Cache Components, but the template leaves
Cache Components disabled so it also demonstrates ordinary App Router setup.

The complete policy example is in
[complex routing](https://ssgoi.dev/llms/complex-routing.txt).

## Verify boundary ownership

- Shop → Tech → Fashion: the product header and tabs keep their DOM; only the
  inner boundary changes. Its outgoing DOM still contains the old category.
- Shop → Posts: the products shell leaves and the post boundary enters.
- Post list → detail → browser Back: the real routed roots leave and enter,
  and the list scroll position is restored.
- Query-only navigation keeps a boundary mounted by default.

The React adapter regression suite also covers an app shell shared across
top-level tabs, per-project shell lifetimes, intercepted modal open/back/forward,
direct detail entry, index backgrounds, nested sidebars, and unresolved URLs:

```bash
pnpm --filter @ssgoi/react test:run
```

Full boundary guide: https://ssgoi.dev/llms.txt

```bash
pnpm lint
pnpm build
```
