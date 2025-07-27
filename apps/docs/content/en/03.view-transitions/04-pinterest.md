---
title: "Pinterest Transition"
description: "Pinterest-style expansion from gallery to detail view"
nav-title: "Pinterest"
---

# Pinterest Transition

The Pinterest transition creates an effect where small gallery items expand to full screen. It brings Pinterest's signature transition effect to the web, providing a visually appealing and intuitive user experience.

## Core Concept

Pinterest transition uses two key attributes:

- **`data-pinterest-gallery-key`**: Gallery page items
- **`data-pinterest-detail-key`**: Detail page container

Elements with matching key values are connected to create expand/collapse animations.

```
Gallery Page                    Detail Page
┌─────────────────┐            ┌─────────────────┐
│ ┌──┐ ┌──┐ ┌──┐ │            │                 │
│ │▣ │ │  │ │  │ │ ═════════> │       ▣         │
│ └──┘ └──┘ └──┘ │            │                 │
│ gallery-key="1" │            │ detail-key="1"  │
└─────────────────┘            └─────────────────┘
```

## Basic Usage

### 1. Transition Setup

```tsx
import { Ssgoi } from '@ssgoi/react';
import { pinterest } from '@ssgoi/react/view-transitions';

const config = {
  transitions: [
    {
      from: '/gallery',
      to: '/gallery/*',
      transition: pinterest(),
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

### 2. Gallery Page

```tsx
export function Gallery() {
  return (
    <div className="masonry-grid">
      {items.map(item => (
        <Link 
          key={item.id} 
          href={`/gallery/${item.id}`}
          data-pinterest-gallery-key={item.id}
          className="gallery-item"
        >
          <img src={item.thumbnail} alt={item.title} />
          <h3>{item.title}</h3>
        </Link>
      ))}
    </div>
  );
}
```

### 3. Detail Page

```tsx
export function GalleryDetail({ item }) {
  return (
    <div 
      data-pinterest-detail-key={item.id}
      className="detail-container"
    >
      <img src={item.fullImage} alt={item.title} />
      <h1>{item.title}</h1>
      <p>{item.description}</p>
    </div>
  );
}
```

## Options

```tsx
pinterest({
  spring: {
    stiffness: 50,   // Spring stiffness (default: 50)
    damping: 10      // Damping ratio (default: 10)
  },
  timeout: 300       // Page matching timeout (default: 300ms)
})
```

## How It Works

### Gallery → Detail (Enter Mode)

1. Calculate gallery item position and size
2. Start from item area using clip-path
3. Expand to full screen with clip-path animation
4. Apply scale and translate simultaneously

```
Start: Small card      Mid: Expanding        End: Full screen
┌─────────────┐        ┌─────────────┐        ┌─────────────┐
│┌──┐         │        │ ┌────────┐  │        │             │
││▣ │         │   =>   │ │   ▣    │  │   =>   │      ▣      │
│└──┘         │        │ └────────┘  │        │             │
└─────────────┘        └─────────────┘        └─────────────┘
```

### Detail → Gallery (Exit Mode)

1. Calculate gallery item position from detail view
2. Shrink to gallery item size using clip-path
3. Move to original position with fade out

## Advanced Examples

### With Masonry Layout

```tsx
// Gallery page
<div className="masonry-grid">
  {items.map((item, index) => (
    <div 
      key={item.id}
      data-pinterest-gallery-key={item.id}
      className="masonry-item"
      style={{ 
        gridRowEnd: `span ${item.height}`,
        animationDelay: `${index * 50}ms` 
      }}
    >
      <Link href={`/gallery/${item.id}`}>
        <img src={item.thumbnail} alt={item.title} />
      </Link>
    </div>
  ))}
</div>
```

### Image Preloading

```tsx
// Detail page - preload images for smooth transitions
export function GalleryDetail({ item }) {
  useEffect(() => {
    // Preload high-resolution image
    const img = new Image();
    img.src = item.fullImage;
  }, [item.fullImage]);

  return (
    <div data-pinterest-detail-key={item.id}>
      {/* Content */}
    </div>
  );
}
```

## Styling Considerations

### Gallery Items

```css
.gallery-item {
  /* Base styles for Pinterest effect */
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.gallery-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
```

### Detail Container

```css
.detail-container {
  /* Full screen utilization */
  min-height: 100vh;
  width: 100%;
  
  /* Content alignment */
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

## Important Notes

### 1. Key Rules
- Only one `data-pinterest-detail-key` per page
- Gallery and detail keys must match exactly
- Both numbers and strings work as keys

### 2. Layout Requirements
- Gallery items need clear boundaries
- Detail pages work best with full screen layout
- Consider responsive design

### 3. Performance Optimization
- Optimize images to appropriate sizes
- Use separate thumbnails and full images
- Apply lazy loading

## Recommended Use Cases

- 📷 Image galleries
- 🛍️ E-commerce product lists
- 📌 Pinterest-style layouts
- 🎨 Portfolio galleries
- 📰 Card-based content lists

## Hero vs Pinterest

| Feature | Hero Transition | Pinterest Transition |
|---------|----------------|---------------------|
| Purpose | Individual element movement | Full screen expansion |
| Animation | Position and size transform | Clip-path expansion |
| Complexity | Multiple elements possible | Single container |
| Effect | Element connectivity | Immersive expansion |