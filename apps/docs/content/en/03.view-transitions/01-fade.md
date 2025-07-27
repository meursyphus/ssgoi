---
title: "Fade Transition"
description: "Smoothly transition pages with fade in/out effects"
nav-title: "Fade"
---

# Fade Transition

The Fade transition is the most basic yet elegant page transition effect. It provides a smooth transition where the current page gradually fades out while the new page fades in.

## Basic Usage

```tsx
import { Ssgoi } from '@ssgoi/react';
import { fade } from '@ssgoi/react/view-transitions';

const config = {
  defaultTransition: fade()
};

export default function App() {
  return (
    <Ssgoi config={config}>
      {/* App content */}
    </Ssgoi>
  );
}
```

## Options

The fade transition allows customization of spring animation settings:

```tsx
fade({
  spring: {
    stiffness: 300,  // Spring stiffness (default: 300)
    damping: 30      // Damping ratio (default: 30)
  }
})
```

### Spring Options Explained

- **stiffness**: Controls the speed of the animation. Higher values result in faster transitions
- **damping**: Controls the bounce of the animation. Higher values result in smoother transitions

## Usage Examples

### Slow Fade

Smooth and slow fade effect:

```tsx
const config = {
  defaultTransition: fade({
    spring: {
      stiffness: 100,
      damping: 20
    }
  })
};
```

### Fast Fade

Quick and snappy fade effect:

```tsx
const config = {
  defaultTransition: fade({
    spring: {
      stiffness: 500,
      damping: 40
    }
  })
};
```

## Route-Specific Application

```tsx
const config = {
  transitions: [
    {
      from: '/home',
      to: '/about', 
      transition: fade(),
      symmetric: true  // Automatically applies fade for /about → /home
    }
  ]
};

<Ssgoi config={config}>
  {/* App content */}
</Ssgoi>
```

## How It Works

The fade transition works as follows:

1. **Outgoing page**: Opacity decreases from 1 to 0
2. **Incoming page**: Opacity increases from 0 to 1
3. Both animations run simultaneously creating a natural crossfade effect

## Advantages

- Universal transition suitable for all content types
- Lightweight animation with minimal CPU/GPU impact
- Visually smooth and professional appearance
- Direction-agnostic, works naturally with any navigation pattern

## Recommended Use Cases

- Default page transitions
- Navigation between unrelated content pages
- When a calm and elegant user experience is needed
- Performance-critical mobile environments