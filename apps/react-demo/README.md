# SSGOI React Demo

This demo showcases SSGOI's powerful page and element transitions in a Next.js (App Router) application.

## 🚀 Getting Started

### Run from the monorepo root:
```bash
pnpm react-demo:dev
```

Or run directly from this directory:
```bash
pnpm dev
```

The demo will be available at [http://localhost:3001](http://localhost:3001)

## 🎯 What to Try

### 1. Hero Transitions
- Click on any colored box in the "Hero Transition" section
- Watch how the box smoothly expands to fill the screen
- Use the back button to see the reverse transition
- Try navigating with browser back/forward buttons - state is preserved!

### 2. DOM Transitions
- Click "Hide Elements" / "Show Elements" to see various transition effects:
  - **Fade**: Simple opacity transition
  - **Scale + Rotate**: Combined transform effects
  - **Slide In**: Horizontal slide animation
  - **Bounce Scale**: Spring physics with custom parameters

### 3. Spring Physics Controls
- Adjust **Stiffness** (1-1000): Higher = faster animation
- Adjust **Damping** (0-100): Higher = less oscillation
- Use preset buttons for quick adjustments:
  - **Smooth**: Slow, gentle transitions
  - **Normal**: Balanced speed and smoothness
  - **Fast**: Quick, snappy transitions

## 📁 Project Structure

```
react-demo/
├── app/
│   ├── layout.tsx        # SSGOI provider setup with hero transition config
│   ├── page.tsx          # Main demo page with transition examples
│   ├── page.module.css   # Styles for main page
│   └── item/
│       └── [id]/
│           ├── page.tsx  # Dynamic route for hero transition targets
│           └── page.module.css
```

## 🔧 Key Implementation Details

### Setting up SSGOI (app/layout.tsx)
```tsx
import { Ssgoi } from "@ssgoi/react";
import { hero } from "@ssgoi/react/view-transitions";

const ssgoiConfig = {
  transitions: [
    {
      from: "/",
      to: "/item/*",
      transition: hero({ spring: { stiffness: 5, damping: 1 } }),
      symmetric: true,
    },
  ],
};

// Wrap your app with Ssgoi provider
<Ssgoi config={ssgoiConfig}>
  <div style={{ position: "relative", minHeight: "100vh" }}>
    {children}
  </div>
</Ssgoi>
```

### Page Transitions (app/page.tsx)
```tsx
import { SsgoiTransition } from "@ssgoi/react";

// Wrap each page with SsgoiTransition
<SsgoiTransition id="/">
  {/* Page content */}
</SsgoiTransition>
```

### Hero Transitions
Hero transitions work by matching elements with the same `data-hero-key`:

```tsx
// Source element (main page)
<Link
  href={`/item/${item.id}`}
  data-hero-key={`color-${item.id}`}
  style={{ backgroundColor: item.color }}
>
  {item.name}
</Link>

// Target element (detail page)
<div
  data-hero-key={`color-${item.id}`}
  style={{ backgroundColor: item.color }}
>
  {/* Detail content */}
</div>
```

### Element Transitions
```tsx
import { transition } from "@ssgoi/react";

// Apply transitions to individual elements
<div
  ref={transition({
    key: "unique-key",
    in: (element) => ({
      spring: { stiffness, damping },
      tick: (progress) => {
        element.style.opacity = progress.toString();
      },
    }),
    out: (element) => ({
      spring: { stiffness, damping },
      tick: (progress) => {
        element.style.opacity = progress.toString();
      },
    }),
  })}
>
  Animated content
</div>
```

## 🎨 Customization Ideas

1. **Add New Transitions**: Create custom transition effects in the shapes grid
2. **Route Patterns**: Add more route-based transitions in layout.tsx
3. **Spring Presets**: Experiment with different stiffness/damping combinations
4. **Hero Elements**: Try hero transitions with images or other content types

## 📚 Learn More

- [SSGOI Documentation](https://ssgoi.dev)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Spring Physics in Animation](https://ssgoi.dev/docs/spring-physics)

## 🐛 Troubleshooting

- **Transitions not working?** Make sure each page is wrapped with `SsgoiTransition`
- **Hero transitions failing?** Check that `data-hero-key` matches on both elements
- **Performance issues?** Try adjusting spring parameters or reducing concurrent animations