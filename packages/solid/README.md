# @ssgoi/solid

Native app-like page transitions for Solid and SolidStart. Make a web app, PWA or WebView app (Capacitor, Tauri, Ionic) feel like a native app without replacing your router.

[![SSGOI live showcase](https://ssgoi.dev/readme.png)](https://ssgoi.dev)

[Live demos](https://ssgoi.dev) · [Hero, Zoom, Film, and Sheet in motion](https://ssgoi.dev/blog/view-transition-api-limitations)

```bash
npm install @ssgoi/solid
```

Agent setup guide: https://ssgoi.dev/llms/solid.txt

## Layout boundary

Pass a reactive route getter to `<Ssgoi>` once (inside `<Router>`, see [Root](#root)),
then wrap routed content in `SsgoiLayoutBoundary`.

```tsx
import { SsgoiLayoutBoundary } from "@ssgoi/solid";

export default function ProductsLayout(props) {
  return (
    <SsgoiLayoutBoundary as="section">
      <div>{props.children}</div>
    </SsgoiLayoutBoundary>
  );
}
```

Each boundary marks the current path with `data-ssgoi-transition`. Nest them
freely: depth is automatic. Declare which paths share a layout in
`config.layouts`; the scope matched at a boundary's depth keeps its DOM, and
past the declared scopes a boundary remounts on every path change (the default
without `layouts`).

```ts
const TOP_LEVEL = ["/home", "/search", "/profile"];
const config = {
  layouts: [
    { paths: TOP_LEVEL }, // tabs share one depth-0 layout
    {
      paths: "/**",
      except: TOP_LEVEL,
      layouts: [{ paths: "/products/**" }], // depth-1 scope inside details
    },
  ],
  transitions: [/* ... */],
};
```

The first matching scope at each level wins. Single-segment captures (`*`,
`:id`, `[id]`) split instances, so `/projects/:id/**` keeps one layout per
project; `**` tails do not. `SsgoiLayoutBoundary` takes no SSGOI props (`as`
sets the element) and throws without `framework` on `<Ssgoi>`.

`SsgoiRouteBoundary` from `@ssgoi/solid/solid-router` and
`@ssgoi/solid/solidstart` is deprecated; use `SsgoiLayoutBoundary` with
`framework` instead.

See the [framework guide](https://ssgoi.dev/docs/frameworks/solid) for wiring and limits.

## Root

Use one `<Ssgoi>` around file routes.

```tsx
import { Router, useLocation, type RouteSectionProps } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Ssgoi } from "@ssgoi/solid";
import { drill } from "@ssgoi/solid/view-transitions";

const config = {
  transitions: [{ on: "/posts/**", except: "/posts", transition: drill() }],
};

function Root(props: RouteSectionProps) {
  const location = useLocation();

  return (
    <main class="relative z-0 min-h-dvh overflow-x-clip">
      <Ssgoi
        config={config}
        framework={{ getRoute: () => ({ pathname: location.pathname }) }}
      >
        {props.children}
      </Ssgoi>
    </main>
  );
}

export default function App() {
  return (
    <Router root={Root}>
      <FileRoutes />
    </Router>
  );
}
```

## Route boundary

Mark the DOM root owned by a route:

```tsx
export default function Posts() {
  return <section data-ssgoi-transition="/posts">Posts</section>;
}
```

Use the real route path for dynamic pages:

```tsx
<section data-ssgoi-transition={`/posts/${props.id}`}>...</section>
```

## Persistent layouts

Put one marker on the persistent layout and another on its child route.
SolidStart keeps the layout DOM while child routes change.

```tsx
export default function ProductsLayout(props) {
  const location = useLocation();

  return (
    <section data-ssgoi-transition={location.pathname}>
      <ProductTabs />
      <div>{props.children}</div>
    </section>
  );
}
```

Each child route marks its own page root. Child navigation uses the child
boundary; leaving the layout uses the outer boundary.

## Config

```ts
import { drill, slide, zoom } from "@ssgoi/solid/view-transitions";

const config = {
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
};
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

`SsgoiTransition` is deprecated. Use the data attribute directly.

## License

MIT
