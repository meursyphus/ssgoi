---
title: "Hero Transition"
description: "Shared elements that smoothly animate between pages"
nav-title: "Hero"
---

# Hero Transition

The Hero transition creates an effect where shared elements between two pages naturally move and transform. It provides an immersive transition experience, like images or cards expanding from a list into a detail view.

## Core Concept

To use hero transitions, add the `data-hero-key` attribute to elements that should animate. Elements with matching keys are connected and animated between pages.

```
Page A                      Page B
┌─────────────┐            ┌─────────────┐
│ ┌─────────┐ │            │             │
│ │ key="1" │ │ ══════════>│   key="1"   │
│ └─────────┘ │            │             │
└─────────────┘            └─────────────┘
```

## Basic Usage

### 1. Transition Setup

```tsx
import { Ssgoi } from '@ssgoi/react';
import { hero } from '@ssgoi/react/view-transitions';

const config = {
  transitions: [
    {
      from: '/products',
      to: '/products/*',
      transition: hero(),
      symmetric: true
    }
  ]
};

export default function App() {
  return (
    <Ssgoi config={config}>
      {/* App content */}
    </Ssgoi>
  );
}
```

### 2. Adding Keys to Elements

**List Page:**
```tsx
export function ProductList() {
  return (
    <div className="grid">
      {products.map(product => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <img 
            data-hero-key={`product-image-${product.id}`}
            src={product.thumbnail}
            alt={product.name}
          />
          <h3 data-hero-key={`product-title-${product.id}`}>
            {product.name}
          </h3>
        </Link>
      ))}
    </div>
  );
}
```

**Detail Page:**
```tsx
export function ProductDetail({ product }) {
  return (
    <div>
      <img 
        data-hero-key={`product-image-${product.id}`}
        src={product.fullImage}
        alt={product.name}
      />
      <h1 data-hero-key={`product-title-${product.id}`}>
        {product.name}
      </h1>
      <p>{product.description}</p>
    </div>
  );
}
```

## Options

```tsx
hero({
  spring: {
    stiffness: 300,  // Spring stiffness (default: 300)
    damping: 30      // Damping ratio (default: 30)
  },
  timeout: 300       // Page matching timeout (default: 300ms)
})
```

## Advanced Examples

### Multiple Elements Transitioning

```tsx
// Image, title, and price all hero transition
<article>
  <img data-hero-key={`hero-img-${id}`} src={image} />
  <h2 data-hero-key={`hero-title-${id}`}>{title}</h2>
  <span data-hero-key={`hero-price-${id}`}>${price}</span>
</article>
```

### Dynamic Key Generation

```tsx
// Different hero groups by category
<div data-hero-key={`${category}-item-${id}`}>
  {content}
</div>
```

## How It Works

1. **Matching**: Find matching `data-hero-key` in outgoing and incoming pages
2. **Calculation**: Calculate start/end positions and size differences
3. **Transform**: Animate position (translate) and size (scale) simultaneously
4. **Cleanup**: Reset styles after animation completes

```
Start State        Mid Animation      Final State
┌──┐              ┌────┐            ┌──────┐
│  │ ──────────> │    │ ────────> │      │
└──┘              └────┘            └──────┘
Position A        Moving            Position B
Size S            Transforming      Size L
```

## Important Notes

### 1. Key Uniqueness
- `data-hero-key` must be unique within a page
- For dynamic data, include IDs in keys

### 2. Element Matching
- Falls back to regular transition if no matching key found
- Only first element animates if multiple have same key

### 3. Style Considerations
- `position: relative` temporarily applied during transition
- `transform-origin` set to `top left`
- Original styles restored after animation

## Recommended Use Cases

- 📸 Image gallery → Image detail view
- 🛍️ Product list → Product detail page
- 📝 Card layout → Full screen view
- 👤 Profile thumbnail → Profile page
- 🎵 Album cover → Player screen

## Performance Optimization

- Don't use hero keys on too many elements
- Apply to simple elements rather than complex DOM structures
- Optimize images to appropriate sizes
- `will-change: transform` is handled automatically by Ssgoi