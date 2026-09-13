# SSGOI + SolidStart

Import `SsgoiRouteBoundary` from `@ssgoi/solid/solidstart`. The router is an
optional peer and is loaded only by this entry.

```bash
pnpm install
pnpm dev
```

The root app creates one `<Ssgoi>` with `src/ssgoi-config.ts` and one
centralized route boundary:

```tsx
<Ssgoi config={ssgoiConfig}>
  <SsgoiRouteBoundary
    resolve={({ pathname }) => ({
      id: pathname,
      key: getRootTransitionId(pathname),
    })}
  >
    {props.children}
  </SsgoiRouteBoundary>
</Ssgoi>
```

The root boundary keeps a `/products` key for that route family while its id tracks the real pathname. The persistent
products route wraps its child route in a second boundary, so category
navigation replaces only the inner content while the header and tabs stay
mounted.

Effects:

- Posts: `drill`.
- Product tabs: ordered `slide`.
- Gallery and profile: `zoom`.

Guide: https://ssgoi.dev/llms/solid.txt

```bash
pnpm typecheck
pnpm build
```

## Customize motion

Presets accept a second `{ override }` argument. This optional example retunes
only the backward direction; the template's default config remains unchanged.

```ts
import { drill, spring } from "@ssgoi/solid";

const tunedDrill = drill({}, {
  override: {
    backward({ animation }) {
      animation.set({ integrator: spring({ stiffness: 400, damping: 35 }) });
    },
  },
});
```

The core decides direction from route relationships and history. An explicit
list/detail rule also treats a fresh detail-to-list link as backward. Equal
from/to patterns use history direction. Keep zoom/hero enter and exit markers;
they identify expanded media and related thumbnails within those pages.

[Named groups and overlap](https://ssgoi.dev/docs/motion) ·
[Writing custom transitions with defineTransition](https://ssgoi.dev/docs/custom-transitions)
