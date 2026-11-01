# @ssgoi/qwik

Native app-like page transitions for Qwik and Qwik City. Make a web app, PWA or WebView app (Capacitor, Tauri, Ionic) feel like a native app without replacing your router.

[![SSGOI live showcase](https://ssgoi.dev/readme.png)](https://ssgoi.dev)

[Live demos](https://ssgoi.dev) · [Hero, Zoom, Film, and Sheet in motion](https://ssgoi.dev/blog/view-transition-api-limitations)

```bash
npm install @ssgoi/qwik
```

Agent setup guide: https://ssgoi.dev/llms/qwik.txt

## Router integration

Pass Qwik City's location store to the root as `framework`; the layout
boundary hook reads it from SSGOI's context. The store is a value, so it
serializes like any other Qwik state.

See the [framework guide](https://ssgoi.dev/docs/frameworks/qwik) for wiring and limits.

## Root

Qwik configs contain functions, so pass a QRL factory.

```tsx
import { $, Slot, component$, useSignal } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { useSsgoi } from "@ssgoi/qwik";
import { drill } from "@ssgoi/qwik/view-transitions";

const config$ = $(() => ({
  transitions: [{ on: "/posts/**", except: "/posts", transition: drill() }],
}));

export default component$(() => {
  const root = useSignal<HTMLElement>();
  useSsgoi(root, { config$, framework: { location: useLocation() } });

  return (
    <main ref={root} class="relative z-0 min-h-dvh overflow-x-clip">
      <Slot />
    </main>
  );
});
```

With concrete children, `<Ssgoi config$={config$} framework={{ location: useLocation() }}>`
does the same.

## Layout boundary

Use the layout boundary hook on the page's own root:

```tsx
import { component$ } from "@builder.io/qwik";
import { useSsgoiLayoutBoundary } from "@ssgoi/qwik";

export default component$(() => {
  const boundary = useSsgoiLayoutBoundary();
  return (
    <section key={boundary.value.key} data-ssgoi-transition={boundary.value.id}>
      Page
    </section>
  );
});
```

The key replaces the root when City reuses a parameterized page. The id
defaults to the pathname and the key to the id. Pass a fixed key for a
persistent shell, `useSsgoiLayoutBoundary("products-layout")`, or a fixed id
and/or key, `useSsgoiLayoutBoundary({ id: "/feed" })`. Keep Slot ownership in
the route/layout.
Without `framework` on the root, the hook throws.

`useSsgoiRouteBoundary` from `@ssgoi/qwik/qwik-city` is deprecated and will be
removed in 8.0.0; it reads `useLocation()` itself and keeps working without
`framework`.

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

Qwik City replaces child route roots under `<Slot />`. Child navigation uses
the child boundary; leaving the layout uses the outer boundary.

## Config

```tsx
import { $ } from "@builder.io/qwik";
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

`Ssgoi` remains available for concrete projected children. In Qwik City route
layouts, prefer `useSsgoi()` so `<Slot />` stays directly under the observed
root.

## License

MIT
