---
title: "Fade Animation"
description: "Animate elements with smooth fade in/out effects"
nav-title: "Fade"
---

# Fade Animation

The Fade animation adjusts the opacity of elements to create smooth appearing and disappearing effects. It's the most basic and widely used animation.

## Basic Usage

```tsx
import { transition } from '@ssgoi/react';
import { fade } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'fade-element', ...fade() })}>
          Element with fade animation
        </div>
      )}
    </div>
  );
}
```

## Options

```typescript
interface FadeOptions {
  from?: number;    // Starting opacity (default: 0)
  to?: number;      // Ending opacity (default: 1)
  spring?: {
    stiffness?: number;  // Spring stiffness (default: 300)
    damping?: number;    // Damping coefficient (default: 30)
  };
}
```

### Option Details

- **from**: Opacity value at animation start (0-1)
- **to**: Opacity value at animation end (0-1)
- **spring**: Spring physics settings
  - `stiffness`: Higher values create faster animations
  - `damping`: Higher values create smoother animations

## Usage Examples

### Partial Fade

Fade starting from semi-transparent to slightly transparent:

```tsx
const partialFade = fade({
  from: 0.2,  // Start at 20% opacity
  to: 0.8,    // End at 80% opacity
  spring: { stiffness: 300, damping: 30 }
});

<div ref={transition({ key: 'partial-fade', ...partialFade })}>
  Partial fade effect
</div>
```

### Slow Fade

Slowly and smoothly appearing effect:

```tsx
const slowFade = fade({
  spring: { 
    stiffness: 100,  // Low stiffness
    damping: 20      // Low damping
  }
});

<div ref={transition({ key: 'slow-fade', ...slowFade })}>
  Slow fade effect
</div>
```

### Fast Fade

Quickly appearing effect:

```tsx
const fastFade = fade({
  spring: { 
    stiffness: 500,  // High stiffness
    damping: 40      // High damping
  }
});

<div ref={transition({ key: 'fast-fade', ...fastFade })}>
  Fast fade effect
</div>
```

## Combining with Other Animations

Fade can be combined with other animations for richer effects:

```tsx
// Custom combination animation
const fadeAndScale = {
  in: (element) => ({
    spring: { stiffness: 300, damping: 30 },
    tick: (progress) => {
      element.style.opacity = progress.toString();
      element.style.transform = `scale(${0.8 + progress * 0.2})`;
    }
  }),
  out: (element) => ({
    spring: { stiffness: 300, damping: 30 },
    tick: (progress) => {
      element.style.opacity = progress.toString();
      element.style.transform = `scale(${0.8 + progress * 0.2})`;
    }
  })
};
```

## Performance Considerations

- Fade leverages GPU acceleration for excellent performance
- `opacity` changes don't trigger reflows, making them efficient
- Maintains smooth animations even when applied to many elements simultaneously

## Accessibility

Consider accessibility when using fade animations:

```tsx
<div 
  ref={transition({ key: 'accessible-fade', ...fade() })}
  role="status"
  aria-live="polite"
>
  Fade element with screen reader announcements
</div>
```

## Recommended Use Cases

- **Notification messages**: Providing feedback to users
- **Modals/Popups**: Showing/hiding overlays
- **Image galleries**: Image transition effects
- **Loading states**: Content loading indicators
- **Tooltips**: Displaying information on hover