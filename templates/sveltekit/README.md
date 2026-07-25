# SSGOI + SvelteKit

```bash
pnpm install
pnpm dev
```

The root layout uses one config from `src/lib/ssgoi-config.ts` and one
`<Ssgoi>`. Its centralized route boundary owns the outgoing and incoming page
DOM:

```svelte
<Ssgoi config={ssgoiConfig}>
  <SsgoiTransitionBoundary getId={getRootTransitionId}>
    {@render children()}
  </SsgoiTransitionBoundary>
</Ssgoi>
```

The root boundary maps every `/products/*` URL to `/products`.
`routes/products/+layout.svelte` stays mounted and puts a second boundary
around its child route. Category navigation therefore replaces only the inner
boundary, keeping the header and tabs still while the content slides.

Effects:

- Posts: `drill`.
- Product tabs: ordered `slide`.
- Gallery and profile: `zoom`.

Guide: https://ssgoi.dev/llms/svelte.txt

```bash
pnpm check
pnpm build
```
