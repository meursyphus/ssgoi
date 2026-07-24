# SSGOI + SolidStart

```bash
pnpm install
pnpm dev
```

The root app creates one `<Ssgoi>` with `src/ssgoi-config.ts`.

Route components mark their DOM roots:

```tsx
<main data-ssgoi-transition="/posts">...</main>
```

The products route layout has an outer marker and each product category page
has an inner marker. SolidStart keeps the outer layout mounted during category
navigation, so only the inner content slides. Leaving products uses the outer
boundary.

Effects:

- Posts: `drill`.
- Product tabs: ordered `slide`.
- Gallery and profile: `zoom`.

Guide: https://ssgoi.dev/llms/solid.txt

```bash
pnpm typecheck
pnpm build
```
