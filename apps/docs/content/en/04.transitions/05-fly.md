---
title: "Fly Animation"
description: "Create effects where elements fly in from specific positions"
nav-title: "Fly"
---

# Fly Animation

The Fly animation creates effects where elements fly in from specific coordinates. You can control both X and Y coordinates, enabling diagonal movements and complex entrance effects.

## Basic Usage

```tsx
import { transition } from '@ssgoi/react';
import { fly } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'fly-element', ...fly() })}>
          Element with fly animation
        </div>
      )}
    </div>
  );
}
```

## Options

```typescript
interface FlyOptions {
  x?: number | string;    // X-axis travel distance (default: 0)
  y?: number | string;    // Y-axis travel distance (default: -100)
  opacity?: number;       // Starting opacity (default: 0)
  spring?: {
    stiffness?: number;   // Spring stiffness (default: 400)
    damping?: number;     // Damping coefficient (default: 35)
  };
}
```

### Option Details

- **x**: Horizontal starting position (positive: right, negative: left)
- **y**: Vertical starting position (positive: down, negative: up)
- **opacity**: Starting opacity (0-1)
- **spring**: Spring physics settings

## Usage Examples

### Flying from Different Directions

```tsx
// Fly from top (default)
const flyFromTop = fly();

// Fly from bottom
const flyFromBottom = fly({ 
  y: 100 
});

// Fly from left
const flyFromLeft = fly({ 
  x: -200, 
  y: 0 
});

// Fly from right
const flyFromRight = fly({ 
  x: 200, 
  y: 0 
});

// Diagonal (top-left)
const flyDiagonal = fly({ 
  x: -150, 
  y: -150 
});
```

### Unit Specification

```tsx
// Pixel units (default)
const flyPixels = fly({ 
  x: 100, 
  y: -50 
});

// Rem units
const flyRem = fly({ 
  x: '5rem', 
  y: '-3rem' 
});

// Viewport units
const flyViewport = fly({ 
  x: '50vw', 
  y: '-100vh' 
});

// Percentage units
const flyPercent = fly({ 
  x: '200%', 
  y: '0%' 
});
```

### Opacity Control

```tsx
// Start semi-transparent
const flyWithOpacity = fly({ 
  x: 0, 
  y: -100, 
  opacity: 0.2  // Start at 20% opacity
});

// Fully opaque (fly only)
const flyNoFade = fly({ 
  x: -100, 
  y: 0, 
  opacity: 1  // No fade effect
});
```

## Practical Use Cases

### Floating Action Button (FAB)

```tsx
function FloatingActionButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="fixed bottom-4 right-4">
      {/* Main button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg"
      >
        +
      </button>
      
      {/* Sub buttons */}
      {isExpanded && (
        <>
          <button
            ref={transition({ 
              key: 'fab-1', 
              ...fly({ x: -60, y: -10 }) 
            })}
            className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-green-500"
          >
            📝
          </button>
          
          <button
            ref={transition({ 
              key: 'fab-2', 
              ...fly({ x: -45, y: -45 }) 
            })}
            className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-red-500"
          >
            📸
          </button>
          
          <button
            ref={transition({ 
              key: 'fab-3', 
              ...fly({ x: -10, y: -60 }) 
            })}
            className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-yellow-500"
          >
            📎
          </button>
        </>
      )}
    </div>
  );
}
```

### Card Grid Animation

```tsx
function CardGrid({ cards }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card, index) => {
        // Each card flies from different direction
        const row = Math.floor(index / 3);
        const col = index % 3;
        
        return (
          <div
            key={card.id}
            ref={transition({ 
              key: `card-${card.id}`, 
              ...fly({ 
                x: (col - 1) * 100,  // Center column is 0, left/right are ±100
                y: row * 50,         // Lower rows start from further down
                spring: { 
                  stiffness: 300, 
                  damping: 30 + index * 2  // Sequential effect
                }
              }) 
            })}
            className="p-4 bg-white rounded-lg shadow"
          >
            {card.content}
          </div>
        );
      })}
    </div>
  );
}
```

### Tooltip Animation

```tsx
function Tooltip({ children, content }) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPosition({
            x: rect.width / 2,
            y: -10
          });
          setIsVisible(true);
        }}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={transition({ 
            key: 'tooltip', 
            ...fly({ 
              x: 0, 
              y: 10,  // Slightly rise from below
              opacity: 0.1 
            }) 
          })}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded"
          style={{ left: position.x }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
```

### Notification Stack

```tsx
function NotificationStack({ notifications }) {
  return (
    <div className="fixed top-4 right-4 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          ref={transition({ 
            key: `notification-${notification.id}`, 
            ...fly({ 
              x: 300,  // Fly from right
              y: 0,
              spring: { 
                stiffness: 400, 
                damping: 35 
              }
            }) 
          })}
          className="bg-white rounded-lg shadow-lg p-4 min-w-[300px]"
        >
          <h4 className="font-semibold">{notification.title}</h4>
          <p className="text-sm text-gray-600">{notification.message}</p>
        </div>
      ))}
    </div>
  );
}
```

## Advanced Usage

### Mouse Position-based Fly

```tsx
function MouseBasedFly() {
  const [items, setItems] = useState([]);
  
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const newItem = {
      id: Date.now(),
      x,
      y
    };
    
    setItems([...items, newItem]);
  };
  
  return (
    <div 
      className="relative w-full h-96 bg-gray-100 overflow-hidden"
      onClick={handleClick}
    >
      {items.map(item => (
        <div
          key={item.id}
          ref={transition({ 
            key: `item-${item.id}`, 
            ...fly({ 
              x: -item.x,  // From click position to center
              y: -item.y,
              spring: { stiffness: 200, damping: 25 }
            }) 
          })}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-blue-500 rounded-full"
        />
      ))}
    </div>
  );
}
```

### Staggered Fly Animation

```tsx
function StaggeredFly({ items }) {
  const [visibleItems, setVisibleItems] = useState([]);
  
  useEffect(() => {
    // Show items sequentially
    items.forEach((item, index) => {
      setTimeout(() => {
        setVisibleItems(prev => [...prev, item]);
      }, index * 100);
    });
  }, [items]);
  
  return (
    <div className="space-y-2">
      {visibleItems.map((item, index) => (
        <div
          key={item.id}
          ref={transition({ 
            key: `stagger-${item.id}`, 
            ...fly({ 
              x: -50 - index * 10,  // Progressively from further away
              y: 0,
              spring: { 
                stiffness: 300, 
                damping: 30 
              }
            }) 
          })}
          className="p-3 bg-white rounded shadow"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
```

## Performance Optimization

- `transform: translate()` uses GPU acceleration
- Animating X and Y simultaneously is handled with a single transform
- Spring physics create more natural motion than CSS animations for complex paths

## Accessibility Considerations

```tsx
<div 
  ref={transition({ 
    key: 'accessible-fly', 
    ...fly({ x: -100, y: -50 }) 
  })}
  role="status"
  aria-live="polite"
  aria-label="Flying content"
>
  Important notification content
</div>
```

## Recommended Use Cases

- **Floating buttons**: FAB menu expansion
- **Tooltips/Popovers**: Mouse position-based display
- **Notifications**: Entry from screen edges
- **Card layouts**: Grid item animations
- **Dashboard widgets**: Dynamic content addition