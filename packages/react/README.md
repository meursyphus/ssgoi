# @ssgoi/react

React bindings for SSGOI.

[![SSGOI live showcase](https://ssgoi.dev/readme.png)](https://ssgoi.dev)

[Live demos](https://ssgoi.dev) · [Hero, Zoom, Film, and Sheet in motion](https://ssgoi.dev/blog/view-transition-api-limitations)

```bash
npm install @ssgoi/react
```

Agent setup guide: https://ssgoi.dev/llms.txt

## Contents

- Next.js
- Persistent layouts
- Sliding tabs
- React Router
- TanStack Router
- Config
- Effect index

## Next.js

Keep one config and one `<Ssgoi>` above route boundaries.

```tsx
// app/ssgoi-provider.tsx
"use client";

import { Ssgoi } from "@ssgoi/react";
import { drill, slide } from "@ssgoi/react/view-transitions";

const config = {
  transitions: [
    { on: "/posts/**", except: "/posts", transition: drill() },
    {
      ordered: ["/products/all", "/products/electronics", "/products/fashion"],
      transition: slide(),
    },
  ],
};

export function SsgoiProvider({ children }) {
  return <Ssgoi config={config}>{children}</Ssgoi>;
}
```

Create the router-aware boundary in the application:

```tsx
// app/ssgoi-transition-boundary.tsx
"use client";

import { type Key, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type BoundaryScope = (pathname: string) => Key;

export function SsgoiTransitionBoundary({
  children,
  scope = (pathname) => pathname,
}: {
  children: ReactNode;
  scope?: BoundaryScope;
}) {
  const pathname = usePathname();

  return (
    <div key={scope(pathname)} data-ssgoi-transition={pathname}>
      {children}
    </div>
  );
}
```

- `key` controls which layout region remounts.
- `data-ssgoi-transition` remains the real pathname.
- The `scope` function is application code; it is not part of `SsgoiConfig`.

Place boundaries in layouts, not in every page.

```tsx
// app/posts/layout.tsx
export default function PostsLayout({ children }) {
  return <SsgoiTransitionBoundary>{children}</SsgoiTransitionBoundary>;
}
```

## Persistent layouts

Return the same key to keep a layout mounted.

```tsx
export default function ProductsLayout({ children }) {
  return (
    <SsgoiTransitionBoundary scope={() => "products-layout"}>
      <ProductHeader />
      <ProductTabs />

      <SsgoiTransitionBoundary>{children}</SsgoiTransitionBoundary>
    </SsgoiTransitionBoundary>
  );
}
```

Category navigation replaces only the inner boundary. Leaving `/products`
replaces the outer boundary and its chrome.

## Bottom navigation

Use Next.js route groups:

```text
app/
  layout.tsx
  (tabs)/layout.tsx
  (tabs)/page.tsx
  (tabs)/search/page.tsx
  (detail)/layout.tsx
  (detail)/post/[id]/page.tsx
```

```tsx
// app/(tabs)/layout.tsx
export default function TabsLayout({ children }) {
  return (
    <SsgoiTransitionBoundary scope={() => "tabs-shell"}>
      <SsgoiTransitionBoundary>{children}</SsgoiTransitionBoundary>
      <BottomNav />
    </SsgoiTransitionBoundary>
  );
}
```

- Tab → tab: inner boundary changes; nav stays.
- Tab → detail: route group exits; outer shell and nav leave together.

Full pattern: https://ssgoi.dev/llms/bottom-nav.txt

## React Router

Replace `usePathname()` with `useLocation()` and render the boundary in a
nested layout route:

```tsx
const { pathname } = useLocation();

return (
  <div key={scope(pathname)} data-ssgoi-transition={pathname}>
    <Outlet />
  </div>
);
```

## TanStack Router

Read the pathname from router state and place the boundary in a parent route:

```tsx
const pathname = useRouterState({
  select: (state) => state.location.pathname,
});
```

## Config

```ts
import { drill, slide, zoom } from "@ssgoi/react/view-transitions";

const config = {
  transitions: [
    { on: "/posts/**", except: "/posts", transition: drill() },
    { from: "/gallery", to: "/gallery/:id", transition: zoom() },
    { ordered: ["/tabs/a", "/tabs/b"], transition: slide() },
  ],
};
```

- `on`: route family.
- `from`/`to`: precise pair.
- `ordered`: directional sequence.
- Patterns support exact paths, `:id`, `*`, and suffix `**`.
- `priority` overrides path specificity.

## Effect index

- `fade`: unrelated pages.
- `drill`: list → detail.
- `slide`: ordered tabs.
- `axis`: sibling destinations.
- `sheet`: modal-like routes.
- `zoom`: card/image → detail.
- `hero`: shared elements and page chrome.
- `scroll`: vertical sequences.
- `strip`, `film`, `rotate`, `blind`, `jaemin`: expressive transitions.

References: https://ssgoi.dev/llms.txt#7-transition-index

## Layout

The shell around `<Ssgoi>` needs `position: relative` and `z-index: 0`. Add
`overflow-x: clip` for horizontal effects.

## Low-level APIs

`SsgoiTransition` is deprecated. Use `data-ssgoi-transition` on the application
boundary.

`transition()` and the auto-key plugins remain available for element-level
mount/unmount animations; they are separate from route boundaries.

## License

MIT
