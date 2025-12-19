# SSGOI SvelteKit Template

A demo template showcasing SSGOI page transitions in SvelteKit.

## Features

- **Posts**: Drill transition between list and detail views
- **Shop**: Slide transitions with category tabs using nested Ssgoi
- **Gallery**: Pinterest-style masonry layout with pinterest transition
- **Profile**: Instagram-style grid with instagram transition

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

## Transitions

### Drill Transition (Posts)

```svelte
<script>
  import { drill } from '@ssgoi/svelte/view-transitions';

  const config = {
    transitions: [
      {
        from: '/posts',
        to: '/posts/*',
        transition: drill({ direction: 'enter' })
      },
      {
        from: '/posts/*',
        to: '/posts',
        transition: drill({ direction: 'exit' })
      }
    ]
  };
</script>
```

### Slide Transition (Shop)

```svelte
<script>
  import { slide } from '@ssgoi/svelte/view-transitions';

  const config = {
    transitions: [
      {
        from: '/products/tab/left',
        to: '/products/tab/right',
        transition: slide({ direction: 'left' })
      }
    ],
    middleware: (from, to) => {
      // Determine slide direction based on tab order
      // ...
    }
  };
</script>
```

### Pinterest Transition (Gallery)

```svelte
<script>
  import { pinterest } from '@ssgoi/svelte/view-transitions';

  const config = {
    transitions: [
      {
        from: '/pinterest/*',
        to: '/pinterest',
        transition: pinterest(),
        symmetric: true
      }
    ]
  };
</script>
```

### Instagram Transition (Profile)

```svelte
<script>
  import { instagram } from '@ssgoi/svelte/view-transitions';

  const config = {
    transitions: [
      {
        from: '/profile',
        to: '/profile/*',
        transition: instagram(),
        symmetric: true
      }
    ]
  };
</script>
```

## Learn More

- [SSGOI Documentation](https://ssgoi.dev)
- [SvelteKit Documentation](https://svelte.dev/docs/kit)
