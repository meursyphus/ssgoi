---
title: "Rotate Animation"
description: "Create dynamic and lively effects by rotating elements"
nav-title: "Rotate"
---

# Rotate Animation

The Rotate animation creates effects by rotating elements in 2D or 3D space. It's a fun and eye-catching animation that can draw user attention.

## Basic Usage

```tsx
import { transition } from '@ssgoi/react';
import { rotate } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'rotate-element', ...rotate() })}>
          Element with rotate animation
        </div>
      )}
    </div>
  );
}
```

## Options

```typescript
interface RotateOptions {
  degrees?: number;        // Rotation angle (default: 360)
  clockwise?: boolean;     // Clockwise direction (default: true)
  scale?: boolean;         // Add scale effect (default: false)
  fade?: boolean;          // Add fade effect (default: false)
  origin?: string;         // Rotation origin (default: 'center')
  axis?: '2d' | 'x' | 'y' | 'z';  // Rotation axis (default: '2d')
  perspective?: number;    // 3D perspective (default: 800)
  spring?: {
    stiffness?: number;    // Spring stiffness (default: 500)
    damping?: number;      // Damping coefficient (default: 25)
  };
}
```

### Option Details

- **degrees**: Rotation angle (360 = one full rotation)
- **clockwise**: true for clockwise, false for counter-clockwise
- **scale**: Add scaling effect with rotation
- **fade**: Add fade effect with rotation
- **origin**: Rotation origin point (CSS transform-origin value)
- **axis**: Rotation axis
  - `'2d'`: Planar rotation (default)
  - `'x'`: X-axis rotation (flip up/down)
  - `'y'`: Y-axis rotation (flip left/right)
  - `'z'`: Z-axis rotation (same as planar)
- **perspective**: Perspective distance for 3D rotation
- **spring**: Spring physics settings

## Usage Examples

### Basic Rotation Variations

```tsx
// Half rotation
const halfRotate = rotate({ 
  degrees: 180 
});

// Counter-clockwise rotation
const counterClockwise = rotate({ 
  clockwise: false 
});

// Double rotation
const doubleRotate = rotate({ 
  degrees: 720 
});

// Small rotation
const smallRotate = rotate({ 
  degrees: 45 
});
```

### 3D Rotation

```tsx
// X-axis rotation (card flip effect)
const flipX = rotate({ 
  axis: 'x',
  degrees: 180,
  perspective: 1000
});

// Y-axis rotation (door opening effect)
const flipY = rotate({ 
  axis: 'y',
  degrees: 90,
  perspective: 800
});

// Z-axis rotation (planar rotation)
const rotateZ = rotate({ 
  axis: 'z',
  degrees: 360
});
```

### Changing Rotation Origin

```tsx
// Rotate from top-left
const topLeftRotate = rotate({ 
  origin: 'top left',
  degrees: 90
});

// Rotate from bottom-right
const bottomRightRotate = rotate({ 
  origin: 'bottom right',
  degrees: -90
});

// Custom origin
const customOrigin = rotate({ 
  origin: '25% 75%',
  degrees: 180
});
```

### Combined Effects

```tsx
// Rotate + Scale
const rotateScale = rotate({ 
  degrees: 360,
  scale: true
});

// Rotate + Fade
const rotateFade = rotate({ 
  degrees: 720,
  fade: true
});

// Rotate + Scale + Fade
const rotateAll = rotate({ 
  degrees: 360,
  scale: true,
  fade: true,
  spring: { stiffness: 300, damping: 20 }
});
```

## Practical Use Cases

### Loading Spinner

```tsx
function LoadingSpinner({ isLoading }) {
  return (
    <>
      {isLoading && (
        <div 
          ref={transition({ 
            key: 'spinner', 
            ...rotate({ 
              degrees: 360,
              spring: { stiffness: 100, damping: 10 }
            }) 
          })}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      )}
    </>
  );
}
```

### Card Flip

```tsx
function FlipCard({ front, back }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <div 
      className="relative w-64 h-96 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* Front side */}
      {!isFlipped && (
        <div 
          ref={transition({ 
            key: 'card-front', 
            ...rotate({ 
              axis: 'y',
              degrees: 180,
              perspective: 1000
            }) 
          })}
          className="absolute inset-0 bg-white rounded-lg shadow-lg p-6"
        >
          {front}
        </div>
      )}
      
      {/* Back side */}
      {isFlipped && (
        <div 
          ref={transition({ 
            key: 'card-back', 
            ...rotate({ 
              axis: 'y',
              degrees: 180,
              perspective: 1000,
              clockwise: false
            }) 
          })}
          className="absolute inset-0 bg-gray-800 text-white rounded-lg shadow-lg p-6"
        >
          {back}
        </div>
      )}
    </div>
  );
}
```

