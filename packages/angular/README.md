# @ssgoi/angular

Angular bindings for SSGOI that give any Angular 20+ app native-feeling page transitions powered by the `@ssgoi/core` animation engine.

try this: [ssgoi.dev](https://ssgoi.dev)

## AI-Assisted Setup

Using Claude, Cursor, ChatGPT, or another AI assistant? Point it at:

```
https://ssgoi.dev/llms.txt
```

It has the full setup guide, every transition, the API, and troubleshooting — everything an agent needs to wire SSGOI into your app.

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
- `data-ssgoi-transition` route markers discovered automatically inside `[ssgoi]`.
- Deprecated `SsgoiTransition` directive (selector: `[ssgoiTransition]`) kept for backward compatibility.
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
    <!-- position: relative + z-index: 0 are required (the outgoing page is cloned with position:absolute) -->
    <div
      ssgoi
      [config]="ssgoiConfig()"
      style="position: relative; z-index: 0; min-height: 100vh"
    >
      <router-outlet />
    </div>
  `,
})
export class AppComponent {
  protected readonly ssgoiConfig = signal<SsgoiConfig>({
    transitions: [{ from: "/home", to: "/about", transition: fade() }],
  });
}
```

### 2. Mark each routed view

```typescript
import { Component } from "@angular/core";

@Component({
  selector: "app-home",
  standalone: true,
  template: `
    <section data-ssgoi-transition="/home">
      <h1>Home Page</h1>
    </section>
  `,
})
export class HomeComponent {}
```

The `data-ssgoi-transition` value should uniquely identify the view (commonly the route path).

## How It Works

- `Ssgoi` wraps `createSggoiTransitionContext` from `@ssgoi/core`, injects it via `SSGOI_CONTEXT`, and observes `data-ssgoi-transition` elements under the host. The directive guards against the server platform so SSR renders stay deterministic.
- The deprecated `SsgoiTransition` directive still sets `data-ssgoi-transition` and registers the host directly for backward compatibility.

Because everything is driven by signals, Angular change detection stays minimal and the bundle remains fully tree-shakeable.

## API Reference

- `Ssgoi`
  - `config: SsgoiConfig` (input, optional) – global transition configuration. Uses `{}` as default.
  - `host: HostAnimation | undefined` (input, optional) – external playback host for debug tooling.
- `data-ssgoi-transition` – identifier for the target view/container.
- `SsgoiTransition` is deprecated; use `data-ssgoi-transition` directly.
- `injectSsgoi(): SsgoiContext` – returns the adapter context. During SSR it falls back to a no-op implementation so you can call it unconditionally.

## Available Transitions

Import view-level factories from `@ssgoi/angular/view-transitions`:

```typescript
import {
  fade,
  drill,
  slide,
  scroll,
  axis,
  sheet,
  hero,
  zoom,
  strip,
  blind,
  film,
  rotate,
  jaemin,
} from "@ssgoi/angular/view-transitions";
```

- `fade()` - Calm cross-fade. Safe default for unrelated pages
- `drill()` - iOS-style hierarchical navigation (list → detail)
- `slide()` - Horizontal push for tabs / sequential flows
- `scroll()` - Vertical page scroll for onboarding / paginated views
- `axis()` - Material/Flutter shared-axis swap for sibling/tab routes
- `sheet()` - Bottom sheet that slides up (modal-like flows)
- `hero()` - Shared element transition (matching `data-hero-enter-key` / `data-hero-exit-key`)
- `zoom()` - Card-to-detail expansion (matching `data-zoom-enter-key` / `data-zoom-exit-key`)
- `strip()` - 3D Y-axis perspective flip
- `blind()` - Window-blinds wipe reveal
- `film()` - Cinematic shrink + tile (gallery / lightbox)
- `rotate()` - Card flip between siblings
- `jaemin()` - Playful rotated zoom for special moments

Factories take effect options only. Put them in an `on`, `from`/`to`, or
`ordered` route rule; the rule resolves forward/backward direction.

## Sample Configuration

```typescript
import { fade, scroll } from "@ssgoi/angular/view-transitions";
import type { SsgoiConfig } from "@ssgoi/angular";

export const config: SsgoiConfig = {
  transitions: [
    { from: "/", to: "/home", transition: fade() },
    { ordered: ["/home", "/about"], transition: scroll() },
  ],
};
```

## License

MIT © MeurSyphus

## Links

- [Documentation](https://ssgoi.dev)
- [GitHub](https://github.com/meursyphus/ssgoi)
- [Issues](https://github.com/meursyphus/ssgoi/issues)
