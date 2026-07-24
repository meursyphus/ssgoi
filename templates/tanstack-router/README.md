# SSGOI + TanStack Router

```bash
pnpm install
pnpm dev
```

## Structure

- `app/components/ssgoi-config.ts`: one transition config.
- `app/components/demo-layout.tsx`: one root `<Ssgoi>`.
- `app/components/ssgoi-transition-boundary.tsx`: reads router state.
- Parent route files place boundaries around `<Outlet />`.

```tsx
const pathname = useRouterState({
  select: (state) => state.location.pathname,
});

return (
  <div key={scope(pathname)} data-ssgoi-transition={pathname}>
    {children}
  </div>
);
```

The products parent route keeps its outer layout key stable and keys only the
inner content by pathname. Ordered paths in the root config decide slide
direction.

Effects:

- Posts: `drill`.
- Product tabs: ordered `slide`.
- Gallery and profile: `zoom`.

Guide: https://ssgoi.dev/llms.txt#8-other-frameworks

```bash
pnpm typecheck
pnpm build
```
