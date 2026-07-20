# SSGOI Nuxt Template

A Nuxt 3 template showcasing SSGOI page transitions with various demo pages.

## Features

- **Posts**: Blog-style list-to-detail with drill transition
- **Shop**: Product catalog with category tabs and slide transitions
- **Gallery**: Pinterest-style masonry grid with zoom expand transition
- **Profile**: Instagram-style profile with feed and zoom static transition

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### From Root

```bash
# Run from project root
pnpm template:nuxt

# Build from project root
pnpm template:nuxt:build
```

## Project Structure

```
nuxt/
├── app.vue                    # Root component
├── assets/css/                # Tailwind CSS
├── components/                # Reusable components
│   ├── demolayout.vue        # Main layout with navigation
│   ├── demowrapper.vue       # iPhone frame wrapper
│   ├── navitem.vue           # Navigation item
│   ├── pincard.vue           # Pinterest card
│   ├── postcard.vue          # Profile post card
│   ├── profilefeed.vue       # Profile feed grid
│   ├── ssgoi-transition-boundary.vue # Keyed route boundary
│   └── products/             # Product components
├── composables/               # Vue composables
│   ├── use-posts.ts          # Posts data
│   ├── use-products.ts       # Products data
│   ├── use-pinterest.ts      # Pinterest data
│   └── use-profile.ts        # Profile data
├── pages/                     # Nuxt pages
│   ├── index.vue             # Redirects to /posts
│   ├── posts/                # Blog posts
│   ├── products/             # Product pages
│   ├── pinterest/            # Gallery pages
│   └── profile/              # Profile pages
└── public/demo/              # Static demo images
```

## Route Boundaries

`SsgoiTransitionBoundary` lets a persistent layout own the transition marker,
so individual page components do not set `data-ssgoi-transition`. Its keyed
Vue VNode keeps the outgoing slot subtree separate from the incoming route.

```vue
<Ssgoi :config="config">
  <SsgoiTransitionBoundary>
    <slot />
  </SsgoiTransitionBoundary>
</Ssgoi>
```

The default id is `route.path`. Pass `getId` when a persistent nested layout
needs one outer identity. This template maps every `/products/*` route to the
outer `/products` boundary and uses the full path in the nested products
provider.

## Transitions

### Drill Transition (Posts)

- List to detail: drill enter
- Detail to list: drill exit

### Slide Transition (Products)

- Horizontal slide between category tabs
- Dynamic direction based on tab order

### Zoom Transition (Gallery)

- Expand from grid to detail view
- Smooth scaling animation

### Zoom Transition (Profile)

- Feed grid to post detail
- Static shared image expansion

## Technologies

- **Nuxt 3**: The Intuitive Vue Framework
- **Vue 3**: Progressive JavaScript Framework
- **SSGOI**: Page transition library
- **Tailwind CSS**: Utility-first CSS framework

## License

MIT
