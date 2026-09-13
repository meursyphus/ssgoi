# SSGOI + SvelteKit

The router helper used by this template is an experimental API.

Import `SsgoiRouteBoundary` from `@ssgoi/svelte/sveltekit`. The router is an
optional peer and is loaded only by this entry.

```bash
pnpm install
pnpm dev
```

The root layout uses one config from `src/lib/ssgoi-config.ts` and one
`<Ssgoi>`. Its shipped route boundary owns the outgoing and incoming page
DOM:

```svelte
<Ssgoi config={ssgoiConfig}>
  <SsgoiRouteBoundary
    resolve={({ url }) => ({ id: url.pathname, key: getRootTransitionId(url) })}
  >
    {@render children()}
  </SsgoiRouteBoundary>
</Ssgoi>
```

The root boundary keeps a `/products` key for that route family while its id tracks the real pathname.
`routes/products/+layout.svelte` stays mounted and puts a second boundary
around its child route. Category navigation therefore replaces only the inner
boundary, keeping the header and tabs still while the content slides.

Effects:

- Posts: `drill`.
- Product tabs: ordered `slide`.
- Gallery and profile: `zoom`.

Guide: https://ssgoi.dev/llms/svelte.txt

```bash
pnpm check
pnpm build
```

## Customize motion

Presets accept a second `{ override }` argument. This optional example retunes
only the backward direction; the template's default config remains unchanged.

```ts
import { drill, spring } from "@ssgoi/svelte";

const tunedDrill = drill(
  {},
  {
    override: {
      backward({ animation }) {
        animation.set({ integrator: spring({ stiffness: 400, damping: 35 }) });
      },
    },
  },
);
```

The core decides direction from route relationships and history. An explicit
list/detail rule also treats a fresh detail-to-list link as backward. Equal
from/to patterns use history direction. Keep zoom/hero enter and exit markers;
they identify expanded media and related thumbnails within those pages.

[Named groups and overlap](https://ssgoi.dev/docs/motion) ·
[Writing custom transitions with defineTransition](https://ssgoi.dev/docs/custom-transitions)
