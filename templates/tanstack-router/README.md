# SSGOI + TanStack Router

The router helper used by this template is an experimental API.

Pass TanStack Router's rendered pathname to `<Ssgoi framework>` and import
`SsgoiLayoutBoundary` from `@ssgoi/react`. The package itself never imports
`@tanstack/react-router`.

```bash
pnpm install
pnpm dev
```

## Structure

- `app/components/ssgoi-config.ts`: one transition config.
- `app/components/demo-layout.tsx`: one root `<Ssgoi>` inside a
  `relative z-0 overflow-x-clip` shell.
- `SsgoiLayoutBoundary`: the shipped pathname boundary.
- Route layouts place a stable shell boundary around a pathname child boundary.

```tsx
import { useRouterState } from "@tanstack/react-router";
import { Ssgoi, type SsgoiFramework } from "@ssgoi/react";

// Key by the leaf match the outlet renders, not location (location moves
// before pending matches render; index routes match "/parent/").
const framework: SsgoiFramework = {
  useRoute: () => ({
    pathname: useRouterState({
      select: (state) => {
        const location = state.location.pathname;
        const leaf = state.matches.at(-1)?.pathname;
        if (!leaf) return location;
        return leaf.length > 1 && leaf.endsWith("/") && !location.endsWith("/")
          ? leaf.slice(0, -1)
          : leaf;
      },
    }),
  }),
};

<Ssgoi config={ssgoiConfig} framework={framework}>
  {children}
</Ssgoi>;
```

```tsx
<SsgoiLayoutBoundary boundary="products-layout">
  <ProductHeaderAndTabs />
  <SsgoiLayoutBoundary>
    <Outlet />
  </SsgoiLayoutBoundary>
</SsgoiLayoutBoundary>
```

The products route owns the stable outer lifetime. Its marker follows the full
pathname while category navigation replaces only the inner content. The root
contains one provider; it does not remount the products shell for each tab.

Effects:

- Posts: `drill`.
- Product tabs: ordered `slide`.
- Gallery and profile: `zoom`.

Guide: https://ssgoi.dev/llms/frameworks/tanstack-router.txt

```bash
pnpm typecheck
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
