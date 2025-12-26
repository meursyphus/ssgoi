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
- **Pinterest Transition**: Gallery to detail with hero animation
- **Instagram Transition**: Profile feed grid to detail view
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
  <RouterProvider router={router} />
);
```

### 2. SSGOI Configuration (demo-layout.tsx)

```tsx
import { useRouterState } from "@tanstack/react-router";
import { Ssgoi } from "@ssgoi/react";
import { drill, pinterest, instagram } from "@ssgoi/react/view-transitions";

export default function DemoLayout({ children }) {
  const location = useRouterState({ select: (s) => s.location });
  const pathname = location.pathname;

  const config = useMemo(() => ({
    transitions: [
      {
        from: "/posts",
        to: "/posts/*",
        transition: drill({ direction: "enter" }),
      },
      // ... more transitions
    ],
  }), []);

  return (
    <Ssgoi config={config}>{children}</Ssgoi>
  );
}
```

### 3. Page Components

Each page must be wrapped with `SsgoiTransition` and given a unique `id`:

```tsx
import { SsgoiTransition } from "@ssgoi/react";

export default function PostsPage() {
  return (
    <SsgoiTransition id="/posts">
      {/* Page content */}
    </SsgoiTransition>
  );
}
```

## Learn More

- [SSGOI Documentation](https://ssgoi.dev)
- [Tanstack Router Documentation](https://tanstack.com/router/latest)
