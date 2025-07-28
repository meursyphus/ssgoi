---
title: "Slide Animation"
description: "Create dynamic movement effects by sliding elements in specific directions"
nav-title: "Slide"
---

# Slide Animation

The Slide animation makes elements appear or disappear by sliding from a specific direction. It's effective when directional transitions are needed.

## Basic Usage

```tsx
import { transition } from '@ssgoi/react';
import { slide } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'slide-element', ...slide() })}>
          Element with slide animation
        </div>
      )}
    </div>
  );
}
```

## Options

```typescript
interface SlideOptions {
  direction?: 'left' | 'right' | 'up' | 'down';  // Slide direction (default: 'left')
  distance?: number | string;   // Travel distance (default: 100)
  opacity?: number;            // Starting opacity (default: 0)
  fade?: boolean;              // Add fade effect (default: true)
  axis?: 'x' | 'y';          // Movement axis (alternative to direction)
  spring?: {
    stiffness?: number;        // Spring stiffness (default: 400)
    damping?: number;          // Damping coefficient (default: 35)
  };
}
```

### Option Details

- **direction**: Slide direction
  - `'left'`: Appear from left
  - `'right'`: Appear from right
  - `'up'`: Appear from top
  - `'down'`: Appear from bottom
- **distance**: Travel distance (pixels or CSS units)
- **opacity**: Starting opacity (0-1)
- **fade**: Use fade effect with slide
- **axis**: Simple axis specification ('x' or 'y')
- **spring**: Spring physics settings

## Usage Examples

### Directional Slides

```tsx
// Slide from left
const slideLeft = slide({ 
  direction: 'left' 
});

// Slide from right
const slideRight = slide({ 
  direction: 'right' 
});

// Slide from top
const slideUp = slide({ 
  direction: 'up' 
});

// Slide from bottom
const slideDown = slide({ 
  direction: 'down' 
});
```

### Distance Control

```tsx
// Short distance
const shortSlide = slide({
  direction: 'left',
  distance: 50  // Move only 50px
});

// Long distance
const longSlide = slide({
  direction: 'right',
  distance: '100vw'  // Move full viewport width
});

// Using rem units
const remSlide = slide({
  direction: 'up',
  distance: '5rem'
});
```

### Slide Without Fade

```tsx
const slideNoFade = slide({
  direction: 'left',
  fade: false,      // Remove fade effect
  opacity: 1        // Maintain full opacity
});
```

## Practical Use Cases

### Sidebar Menu

```tsx
function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <>
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <div 
            ref={transition({ 
              key: 'sidebar', 
              ...slide({ 
                direction: 'left', 
                distance: 300,
                fade: false 
              }) 
            })}
            className="fixed left-0 top-0 h-full w-72 bg-white shadow-lg z-50"
          >
            <nav className="p-4">
              <h2>Menu</h2>
              {/* Menu items */}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
```

### Notification Toast

```tsx
function Toast({ message, isVisible }) {
  return (
    <>
      {isVisible && (
        <div 
          ref={transition({ 
            key: 'toast', 
            ...slide({ 
              direction: 'up', 
              distance: 100 
            }) 
          })}
          className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          {message}
        </div>
      )}
    </>
  );
}
```

### Tab Content Transition

```tsx
function TabContent({ activeTab }) {
  const getSlideDirection = (tab) => {
    const tabs = ['tab1', 'tab2', 'tab3'];
    const currentIndex = tabs.indexOf(activeTab);
    const targetIndex = tabs.indexOf(tab);
    return currentIndex < targetIndex ? 'left' : 'right';
  };
  
  return (
    <div className="relative overflow-hidden h-64">
      {activeTab === 'tab1' && (
        <div 
          ref={transition({ 
            key: 'tab1', 
            ...slide({ direction: getSlideDirection('tab1') }) 
          })}
          className="absolute inset-0 p-4"
        >
          Tab 1 content
        </div>
      )}
      
      {activeTab === 'tab2' && (
        <div 
          ref={transition({ 
            key: 'tab2', 
            ...slide({ direction: getSlideDirection('tab2') }) 
          })}
          className="absolute inset-0 p-4"
        >
          Tab 2 content
        </div>
      )}
    </div>
  );
}
```

### Carousel Slide

```tsx
function Carousel({ images, currentIndex }) {
  return (
    <div className="relative w-full h-96 overflow-hidden">
      {images.map((image, index) => (
        index === currentIndex && (
          <img
            key={index}
            ref={transition({ 
              key: `slide-${index}`, 
              ...slide({ 
                direction: 'left',
                distance: '100%',
                spring: { stiffness: 300, damping: 30 }
              }) 
            })}
            src={image}
            alt={`Slide ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )
      ))}
    </div>
  );
}
```

## Advanced Usage

### Axis-Based Slide

```tsx
// X-axis slide (horizontal)
const slideX = slide({
  axis: 'x',  // Use axis instead of direction
  distance: 200
});

// Y-axis slide (vertical)
const slideY = slide({
  axis: 'y',
  distance: 150
});
```

### Sequential Animation

```tsx
function SequentialSlides() {
  const [step, setStep] = useState(0);
  
  return (
    <div>
      {step >= 0 && (
        <div 
          ref={transition({ 
            key: 'step-1', 
            ...slide({ direction: 'right', distance: 50 }) 
          })}
        >
          Step 1
        </div>
      )}
      
      {step >= 1 && (
        <div 
          ref={transition({ 
            key: 'step-2', 
            ...slide({ direction: 'right', distance: 50 }) 
          })}
        >
          Step 2
        </div>
      )}
      
      <button onClick={() => setStep(step + 1)}>Next</button>
    </div>
  );
}
```

### Responsive Slide

```tsx
function ResponsiveSlide() {
  const isMobile = window.innerWidth < 768;
  
  const responsiveSlide = slide({
    direction: isMobile ? 'up' : 'left',
    distance: isMobile ? 50 : 100,
    spring: { 
      stiffness: isMobile ? 500 : 400,
      damping: 35 
    }
  });
  
  return (
    <div ref={transition({ key: 'responsive', ...responsiveSlide })}>
      Responsive slide
    </div>
  );
}
```

## Performance Optimization

- `transform: translate()` uses GPU acceleration for excellent performance
- Doesn't change layout, avoiding reflows
- Maintains smooth animations even when applied to many elements

### Performance Tips

```tsx
// Good example: Using transform
const goodSlide = slide(); // Uses transform: translateX/Y

// Avoid: Directly changing position
const badSlide = {
  in: (element) => ({
    tick: (progress) => {
      // Causes reflow!
      element.style.left = `${(1 - progress) * -100}px`;
    }
  })
};
```

## Accessibility Considerations

```tsx
<div 
  ref={transition({ 
    key: 'accessible-slide', 
    ...slide() 
  })}
  role="region"
  aria-live="polite"
  aria-label="Slide content"
>
  Accessible slide content
</div>
```

## Recommended Use Cases

- **Navigation menus**: Sidebars, dropdowns
- **Notifications/Toasts**: Appearing from screen edges
- **Tab/Step transitions**: Directional content transitions
- **Image galleries**: Slideshows, carousels
- **Form steps**: Multi-step form transitions