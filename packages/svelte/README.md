# @ssgoi/svelte

Svelte and SvelteKit bindings for SSGOI.

Native app-like page transitions for mobile web apps.

**Router agnostic · Cross-browser · SSR ready · Web Animations API powered**

[Live showcase](https://ssgoi.dev) · [Documentation](https://ssgoi.dev/docs)

|                                                               Drill                                                                |                                                                                    Sheet                                                                                    |
| :--------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://ssgoi.dev/readme-drill.gif" alt="Drill transition opening and closing a chat in a mobile web app" width="280" /> | <img src="https://ssgoi.dev/blog/view-transition-api-limitations/sheet-blur-full.gif" alt="Sheet transition opening a compose screen above a mobile web app" width="280" /> |
|                                          Navigate through a mobile app with spatial depth                                          |                                                                Present focused tasks above the current page                                                                 |

## Why SSGOI?

|                                    |                                                                             |
| ---------------------------------- | --------------------------------------------------------------------------- |
| **Router agnostic**                | Keep your existing router and let it own navigation.                        |
| **Cross-browser**                  | Use the same transitions across Chrome, Safari, Firefox, and Edge.          |
| **Optimized motion**               | Spring physics are precomputed into Web Animations API keyframes.           |
| **Beyond the View Transition API** | Build transitions that need live DOM, runtime layers, and precise geometry. |
| **Easy to adopt**                  | Add SSGOI by changing only 2–3 files.                                       |

---

## Set it up with one link

Give this URL to Claude, Codex, Cursor, or another coding agent:

```text
https://ssgoi.dev/llms/frameworks/sveltekit.txt
```

It contains the complete SvelteKit setup, route-boundary model, configuration,
and troubleshooting guidance.

---

## Or add it in just 2–3 files

```bash
npm install @ssgoi/svelte
```

### Root

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

### Route boundary

Mark each route root:

```svelte
<!-- src/routes/posts/+page.svelte -->
<div data-ssgoi-transition="/posts">Posts</div>
```

For dynamic routes, use the real path:

```svelte
<div data-ssgoi-transition={`/posts/${postId}`}>...</div>
```

### Persistent layouts

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

### Config

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
`preserveScroll: { from: boolean, to: boolean }`.

### Effect index

- `fade`: unrelated pages.
- `drill`: list → detail.
- `slide` or `axis`: ordered tabs.
- `sheet`: modal-like routes.
- `zoom` or `hero`: shared-element details.
- `scroll`: vertical sequences.

All effects: https://ssgoi.dev/llms/transitions.txt

`SsgoiTransition` is deprecated. Use the data attribute directly.

---

## Compatibility

SSGOI depends on the broadly available Web Animations API instead of requiring
the View Transition API.

| <img src="https://ssgoi.dev/logos/chrome.svg" alt="Chrome" width="36" /><br />Chrome 84+ | <img src="https://ssgoi.dev/logos/safari.svg" alt="Safari" width="36" /><br />Safari 13.1+ | <img src="https://ssgoi.dev/logos/firefox.svg" alt="Firefox" width="36" /><br />Firefox 75+ | <img src="https://ssgoi.dev/logos/edge.svg" alt="Edge" width="36" /><br />Edge 84+ |
| :--------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------: |

It observes the DOM lifecycle your framework already owns, so routing and SSR
stay with your existing stack.

| <img src="https://ssgoi.dev/logos/nextjs.svg" alt="Next.js" width="42" /><br />Next.js | <img src="https://ssgoi.dev/logos/react-router.svg" alt="React Router" width="42" /><br />React Router | <img src="https://ssgoi.dev/logos/tanstack.svg" alt="TanStack Router" width="42" /><br />TanStack Router | <img src="https://ssgoi.dev/logos/svelte.svg" alt="SvelteKit" width="42" /><br />SvelteKit | <img src="https://ssgoi.dev/logos/nuxt.svg" alt="Nuxt" width="42" /><br />Nuxt |
| :------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------: |

React · Svelte · Vue · Solid · Angular · Qwik · framework-agnostic core

[See complete compatibility and framework guides →](https://ssgoi.dev/docs/compatibility)

---

## Why SSGOI doesn't use the View Transition API

SSGOI owns the geometry, temporary visual layers, live outgoing DOM, and
navigation policy needed to turn complex motion into reusable presets.

|                                                                                     Zoom                                                                                      |                                                                              Film                                                                               |                                                                               Sheet                                                                                |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://ssgoi.dev/blog/view-transition-api-limitations/zoom-blur.gif" alt="Zoom transition that transforms and clips a detail page around its image" width="240" /> | <img src="https://ssgoi.dev/blog/view-transition-api-limitations/film.gif" alt="Film transition with runtime visual pieces and multiple springs" width="320" /> | <img src="https://ssgoi.dev/blog/view-transition-api-limitations/sheet-blur-full.gif" alt="Sheet transition with a live backdrop between two pages" width="240" /> |
|                                                                 The whole detail page unfolds from its image                                                                  |                                                         Runtime scene, live video, and multiple springs                                                         |                                                             A live backdrop sits between the two pages                                                             |

[Read why SSGOI doesn't use the View Transition API →](https://ssgoi.dev/blog/view-transition-api-limitations)

---

## License

MIT Licensed © [MeurSyphus](https://github.com/meursyphus)
