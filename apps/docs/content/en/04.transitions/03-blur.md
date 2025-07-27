---
title: "Blur Animation"
description: "Smoothly focus or blur elements with blur effects"
nav-title: "Blur"
---

# Blur Animation

The Blur animation applies blur effects to elements, useful for shifting focus or creating soft backgrounds. It provides visual depth and elegant transition effects.

## Basic Usage

```tsx
import { transition } from '@ssgoi/react';
import { blur } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'blur-element', ...blur() })}>
          Element with blur animation
        </div>
      )}
    </div>
  );
}
```

## Options

```typescript
interface BlurOptions {
  amount?: number | string;  // Blur intensity (default: 10)
  opacity?: number;          // Starting opacity (default: 0)
  scale?: boolean;           // Add scale effect (default: false)
  fade?: boolean;            // Add fade effect (default: true)
  spring?: {
    stiffness?: number;      // Spring stiffness (default: 300)
    damping?: number;        // Damping coefficient (default: 30)
  };
}
```

### Option Details

- **amount**: Blur intensity (in pixels or CSS value)
- **opacity**: Starting opacity (0-1)
- **scale**: Whether to apply scale effect with blur
- **fade**: Whether to apply fade effect with blur
- **spring**: Spring physics settings

## Usage Examples

### Heavy Blur Effect

```tsx
const heavyBlur = blur({
  amount: 20,  // Strong blur
  spring: { stiffness: 200, damping: 25 }
});

<div ref={transition({ key: 'heavy-blur', ...heavyBlur })}>
  Heavily blurred element
</div>
```

### Blur + Scale Combination

```tsx
const blurScale = blur({
  amount: 15,
  scale: true,  // Add scale effect
  spring: { stiffness: 400, damping: 35 }
});

<div ref={transition({ key: 'blur-scale', ...blurScale })}>
  Blur with scale down effect
</div>
```

### Blur Only (No Fade)

```tsx
const blurOnly = blur({
  fade: false,     // Remove fade effect
  opacity: 1,      // Maintain full opacity
  amount: '2rem'   // Using rem units
});

<div ref={transition({ key: 'blur-only', ...blurOnly })}>
  Blur without opacity change
</div>
```

## Practical Use Cases

### Background Blur Effect

```tsx
function BlurredBackground() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="relative">
      {/* Background content */}
      <div className="p-8">
        <h1>Main Content</h1>
        <button onClick={() => setIsModalOpen(true)}>
          Open Modal
        </button>
      </div>
      
      {/* Blur overlay */}
      {isModalOpen && (
        <div 
          ref={transition({ 
            key: 'blur-overlay', 
            ...blur({ amount: 8, opacity: 0.5 }) 
          })}
          className="fixed inset-0 bg-black/20"
          onClick={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
```

### Image Loading Effect

```tsx
function BlurredImage({ src, alt }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className="relative">
      {/* Placeholder */}
      {!isLoaded && (
        <div 
          ref={transition({ 
            key: 'image-placeholder', 
            ...blur({ amount: 20 }) 
          })}
          className="absolute inset-0 bg-gray-200"
        />
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={isLoaded ? 'opacity-100' : 'opacity-0'}
      />
    </div>
  );
}
```

### Focus Transition Effect

```tsx
function FocusableCards() {
  const [focusedId, setFocusedId] = useState(null);
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map(id => (
        <div
          key={id}
          onClick={() => setFocusedId(id)}
          className="relative cursor-pointer"
        >
          {/* Blur effect */}
          {focusedId && focusedId !== id && (
            <div 
              ref={transition({ 
                key: `blur-${id}`, 
                ...blur({ amount: 5, opacity: 0.7 }) 
              })}
              className="absolute inset-0 z-10"
            />
          )}
          
          {/* Card content */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3>Card {id}</h3>
            <p>Click to focus</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Advanced Usage

### Dynamic Blur Intensity

```tsx
function DynamicBlur() {
  const [blurAmount, setBlurAmount] = useState(10);
  
  const dynamicBlur = blur({
    amount: blurAmount,
    spring: { stiffness: 300, damping: 30 }
  });
  
  return (
    <div>
      <input
        type="range"
        min="0"
        max="30"
        value={blurAmount}
        onChange={(e) => setBlurAmount(Number(e.target.value))}
      />
      
      <div ref={transition({ key: `blur-${blurAmount}`, ...dynamicBlur })}>
        Blur intensity: {blurAmount}px
      </div>
    </div>
  );
}
```

### Text Spoiler

```tsx
function Spoiler({ children }) {
  const [isRevealed, setIsRevealed] = useState(false);
  
  return (
    <span 
      className="relative inline-block cursor-pointer"
      onClick={() => setIsRevealed(!isRevealed)}
    >
      {!isRevealed && (
        <span 
          ref={transition({ 
            key: 'spoiler-blur', 
            ...blur({ amount: 8, fade: false }) 
          })}
          className="absolute inset-0"
        />
      )}
      <span className={!isRevealed ? 'select-none' : ''}>
        {children}
      </span>
    </span>
  );
}
```

## Performance Considerations

- Blur effects use GPU acceleration but are more computationally intensive than other effects
- May cause performance degradation when applied to large areas or many elements simultaneously
- Consider reducing blur intensity on mobile devices

### Performance Optimization Tips

```tsx
// Mobile optimization
const isMobile = window.innerWidth < 768;
const optimizedBlur = blur({
  amount: isMobile ? 5 : 15,  // Reduce blur on mobile
  spring: { 
    stiffness: isMobile ? 400 : 300,  // Faster animation on mobile
    damping: 35 
  }
});
```

## Browser Compatibility

- Supported in all modern browsers
- Safari may require `-webkit-backdrop-filter`
- IE11 does not support CSS filters

## Recommended Use Cases

- **Modals/Dialogs**: Blurring background content
- **Image Loading**: Transitioning from placeholder to actual image
- **Focus Effects**: Emphasizing important elements
- **Spoiler Text**: Hiding content before user interaction
- **Depth Expression**: Distinguishing UI layers