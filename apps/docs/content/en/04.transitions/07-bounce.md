---
title: "Bounce Animation"
description: "Create lively effects that make elements appear to bounce"
nav-title: "Bounce"
---

# Bounce Animation

The Bounce animation creates a bouncing effect that makes elements appear to spring up and down. It's effective for drawing attention and creating playful, engaging user experiences.

## Basic Usage

```tsx
import { transition } from '@ssgoi/react';
import { bounce } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'bounce-element', ...bounce() })}>
          Element with bounce animation
        </div>
      )}
    </div>
  );
}
```

## Options

```typescript
interface BounceOptions {
  height?: number;         // Bounce height (default: 20)
  intensity?: number;      // Bounce intensity (default: 1)
  scale?: boolean;         // Add scale effect (default: true)
  fade?: boolean;          // Add fade effect (default: false)
  direction?: 'up' | 'down';  // Bounce direction (default: 'up')
  spring?: {
    stiffness?: number;    // Spring stiffness (default: 800)
    damping?: number;      // Damping coefficient (default: 15)
  };
}
```

### Option Details

- **height**: Maximum bounce height (pixels)
- **intensity**: Bounce count and intensity (1 = default, 2 = double)
- **scale**: Add scaling effect with bounce
- **fade**: Add fade effect with bounce
- **direction**: Bounce direction
  - `'up'`: Bounce upward
  - `'down'`: Drop downward
- **spring**: Spring physics settings (higher stiffness = faster bounce)

## Usage Examples

### Bounce Intensity Control

```tsx
// Soft bounce
const softBounce = bounce({ 
  height: 10,
  intensity: 0.5,
  spring: { stiffness: 600, damping: 20 }
});

// Strong bounce
const strongBounce = bounce({ 
  height: 30,
  intensity: 2,
  spring: { stiffness: 1000, damping: 10 }
});

// Subtle bounce
const subtleBounce = bounce({ 
  height: 5,
  intensity: 0.3
});
```

### Direction Change

```tsx
// Bounce up (default)
const bounceUp = bounce({ 
  direction: 'up' 
});

// Bounce down (dropping effect)
const bounceDown = bounce({ 
  direction: 'down',
  height: 25
});
```

### Combined Effects

```tsx
// Bounce + Fade
const bounceFade = bounce({ 
  fade: true,
  height: 20
});

// Bounce only (no scale)
const bounceOnly = bounce({ 
  scale: false,
  height: 15
});

// All effects combined
const bounceAll = bounce({ 
  height: 25,
  intensity: 1.5,
  scale: true,
  fade: true,
  spring: { stiffness: 700, damping: 12 }
});
```

## Practical Use Cases

### Like Button

```tsx
function LikeButton() {
  const [isLiked, setIsLiked] = useState(false);
  
  return (
    <button
      onClick={() => setIsLiked(!isLiked)}
      className="relative p-2"
    >
      {isLiked ? (
        <HeartIcon 
          ref={transition({ 
            key: 'heart-filled', 
            ...bounce({ 
              height: 15,
              intensity: 1.2,
              spring: { stiffness: 900, damping: 15 }
            }) 
          })}
          className="w-8 h-8 text-red-500"
        />
      ) : (
        <HeartOutlineIcon className="w-8 h-8 text-gray-400" />
      )}
      
      {/* Like count animation */}
      {isLiked && (
        <span 
          ref={transition({ 
            key: 'like-count', 
            ...bounce({ 
              height: 10,
              direction: 'up',
              fade: true
            }) 
          })}
          className="absolute -top-2 -right-2 text-xs text-red-500"
        >
          +1
        </span>
      )}
    </button>
  );
}
```

### Notification Bell

```tsx
function NotificationBell({ hasNew }) {
  return (
    <div className="relative">
      <BellIcon 
        ref={hasNew ? transition({ 
          key: 'bell-bounce', 
          ...bounce({ 
            height: 8,
            intensity: 2,
            spring: { stiffness: 1200, damping: 20 }
          }) 
        }) : undefined}
        className="w-6 h-6"
      />
      
      {hasNew && (
        <div 
          ref={transition({ 
            key: 'notification-dot', 
            ...bounce({ 
              height: 5,
              scale: true
            }) 
          })}
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
        />
      )}
    </div>
  );
}
```

