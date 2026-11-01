# @ssgoi/svelte

Native app-like page transitions for Svelte and SvelteKit. Make a web app, PWA or WebView app (Capacitor, Tauri, Ionic) feel like a native app without replacing your router.

[![SSGOI live showcase](https://ssgoi.dev/readme.png)](https://ssgoi.dev)

[Live demos](https://ssgoi.dev) · [Hero, Zoom, Film, and Sheet in motion](https://ssgoi.dev/blog/view-transition-api-limitations)

```bash
npm install @ssgoi/svelte
```

Agent setup guide: https://ssgoi.dev/llms/svelte.txt

## Router wiring

Install this framework package once. The root entry never imports a router:
pass the router members SSGOI needs through `<Ssgoi framework>`.

The `@ssgoi/svelte/sveltekit` subpath (`SsgoiRouteBoundary`) is deprecated.
Use `SsgoiLayoutBoundary` from `@ssgoi/svelte` with `framework` instead.

See the [framework guide](https://ssgoi.dev/docs/frameworks/svelte) for wiring and limits.

## Root

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { onNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import { Ssgoi } from "@ssgoi/svelte";
  import { drill } from "@ssgoi/svelte/view-transitions";

  let { children } = $props();

  const config = {
    transitions: [{ on: "/posts/**", except: "/posts", transition: drill() }],
  };
</script>

<main class="ssgoi-shell">
  <Ssgoi
    {config}
    framework={{
      getRoute: () => ({ pathname: page.url.pathname, url: page.url }),
      onNavigate,
    }}
  >
    {@render children()}
  </Ssgoi>
</main>
```

```css
.ssgoi-shell {
  position: relative;
  z-index: 0;
  min-height: 100dvh;
  overflow-x: clip;
}
```

SvelteKit before 2.12 has no `$app/state`; read the store instead:

```svelte
<script lang="ts">
  import { get } from "svelte/store";
  import { onNavigate } from "$app/navigation";
  import { page } from "$app/stores";
</script>

<Ssgoi
  {config}
  framework={{
    getRoute: () => ({ pathname: get(page).url.pathname, url: get(page).url }),
    onNavigate,
  }}
>
  {@render children()}
</Ssgoi>
```

## Route boundary

Mark each route root:

```svelte
<!-- src/routes/posts/+page.svelte -->
<div data-ssgoi-transition="/posts">Posts</div>
```

For dynamic routes, use the real path:

```svelte
<div data-ssgoi-transition="/posts/{postId}">...</div>
```

## Persistent layouts

A persistent `+layout.svelte` may own an outer boundary while child pages own
inner boundaries:

```svelte
<div data-ssgoi-transition={$page.url.pathname}>
  <ProductTabs />
  {@render children()}
</div>
```

SvelteKit keeps the layout DOM during child navigation. Leaving the layout
uses the outer boundary; changing a child route uses the child boundary.

`SsgoiLayoutBoundary` does this for you. It reads the router from
`<Ssgoi framework>`, keeps the outgoing DOM intact when the route changes, and
keeps a persistent shell's DOM while its `key` stays the same:

```svelte
<!-- src/routes/projects/[id]/+layout.svelte -->
<script lang="ts">
  import { SsgoiLayoutBoundary } from "@ssgoi/svelte";

  let { children } = $props();
</script>

<SsgoiLayoutBoundary
  as="section"
  boundary={({ pathname }) => ({
    id: pathname,
    key: pathname.match(/^\/projects\/[^/]+/)?.[0],
  })}
>
  {@render children()}
</SsgoiLayoutBoundary>
```

Without `boundary`, the id and key are the pathname. `boundary` also accepts:

- a string: a fixed key, e.g. `boundary="products-layout"` for a shell that
  never remounts; the id stays the pathname.
- an object: a fixed `id` and/or `key`, e.g. `boundary={{ id: "/feed" }}`.
- a function of the route (`{ pathname, url }` plus any fields `getRoute`
  returns) that returns either of the above. Use `url` to react to search
  changes.

Use a keyed block only when the router reuses the same DOM node and a new
boundary must be forced:

```svelte
{#key resolveKey($page.url.pathname)}
  <div data-ssgoi-transition={$page.url.pathname}>
    {@render children()}
  </div>
{/key}
```

## Config

```ts
import { drill, slide, zoom } from "@ssgoi/svelte/view-transitions";

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
