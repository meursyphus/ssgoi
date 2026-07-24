# SSGOI + SvelteKit

```bash
pnpm install
pnpm dev
```

The root layout uses one config from `src/lib/ssgoi-config.ts` and one
`<Ssgoi>`.

Route pages mark their DOM roots:

```svelte
<main data-ssgoi-transition="/posts">...</main>
```

`routes/products/+layout.svelte` is the persistent outer boundary. Product
category pages render an inner boundary. SvelteKit keeps the outer layout
mounted while child routes change, so the header and tabs remain still while
the content slides.

Effects:

- Posts: `drill`.
- Product tabs: ordered `slide`.
- Gallery and profile: `zoom`.

Guide: https://ssgoi.dev/llms/svelte.txt

```bash
pnpm check
pnpm build
```
