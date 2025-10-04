# @ssgoi/angular

Angular bindings for SSGOI - Native app-like page transitions for Angular applications.

## Installation

```bash
npm install @ssgoi/angular
# or
pnpm add @ssgoi/angular
# or
yarn add @ssgoi/angular
```

## Features

- 🎯 **Modern Angular** - Built with Angular v20+ signal-based APIs and standalone components
- 🚀 **Spring Physics** - Smooth, natural animations powered by spring physics
- 📦 **SSR Compatible** - Full support for Angular Universal
- 🎨 **Customizable** - Extensive animation options and configurations
- 🔄 **Router Agnostic** - Works with Angular Router and any other routing solution
- ⚡ **Tree-shakeable** - Optimized bundle size with ES modules
- 🔥 **Performance Optimized** - OnPush change detection strategy for maximum performance

## Quick Start

### 1. Wrap your app with Ssgoi component

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Ssgoi } from '@ssgoi/angular';
import { fade } from '@ssgoi/angular/view-transitions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Ssgoi],
  template: `
    <ssgoi [config]="ssgoiConfig">
      <div style="position: relative; min-height: 100vh">
        <router-outlet />
      </div>
    </ssgoi>
  `
})
export class AppComponent {
  ssgoiConfig = {
    defaultTransition: fade()
  };
}
```

### 2. Wrap your pages with SsgoiTransition

```typescript
import { Component } from '@angular/core';
import { SsgoiTransition } from '@ssgoi/angular';

@Component({
  selector: 'app-home',
  imports: [SsgoiTransition],
  template: `
    <ssgoi-transition id="/home">
      <h1>Home Page</h1>
    </ssgoi-transition>
  `
})
export class HomeComponent {}
```

## API

### Components

#### `Ssgoi`

Main wrapper component that provides transition context.

**Props:**
- `config: SsgoiConfig` - Transition configuration

#### `SsgoiTransition`

Wraps individual pages/routes for transitions.

**Props:**
- `id: string` - Unique identifier (typically the route path)
- `className?: string` - Optional CSS class

### Directive

#### `SsgoiTransitionDirective`

Directive for element-level transitions.

```typescript
import { Component } from '@angular/core';
import { SsgoiTransitionDirective } from '@ssgoi/angular';
import { injectSsgoi } from '@ssgoi/angular';

@Component({
  selector: 'app-example',
  imports: [SsgoiTransitionDirective],
  template: `<div [ssgoiTransition]="'my-element'">Content</div>`
})
export class ExampleComponent {}
```

### Functions

#### `injectSsgoi()`

Injectable function to access SSGOI context within components.

```typescript
const getTransition = injectSsgoi();
const transition = getTransition('/route-id');
```

## Available Transitions

### View Transitions (Page-level)

```typescript
import {
  fade,
  scroll,
  drill,
  hero,
  pinterest
} from '@ssgoi/angular/view-transitions';
```

### Element Transitions

```typescript
import {
  fadeIn,
  fadeOut,
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  scaleIn,
  scaleOut,
  bounce,
  blur,
  rotate
} from '@ssgoi/angular/transitions';
```

## Configuration Example

```typescript
import { fade, scroll } from '@ssgoi/angular/view-transitions';

const config = {
  defaultTransition: fade(),
  transitions: [
    {
      from: '/home',
      to: '/about',
      transition: scroll({ direction: 'up' }),
      symmetric: true
    }
  ]
};
```

## License

MIT © MeurSyphus

## Links

- [Documentation](https://ssgoi.dev)
- [GitHub](https://github.com/meursyphus/ssgoi)
- [Issues](https://github.com/meursyphus/ssgoi/issues)
