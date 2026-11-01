# SSGOI + SvelteKit

The router helper used by this template is an experimental API.

Pass a route getter from SvelteKit's page state and `onNavigate` to
`<Ssgoi framework>` and import `SsgoiLayoutBoundary` from `@ssgoi/svelte`.
The package itself never imports `@sveltejs/kit`.

```bash
pnpm install
pnpm dev
```

The root layout uses one config from `src/lib/ssgoi-config.ts` and one
`<Ssgoi>`. Its shipped layout boundary owns the outgoing and incoming page
DOM:

```svelte
<script lang="ts">
  import { page } from "$app/state";
  import { onNavigate } from "$app/navigation";
  import { Ssgoi, SsgoiLayoutBoundary } from "@ssgoi/svelte";
</script>

<Ssgoi
  config={ssgoiConfig}
  framework={{
    getRoute: () => ({ pathname: page.url.pathname, url: page.url }),
    onNavigate,
  }}
>
  <SsgoiLayoutBoundary
    boundary={({ url }) => getRootTransitionId(url)}
  >
    {@render children()}
  </SsgoiLayoutBoundary>
</Ssgoi>
```

On SvelteKit < 2.12 (no `$app/state`), use the store instead:
`getRoute: () => ({ pathname: get(page).url.pathname, url: get(page).url })`
with `page` from `$app/stores` and `get` from `svelte/store`.

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
