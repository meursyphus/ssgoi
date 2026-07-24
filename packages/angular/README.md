# @ssgoi/angular

Angular bindings for SSGOI.

[![SSGOI live showcase](https://ssgoi.dev/readme.png)](https://ssgoi.dev)

[Live demos](https://ssgoi.dev) · [Hero, Zoom, Film, and Sheet in motion](https://ssgoi.dev/blog/view-transition-api-limitations)

```bash
npm install @ssgoi/angular
```

Agent setup guide: https://ssgoi.dev/llms.txt

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

## Config

```ts
import type { SsgoiConfig } from "@ssgoi/angular";
import { drill, slide, zoom } from "@ssgoi/angular/view-transitions";

const config: SsgoiConfig = {
  transitions: [
    { on: "/posts/**", except: "/posts", transition: drill() },
    { from: "/gallery", to: "/gallery/:id", transition: zoom() },
    { ordered: ["/tabs/a", "/tabs/b"], transition: slide() },
  ],
};
```

- `on`: route family.
- `from`/`to`: precise pair.
- `ordered`: directional sequence.
- Patterns support exact paths, `:id`, `*`, and suffix `**`.
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
