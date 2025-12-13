# @ssgoi/qwik

Qwik bindings for SSGOI - Native app-like page transitions for Qwik applications.

## Installation

```bash
npm install @ssgoi/qwik @ssgoi/core
# or
pnpm add @ssgoi/qwik @ssgoi/core
# or
yarn add @ssgoi/qwik @ssgoi/core
```

## Usage

### Basic Setup

Wrap your application with the `Ssgoi` provider:

```tsx
import { component$ } from "@builder.io/qwik";
import { Ssgoi } from "@ssgoi/qwik";
import { fade } from "@ssgoi/qwik/view-transitions";

export default component$(() => {
  return (
    <Ssgoi
      config={{
        defaultTransition: fade(),
      }}
    >
      {/* Your app content */}
    </Ssgoi>
  );
});
```

### Page Transitions

Use `SsgoiTransition` to wrap your page components:

```tsx
import { component$ } from "@builder.io/qwik";
import { SsgoiTransition } from "@ssgoi/qwik";

export default component$(() => {
  return (
    <SsgoiTransition id="/about">
      <h1>About Page</h1>
      <p>This is the about page</p>
    </SsgoiTransition>
  );
});
```

### Element Transitions

Use the `transition` function for individual element animations:

```tsx
import { component$ } from "@builder.io/qwik";
import { transition } from "@ssgoi/qwik";
import { fadeIn } from "@ssgoi/qwik/transitions";

export default component$(() => {
  return (
    <div ref={transition(fadeIn())}>
      This element will fade in when mounted
    </div>
  );
});
```

### Advanced Configuration

Configure route-specific transitions:

```tsx
import { scroll, drill } from "@ssgoi/qwik/view-transitions";

<Ssgoi
  config={{
    defaultTransition: fade(),
    transitions: [
      {
        from: "/home",
        to: "/about",
        transition: scroll({ direction: "up" }),
        symmetric: true,
      },
      {
        from: "/products",
        to: "/products/*",
        transition: drill({ direction: "enter" }),
      },
    ],
  }}
>
  {/* Your app */}
</Ssgoi>
```

### Transition Scope

Create boundaries for local-scoped transitions:

```tsx
import { component$ } from "@builder.io/qwik";
import { TransitionScope, transition } from "@ssgoi/qwik";
import { fadeIn } from "@ssgoi/qwik/transitions";

export default component$(() => {
  return (
    <TransitionScope>
      <div ref={transition(fadeIn(), { scope: "local" })}>
        This will only animate when added/removed independently
      </div>
    </TransitionScope>
  );
});
```

## Available Transitions

### View Transitions (Page-level)

- `fade()` - Smooth opacity transition
- `scroll()` - Vertical scrolling (up/down)
- `drill()` - Drill in/out effect
- `hero()` - Shared element transitions
- `pinterest()` - Pinterest-style expand

### Element Transitions (Component-level)

- `fadeIn()` / `fadeOut()`
- `slideUp()` / `slideDown()` / `slideLeft()` / `slideRight()`
- `scaleIn()` / `scaleOut()`
- `bounce()`
- `blur()`
- `rotate()`

## API Reference

### Components

#### `<Ssgoi>`

Main provider component for managing page transitions.

Props:
- `config`: Configuration object for transitions

#### `<SsgoiTransition>`

Wrapper component for pages that participate in transitions.

Props:
- `id`: Unique identifier (typically the route path)
- `class`: Optional CSS class name

#### `<TransitionScope>`

Creates a boundary for local-scoped transitions.

### Functions

#### `transition(options)`

Creates a ref callback for element transitions.

Parameters:
- `options`: Transition configuration object
  - `key`: Optional transition key
  - `scope`: Optional scope ('global' | 'local')
  - `in`: Entrance animation callback
  - `out`: Exit animation callback

Returns: Ref callback function for Qwik elements

## Features

- Spring-based physics animations for natural motion
- SSR-friendly with no hydration issues
- Works with Qwik's resumability model
- Automatic cleanup using MutationObserver
- Smooth interruption handling
- TypeScript support

## License

MIT © MeurSyphus

## Links

- [Documentation](https://ssgoi.dev)
- [GitHub](https://github.com/meursyphus/ssgoi)
- [Issues](https://github.com/meursyphus/ssgoi/issues)
