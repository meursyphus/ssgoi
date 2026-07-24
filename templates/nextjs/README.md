# SSGOI + Next.js

```bash
pnpm install
pnpm dev
```

## Structure

- `src/components/ssgoi-config.ts`: one transition config.
- `src/components/demo-layout.tsx`: one root `<Ssgoi>`.
- `src/components/ssgoi-transition-boundary.tsx`: pathname → key utility.
- `src/app/*/layout.tsx`: boundaries placed at persistent layout levels.

The boundary keeps the real pathname as the transition id. Its `scope`
function only controls the React key:

```tsx
<div key={scope(pathname)} data-ssgoi-transition={pathname}>
  {children}
</div>
```

Default scope returns the pathname and remounts on each route change.

## Product tabs

The products layout has two boundaries:

```tsx
<SsgoiTransitionBoundary scope={() => "products-layout"}>
  <ProductHeader />
  <ProductTabs />

  <SsgoiTransitionBoundary>{children}</SsgoiTransitionBoundary>
</SsgoiTransitionBoundary>
```

- Category → category: inner boundary slides; header and tabs stay.
- Products → another section: the outer products layout leaves.

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
