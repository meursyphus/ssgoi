# SSGOI Nuxt Template

A Nuxt 3 template showcasing SSGOI page transitions with various demo pages.

## Features

- **Posts**: Blog-style list-to-detail with drill transition
- **Shop**: Product catalog with category tabs and slide transitions
- **Gallery**: Pinterest-style masonry grid with pinterest transition
- **Profile**: Instagram-style profile with feed and instagram transition

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

## Transitions

### Drill Transition (Posts)
- List to detail: drill enter
- Detail to list: drill exit

### Slide Transition (Products)
- Horizontal slide between category tabs
- Dynamic direction based on tab order

### Pinterest Transition (Gallery)
- Expand from grid to detail view
- Smooth scaling animation

### Instagram Transition (Profile)
- Feed grid to post detail
- Instagram-style expansion

## Technologies

- **Nuxt 3**: The Intuitive Vue Framework
- **Vue 3**: Progressive JavaScript Framework
- **SSGOI**: Page transition library
- **Tailwind CSS**: Utility-first CSS framework

## License

MIT
