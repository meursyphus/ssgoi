---
title: Context Flow in SSGOI
description: Deep dive into how context flows through SSGOI components for page transitions
order: 12
group: Advanced
---

# Context Flow in SSGOI

SSGOI uses Svelte's context API to manage state and configuration across components. This guide explains how context flows through the library and how the different pieces work together.

## Overview

SSGOI's context system consists of four main contexts that work together:

1. **Config Context** - Stores transition configuration
2. **Page Transition Context** - Tracks navigation state
3. **Scroll History Context** - Maintains scroll positions
4. **Hero Context** - Manages hero animations

## Context Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    App Root (+layout)                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │               <Ssgoi> Component                    │  │
│  │  - Initializes all contexts                       │  │
│  │  - Sets up onNavigate hooks                       │  │
│  │  - Provides context to children                   │  │
│  │                                                    │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │           Page Content (+page)               │  │  │
│  │  │  ┌───────────────────────────────────────┐  │  │  │
│  │  │  │     <PageTransition> Component        │  │  │  │
│  │  │  │  - Consumes contexts                  │  │  │  │
│  │  │  │  - Applies transitions                │  │  │  │
│  │  │  │  - Wraps page content                 │  │  │  │
│  │  │  └───────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Initialization Phase

### 1. Setting Up the Provider (`Ssgoi.svelte`)

```svelte
<script lang="ts">
  import context from '../context/index.js';
  
  // Initialize all contexts
  context.config.init(config);
  const pageTransitionContext = context.pageTransition.init();
  const scrollHistoryContext = context.scrollHistory.init();
  context.hero.init();
  
  // Set up navigation hooks
  onNavigate(({ from, to }) => {
    pageTransitionContext.from = from;
    pageTransitionContext.to = to;
  });
  
  onNavigate(({ from }) => {
    // Save scroll position before navigating away
    const path = from?.url.pathname;
    if (path) {
      scrollHistoryContext[path] = document.scrollingElement?.scrollTop ?? 0;
    }
  });
</script>
```

The `Ssgoi` component:
- Creates all four contexts and makes them available to child components
- Sets up navigation listeners to update context state
- Saves scroll positions before navigation

### 2. Configuration Setup

The configuration you provide determines which transitions are used:

```typescript
// Example: page-config.ts
const config = createTransitionConfig({
  transitions: [
    {
      from: '/products',
      to: '/products/*',
      transitions: transitions.hero()
    },
    {
      from: '/posts',
      to: '/posts/*',
      transitions: transitions.fade()
    }
  ],
  defaultTransition: transitions.none()
});
```

This configuration is stored in the config context and accessed during navigation.

## Runtime Phase

### 3. Navigation Trigger

When navigation occurs (user clicks a link):

1. **SvelteKit's `onNavigate`** fires
2. **Page Transition Context** is updated with `from` and `to` routes
3. **Scroll History Context** saves the current scroll position

### 4. Transition Application (`PageTransition.svelte`)

```svelte
<script lang="ts">
  // Get contexts
  const config = context.config.get();
  const scrollHistoryContext = context.scrollHistory.get();
  const pageTransitionContext = context.pageTransition.get();
  
  function transitionIn(node: HTMLElement, params) {
    const { from, to } = pageTransitionContext;
    // Config function determines which transition to use
    const transition = config({ path: from.url.pathname }, { path: to.url.pathname });
    return transition.in(node, params);
  }
  
  function transitionOut(node: HTMLElement, params) {
    const { from, to } = pageTransitionContext;
    const transition = config({ path: from.url.pathname }, { path: to.url.pathname });
    return transition.out(node, params);
  }
</script>
```

The `PageTransition` component:
- Retrieves all contexts
- Uses the config to determine which transition to apply
- Passes scroll positions to transitions
- Applies enter/exit animations

## Context Details

### Config Context

**Purpose**: Stores the transition configuration function

**Data Structure**:
```typescript
type ConfigContext = (from: RouteInfo, to: RouteInfo) => TransitionOption
```

**Usage**: Called during navigation to determine which transition to use based on the current and target routes.

### Page Transition Context

**Purpose**: Tracks current navigation state

**Data Structure**:
```typescript
type PageTransitionContext = {
  from: Navigation['from'],  // Previous route
  to: Navigation['to']       // Target route
}
```

**Usage**: Updated on every navigation, consumed by `PageTransition` to know which routes are transitioning.

### Scroll History Context

**Purpose**: Maintains scroll positions for each visited route

**Data Structure**:
```typescript
type ScrollHistoryContext = Record<string, number>
// Example: { '/': 0, '/products': 150, '/about': 300 }
```

**Usage**: 
- Saves scroll position before navigation
- Provides scroll positions to transitions for smooth animations
- Enables scroll restoration when navigating back

### Hero Context

**Purpose**: Provides crossfade functionality for hero transitions

**Data Structure**:
```typescript
type HeroContext = {
  send: Function,    // Marks element as hero source
  receive: Function  // Marks element as hero target
}
```

**Usage**: Special context for hero animations that need to animate elements between different pages.

## Example: Complete Flow

Let's trace a navigation from `/products` to `/products/widget`:

1. **User clicks a product link**

2. **`onNavigate` fires** in `Ssgoi.svelte`:
   ```javascript
   pageTransitionContext.from = { url: { pathname: '/products' } }
   pageTransitionContext.to = { url: { pathname: '/products/widget' } }
   scrollHistoryContext['/products'] = 150 // Current scroll position
   ```

3. **Old page starts exit transition**:
   - `PageTransition` calls `transitionOut`
   - Config function returns `hero()` transition
   - Hero transition starts with saved scroll position

4. **New page starts enter transition**:
   - `PageTransition` calls `transitionIn`
   - Same `hero()` transition is applied
   - Elements animate to their new positions

5. **Transitions complete**:
   - Navigation is finished
   - Contexts are ready for next navigation

## Best Practices

1. **Always wrap page content** with `PageTransition` to enable transitions
2. **Configure transitions thoughtfully** - consider user experience and performance
3. **Use appropriate transitions** - hero for detail views, fade for unrelated pages
4. **Test scroll behavior** - ensure positions are saved and restored correctly

## Custom Context Usage

You can access these contexts in your own components:

```svelte
<script>
  import { getContext } from 'svelte';
  
  // Get the current navigation state
  const pageTransition = getContext(Symbol.for('page-transition-navigation'));
  
  // Access scroll history
  const scrollHistory = getContext(Symbol.for('scroll-history'));
</script>
```

Note: Direct context access is rarely needed - the built-in components handle most use cases.

## Summary

SSGOI's context flow enables smooth page transitions by:

1. **Centralizing configuration** in the config context
2. **Tracking navigation state** in the page transition context
3. **Preserving scroll positions** in the scroll history context
4. **Enabling complex animations** with the hero context

The contexts work together seamlessly, with `Ssgoi` setting up the system and `PageTransition` consuming it to create beautiful transitions.