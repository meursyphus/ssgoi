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

const config = {
  preserveScroll: { exclude: ["/posts/*"] },
  transitions: [
    drill({ enter: "/posts/*", exit: "/posts" }),
    zoom({ paths: ["/pinterest", "/pinterest/*"], type: "expand" }),
    zoom({ paths: ["/profile", "/profile/*"], type: "static" }),
  ],
};
```

Each routed page has a stable `data-ssgoi-transition` route id.

```tsx
export default function PostsPage() {
  return <main data-ssgoi-transition="/posts">{/* page */}</main>;
}
```

## Build

```bash
pnpm typecheck
pnpm build
```
