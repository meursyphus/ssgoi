# SSGOI + TanStack Router

```bash
pnpm install
pnpm dev
```

## Structure

- `app/components/ssgoi-config.ts`: one transition config.
- `app/components/demo-layout.tsx`: one root `<Ssgoi>` inside a
  `relative z-0 overflow-x-clip` shell.
- `app/components/ssgoi-route-boundary.tsx`: name → route id/key resolver
  using router state.
- Parent route files select boundary names around `<Outlet />`.

```tsx
const pathname = useRouterState({
  select: (state) => state.location.pathname,
});
const boundary = resolveBoundary(name, pathname);

return (
  <div key={boundary.key} data-ssgoi-transition={boundary.id}>
    {children}
  </div>
);
```

`page` uses the pathname for both values. `products-shell` keeps the
route-owned outer layout key stable and the inner content uses `page`. Ordered
paths in the root config decide slide direction.

Effects:

- Posts: `drill`.
- Product tabs: ordered `slide`.
- Gallery and profile: `zoom`.

Guide: https://ssgoi.dev/llms.txt#8-other-frameworks

```bash
pnpm typecheck
pnpm build
```
