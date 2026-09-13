# SSGOI + React Router

Import `SsgoiRouteBoundary` from `@ssgoi/react-router`. This package includes
the common React API and declares its router as a required peer. Install only
this SSGOI package in an application using these imports.

```bash
pnpm install
pnpm dev
```

## Structure

- `app/components/ssgoi-config.ts`: one transition config.
- `app/components/demo-layout.tsx`: one root `<Ssgoi>` inside a
  `relative z-0 overflow-x-clip` shell.
- `@ssgoi/react-router`: the shipped pathname boundary.
- Route layouts place a stable shell boundary around a pathname child boundary.

```tsx
<SsgoiRouteBoundary routeKey="products-layout">
  <ProductHeaderAndTabs />
  <SsgoiRouteBoundary>
    <Outlet />
  </SsgoiRouteBoundary>
</SsgoiRouteBoundary>
```

The products route owns the stable outer lifetime. Its marker follows the full
pathname while category navigation replaces only the inner content. The root
contains one provider; it does not remount the products shell for each tab.

Effects:

- Posts: `drill`.
- Product tabs: ordered `slide`.
- Gallery and profile: `zoom`.

Guide: https://ssgoi.dev/llms/frameworks/react-router.txt

```bash
pnpm typecheck
pnpm build
```

## Customize motion

Presets accept a second `{ override }` argument. This optional example retunes
only the backward direction; the template's default config remains unchanged.

```ts
import { drill, spring } from "@ssgoi/react-router";

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
