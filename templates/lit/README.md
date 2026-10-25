# SSGOI + Lit template

A runnable Lit 3 / TypeScript / Vite app with light-DOM page transitions. It uses normal links, `history.pushState`, and `popstate`; no router dependency is needed. The journal has a home page, a list, a detail page, an editable input, and browser Back/Forward controls.

## Run from this repository

```sh
pnpm install
pnpm --filter @ssgoi/core build
pnpm --filter @ssgoi/lit build
pnpm template:lit
```

Open the Vite URL. Follow **Open the journal**, open the story, then use your browser's Back and Forward buttons or the page controls. Each navigation updates the URL and replaces the keyed page while keeping the controller mounted. Directly opening `/journal/studio-notes` also works with Vite.

```sh
pnpm --filter ssgoi-lit-template typecheck
pnpm --filter ssgoi-lit-template build
pnpm --filter ssgoi-lit-template preview
```

## Copying this template

`@ssgoi/lit` is a new adapter proposed by this change; the template's `workspace:*` dependency is for this monorepo and cannot be installed by itself. Until the adapter is published, run it from this checkout or replace the workspace dependency with a locally packed adapter **and core**. After publication, replace `workspace:*` with an available published `@ssgoi/lit` version before installing a standalone copy. Lit and Vite are ordinary registry dependencies.

A production static host must rewrite application routes to `index.html` for direct entry and refresh. This template assumes deployment at the origin root. Browser Back can leave the application when there is no earlier in-app entry; Forward is a no-op when no forward entry exists.

## How it works

- `src/main.ts` creates one stable `SsgoiController` with a stable `fade()` configuration. `ref(this.ssgoi.ref)` attaches it to a persistent root and `keyed(this.path, ...)` gives each path a new page boundary.
- Page transitions require light DOM: `createRenderRoot()` returns the host. Core's document observer cannot see page removals inside a shadow root. Keep route boundaries and shared-element targets in this same light tree. The app stylesheet is global and does not use shadow-only `static styles`.
- Internal primary clicks call `pushState` and update the committed pathname. Modified clicks, new-tab links, downloads, external origins, and hash links retain native behavior. `popstate` reads the URL after browser Back/Forward. The listener is removed when the host disconnects.
- `src/style.css` gives the root `position: relative`, `z-index: 0`, `min-height: 100dvh`, and `overflow-x: clip`. Header and footer remain outside the keyed page.
- The footer reads `controller.state.status`. Core retains the outgoing DOM until playback settles; there should be one page when the status returns to `idle`.
- The home input is deliberately uncontrolled. Its text survives same-route renders but resets when leaving and returning, because the page instance is new. A real app can store drafts separately if they need to survive navigation.

The template is client-rendered. The adapter supports server-safe imports and controller construction, but this example does not configure SSR or hydration. See the [adapter guide](../../packages/lit/README.md) for element animation directives and lifecycle details.
