# SSGOI + Next.js

Pass a `useRoute` built from the Next.js navigation hooks to
`<Ssgoi framework>`, declare the layout tree in `config.layouts`, and place
`SsgoiLayoutBoundary` (from `@ssgoi/react`, no props) in each layout that
should animate. The package itself never imports `next`.

```bash
pnpm install
pnpm dev
```

## Structure

```
src/app/
  layout.tsx              <Ssgoi> + depth-0 boundary (demo-layout.tsx)
  (top-level)/layout.tsx  depth-1 boundary, bottom nav outside it
    posts/  pinterest/  profile/
    products/layout.tsx   header + category tabs, depth-2 boundary
  (detail)/layout.tsx     depth-1 boundary
    posts/[id]/  pinterest/[id]/  profile/[id]/
```

- Tab → tab: only the depth-1 content changes; the bottom nav stays.
- Tab → detail: the depth-0 boundary changes, so the whole top level,
  bottom nav included, leaves.
- Detail → detail (a related post): only the `(detail)` boundary changes.
- Category → category: only the depth-2 boundary slides; the products header
  and tabs stay.

`src/components/ssgoi-config.ts` mirrors that tree:

```ts
const TOP_LEVEL = ["/posts", "/products/**", "/pinterest", "/profile"];

export const ssgoiConfig = {
  layouts: [
    { paths: TOP_LEVEL, layouts: [{ paths: "/products/**" }] },
    { paths: "/**", except: TOP_LEVEL },
  ],
  transitions: [
    /* drill, zoom, category slide */
    { from: TOP_LEVEL, to: TOP_LEVEL, transition: fade() },
  ],
};
```

A boundary's depth is the number of boundaries above it. At depth N it keys by
the scope chosen at level N of `layouts` (the first sibling whose `paths`
match), so it stays mounted while the route stays inside that scope. With no
scope at that level it keys by the route path. Every boundary's transition id
is the route path.

`src/components/demo-layout.tsx` is the client component that owns `<Ssgoi>`:

```tsx
"use client";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { Ssgoi, SsgoiLayoutBoundary, type SsgoiFramework } from "@ssgoi/react";

const INTERCEPTION_PREFIX = /^(?:\(\.\.\.\)|\(\.\.\)|\(\.\))+/;

const framework: SsgoiFramework = {
  useRoute: () => {
    const pathname = usePathname();
    // The page the children slot renders. During a soft intercept it is still
    // the background page, so no background boundary moves.
    const segments = useSelectedLayoutSegments();
    if (pathname == null) return null;
    const renderedPath = `/${segments
      .filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")))
      .map((segment) => segment.replace(INTERCEPTION_PREFIX, ""))
      .filter(Boolean)
      .join("/")}`;
    return { pathname, renderedPath };
  },
};

<Ssgoi config={ssgoiConfig} framework={framework}>
  <SsgoiLayoutBoundary className="min-h-full flex flex-col">
    {children}
  </SsgoiLayoutBoundary>
</Ssgoi>;
```

Keep the first boundary in the same component as `<Ssgoi>`: `renderedPath` is
relative to the layout that renders it, and nested boundaries go in the group
layouts below.

`renderedPath` is the path the root layout actually renders: its selected
segments without route groups `(x)` or interception markers `(.)`. During a
soft-intercepted navigation the `children` slot keeps showing the background,
so no boundary moves; render a `@modal` slot outside the boundaries and let it
animate on its own. The route read is wrapped in Suspense for Cache
Components, but the template leaves Cache Components disabled so it also
demonstrates ordinary App Router setup.

## Transitions

- Posts: `drill` for list → detail.
- Gallery: expanding `zoom`.
- Profile: static `zoom`.
- Product categories: `ordered` `slide`.
- Tab ↔ tab: `fade` on the depth-1 content. The exact category paths in the
  `ordered` rule outrank `/products/**`, so categories still slide.

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

The React Router and TanStack Router templates use the same tree, config and
prop-less boundaries; only their `framework` differs.

## Verify boundary ownership

- Shop → Tech → Fashion: the product header and tabs keep their DOM; only the
  depth-2 boundary changes. Its outgoing DOM still contains the old category.
- Shop → Posts: the products content leaves, the bottom nav stays.
- Post list → detail → browser Back: the whole top level, bottom nav included,
  leaves and enters, and the list scroll position is restored.
- Detail → related post: only the detail boundary changes.
- Query-only navigation keeps every boundary mounted.

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