### Refresh Button

```tsx
function RefreshButton({ onRefresh }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="p-2 rounded-full hover:bg-gray-100"
    >
      <svg 
        ref={isRefreshing ? transition({ 
          key: 'refresh-icon', 
          ...rotate({ 
            degrees: 360,
            spring: { stiffness: 200, damping: 20 }
          }) 
        }) : undefined}
        className="w-6 h-6"
        viewBox="0 0 24 24"
      >
        <path d="M4 12a8 8 0 0 1 8-8V2.5L16 6l-4 3.5V8a6 6 0 1 0 6 6h1.5a7.5 7.5 0 1 1-7.5-7.5z"/>
      </svg>
    </button>
  );
}
```

### Icon Transition

```tsx
function IconTransition({ isActive }) {
  return (
    <div className="relative w-8 h-8">
      {isActive ? (
        <CheckIcon 
          ref={transition({ 
            key: 'check-icon', 
            ...rotate({ 
              degrees: 360,
              scale: true,
              spring: { stiffness: 600, damping: 30 }
            }) 
          })}
          className="absolute inset-0"
        />
      ) : (
        <CloseIcon 
          ref={transition({ 
            key: 'close-icon', 
            ...rotate({ 
              degrees: -360,
              scale: true,
              spring: { stiffness: 600, damping: 30 }
            }) 
          })}
          className="absolute inset-0"
        />
      )}
    </div>
  );
}
```

## Advanced Usage

### Multi-stage Rotation

```tsx
function MultiStageRotate() {
  const [stage, setStage] = useState(0);
  
  const rotations = [
    { degrees: 90, origin: 'top left' },
    { degrees: 180, origin: 'center' },
    { degrees: 270, origin: 'bottom right' },
    { degrees: 360, origin: 'center' }
  ];
  
  return (
    <div>
      <div 
        ref={transition({ 
          key: `rotate-stage-${stage}`, 
          ...rotate(rotations[stage]) 
        })}
        className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"
      />
      
      <button onClick={() => setStage((s) => (s + 1) % 4)}>
        Next Stage
      </button>
    </div>
  );
}
```

### Mouse Tracking Rotation

```tsx
function MouseTrackingRotate() {
  const [rotation, setRotation] = useState(0);
  const elementRef = useRef(null);
  
  const handleMouseMove = (e) => {
    if (!elementRef.current) return;
    
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(
      e.clientY - centerY,
      e.clientX - centerX
    ) * (180 / Math.PI);
    
    setRotation(angle);
  };
  
  return (
    <div 
      className="relative w-full h-64"
      onMouseMove={handleMouseMove}
    >
      <div 
        ref={(el) => {
          elementRef.current = el;
          if (el) {
            transition({ 
              key: `mouse-rotate-${Math.floor(rotation / 10)}`, 
              ...rotate({ 
                degrees: rotation,
                spring: { stiffness: 300, damping: 30 }
              }) 
            })(el);
          }
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20"
      >
        →
      </div>
    </div>
  );
}
```

### 3D Cube Rotation

```tsx
function RotatingCube() {
  const [face, setFace] = useState(0);
  const faces = ['front', 'right', 'back', 'left'];
  
  return (
    <div className="perspective-1000">
      <div 
        ref={transition({ 
          key: `cube-${face}`, 
          ...rotate({ 
            axis: 'y',
            degrees: face * 90,
            perspective: 1000,
            spring: { stiffness: 200, damping: 25 }
          }) 
        })}
        className="relative w-32 h-32 transform-style-preserve-3d"
      >
        {/* Cube faces */}
        <div className="absolute inset-0 bg-red-500">Front</div>
        <div className="absolute inset-0 bg-blue-500 rotate-y-90">Right</div>
        <div className="absolute inset-0 bg-green-500 rotate-y-180">Back</div>
        <div className="absolute inset-0 bg-yellow-500 rotate-y-270">Left</div>
      </div>
      
      <button onClick={() => setFace((f) => (f + 1) % 4)}>
        Next Face
      </button>
    </div>
  );
}
```

## Performance Optimization

- `transform: rotate()` uses GPU acceleration
- Using `will-change: transform` can improve performance for 3D rotations
- Be cautious with simultaneous rotation of many elements as it may impact performance

## Accessibility Considerations

```tsx
<div 
  ref={transition({ 
    key: 'accessible-rotate', 
    ...rotate() 
  })}
  role="img"
  aria-label="Rotating logo"
  aria-live="polite"
>
  <Logo />
</div>
```

## Recommended Use Cases

- **Loading indicators**: Spinners, progress indicators
- **Icon transitions**: Icon rotation on state changes
- **Card interactions**: Flip effects for front/back
- **Refresh actions**: Refresh button animations
- **Game elements**: Roulette wheels, dice, and other game UI