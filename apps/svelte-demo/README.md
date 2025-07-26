# SSGOI Svelte Demo

This demo showcases SSGOI's powerful page and element transitions in a SvelteKit application.

## 🚀 Getting Started

### Run from the monorepo root:
```bash
pnpm svelte-demo:dev
```

Or run directly from this directory:
```bash
pnpm dev
```

The demo will be available at [http://localhost:5173](http://localhost:5173)

## 🎯 What to Try

### 1. Hero Transitions
- Click on any colored box in the "Hero Transition" section
- Watch how the box smoothly expands to fill the screen
- Click the back button to see the reverse transition
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
svelte-demo/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte    # SSGOI provider setup with hero transition config
│   │   ├── +page.svelte      # Main demo page with transition examples
│   │   └── item/
│   │       └── [id]/
│   │           └── +page.svelte  # Dynamic route for hero transition targets
│   └── app.css               # Global styles
```

## 🔧 Key Implementation Details

### Setting up SSGOI (+layout.svelte)
```svelte
<script lang="ts">
  import { Ssgoi } from '@ssgoi/svelte';
  import { hero } from '@ssgoi/svelte/view-transitions';
  
  const ssgoiConfig = {
    transitions: [
      {
        from: '/',
        to: '/item/*',
        transition: hero({ spring: { stiffness: 5, damping: 1 } }),
        symmetric: true,
      },
    ],
  };
</script>

<Ssgoi config={ssgoiConfig}>
  <div style="position: relative; min-height: 100vh;">
    {@render children()}
  </div>
</Ssgoi>
```

### Page Transitions (+page.svelte)
```svelte
<script>
  import { SsgoiTransition } from '@ssgoi/svelte';
</script>

<!-- Wrap each page with SsgoiTransition -->
<SsgoiTransition id="/">
  <!-- Page content -->
</SsgoiTransition>
```

### Hero Transitions
Hero transitions work by matching elements with the same `data-hero-key`:

```svelte
<!-- Source element (main page) -->
<a
  href={`/item/${item.id}`}
  data-hero-key={`color-${item.id}`}
  style="background-color: {item.color}"
>
  {item.name}
</a>

<!-- Target element (detail page) -->
<div
  data-hero-key={`color-${item.id}`}
  style="background-color: {item.color}"
>
  <!-- Detail content -->
</div>
```

### Element Transitions (Svelte 5)
```svelte
<script>
  import { transition } from '@ssgoi/svelte';
  
  let showElement = $state(true);
  let stiffness = $state(300);
  let damping = $state(30);
</script>

<!-- Apply transitions to individual elements -->
{#if showElement}
  <div
    use:transition={{
      key: 'unique-key',
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
    }}
  >
    Animated content
  </div>
{/if}
```

## 🎨 Customization Ideas

1. **Add New Transitions**: Create custom transition effects in the shapes grid
2. **Route Patterns**: Add more route-based transitions in +layout.svelte
3. **Spring Presets**: Experiment with different stiffness/damping combinations
4. **Hero Elements**: Try hero transitions with images or other content types
5. **Svelte Actions**: Create reusable transition actions for common patterns

## 📚 Learn More

- [SSGOI Documentation](https://ssgoi.dev)
- [SvelteKit Documentation](https://kit.svelte.dev)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/what-are-runes)
- [Spring Physics in Animation](https://ssgoi.dev/docs/spring-physics)

## 🐛 Troubleshooting

- **Transitions not working?** Make sure each page is wrapped with `SsgoiTransition`
- **Hero transitions failing?** Check that `data-hero-key` matches on both elements
- **TypeScript errors?** This demo uses Svelte 5 syntax with `$state` and `$props` runes
- **Performance issues?** Try adjusting spring parameters or reducing concurrent animations

## ⚡ Svelte-Specific Features

- **Reactive State**: Uses Svelte 5's `$state` rune for reactive values
- **Actions**: The `use:transition` directive provides a clean API for element transitions
- **Component Props**: Uses `$props()` for type-safe component properties
- **No Virtual DOM**: Transitions run directly on DOM elements for optimal performance