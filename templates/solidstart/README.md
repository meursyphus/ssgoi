# SSGOI + SolidStart

```bash
pnpm install
pnpm dev
```

The root app creates one `<Ssgoi>` with `src/ssgoi-config.ts` and one
centralized route boundary:

```tsx
<Ssgoi config={ssgoiConfig}>
  <SsgoiTransitionBoundary getId={getRootTransitionId}>
    {props.children}
  </SsgoiTransitionBoundary>
</Ssgoi>
```

The root boundary maps every `/products/*` URL to `/products`. The persistent
products route wraps its child route in a second boundary, so category
navigation replaces only the inner content while the header and tabs stay
mounted.

Effects:

- Posts: `drill`.
- Product tabs: ordered `slide`.
- Gallery and profile: `zoom`.

Guide: https://ssgoi.dev/llms/solid.txt

```bash
pnpm typecheck
pnpm build
```
