# SSGOI + Qwik City

```bash
pnpm install
pnpm dev
```

`src/lib/ssgoi-config.ts` exports one QRL config factory. The root route layout
calls `useSsgoi(root, { config$ })`.

Route components mark their DOM roots:

```tsx
<main data-ssgoi-transition="/posts">...</main>
```

The products route layout is the persistent outer boundary. Category route
components under `<Slot />` render inner boundaries. Child navigation slides
the inner content; leaving products uses the outer boundary.

Effects:

- Posts: `drill`.
- Product tabs: ordered `slide`.
- Gallery and profile: `zoom`.

Guide: https://ssgoi.dev/llms/qwik.txt

```bash
pnpm build.types
pnpm build
```

## Customize motion

Presets accept a second `{ override }` argument. This optional example retunes
only the backward direction; the template's default config remains unchanged.

```ts
import { drill, spring } from "@ssgoi/qwik";

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
