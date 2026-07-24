# SSGOI + React Router Template

This template demonstrates SSGOI page transitions with React Router 7.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173 to view the demo.

## Features

- **Drill Transition**: Posts list-to-detail navigation
- **Slide Transition**: Product category tabs with nested `Ssgoi`
- **Zoom Expand Transition**: Gallery grid-to-detail shared image animation
- **Zoom Static Transition**: Profile feed-to-detail shared image animation
- **Scroll Preservation**: Keeps scroll state where configured

## Integration

The main provider lives in `app/components/demo-layout.tsx`:

```tsx
import { Ssgoi } from "@ssgoi/react";
import { drill, zoom } from "@ssgoi/react/view-transitions";
import { SsgoiTransitionBoundary } from "./ssgoi-transition-boundary";

const config = {
  preserveScroll: { exclude: ["/posts/*"] },
  transitions: [
    { from: "/posts", to: "/posts/*", transition: drill() },
    {
      from: "/pinterest",
      to: "/pinterest/*",
      transition: zoom({ type: "expand" }),
    },
    {
      from: "/profile",
      to: "/profile/*",
      transition: zoom({ type: "static" }),
    },
  ],
};
```

The demo layout wraps routed content once with a small boundary utility.

```tsx
export default function DemoLayout({ children }) {
  return (
    <Ssgoi config={config}>
      <SsgoiTransitionBoundary className="min-h-full bg-[#121212]">
        {children}
      </SsgoiTransitionBoundary>
    </Ssgoi>
  );
}
```

Page components do not set `data-ssgoi-transition` themselves. Dynamic routes
stay as real pathnames and are matched by wildcard patterns in config. Use
`/posts/*` for descendants and `/posts/**` when the parent path should match
too.

## Build

```bash
pnpm typecheck
pnpm build
```
