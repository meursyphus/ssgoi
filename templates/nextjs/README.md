# SSGOI + Next.js

Pass a `useRoute` built from the Next.js navigation hooks to
`<Ssgoi framework>` and import `SsgoiLayoutBoundary` from `@ssgoi/react`.
The package itself never imports `next`.

```tsx
"use client";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { Ssgoi, type SsgoiFramework } from "@ssgoi/react";

const framework: SsgoiFramework = {
  useRoute: ({ parallelRoutesKey = "children" }) => {
    const pathname = usePathname();
    const selectedSegments = useSelectedLayoutSegments(parallelRoutesKey) ?? [];
    return pathname == null ? null : { pathname, selectedSegments };
  },
};

<Ssgoi config={ssgoiConfig} framework={framework}>
  {children}
</Ssgoi>;
```

```bash
pnpm install
pnpm dev
```

## Structure

- `src/components/ssgoi-config.ts`: one transition config.
- `src/components/demo-layout.tsx`: one root `<Ssgoi>` with `framework`.
- `SsgoiLayoutBoundary`: shipped pathname boundary with Suspense.
- `src/app/*/layout.tsx`: boundaries placed at persistent layout levels.

The default boundary uses the pathname for its id and key. A string `boundary`
fixes the key, which keeps a layout shell mounted while its transition id
follows the actual route.

## Product tabs

The products layout has two boundaries:

```tsx
<SsgoiLayoutBoundary boundary="products-layout">
  <ProductHeader />
  <ProductTabs />

  <SsgoiLayoutBoundary>{children}</SsgoiLayoutBoundary>
</SsgoiLayoutBoundary>
```

- Category → category: inner boundary slides; header and tabs stay.
- Products → another section: the outer products layout leaves.

The constant outer key is safe here because `app/products/layout.tsx` itself
unmounts outside `/products`. If the boundary moves into a common app layout,
its `boundary` function must return `"products-layout"` only for product
category paths and a different key for routes outside them.

Direction comes from the single config:

```ts
{
  ordered: PRODUCT_CATEGORIES.map((category) => category.path),
  transition: slide(),
}
```

`ordered` routes restore scroll automatically. `on` and `from`/`to` rules
restore the forward source and reset the forward destination.
During a matched transition, SSGOI also suppresses wheel, single-finger touch,
and page-scroll key input until the outgoing page is gone. This leaves CSS and
scrollbar behavior alone. Set `scrollLock: false` in the top-level config only
if the app manages transition input itself; see the
[scroll restoration guide](https://ssgoi.dev/llms/scroll-restoration.txt).

## Other demos

- Posts: `drill` for list → detail.
- Gallery: expanding `zoom`.
- Profile: static `zoom`.

## Shared boundary contract

This template uses the shipped boundary directly in every routed section;
there is no local keyed-DOM wrapper. The React Router, TanStack Router,
SvelteKit, and Nuxt templates pass their own router to `<Ssgoi framework>` and
use the same `SsgoiLayoutBoundary` with the same `boundary` contract: a key
string, a fixed `{ id?, key? }`, or a function of the route returning either.

For an application with named boundaries, keep its policy in a client component:

```tsx
<SsgoiLayoutBoundary
  boundary={(route) => resolveBoundary("app-shell", route)}
  fallback={<div className="min-h-px" aria-hidden="true" />}
>
  {children}
</SsgoiLayoutBoundary>
```

`resolveBoundary` is application code, not an extra library API. It receives
the object `useRoute` returns: here both `pathname` and the owning layout's
`selectedSegments`. Join `selectedSegments` under the project base to get a
nested slot's path; a soft `@modal` navigation must keep its background's slot
id and key even though the browser URL changes. An empty slot is the index route.
The boundary includes Suspense for Cache Components, but the template leaves
Cache Components disabled so it also demonstrates ordinary App Router setup.

The complete policy example is in
[complex routing](https://ssgoi.dev/llms/complex-routing.txt).

## Verify boundary ownership

- Shop → Tech → Fashion: the product header and tabs keep their DOM; only the
  inner boundary changes. Its outgoing DOM still contains the old category.
- Shop → Posts: the products shell leaves and the post boundary enters.
- Post list → detail → browser Back: the real routed roots leave and enter,
  and the list scroll position is restored.
- Query-only navigation keeps a boundary mounted by default.

The React adapter regression suite also covers an app shell shared across
top-level tabs, per-project shell lifetimes, intercepted modal open/back/forward,
direct detail entry, index backgrounds, nested sidebars, and unresolved URLs:

```bash
pnpm --filter @ssgoi/react test:run
```

Full boundary guide: https://ssgoi.dev/llms.txt

```bash
pnpm lint
pnpm build
```

## Customize motion

Presets accept a second `{ override }` argument. This optional example retunes
only the backward direction; the template's default config remains unchanged.

```ts
import { drill, spring } from "@ssgoi/react";

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
