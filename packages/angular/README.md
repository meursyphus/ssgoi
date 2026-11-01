# @ssgoi/angular

Native app-like page transitions for Angular. Make a web app, PWA or WebView app (Capacitor, Tauri, Ionic) feel like a native app without replacing your router.

[![SSGOI live showcase](https://ssgoi.dev/readme.png)](https://ssgoi.dev)

[Live demos](https://ssgoi.dev) · [Hero, Zoom, Film, and Sheet in motion](https://ssgoi.dev/blog/view-transition-api-limitations)

```bash
npm install @ssgoi/angular
```

Agent setup guide: https://ssgoi.dev/llms.txt

## Router integration

Pass the Angular Router logic to the root as `[ssgoiFramework]`. `[ssgoi]`
resolves the route once, with its own `Injector`, on every committed
navigation and shares it with the layout boundaries below it.

See the [framework guide](https://ssgoi.dev/docs/frameworks/angular) for wiring and limits.

## Setup

Create one SSGOI root above the router outlet.

```ts
import { Component, signal } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet, UrlTree } from "@angular/router";
import { Ssgoi, type SsgoiConfig, type SsgoiFramework } from "@ssgoi/angular";
import { drill } from "@ssgoi/angular/view-transitions";

const framework: SsgoiFramework = {
  // The committed path without query or fragment.
  getRoute: (injector) => {
    const router = injector.get(Router);
    const { root } = router.parseUrl(router.url);
    return { pathname: router.serializeUrl(new UrlTree(root)) };
  },
  onNavigate: (injector, callback) => {
    const subscription = injector.get(Router).events.subscribe((event) => {
      if (event instanceof NavigationEnd) callback();
    });
    return () => subscription.unsubscribe();
  },
};

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, Ssgoi],
  template: `
    <main
      ssgoi
      [config]="config()"
      [ssgoiFramework]="framework"
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
  protected readonly framework = framework;
}
```

## Layout boundary

Use the standalone directive, without a value, on a routed layout's or page's
single DOM root:

```ts
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SsgoiLayoutBoundary } from "@ssgoi/angular";

@Component({
  standalone: true,
  imports: [RouterOutlet, SsgoiLayoutBoundary],
  template: `<section *ssgoiLayoutBoundary><router-outlet /></section>`,
})
export class ShellComponent {}
```

The id (`data-ssgoi-transition`) is the route path. Depth is automatic: a
boundary inside another one's view, including routed children of its
`<router-outlet>`, is one level deeper. Its key is that depth's scope instance
from `config.layouts`, or the route path when the chain is shorter, and the
embedded view is recreated when the key changes. Without `layouts`, every
boundary is recreated on each path change, including parameterized routes that
reuse the same component; query-only navigation preserves it. The template
context (`let boundary`) is `{ id, key }`.

Keep RouterOutlet in the application; custom reuse caches and auxiliary outlet
coordination are not handled. Without `[ssgoiFramework]` on `[ssgoi]`, the
directive throws.

## Layout scopes

Declare the layout tree in the config. At each level the first matching scope
wins; `layouts` nests inside it. A boundary stays mounted while navigation
stays inside its depth's scope instance (values captured by `*` / `:id` are
part of the instance; `**` tails are not):

```ts
const TOP_LEVEL = ["/posts", "/products"];

const config: SsgoiConfig = {
  layouts: [
    { paths: TOP_LEVEL },
    { paths: "/**", except: TOP_LEVEL, layouts: [{ paths: "/products/*/**" }] },
  ],
  transitions: [/* ... */],
};
```

A depth-0 boundary in the root layout keeps the tab shell (and its bottom nav)
mounted between `/posts` and `/products`, and moves it as a whole into a
detail page. A depth-1 boundary inside `/products/:category/...` stays mounted
across that category's pages.

`SsgoiRouteBoundary` from `@ssgoi/angular/router` is deprecated and will be
removed in 8.0.0; it imports Angular Router itself and keeps working without
`[ssgoiFramework]`.

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
  `preserveScroll: { from: boolean, to: boolean }`, or share one position
  across the rule's pages with `preserveScroll: "shared"`.
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
- `[ssgoiFramework]`: accepts `SsgoiFramework` for `*ssgoiLayoutBoundary`.
- `*ssgoiLayoutBoundary`: marks a routed page's root as a layout boundary.
- `data-ssgoi-transition`: marks a route boundary.
- `injectSsgoi()`: returns the transition context.
- `[ssgoiTransition]`: deprecated; will be removed in 8.0.0.

## License

MIT
