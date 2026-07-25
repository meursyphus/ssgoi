# @ssgoi/core

Framework-agnostic route transition engine for SSGOI.

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
https://ssgoi.dev/llms.txt
```

It contains setup guides for every framework adapter, route rules, transition
effects, and troubleshooting guidance.

---

## Or add it in just 2–3 files

Most applications should install a framework package:

```bash
npm install @ssgoi/react
# or @ssgoi/svelte, @ssgoi/vue, @ssgoi/solid, @ssgoi/angular, @ssgoi/qwik
```

### Configuration

`SsgoiConfig` contains route matching and effects. Layout lifetime belongs to
framework-specific transition boundaries, not this config.

```ts
import { drill, slide, zoom, type SsgoiConfig } from "@ssgoi/core";

const config: SsgoiConfig = {
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
      ordered: ["/tabs/a", "/tabs/b", "/tabs/c"],
      transition: slide(),
    },
  ],
};
```

Rule forms:

- `on`: route family. Entering is forward; leaving is backward.
- `from`/`to`: precise pair. Reverse matching is enabled by default.
- `ordered`: array order decides forward and backward.
- `priority`: higher values win before path specificity.
- Scroll is automatic: `on` and `from`/`to` restore the forward `from` side
  and reset `to`; `ordered` restores both. Use
  `preserveScroll: { from: boolean, to: boolean }` for an exact override.

Path patterns:

- `/posts`: exact.
- `/posts/*`: exactly one arbitrary segment.
- `/posts/**`: the parent and every descendant.

A bare `*` remains a compatibility alias for `/**`. Named single-segment forms
remain supported and rank above a single-segment `*` when rules overlap, but
their names are not captured or exposed.

### Boundary model

A framework adapter observes elements marked with:

```html
<div data-ssgoi-transition="/posts/1">...</div>
```

The framework decides when that element is replaced. Nested boundaries follow
DOM lifetime:

- Parent and child change together: the outer changed boundary owns the event.
- Parent remains mounted: the changed child owns the event.

This supports persistent layouts, inner tab transitions, and bottom navigation
with one SSGOI instance.

### Transition context

Custom effects receive semantic direction through `context`:

```ts
import { defineTransition } from "@ssgoi/core";

const effect = defineTransition({
  prepare: ({ from, to, context }) => {
    // Pre-paint setup.
    return {};
  },
  animation: ({ from, to, context }) => {
    // context.direction is "forward" or "backward".
    return animation;
  },
});
```

### Effect index

- `fade`: unrelated pages.
- `drill`: list → detail hierarchy.
- `slide`: ordered tabs and steps.
- `axis`: sibling destinations.
- `sheet`: modal-like routes.
- `zoom`: card or image → detail.
- `hero`: shared elements plus page chrome.
- `scroll`: vertical sequences.
- `strip`, `film`, `rotate`, `blind`, `jaemin`: expressive transitions.

Effect references: https://ssgoi.dev/llms/transitions.txt

### Layout requirements

The shell around the framework root should provide:

```css
.ssgoi-shell {
  position: relative;
  z-index: 0;
  overflow-x: clip;
}
```

`overflow-x: clip` is needed for horizontal effects.

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
