---
title: 'SSGOI Architecture'
description: A comprehensive guide to SSGOI's architecture, including its core components, context management, transitions, and data flow. Learn how SSGOI organizes its code to provide flexible and powerful page transitions in SvelteKit applications.
order: 5
group: 'Advanced'
---

# SSGOI Architecture 🏗️

## 1. Configuration ⚙️

### createTransitionConfig

- Core function for creating page transition configurations
- Maps transition effects based on route patterns
- Handles default transition fallbacks

## 2. Components 🧩

### Ssgoi.svelte (Provider)

- Manages and initializes global state
  - Initializes transition configuration
  - Sets up page transition context
  - Manages scroll history
  - Handles navigation events

### PageTransition.svelte (Implementation)

- Executes actual transition effects
  - Handles transition animations
  - Manages scroll positions
  - Implements animation logic

## 3. Context 🌍

### config.ts

- Global transition settings management
- Handles `TransitionRouteConfig` type configurations

### pageTransition.ts

- Manages page transition state
- Tracks current and next page information
- Stores SvelteKit navigation data

### scrollHistory.ts

- Manages per-page scroll positions
- Stores scroll positions using URL paths

### hero.ts

- Manages Hero transition state
- Provides context for element transitions between pages

## 4. Transitions ✨

### Built-in Effects

- fade: Fade in/out transitions
- scroll: Scroll-based transitions
- hero: Element-based transitions
- pinterest: Pinterest-style transitions
- ripple: Ripple effect transitions
- none: No transition effect

### boilerplate

- Template for creating new transition effects

## 5. Easing 🎭

- Controls transition speed and progression
- Utilizes Svelte's built-in easing functions

## 6. Utils 🛠️

### getRootRect.ts

- Retrieves Ssgoi root element position/size
- Finds elements with `data-ssgoi` attribute

### isFunction.ts

- Function type checking utility

## Data Flow 📊

```text
1. Configuration Flow
   createTransitionConfig
       ↓
   Initialize in Ssgoi.svelte
       ↓
   Store in context (config.ts)
       ↓
   Consume in PageTransition.svelte

2. Page Transition Flow
   Navigation Event Triggered → Ssgoi.svelte (Provider)
                                    ↓
                            Update Context States
                     (pageTransition.ts, scrollHistory.ts)
                                    ↓
                         PageTransition.svelte (Consumer)
                                    ↓
                        Execute Transition Animation
                      (utilizing transitions + easing)

3. Hero Transition Flow
   Initialize hero.ts context
            ↓
   Track Target Elements
            ↓
   Apply Hero Animation
```
