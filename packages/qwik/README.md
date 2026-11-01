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

Call the layout boundary hook in a route layout or page and apply it to that
component's own root. It takes no arguments:

```tsx
import { Slot, component$ } from "@builder.io/qwik";
import { useSsgoiLayoutBoundary } from "@ssgoi/qwik";

export default component$(() => {
  const boundary = useSsgoiLayoutBoundary();
  return (
    <section key={boundary.value.key} data-ssgoi-transition={boundary.value.id}>
      <Slot />
    </section>
  );
});
```

The id is the route path. Depth is automatic: a boundary under another one is
one level deeper. Its key is that depth's scope instance from `config.layouts`,
or the route path when the chain is shorter, so without `layouts` every
boundary replaces its root on each path change, including parameterized pages
City reuses. Keep Slot ownership in the route/layout. Without `framework` on
the root, the hook throws.

## Layout scopes

Declare the layout tree in the config. At each level the first matching scope
wins; `layouts` nests inside it. A boundary stays mounted while navigation
stays inside its depth's scope instance (values captured by `*` / `:id` are
part of the instance; `**` tails are not):

```tsx
const TOP_LEVEL = ["/posts", "/products"];

const config$ = $(() => ({
  layouts: [
    { paths: TOP_LEVEL },
    { paths: "/**", except: TOP_LEVEL, layouts: [{ paths: "/products/*/**" }] },
  ],
  transitions: [/* ... */],
}));
```

Here a depth-0 boundary in the root layout keeps the tab shell (and its bottom
nav) mounted between `/posts` and `/products`, and moves it as a whole into a
detail page. A depth-1 boundary inside `/products/:category/...` stays mounted
across that category's pages.

`useSsgoiRouteBoundary` from `@ssgoi/qwik/qwik-city` is deprecated and will be
removed in 8.0.0; it reads `useLocation()` itself and keeps working without
`framework`.

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
