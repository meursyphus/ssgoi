# SSGOI + Tanstack Router Template

This template demonstrates how to use SSGOI page transitions with [Tanstack Router](https://tanstack.com/router).

## Getting Started

```bash
# From the root of the ssgoi repository
pnpm install

# Navigate to this template
cd templates/tanstack-router

# Start development server
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the demo.

## Features

- **Drill Transition**: List to detail navigation (Posts section)
- **Zoom Expand Transition**: Gallery to detail with shared image animation
- **Zoom Static Transition**: Profile feed grid to detail view
- **Scroll Position Restoration**: Maintains scroll position on navigation

## Project Structure

```
app/
├── routes/
│   ├── __root.tsx          # Root layout with DemoWrapper
│   ├── index.tsx           # Redirects to /posts
│   ├── posts.tsx           # Posts list
│   ├── posts.$postId.tsx   # Post detail
│   ├── pinterest.tsx       # Pinterest gallery
│   ├── pinterest.$pinId.tsx# Pin detail
│   ├── profile.tsx         # Profile page
│   └── profile.$postId.tsx # Profile post detail
├── components/
│   ├── demo-layout.tsx     # SSGOI configuration
│   ├── demo-wrapper.tsx    # Mobile frame UI
│   ├── posts/              # Posts components
│   ├── pinterest/          # Pinterest components
│   └── profile/            # Profile components
└── main.tsx                # App entry point
```

## Key Integration Points

### 1. Router Setup (main.tsx)

```tsx
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
```

### 2. SSGOI Configuration (demo-layout.tsx)

```tsx
import { Ssgoi } from "@ssgoi/react";
import { drill, zoom } from "@ssgoi/react/view-transitions";
import { SsgoiTransitionBoundary } from "../components/ssgoi-transition-boundary";

export default function DemoLayout({ children }) {
  const config = useMemo(
    () => ({
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
    }),
    [],
  );

  return (
    <Ssgoi config={config}>
      <SsgoiTransitionBoundary className="min-h-full bg-[#121212]">
        {children}
      </SsgoiTransitionBoundary>
    </Ssgoi>
  );
}
```

### 3. Page Components

Page components do not set `data-ssgoi-transition` themselves. Dynamic routes
stay as real pathnames and are matched by wildcard patterns in config. Use
`/posts/*` for descendants and `/posts/**` when the parent path should match
too.

```tsx
export default function PostsPage() {
  return <main>{/* Page content */}</main>;
}
```

## Learn More

- [SSGOI Documentation](https://ssgoi.dev)
- [Tanstack Router Documentation](https://tanstack.com/router/latest)
