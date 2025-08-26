# View Transition Demo Components Guide

## Overview

This directory contains demo components that showcase different SSGOI view transition effects. These demos are embedded in the documentation to provide interactive examples for users.

## Architecture

### Core Concept: BrowserMockup Pattern

All demo components follow a consistent pattern using the `BrowserMockup` component:

```tsx
export function TransitionDemo() {
  const config = {
    defaultTransition: transition(), // Your transition
  };

  return (
    <BrowserMockup 
      routes={routes}        // Route configuration
      config={config}        // SSGOI config
      layout={CustomLayout}  // Optional custom layout
      initialRoute="/path"   // Starting route
    />
  );
}
```

### Why This Pattern?

1. **Separation of Concerns**: BrowserMockup handles all SSGOI setup internally (Ssgoi provider, SsgoiTransition wrappers, routing logic)
2. **Consistency**: All demos follow the same structure making them easy to understand and maintain
3. **Reusability**: The mock browser chrome provides a realistic context for transitions
4. **Simplicity**: Demo authors only need to define routes, config, and optionally a layout

## Component Structure

### 1. Route Configuration

Define pages as components and map them to routes:

```tsx
// Define page components
function HomePage() {
  return (
    <DemoPage path="/" title="Home">
      {/* Page content */}
    </DemoPage>
  );
}

// Create route configuration
const routes: RouteConfig[] = [
  { path: "/", component: HomePage, label: "Home" },
  { path: "/about", component: AboutPage, label: "About" },
];
```

### 2. Transition Configuration

Configure the transition for your demo:

```tsx
const config = {
  defaultTransition: fade(), // or slide(), scroll(), hero(), etc.
  // Optional: route-specific transitions
  transitions: [
    {
      from: "/list",
      to: "/detail/*",
      transition: slide({ direction: 'left' }),
    }
  ]
};
```

### 3. Custom Layouts (Optional)

Add custom navigation or UI chrome:

```tsx
function CustomLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoLayout logo="⚡" title="My Demo">
      {/* Custom navigation, headers, etc. */}
      {children}
    </DemoLayout>
  );
}
```

## Creating a New Demo

### Step 1: Create the demo file

```tsx
// new-transition-demo.tsx
"use client";

import React from "react";
import { newTransition } from "@ssgoi/react/view-transitions";
import { BrowserMockup, DemoPage } from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";
```

### Step 2: Define your pages

```tsx
function Page1() {
  return (
    <DemoPage path="/page1" title="Page 1">
      {/* Your content */}
    </DemoPage>
  );
}

function Page2() {
  return (
    <DemoPage path="/page2" title="Page 2">
      {/* Your content */}
    </DemoPage>
  );
}
```

### Step 3: Set up routes and config

```tsx
const routes: RouteConfig[] = [
  { path: "/page1", component: Page1, label: "Page 1" },
  { path: "/page2", component: Page2, label: "Page 2" },
];

export function NewTransitionDemo() {
  const config = {
    defaultTransition: newTransition(),
  };

  return (
    <BrowserMockup 
      routes={routes}
      config={config}
      initialRoute="/page1"
    />
  );
}
```

### Step 4: Add to index.tsx

```tsx
// index.tsx
import { NewTransitionDemo } from "./new-transition-demo";

export interface ViewTransitionDemoProps {
  type: "fade" | "hero" | "new-transition" | ...;
}

export function ViewTransitionDemo({ type }: ViewTransitionDemoProps) {
  switch (type) {
    case "new-transition":
      return <NewTransitionDemo />;
    // ...
  }
}
```

## Examples

### Basic Demo (fade-demo.tsx)

Simple multi-page demo with fade transitions:
- Multiple pages with different content
- Custom layout with branding
- Navigation between pages

### Sidebar Navigation (scroll-demo.tsx)

Demo with sidebar navigation:
- Custom layout with left sidebar
- Scroll transitions between sections
- Active state highlighting

### Dynamic Routes (hero-demo.tsx)

Gallery demo with dynamic detail pages:
- List page with grid layout
- Dynamic detail pages for each item
- Hero transitions with data-hero-key

## Important Notes

### DO NOT:
- Import and use `Ssgoi` or `SsgoiTransition` directly - BrowserMockup handles this
- Manage routing state manually - use the routes configuration
- Create complex state management - keep demos simple and focused

### DO:
- Use `DemoPage` wrapper for all page components
- Use `<a href="/path">` for navigation - BrowserMockup intercepts these
- Keep demos focused on showcasing the specific transition
- Use realistic content that demonstrates the transition well

## Common Patterns

### Navigation Links

Use standard anchor tags - BrowserMockup will handle them:

```tsx
<a href="/about">Go to About</a>
```

### Active State

For custom navigation, you can access the current route:

```tsx
function CustomNav({ children }: { children: React.ReactNode }) {
  return (
    <nav>
      {routes.map(route => (
        <a 
          href={route.path}
          data-active={currentRoute === route.path}
          className="data-[active=true]:bg-blue-500"
        >
          {route.label}
        </a>
      ))}
    </nav>
  );
}
```

### Hero Transitions

For hero transitions, use `data-hero-key` attributes:

```tsx
// List page
<div data-hero-key="item-1">
  <img src="..." />
</div>

// Detail page
<div data-hero-key="item-1">
  <img src="..." />
</div>
```

## Testing

When creating or modifying demos:

1. Test all navigation paths
2. Verify transitions work smoothly
3. Check responsive behavior
4. Ensure content is appropriate and realistic
5. Test in documentation context using `<ViewTransitionDemo type="your-type" />`

## File Naming Convention

- Use lowercase with hyphens: `transition-name-demo.tsx`
- Export named function: `export function TransitionNameDemo()`
- Keep related assets in the same directory

## Tips

1. **Keep it Simple**: Demos should focus on the transition, not complex functionality
2. **Use Real Content**: Realistic content helps users understand use cases
3. **Consider Mobile**: Ensure demos work well on mobile screens
4. **Performance**: Keep images optimized and content lightweight
5. **Accessibility**: Include proper ARIA labels and semantic HTML

## Need Help?

- Check existing demos for patterns and examples
- The `browser-mockup.tsx` file contains all available props and options
- Keep demos consistent with the established patterns for maintainability