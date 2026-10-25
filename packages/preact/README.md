# @ssgoi/preact

Native Preact page transitions backed by the shared SSGOI engine. Uses `preact`,
`preact/hooks`, and `preact/jsx-runtime` directly; React and `preact/compat` are not
required. Supports Preact 10.23 and newer 10.x releases.

## Installation

Before this new adapter is published, use the [workspace template](../../templates/preact)
or its README’s local core + adapter tarball instructions. After publication:

```sh
npm install @ssgoi/preact preact
```

Use your application's Preact JSX configuration (`jsxImportSource: "preact"` in
TypeScript). Start with a standard Preact + TypeScript Vite app if needed.

## Runnable template

The [Preact starter](../../templates/preact) includes Vite, TypeScript, real
preact-iso URL routing, Back/Forward, and examples of persistent shell state and
query-only page state preservation. Its README covers workspace setup and
standalone installation using local package tarballs before publication.

## Runnable example

Replace the app's `src/main.tsx` with the following. The host HTML needs
`<div id="app"></div>`. The two buttons demonstrate page changes without a router.

```tsx
import { render } from "preact";
import { useState } from "preact/hooks";
import {
  Ssgoi,
  SsgoiRouteBoundary,
  useSsgoiTransition,
  type SsgoiConfig,
} from "@ssgoi/preact";
import { fade } from "@ssgoi/preact/view-transitions";

const config: SsgoiConfig = {
  transitions: [{ on: "/**", transition: fade() }],
};

function TransitionStatus() {
  const transition = useSsgoiTransition();
  return <output aria-live="polite">{transition.status}</output>;
}

function App() {
  const [page, setPage] = useState("/home");
  return (
    <div
      style={{
        position: "relative",
        zIndex: 0,
        minHeight: "100dvh",
        overflowX: "clip",
      }}
    >
      <nav>
        <button onClick={() => setPage("/home")}>Home</button>
        <button onClick={() => setPage("/about")}>About</button>
      </nav>
      <Ssgoi config={config}>
        <TransitionStatus />
        <SsgoiRouteBoundary id={page} as="main">
          <h1>{page === "/home" ? "Home" : "About"}</h1>
          <p>Native Preact, shared SSGOI transitions.</p>
        </SsgoiRouteBoundary>
      </Ssgoi>
    </div>
  );
}

render(<App />, document.getElementById("app")!);
```

## API and router integration

- `Ssgoi` accepts `config`, optional `host` (a shared core `HostAnimation`), and
  children. It renders a `display: contents` root. Keep it mounted above your
  changing pages, and keep the config object stable. Changing config or host
  disconnects the previous context and starts a fresh one.
- `SsgoiRouteBoundary` accepts a logical path as `id`, optional `routeKey`, an HTML
  tag as `as` (default `div`), and HTML attributes. Its HTML element is keyed by
  `routeKey ?? id`. Changing the key replaces that element and its child page
  instance, enabling an outgoing/arriving pair. `id` is the transition path, not
  a DOM `id` attribute.
- `useSsgoiTransition()` subscribes to the nearest provider and returns
  `{ status, from, to, direction }`. Status is `idle` or `transitioning`.
  Subscription cleanup happens on provider changes and unmount. It throws
  outside a provider. Defer programmatic scrolling until the state is idle.
- `SsgoiTransition` is a compatibility marker component matching the existing
  adapters. Prefer `SsgoiRouteBoundary` or a keyed HTML element with
  `data-ssgoi-transition`. The marker component does not key itself.
- Core presets, motion helpers, animation classes, and types are re-exported.
  `@ssgoi/preact/view-transitions` and `@ssgoi/preact/types` mirror the shared
  adapter entry points. Shared-element presets use the same core data
  attributes and configuration as the other web adapters.

With a router, keep the provider in its persistent shell and pass the current
pathname to `SsgoiRouteBoundary`. Render the route's own content inside the
boundary. This package does not depend on or ship a router-specific binding.
If query changes represent separate page instances, supply a distinct
`routeKey`; otherwise keep the key stable to preserve inputs and local state.
Do not key the provider itself. A raw marker is also supported:

```tsx
<Ssgoi config={config}>
  <main key={pathname} data-ssgoi-transition={pathname}>
    {pageContent}
  </main>
</Ssgoi>
```

## SSR and lifecycle

Server rendering with `preact-render-to-string` produces ordinary markup and an
idle state without accessing the DOM. Hydrate the same provider and page tree
with Preact's `hydrate`. Observation starts in `useLayoutEffect` after the DOM
commit and disconnects on unmount. Nested providers own only their own page
boundaries. Core retains the outgoing DOM while animating; the outgoing Preact
component has already unmounted, so its effects and event handlers are not
retained as an interactive cached page.

This adapter targets browser HTML elements. Full page reloads cannot animate
between separate documents. Shadow roots need their own integration, and
router-specific scroll restoration must not fight the transition's scroll
policy. Preact 11 is not yet included in the supported peer range. Lifecycle,
SSR, and hydration tests use jsdom and a controlled animation host; real browser
visual behavior still needs application-level verification.

## Development

```sh
pnpm --filter @ssgoi/core build
pnpm --filter @ssgoi/preact build
pnpm --filter @ssgoi/preact test:run
```

The integration follows Preact's official documentation for
[native hooks and layout effects](https://preactjs.com/guide/v10/hooks/),
[DOM refs](https://preactjs.com/guide/v10/refs/), and
[server rendering](https://preactjs.com/guide/v10/server-side-rendering/).
