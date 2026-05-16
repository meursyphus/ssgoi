# @ssgoi/angular

Angular bindings for SSGOI that give any Angular 20+ app native-feeling page transitions powered by the `@ssgoi/core` animation engine.

## Installation

```bash
npm install @ssgoi/angular
# or
pnpm add @ssgoi/angular
# or
yarn add @ssgoi/angular
```

## What You Get

- `Ssgoi` directive (selector: `[ssgoi]`) that bootstraps the core transition context on the client and gracefully no-ops during SSR.
- `SsgoiTransition` directive (selector: `[ssgoiTransition]`) that wires individual route containers into the transition system.
- `injectSsgoi()` helper and `SSGOI_CONTEXT` injection token for retrieving the transition context anywhere in your component tree.
- Re-exported transition factories under `@ssgoi/angular/view-transitions`.

## Quick Start

### 1. Provide the transition context once

```typescript
import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Ssgoi, SsgoiConfig } from "@ssgoi/angular";
import { fade } from "@ssgoi/angular/view-transitions";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, Ssgoi],
  template: `
    <div
      ssgoi
      [config]="ssgoiConfig()"
      style="position: relative; min-height: 100vh"
    >
      <router-outlet />
    </div>
  `,
})
export class AppComponent {
  protected readonly ssgoiConfig = signal<SsgoiConfig>({
    transitions: [fade({ paths: ["/home", "/about"] })],
  });
}
```

### 2. Mark each routed view with `SsgoiTransition`

```typescript
import { Component } from "@angular/core";
import { SsgoiTransition } from "@ssgoi/angular";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [SsgoiTransition],
  template: `
    <section [ssgoiTransition]="'/home'">
      <h1>Home Page</h1>
    </section>
  `,
})
export class HomeComponent {}
```

The value you pass to `[ssgoiTransition]` should uniquely identify the view (commonly the route path).

## How It Works

- `Ssgoi` wraps `createSggoiTransitionContext` from `@ssgoi/core` and injects it via `SSGOI_CONTEXT`. The directive guards against the server platform so SSR renders stay deterministic.
- `SsgoiTransition` reads that context with `injectSsgoi()`, sets `data-ssgoi-transition` on the host, and subscribes the element to the core transition runner.

Because everything is driven by signals, Angular change detection stays minimal and the bundle remains fully tree-shakeable.

## API Reference

- `Ssgoi`
  - `config: SsgoiConfig` (input, optional) – global transition configuration. Uses `{}` as default.
  - `host: HostAnimation | undefined` (input, optional) – external playback host for debug tooling.
- `SsgoiTransition`
  - `ssgoiTransition: string` (required input) – identifier for the target view/container.
- `injectSsgoi(): SsgoiContext` – returns the adapter context. During SSR it falls back to a no-op implementation so you can call it unconditionally.

## Available Transitions

View-level factories:

```typescript
import {
  fade,
  scroll,
  drill,
  hero,
  slide,
  zoom,
} from "@ssgoi/angular/view-transitions";
```

## Sample Configuration

```typescript
import { fade, scroll } from "@ssgoi/angular/view-transitions";
import type { SsgoiConfig } from "@ssgoi/angular";

export const config: SsgoiConfig = {
  transitions: [
    fade({ paths: ["/", "/home"] }),
    scroll({ paths: ["/home", "/about"] }),
  ],
};
```

## License

MIT © MeurSyphus

## Links

- [Documentation](https://ssgoi.dev)
- [GitHub](https://github.com/meursyphus/ssgoi)
- [Issues](https://github.com/meursyphus/ssgoi/issues)
