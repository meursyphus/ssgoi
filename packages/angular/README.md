# @ssgoi/angular

Angular bindings for SSGOI.

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
https://ssgoi.dev/llms/frameworks/angular.txt
```

It contains the complete Angular setup, route-boundary model, configuration,
and troubleshooting guidance.

---

## Or add it in just 2–3 files

```bash
npm install @ssgoi/angular
```

### Setup

Create one SSGOI root above the router outlet.

```ts
import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/angular";
import { drill } from "@ssgoi/angular/view-transitions";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, Ssgoi],
  template: `
    <main
      ssgoi
      [config]="config()"
      style="position:relative;z-index:0;overflow-x:clip"
    >
      <router-outlet />
    </main>
  `,
})
export class AppComponent {
  protected readonly config = signal<SsgoiConfig>({
    transitions: [{ on: "/posts/**", except: "/posts", transition: drill() }],
  });
}
```

### Route boundary

Mark the root element of each routed component.

```ts
@Component({
  selector: "app-post",
  standalone: true,
  template: `
    <article data-ssgoi-transition="/posts/42">
      <!-- page -->
    </article>
  `,
})
export class PostComponent {}
```

The id must match the config route patterns.

### Config

```ts
import type { SsgoiConfig } from "@ssgoi/angular";
import { drill, slide, zoom } from "@ssgoi/angular/view-transitions";

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
      ordered: ["/tabs/a", "/tabs/b"],
      transition: slide(),
    },
  ],
};
```

- `on`: route family.
- `from`/`to`: precise pair.
- `ordered`: directional sequence.
- Scroll is automatic: `on` and `from`/`to` restore `from` and reset `to`;
  `ordered` restores both. Override with
  `preserveScroll: { from: boolean, to: boolean }`.
- Patterns support exact paths, a `*` path segment, and suffix `**`.
- Higher `priority` wins before path specificity.

### Effect index

- `fade`: unrelated pages.
- `drill`: list → detail.
- `slide`: ordered tabs.
- `axis`: sibling destinations.
- `sheet`: modal-like routes.
- `zoom`: card/image → detail.
- `hero`: shared elements and page chrome.
- `scroll`: vertical sequences.
- `strip`, `film`, `rotate`, `blind`, `jaemin`: expressive transitions.

Options: https://ssgoi.dev/llms/transitions.txt

### API

- `[ssgoi]`: creates the root transition context.
- `[config]`: accepts `SsgoiConfig`.
- `[host]`: accepts an optional `HostAnimation`.
- `data-ssgoi-transition`: marks a route boundary.
- `injectSsgoi()`: returns the transition context.
- `[ssgoiTransition]`: deprecated; use the data attribute.

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
