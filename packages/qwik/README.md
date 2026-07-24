# @ssgoi/qwik

Qwik and Qwik City bindings for SSGOI.

[![SSGOI live showcase](https://ssgoi.dev/readme.png)](https://ssgoi.dev)

[Live demos](https://ssgoi.dev) · [Hero, Zoom, Film, and Sheet in motion](https://ssgoi.dev/blog/view-transition-api-limitations)

```bash
npm install @ssgoi/qwik
```

Agent setup guide: https://ssgoi.dev/llms/qwik.txt

## Root

Qwik configs contain functions, so pass a QRL factory.

```tsx
import { $, Slot, component$, useSignal } from "@builder.io/qwik";
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

Mark route component roots:

```tsx
export default component$(() => (
  <section data-ssgoi-transition="/posts">Posts</section>
));
```

Dynamic route:

```tsx
<section data-ssgoi-transition={`/posts/${postId}`}>...</section>
```

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
    { on: "/posts/**", except: "/posts", transition: drill() },
    { from: "/gallery", to: "/gallery/*", transition: zoom() },
    { ordered: ["/tabs/a", "/tabs/b"], transition: slide() },
  ],
}));
```

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
