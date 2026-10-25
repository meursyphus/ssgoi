# SSGOI + Mithril template

A runnable Vite app using `@ssgoi/mithril` and Mithril's own router. Navigate Collection → Item 1 → Item 2, increment the local counter, and use browser Back/Forward. The stable header and provider remain mounted; each pathname gets a fresh page boundary. Query/hash-only changes preserve the page by default.

## Run from this repository

```sh
pnpm install
pnpm --filter @ssgoi/core build
pnpm --filter @ssgoi/mithril build
pnpm --filter ssgoi-mithril-template dev
```

Open the URL printed by Vite. Production build and preview:

```sh
pnpm --filter ssgoi-mithril-template build
pnpm --filter ssgoi-mithril-template preview
```

The template uses `workspace:^` for the adapter so a checkout tests the local implementation. To copy it into a standalone app, replace that dependency with a published `@ssgoi/mithril` version once available, then install dependencies normally. This PR does not publish npm packages.

`src/main.ts` contains the stable provider, route table, keyed boundary and page components. `src/style.css` supplies the positioned, clipped layout shell. Hash routing uses Mithril's default `#!` prefix, so static hosting needs no pathname rewrites.

Experimental API: the optional `@ssgoi/mithril/router` helper. The provider and core presets live in the base entry point. See [the adapter guide](../../packages/mithril/README.md) for manual boundaries, state subscriptions and limitations.
