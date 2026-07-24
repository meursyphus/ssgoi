# SSGOI + React Router

```bash
pnpm install
pnpm dev
```

## Structure

- `app/components/ssgoi-config.ts`: one transition config.
- `app/components/demo-layout.tsx`: one root `<Ssgoi>`.
- `app/components/ssgoi-transition-boundary.tsx`: uses `useLocation()`.
- `app/routes/page-boundary.layout.tsx`: standard pathname boundary.
- `app/routes/products_.layout.tsx`: persistent product shell plus inner tab
  boundary.

The custom boundary maps pathname to a React key:

```tsx
const { pathname } = useLocation();

return (
  <div key={scope(pathname)} data-ssgoi-transition={pathname}>
    {children}
  </div>
);
```

The products layout returns a stable outer key and uses the pathname for its
inner `<Outlet />`. Category navigation slides only the inner content.

Effects:

- Posts: `drill`.
- Product tabs: ordered `slide`.
- Gallery and profile: `zoom`.

Guide: https://ssgoi.dev/llms.txt#8-other-frameworks

```bash
pnpm typecheck
pnpm build
```