### Success Message

```tsx
function SuccessMessage({ show, message }) {
  return (
    <>
      {show && (
        <div 
          ref={transition({ 
            key: 'success-message', 
            ...bounce({ 
              height: 20,
              direction: 'down',
              fade: true,
              spring: { stiffness: 600, damping: 18 }
            }) 
          })}
          className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
        >
          <CheckCircleIcon className="w-5 h-5" />
          {message}
        </div>
      )}
    </>
  );
}
```

### Drop Animation

```tsx
function DroppableItem({ item, onDrop }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  
  const handleDrop = () => {
    setIsDropped(true);
    onDrop(item);
  };
  
  return (
    <div
      draggable
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => {
        setIsDragging(false);
        handleDrop();
      }}
      className={isDragging ? 'opacity-50' : ''}
    >
      {isDropped ? (
        <div 
          ref={transition({ 
            key: 'dropped-item', 
            ...bounce({ 
              height: 30,
              direction: 'down',
              intensity: 1.5,
              spring: { stiffness: 500, damping: 12 }
            }) 
          })}
          className="p-4 bg-blue-100 rounded-lg"
        >
          {item.name} (Dropped!)
        </div>
      ) : (
        <div className="p-4 bg-gray-100 rounded-lg cursor-move">
          {item.name}
        </div>
      )}
    </div>
  );
}
```

## Advanced Usage

### Continuous Bounce

```tsx
function ContinuousBounce() {
  const [bounceCount, setBounceCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBounceCount(c => c + 1);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      ref={transition({ 
        key: `bounce-${bounceCount}`, 
        ...bounce({ 
          height: 15,
          intensity: 0.8
        }) 
      })}
      className="w-20 h-20 bg-purple-500 rounded-full"
    />
  );
}
```

### Elastic Menu

```tsx
function ElasticMenu({ items }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-blue-500 text-white rounded-full"
      >
        <MenuIcon />
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-2 space-y-2">
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={transition({ 
                key: `menu-item-${item.id}`, 
                ...bounce({ 
                  height: 20 - index * 3,  // Progressively decrease
                  intensity: 1,
                  spring: { 
                    stiffness: 800 - index * 50,  // Sequential effect
                    damping: 15 
                  }
                }) 
              })}
              className="block w-full px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50"
              style={{ 
                transitionDelay: `${index * 50}ms`  // Stagger effect
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Ball Bounce Simulation

```tsx
function BouncingBall() {
  const [position, setPosition] = useState({ x: 50, y: 0 });
  const [bounceKey, setBounceKey] = useState(0);
  
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setBounceKey(k => k + 1);
  };
  
  return (
    <div 
      className="relative w-full h-96 bg-gray-100 overflow-hidden"
      onClick={handleClick}
    >
      <div
        ref={transition({ 
          key: `ball-${bounceKey}`, 
          ...bounce({ 
            height: 150,
            direction: 'down',
            intensity: 2,
            scale: true,
            spring: { stiffness: 400, damping: 10 }
          }) 
        })}
        className="absolute w-12 h-12 bg-red-500 rounded-full"
        style={{ 
          left: position.x - 24,
          top: position.y - 24
        }}
      />
    </div>
  );
}
```

## Performance Optimization

- Bounce uses `transform: translateY()` for GPU acceleration
- Higher `intensity` values require more calculations
- Consider performance when bouncing multiple elements simultaneously

### Performance Tips

```tsx
// Mobile optimization
const isMobile = window.innerWidth < 768;
const optimizedBounce = bounce({
  height: isMobile ? 10 : 20,
  intensity: isMobile ? 0.8 : 1,
  spring: { 
    stiffness: isMobile ? 900 : 800,
    damping: 15 
  }
});
```

## Accessibility Considerations

```tsx
<button
  ref={transition({ 
    key: 'accessible-bounce', 
    ...bounce() 
  })}
  aria-label="New notification available"
  aria-live="polite"
  aria-atomic="true"
>
  <NotificationIcon />
</button>
```

## Recommended Use Cases

- **Interaction feedback**: Button clicks, likes
- **Notifications**: New messages, update alerts
- **Success/Complete states**: Task completion indicators
- **Game elements**: Score gains, item collection
- **Tutorials**: Highlighting important elements