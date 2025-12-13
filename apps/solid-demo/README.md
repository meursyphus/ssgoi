# SSGOI Solid Demo

This is a demo application showcasing the SSGOI page transition library with Solid.js and SolidStart.

## Features

- Hero transitions between pages
- DOM element transitions with customizable spring physics
- Dark theme UI
- Server-side rendering (SSR) support

## Getting Started

```bash
# Install dependencies (from root of monorepo)
pnpm install

# Run the demo
pnpm solid-demo:dev
```

The demo will be available at http://localhost:5175

## Demo Pages

- **Home (/)**: Showcases hero transitions and various DOM element transitions (fade, scale, rotate, slide)
- **Item Detail (/item/[id])**: Detail page with hero transition animation

## Transitions Demonstrated

### Page Transitions
- Hero transition - Shared element morphing between pages

### DOM Transitions
- Fade in/out
- Scale + Rotate
- Slide
- Bounce scale

All transitions use spring-based physics for natural, smooth animations with adjustable stiffness and damping parameters.
