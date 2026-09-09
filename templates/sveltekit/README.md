# SSGOI + SvelteKit

Import `SsgoiRouteBoundary` from `@ssgoi/svelte/sveltekit`. The router is an
optional peer and is loaded only by this entry.

```bash
pnpm install
pnpm dev
```

The root layout uses one config from `src/lib/ssgoi-config.ts` and one
`<Ssgoi>`. Its shipped route boundary owns the outgoing and incoming page
DOM:

```svelte
<Ssgoi config={ssgoiConfig}>
  <SsgoiRouteBoundary
    resolve={({ url }) => ({ id: url.pathname, key: getRootTransitionId(url) })}
  >
    {@render children()}
  </SsgoiRouteBoundary>
</Ssgoi>
```

The root boundary keeps a `/products` key for that route family while its id tracks the real pathname.
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
