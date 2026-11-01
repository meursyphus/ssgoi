# @ssgoi/angular

Native app-like page transitions for Angular. Make a web app, PWA or WebView app (Capacitor, Tauri, Ionic) feel like a native app without replacing your router.

[![SSGOI live showcase](https://ssgoi.dev/readme.png)](https://ssgoi.dev)

[Live demos](https://ssgoi.dev) · [Hero, Zoom, Film, and Sheet in motion](https://ssgoi.dev/blog/view-transition-api-limitations)

```bash
npm install @ssgoi/angular
```

Agent setup guide: https://ssgoi.dev/llms.txt

## Router integration

Pass the Angular Router logic to the root as `[ssgoiFramework]`; the layout
boundary directive reads it through the DI that `[ssgoi]` provides and calls
it with its own `Injector`, so `ActivatedRoute` resolves at its position.

See the [framework guide](https://ssgoi.dev/docs/frameworks/angular) for wiring and limits.

## Setup

Create one SSGOI root above the router outlet.

```ts
import { Component, signal } from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
  createUrlTreeFromSnapshot,
} from "@angular/router";
import { Ssgoi, type SsgoiConfig, type SsgoiFramework } from "@ssgoi/angular";
import { drill } from "@ssgoi/angular/view-transitions";

const framework: SsgoiFramework = {
  getRoute: (injector) => {
    const route = injector.get(ActivatedRoute).snapshot;
    const router = injector.get(Router);
    return {
      pathname: router.serializeUrl(
        createUrlTreeFromSnapshot(route, [], null, null),
      ),
      route,
    };
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

Use the standalone directive on the routed page's single DOM root:

```ts
import { Component } from "@angular/core";
import { SsgoiLayoutBoundary } from "@ssgoi/angular";

@Component({
  standalone: true,
  imports: [SsgoiLayoutBoundary],
  template: `<article *ssgoiLayoutBoundary="let route">{{ route.id }}</article>`,
})
export class PostComponent {}
```

It recreates the embedded view on pathname changes, including parameterized
routes that reuse the same component. Query-only navigation preserves it.

The directive's value sets the boundary; the id defaults to the pathname and
the key to the id:

- `*ssgoiLayoutBoundary="'products-layout'"`: a fixed key for a persistent region.
- `*ssgoiLayoutBoundary="{ id: '/feed' }"`: a fixed id and/or key.
- `*ssgoiLayoutBoundary="boundary"`: a function of the object `getRoute`
  returns, returning a key string or `{ id?, key? }`. Annotate its extra
  fields, e.g. `route: ActivatedRouteSnapshot`.

Keep RouterOutlet in the application; custom reuse caches and auxiliary outlet
coordination are not handled. Without `[ssgoiFramework]` on `[ssgoi]`, the
directive throws.

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
