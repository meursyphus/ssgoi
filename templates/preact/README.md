# Preact + SSGOI starter

A Vite + TypeScript app using native Preact 10, `preact-iso` 2, and
`@ssgoi/preact`. It has real URL routes (`/`, `/about`, and a not-found page),
ordinary links, browser Back/Forward, and a stable transition provider.

## Run from this repository

Use Node 20.19+ or 22.12+ and pnpm 10.13.1. From the repository root:

```sh
pnpm install
pnpm --filter @ssgoi/core build
pnpm --filter @ssgoi/preact build
pnpm template:preact
```

Open the local URL printed by Vite. Validation and production preview:

```sh
pnpm --filter ssgoi-preact-template typecheck
pnpm --filter ssgoi-preact-template build
pnpm --filter ssgoi-preact-template preview
```

The production output is `templates/preact/dist`. Configure your static host to
serve `index.html` for unknown paths so refreshing `/about` or opening it directly
works. Vite's development and preview servers already support this SPA fallback.

## Copy into a standalone project before publication

The template's `workspace:*` dependency intentionally uses this checkout's
adapter. New adapter packages may not exist on npm until the next release;
replacing it with a version string is not enough before publication.

Build and pack both core and adapter from the repository root:

```sh
pnpm --filter @ssgoi/core build
pnpm --filter @ssgoi/preact build
mkdir -p /tmp/ssgoi-preact-packs
pnpm --filter @ssgoi/core pack --pack-destination /tmp/ssgoi-preact-packs
pnpm --filter @ssgoi/preact pack --pack-destination /tmp/ssgoi-preact-packs
```

Copy this template's source files to a directory outside the monorepo (omit
`node_modules` and `dist`). In the copied `package.json`, replace
`"@ssgoi/preact": "workspace:*"` with the generated adapter tarball path:

```json
"@ssgoi/preact": "file:/tmp/ssgoi-preact-packs/ssgoi-preact-7.4.1.tgz"
```

Create a `pnpm-workspace.yaml` in that standalone directory to force the adapter's
transitive core dependency to the matching local build:

```yaml
packages:
  - .
overrides:
  "@ssgoi/core": "file:/tmp/ssgoi-preact-packs/ssgoi-core-7.4.1.tgz"
```

Then run `pnpm install`, `pnpm dev`, or `pnpm build` there. Use the actual tarball
filenames if package versions change. After the adapter is published, use
`pnpm add @ssgoi/preact@<published-version>` and remove the local core override.

## Verify routing and state

1. Enter a **Shell draft** and a **Page note**, then increment **Page count**.
2. Follow **Toggle view query**. The URL becomes `/?view=compact`; the page note
   and count remain because the pathname and boundary key did not change.
3. Follow **About**. The URL becomes `/about`, outgoing/incoming pages animate,
   and the shell draft remains. The transition status returns to **Ready**.
4. Use browser Back/Forward or the matching demo buttons. History entries render
   the correct page. Returning to Home creates a fresh page note/count; it does
   not pretend to cache unmounted component state.
5. Refresh `/about`, visit an unknown path, and use its Return home link.

A transition keeps the outgoing DOM visible until animation completes. Its
Preact component has already unmounted, so it is not a live page cache. Query-only
updates preserve page-local state; persistent shell state survives route changes.

## Where the integration lives

`src/app.tsx` defines the stable config and provider, reads `useLocation().path`,
and passes that pathname to `SsgoiRouteBoundary`. The boundary owns the key and
replaces the page's HTML element when the path changes. Router matching and
history remain with `preact-iso`; the adapter has no router dependency.

All routes in this starter are eager and synchronous. For lazy/data-suspending
routes, place boundaries inside committed route components so the outgoing page
survives until the next page is ready; do not key an entire loading router from
its requested URL. Hash/query changes are not separate page lifetimes here.

The core engine supplies fade playback and scroll policy. This starter does not
add competing router scroll restoration. The adapter supports browser light-DOM
HTML pages and Preact 10.23+; it does not claim Preact 11 or shadow-root routing.

[Preact routing documentation](https://preactjs.com/guide/v10/preact-iso/)
explains `LocationProvider`, `Router`, and ordinary-link interception.
