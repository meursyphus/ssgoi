# @ssgoi/qwik

Qwik bindings for SSGOI - native app-like page transitions for Qwik and Qwik City.

Full setup reference for AI agents:

https://ssgoi.dev/llms.txt

## Install

```bash
npm install @ssgoi/qwik
```

## Qwik City

Qwik serializes component state for resumability, while SSGOI transition configs contain functions. Pass the config as a QRL factory (`config$`) so the adapter can resolve it in the browser before starting the DOM observer.

Use `useSsgoi(ref, { config$ })` directly in the Qwik City layout that owns the route `<Slot />`:

```tsx
import { $, Slot, component$, useSignal } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { useSsgoi } from "@ssgoi/qwik";
import { drill, zoom } from "@ssgoi/qwik/view-transitions";

const ssgoiConfig$ = $(() => ({
  preserveScroll: { exclude: ["/posts/*"] },
  transitions: [
    zoom({ paths: ["/gallery", "/gallery/*"], type: "expand" }),
    drill({ enter: "/posts/*", exit: "/posts" }),
  ],
}));

export default component$(() => {
  const location = useLocation();
  const ssgoiRoot = useSignal<HTMLElement>();

  useSsgoi(ssgoiRoot, { config$: ssgoiConfig$ });

  return (
    <main
      ref={ssgoiRoot}
      class="relative z-0 h-dvh overflow-y-auto overflow-x-clip"
    >
      <Slot />
      <Link href="/posts/">Posts</Link>
      <p>{location.url.pathname}</p>
    </main>
  );
});
```

Set `data-ssgoi-transition` directly on each routed page boundary. The value only needs to match the `paths`, `from`, or `to` values in your config:

```tsx
export default component$(() => {
  return (
    <section data-ssgoi-transition="/posts" class="min-h-full">
      Posts
    </section>
  );
});
```

Import view-level factories from `@ssgoi/qwik/view-transitions`.

## Qwik City Notes

- Declare configs with Qwik `$`, for example `const config$ = $(() => ({ transitions: [...] }))`. Do not pass a plain config object through component props.
- Keep the route `<Slot />` inside the same layout element observed by `useSsgoi`.
- Mark pages directly with `data-ssgoi-transition`; do not put one generic boundary around the parent `<Slot />`.
- Put layout-shell classes such as `relative z-0 overflow-x-clip` on the SSGOI root/scroll container, not on every page marker.

`Ssgoi` is also exported for wrapping concrete children outside Qwik City routing. In Qwik City layouts, prefer `useSsgoi` because forwarding a route `<Slot />` through another component can prevent routed content from being projected into the live DOM during navigation.

## Troubleshooting

If route navigation works but no transition runs:

1. Confirm the layout calls `useSsgoi(ssgoiRoot, { config$ })`.
2. Confirm `config$` is created with Qwik `$`.
3. Confirm the SSGOI root contains the route `<Slot />` directly.
4. Confirm every routed page has a `data-ssgoi-transition` value that matches your transition config.
