# @ssgoi/qwik

Native app-like page transitions for Qwik and Qwik Router. Make a web app, PWA or WebView app (Capacitor, Tauri, Ionic) feel like a native app without replacing your router.

[![SSGOI live showcase](https://ssgoi.dev/readme.png)](https://ssgoi.dev)

[Live demos](https://ssgoi.dev) · [Hero, Zoom, Film, and Sheet in motion](https://ssgoi.dev/blog/view-transition-api-limitations)

```bash
npm install @ssgoi/qwik
```

Agent setup guide: https://ssgoi.dev/llms/qwik.txt

## Qwik 2 compatibility

Built against Qwik 2.0.0-rc.2 (`@qwik.dev/core` and `@qwik.dev/router`), using
Vite 8 and Node.js 20.19+ or 22.12+. Keep the core and router on matching Qwik
versions. Qwik 1 / `@builder.io/*` apps must migrate before upgrading this adapter.
The package now ships ESM, matching Qwik 2; use `import` instead of `require`.

The old `@ssgoi/qwik/qwik-city` import remains as a deprecated alias to the
Qwik 2 helper; it does not load or support Qwik City 1.

## Router helpers

Install this framework package once; router helpers are optional subpaths.
These router helpers are experimental APIs and may change.

| Router      | Import                    | API                     |
| ----------- | ------------------------- | ----------------------- |
| Qwik Router | `@ssgoi/qwik/qwik-router` | `useSsgoiRouteBoundary` |

See the [framework guide](https://ssgoi.dev/docs/frameworks/qwik) for wiring and limits.

## Root

Qwik configs contain functions, so pass a QRL factory.

```tsx
import { $, Slot, component$, useSignal } from "@qwik.dev/core";
import { useSsgoi } from "@ssgoi/qwik";
import { drill } from "@ssgoi/qwik/view-transitions";

const config$ = $(() => ({
  transitions: [{ on: "/posts/**", except: "/posts", transition: drill() }],
}));

export default component$(() => {
  const root = useSignal<HTMLElement>();
  useSsgoi(root, { config$ });

  return (
    <main ref={root} class="relative z-0 min-h-dvh overflow-x-clip">
      <Slot />
    </main>
  );
});
```

## Route boundary

Use the experimental Qwik Router helper on the page's own root:

```tsx
import { component$ } from "@qwik.dev/core";
import { useSsgoiRouteBoundary } from "@ssgoi/qwik/qwik-router";

export default component$(() => {
  const boundary = useSsgoiRouteBoundary();
  return (
    <section key={boundary.value.key} data-ssgoi-transition={boundary.value.id}>
      Page
    </section>
  );
});
```

The key replaces the root when City reuses a parameterized page. A stable key
can be passed for a persistent shell. Keep Slot ownership in the route/layout.

## Persistent layouts

Put an outer marker in the persistent route layout and markers on child route
roots:

```tsx
export default component$(() => {
  const location = useLocation();
  const pathname = location.url.pathname.replace(/\/$/, "");

  return (
    <section data-ssgoi-transition={pathname}>
      <ProductTabs />
      <Slot />
    </section>
  );
});
```

Qwik Router replaces child route roots under `<Slot />`. Child navigation uses
the child boundary; leaving the layout uses the outer boundary.

## Config

```tsx
import { $ } from "@qwik.dev/core";
import { drill, slide, zoom } from "@ssgoi/qwik/view-transitions";

const config$ = $(() => ({
  transitions: [
    {
      on: "/posts/**",
      except: "/posts",
      transition: drill(),
    },
    {
      from: "/gallery",
      to: "/gallery/*",
      transition: zoom(),
    },
    {
      ordered: ["/tabs/a", "/tabs/b"],
      transition: slide(),
    },
  ],
}));
```

Scroll is automatic: `on` and `from`/`to` restore `from` and reset `to`;
`ordered` restores both. Override with
`preserveScroll: { from: boolean, to: boolean }`, or share one position across
the rule's pages with `preserveScroll: "shared"`.

## Effect index

- `fade`: unrelated pages.
- `drill`: list → detail.
- `slide` or `axis`: ordered tabs.
- `sheet`: modal-like routes.
- `zoom` or `hero`: shared-element details.
- `scroll`: vertical sequences.

All effects: https://ssgoi.dev/llms.txt#7-transition-index

`Ssgoi` remains available for concrete projected children. In Qwik Router route
layouts, prefer `useSsgoi()` so `<Slot />` stays directly under the observed
root.

## License

MIT
