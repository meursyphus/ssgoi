# SSGOI + React Router

```bash
pnpm install
pnpm dev
```

## Structure

- `app/components/ssgoi-config.ts`: one transition config.
- `app/components/demo-layout.tsx`: one root `<Ssgoi>` inside a
  `relative z-0 overflow-x-clip` shell.
- `app/components/ssgoi-route-boundary.tsx`: name → route id/key resolver
  using `useLocation()`.
- `app/routes/page-boundary.layout.tsx`: standard named page boundary.
- `app/routes/products_.layout.tsx`: persistent product shell plus inner tab
  boundary.

Layouts pass a semantic name; the boundary resolver owns the key policy:

```tsx
const { pathname } = useLocation();
const boundary = resolveBoundary(name, pathname);

return (
  <div key={boundary.key} data-ssgoi-transition={boundary.id}>
    {children}
  </div>
);
```

`page` uses the pathname for both values. `products-shell` returns a stable
outer key because the products layout owns that boundary's lifetime; its inner
`<Outlet />` uses `page`. Category navigation therefore slides only the inner
content.

Effects:

- Posts: `drill`.
- Product tabs: ordered `slide`.
- Gallery and profile: `zoom`.

Guide: https://ssgoi.dev/llms.txt#8-other-frameworks

```bash
pnpm typecheck
pnpm build
```
