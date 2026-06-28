# @ssgoi/qwik

Qwik bindings for SSGOI - native app-like page transitions for Qwik and Qwik City.

Full setup reference for AI agents:

https://ssgoi.dev/llms.txt

## Install

```bash
npm install @ssgoi/qwik
```

## Qwik City

Qwik serializes component state for resumability, while SSGOI transition configs contain functions. Pass the config as a QRL factory so it is created in the browser when the observer starts.

```tsx
import { $, Slot, component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { Ssgoi } from "@ssgoi/qwik";
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

  return (
    <main class="relative z-0 h-dvh overflow-y-auto overflow-x-clip">
      <Ssgoi config$={ssgoiConfig$}>
        <Slot />
      </Ssgoi>
      <Link href="/posts/">Posts</Link>
      <p>{location.url.pathname}</p>
    </main>
  );
});
```

Set `data-ssgoi-transition` directly on each routed page boundary:

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
