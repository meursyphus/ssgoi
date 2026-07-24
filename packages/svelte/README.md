# @ssgoi/svelte

Svelte and SvelteKit bindings for SSGOI.

[![SSGOI live showcase](https://ssgoi.dev/readme.png)](https://ssgoi.dev)

[Live demos](https://ssgoi.dev) · [Hero, Zoom, Film, and Sheet in motion](https://ssgoi.dev/blog/view-transition-api-limitations)

```bash
npm install @ssgoi/svelte
```

Agent setup guide: https://ssgoi.dev/llms/svelte.txt

## Root

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { Ssgoi } from "@ssgoi/svelte";
  import { drill } from "@ssgoi/svelte/view-transitions";

  let { children } = $props();

  const config = {
    transitions: [{ on: "/posts/**", except: "/posts", transition: drill() }],
  };
</script>

<main class="ssgoi-shell">
  <Ssgoi {config}>
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
    { on: "/posts/**", except: "/posts", transition: drill() },
    { from: "/gallery", to: "/gallery/*", transition: zoom() },
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
