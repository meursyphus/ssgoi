# @ssgoi/solid

Solid and SolidStart bindings for SSGOI.

[![SSGOI live showcase](https://ssgoi.dev/readme.png)](https://ssgoi.dev)

[Live demos](https://ssgoi.dev) · [Hero, Zoom, Film, and Sheet in motion](https://ssgoi.dev/blog/view-transition-api-limitations)

```bash
npm install @ssgoi/solid
```

Agent setup guide: https://ssgoi.dev/llms/solid.txt

## Root

Use one `<Ssgoi>` around file routes.

```tsx
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Ssgoi } from "@ssgoi/solid";
import { drill } from "@ssgoi/solid/view-transitions";

const config = {
  transitions: [{ on: "/posts/**", except: "/posts", transition: drill() }],
};

export default function App() {
  return (
    <Router
      root={(props) => (
        <main class="relative z-0 min-h-dvh overflow-x-clip">
          <Ssgoi config={config}>{props.children}</Ssgoi>
        </main>
      )}
    >
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
    { on: "/posts/**", except: "/posts", transition: drill() },
    { from: "/gallery", to: "/gallery/:id", transition: zoom() },
    { ordered: ["/tabs/a", "/tabs/b"], transition: slide() },
  ],
};
```

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
