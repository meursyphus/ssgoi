---
title: "Scale Animation"
description: "Create zoom in/out effects by adjusting element size"
nav-title: "Scale"
---

# Scale Animation

The Scale animation changes the size of elements to create zooming in or out effects. It's effective for drawing attention or expressing visual hierarchy.

## Basic Usage

```tsx
import { transition } from '@ssgoi/react';
import { scale } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'scale-element', ...scale() })}>
          Element with scale animation
        </div>
      )}
    </div>
  );
}
```

## Options

```typescript
interface ScaleOptions {
  start?: number;      // Starting scale factor (default: 0)
  opacity?: number;    // Starting opacity (default: 0)
  axis?: 'x' | 'y' | 'both';  // Scale direction (default: 'both')
  spring?: {
    stiffness?: number;  // Spring stiffness (default: 300)
    damping?: number;    // Damping coefficient (default: 30)
  };
}
```

### Option Details

- **start**: Size at animation start (0 = 0%, 1 = 100%)
- **opacity**: Starting opacity (0-1)
- **axis**: Axis to apply scale
  - `'both'`: Both X and Y axes (default)
  - `'x'`: Horizontal only
  - `'y'`: Vertical only
- **spring**: Spring physics settings

## Usage Examples

### Axis-Specific Scale

#### X-Axis Scale (Horizontal Expansion)

```tsx
const scaleX = scale({
  axis: 'x',
  spring: { stiffness: 400, damping: 35 }
});

<div ref={transition({ key: 'scale-x', ...scaleX })}>
  Element that expands horizontally
</div>
```

#### Y-Axis Scale (Vertical Expansion)

```tsx
const scaleY = scale({
  axis: 'y',
  spring: { stiffness: 400, damping: 35 }
});

<div ref={transition({ key: 'scale-y', ...scaleY })}>
  Element that expands vertically
</div>
```

### Partial Scale

Effect starting from a smaller size:

```tsx
const partialScale = scale({
  start: 0.5,     // Start at 50% size
  opacity: 0.3,   // Start at 30% opacity
});

<div ref={transition({ key: 'partial-scale', ...partialScale })}>
  Element starting at half size
</div>
```

### Scale with Bounce Effect

Adding bounce effect with spring settings:

```tsx
const bounceScale = scale({
  spring: { 
    stiffness: 200,  // Lower stiffness for bounce
    damping: 15      // Lower damping for more oscillation
  }
});

<div ref={transition({ key: 'bounce-scale', ...bounceScale })}>
  Bouncy scale effect
</div>
```

## Practical Use Cases

### Card Hover Effect

```tsx
function Card() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div 
          ref={transition({ 
            key: 'card-hover', 
            ...scale({ start: 0.95, opacity: 0.8 }) 
          })}
          className="absolute inset-0 bg-blue-500/20 rounded-lg"
        />
      )}
      <div className="p-4">Card content</div>
    </div>
  );
}
```

### Modal Entrance Effect

```tsx
function Modal({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div 
            ref={transition({ 
              key: 'modal', 
              ...scale({ start: 0.8, opacity: 0 }) 
            })}
            className="bg-white rounded-lg p-6 shadow-xl"
          >
            <h2>Modal Title</h2>
            <p>Modal content</p>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
```

### Icon Animation

```tsx
function AnimatedIcon() {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <button onClick={() => setIsActive(!isActive)}>
      {isActive ? (
        <HeartFilledIcon 
          ref={transition({ 
            key: 'heart-icon', 
            ...scale({ start: 0, spring: { stiffness: 600, damping: 20 } }) 
          })} 
        />
      ) : (
        <HeartOutlineIcon />
      )}
    </button>
  );
}
```

## Performance Optimization

- `transform: scale()` uses GPU acceleration for excellent performance
- Doesn't cause layout changes, avoiding reflows
- Maintains smooth animations even when applied to many elements simultaneously

### Performance Tips

```tsx
// Good example: Using transform
const goodScale = scale(); // Uses transform: scale()

// Avoid: Directly changing width/height
const badScale = {
  in: (element) => ({
    tick: (progress) => {
      // Causes reflow!
      element.style.width = `${progress * 100}px`;
      element.style.height = `${progress * 100}px`;
    }
  })
};
```

## Accessibility Considerations

```tsx
<button
  ref={transition({ 
    key: 'accessible-button', 
    ...scale({ start: 0.9 }) 
  })}
  aria-label="Expanding button"
  className="focus:outline-none focus:ring-2"
>
  Click me
</button>
```

## Recommended Use Cases

- **Buttons/Icons**: Click feedback or hover effects
- **Cards/Tiles**: Selection state or focus indication
- **Modals/Popups**: Entry and exit animations
- **Image galleries**: Thumbnail zoom effects
- **Charts/Graphs**: Emphasizing data visualization elements