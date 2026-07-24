# SSGOI SvelteKit Template

A demo template showcasing SSGOI page transitions in SvelteKit.

## Features

- **Posts**: Drill transition between list and detail views
- **Shop**: Slide transitions with category tabs using nested Ssgoi
- **Gallery**: Pinterest-style masonry layout with zoom expand transition
- **Profile**: Instagram-style grid with zoom static transition

## Getting Started

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) to view the demo.

### Build

```bash
pnpm build
```

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── demo-layout.svelte      # Main layout with Ssgoi provider and navigation
│   │   ├── demo-wrapper.svelte     # iPhone frame wrapper
│   │   ├── ssgoi-transition-boundary.svelte # SvelteKit route boundary
│   │   └── product-grid.svelte     # Product grid component
│   └── data/
│       ├── posts.ts                # Posts mock data
│       ├── products.ts             # Products mock data
│       ├── pinterest.ts            # Pinterest items mock data
│       └── profile.ts              # Profile and posts mock data
└── routes/
    ├── +layout.svelte              # Root layout
    ├── +page.server.ts             # Redirect to /posts
    ├── posts/                      # Posts demo
    ├── products/                   # Shop demo with nested Ssgoi
    ├── pinterest/                  # Gallery demo
    └── profile/                    # Profile demo
```

## Route Boundaries

`SsgoiTransitionBoundary` lets the layout own the transition marker, so page
components do not need to set `data-ssgoi-transition` themselves. It detaches
the outgoing boundary in SvelteKit's `onNavigate` hook before the live layout
snippet is updated, then mounts the incoming boundary after the route DOM has
updated.

```svelte
<Ssgoi {config}>
  <SsgoiTransitionBoundary>
    {@render children()}
  </SsgoiTransitionBoundary>
</Ssgoi>
```

By default the boundary uses `url.pathname`. Pass `getId` when a persistent
nested layout should keep one logical id. The outer demo boundary maps every
`/products/*` URL to `/products`, while the nested products boundary uses the
full pathname for tab transitions.

## Transitions

### Drill Transition (Posts)

```svelte
<script>
  import { drill } from "@ssgoi/svelte/view-transitions";

  const config = {
    transitions: [
      { on: "/posts/**", except: "/posts", transition: drill() },
    ],
  };
</script>
```

### Slide Transition (Shop)

```svelte
<script>
  import { slide } from "@ssgoi/svelte/view-transitions";

  const config = {
    transitions: [
      {
        ordered: ["/products/all", "/products/electronics", "/products/fashion"],
        transition: slide(),
      },
    ],
  };
</script>
```

### Zoom Transition (Gallery)

```svelte
<script>
  import { zoom } from "@ssgoi/svelte/view-transitions";

  const config = {
    transitions: [
      {
        from: "/pinterest",
        to: "/pinterest/*",
        transition: zoom({ type: "expand" }),
      },
    ],
  };
</script>
```

### Zoom Transition (Profile)

```svelte
<script>
  import { zoom } from "@ssgoi/svelte/view-transitions";

  const config = {
    transitions: [
      {
        from: "/profile",
        to: "/profile/*",
        transition: zoom({ type: "static" }),
      },
    ],
  };
</script>
```

## Learn More

- [SSGOI Documentation](https://ssgoi.dev)
- [SvelteKit Documentation](https://svelte.dev/docs/kit)
