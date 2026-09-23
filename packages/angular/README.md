# @ssgoi/angular

Angular bindings for SSGOI.

[![SSGOI live showcase](https://ssgoi.dev/readme.png)](https://ssgoi.dev)

[Live demos](https://ssgoi.dev) · [Hero, Zoom, Film, and Sheet in motion](https://ssgoi.dev/blog/view-transition-api-limitations)

```bash
npm install @ssgoi/angular
```

Agent setup guide: https://ssgoi.dev/llms.txt

## Router helpers

Install this framework package once; router helpers are optional subpaths.
These router helpers are experimental APIs and may change.

| Router         | Import                  | API                  |
| -------------- | ----------------------- | -------------------- |
| Angular Router | `@ssgoi/angular/router` | `SsgoiRouteBoundary` |

See the [framework guide](https://ssgoi.dev/docs/frameworks/angular) for wiring and limits.

## Setup

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

## Route boundary

Use the experimental standalone directive on the routed page's single DOM root:

```ts
import { Component } from "@angular/core";
import { SsgoiRouteBoundary } from "@ssgoi/angular/router";

@Component({
  standalone: true,
  imports: [SsgoiRouteBoundary],
  template: `<article *ssgoiRouteBoundary="let route">{{ route.id }}</article>`,
})
export class PostComponent {}
```

It recreates the embedded view on pathname changes, including parameterized
routes that reuse the same component. Query-only navigation preserves it. Use
`key: 'shell'` for a persistent region. Keep RouterOutlet in the application;
custom reuse caches and auxiliary outlet coordination are not handled.

## Config

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

## Effect index

- `fade`: unrelated pages.
- `drill`: list → detail.
- `slide`: ordered tabs.
- `axis`: sibling destinations.
- `sheet`: modal-like routes.
- `zoom`: card/image → detail.
- `hero`: shared elements and page chrome.
- `scroll`: vertical sequences.
- `strip`, `film`, `rotate`, `blind`, `jaemin`: expressive transitions.

Options: https://ssgoi.dev/llms.txt#7-transition-index

## API

- `[ssgoi]`: creates the root transition context.
- `[config]`: accepts `SsgoiConfig`.
- `[host]`: accepts an optional `HostAnimation`.
- `data-ssgoi-transition`: marks a route boundary.
- `injectSsgoi()`: returns the transition context.
- `[ssgoiTransition]`: deprecated; use the data attribute.

## License

MIT
