# SSGOI + Qwik City

```bash
pnpm install
pnpm dev
```

`src/lib/ssgoi-config.ts` exports one QRL config factory. The root route layout
calls `useSsgoi(root, { config$ })`.

Route components mark their DOM roots:

```tsx
<main data-ssgoi-transition="/posts">...</main>
```

The products route layout is the persistent outer boundary. Category route
components under `<Slot />` render inner boundaries. Child navigation slides
the inner content; leaving products uses the outer boundary.

Effects:

- Posts: `drill`.
- Product tabs: ordered `slide`.
- Gallery and profile: `zoom`.

Guide: https://ssgoi.dev/llms/qwik.txt

```bash
pnpm build.types
pnpm build
```
