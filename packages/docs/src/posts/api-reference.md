---
title: "SSGOI API Reference"
description: "Comprehensive guide to SSGOI's API, including functions, components, and configuration options"
order: 1
group: "Reference"
---

# SSGOI API Specification

## Overview

SSGOI (쓱고이) is a page transition library for Svelte applications. This document outlines the API specification for configuring and using SSGOI in your projects.

## Type Definitions

```typescript
import type { TransitionConfig as SvelteTransitionConfig } from 'svelte/transition';

export interface RouteInfo {
  path: string;
}

export type TransitionEffect = {
  in: (node: Element, params?: any) => SvelteTransitionConfig;
  out: (node: Element, params?: any) => SvelteTransitionConfig;
};

export type TransitionFunction = (from: RouteInfo, to: RouteInfo) => TransitionEffect;

export interface TransitionDefinition {
  from: string;
  to: string;
  transitions: TransitionEffect | TransitionFunction;
  symmetric?: boolean;
}

export interface TransitionConfigInput {
  transitions: TransitionDefinition[];
  defaultTransition: TransitionEffect | TransitionFunction;
}

export type TransitionConfig = (from: RouteInfo, to: RouteInfo) => TransitionEffect;
```

## Key Concepts

### RouteInfo

Represents basic information about a route.

### TransitionEffect

Defines the `in` and `out` transitions for a page transition.

### TransitionFunction

A function that dynamically determines the transition effect based on the `from` and `to` routes.

### TransitionDefinition

Defines a single transition rule, specifying the `from` and `to` routes, and the transition to apply.

### TransitionConfigInput

The main configuration object for SSGOI, containing an array of transition definitions and a default transition.

### TransitionConfig

The final, compiled configuration function that determines the transition effect for any given route change.

## Usage

### Creating a Configuration

Use the `createTransitionConfig` function to create your SSGOI configuration:

```typescript
import { createTransitionConfig, transitions } from 'ssgoi';

const config = createTransitionConfig({
  transitions: [
    {
      from: '/home',
      to: '/about',
      transitions: transitions.fade,
      symmetric: true
    },
    {
      from: '/blog',
      to: '/post/:id',
      transitions: (from, to) => {
        // Dynamic transition logic
        return from.path === '/blog' ? transitions.slideRight : transitions.slideLeft;
      }
    }
  ],
  defaultTransition: transitions.fade
});
```

### Applying the Configuration

Apply the configuration to your Svelte app's routing system. The exact method may vary depending on your routing solution.

## Key Features

1. **Explicit From-To Relationships**: Each transition rule clearly defines both the starting and ending routes.

2. **Symmetric Transitions**: Easily define bidirectional transitions with the `symmetric` option.

3. **Dynamic Transitions**: Use functions to determine transitions based on runtime conditions.

4. **Fallback Transitions**: A default transition is applied when no specific rules match.

5. **Wildcard Support**: Use `*` in route patterns for flexible matching.

6. **Priority-Based Rules**: Transitions are evaluated in the order they are defined, allowing for specific rules to take precedence over general ones.

## Best Practices

1. Order your transitions from most specific to least specific.
2. Use the `symmetric` option to reduce duplication when appropriate.
3. Leverage dynamic transitions for complex logic, but prefer static transitions for simplicity when possible.
4. Always provide a sensible default transition.
5. Use wildcard patterns judiciously to avoid unexpected behavior.

## Performance Considerations

- Keep the number of transition rules manageable to ensure quick evaluation.
- Use simple transitions for frequent route changes.
- Consider the performance impact of complex dynamic transition functions.

This specification provides a flexible and powerful way to define page transitions in your Svelte applications using SSGOI.