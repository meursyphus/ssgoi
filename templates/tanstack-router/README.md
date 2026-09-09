# SSGOI + TanStack Router

Import `SsgoiRouteBoundary` from `@ssgoi/react/tanstack-router`. The router is an
optional peer and is loaded only by this entry.

```bash
pnpm install
pnpm dev
```

## Structure

- `app/components/ssgoi-config.ts`: one transition config.
- `app/components/demo-layout.tsx`: one root `<Ssgoi>` inside a
  `relative z-0 overflow-x-clip` shell.
- `@ssgoi/react/tanstack-router`: the shipped pathname boundary.
- Route layouts place a stable shell boundary around a pathname child boundary.

```tsx
<SsgoiRouteBoundary routeKey="products-layout">
  <ProductHeaderAndTabs />
  <SsgoiRouteBoundary>
    <Outlet />
  </SsgoiRouteBoundary>
</SsgoiRouteBoundary>
```

The products route owns the stable outer lifetime. Its marker follows the full
pathname while category navigation replaces only the inner content. The root
contains one provider; it does not remount the products shell for each tab.

Effects:

- Posts: `drill`.
- Product tabs: ordered `slide`.
- Gallery and profile: `zoom`.

Guide: https://ssgoi.dev/llms/frameworks/tanstack-router.txt

```bash
pnpm typecheck
pnpm build
```
