## SSGOI Page Transition Configuration Guide

### Overview

SSGOI's new page transition configuration system allows for defining complex page transitions in an intuitive and flexible manner. This system is designed with clarity, flexibility, and reusability in mind.

### Key Features

- Explicit from-to relationships: Each transition rule has a clear starting point (from) and destination (to).
- Automatic generation of symmetric transitions: Easily define bidirectional transitions.
- Priority-based rule application: More specific rules take precedence over general rules.
- Wildcard support: Easily define general rules for multiple paths.
- Type safety: Ensure configuration accuracy through TypeScript.

### Configuration Structure

```typescript
type TransitionConfig = {
  transitions: TransitionDefinition[];
  defaultTransition: TransitionPair;
};

type TransitionDefinition = {
  from: string;
  to: string;
  transitions: TransitionPair;
  symmetric?: boolean;
};

type TransitionPair = {
  in: TransitionFunc;
  out: TransitionFunc;
};

type TransitionFunc = (node: HTMLElement, params?: any) => {
  duration?: number;
  delay?: number;
  easing?: (t: number) => number;
  css?: (t: number, u: number) => string;
  tick?: (t: number, u: number) => void;
};
```

### Usage

```typescript
import { createTransitionConfig, transitions } from 'ssgoi';

const config = createTransitionConfig({
  transitions: [
    {
      from: '/demo/blog',
      to: '/demo/post',
      transitions: {
        in: transitions.scrollUpToDown.in,
        out: transitions.scrollDownToUp.out
      },
      symmetric: true
    },
    // Additional transition rules...
  ],
  defaultTransition: {
    in: transitions.fade.in,
    out: transitions.fade.out
  }
});

export default config;
```

### Key Concepts Explained

#### 1. Transition Definition (TransitionDefinition)

Each transition definition consists of the following elements:

- from: Starting path
- to: Destination path
- transitions: Actual transition effects (in and out)
- symmetric: Whether the transition is bidirectional (optional)

#### 2. Symmetric Transitions

Setting symmetric: true automatically generates the reverse transition. For example:

```typescript
{
  from: '/demo/blog',
  to: '/demo/post',
  transitions: {
    in: transitions.scrollUpToDown.in,
    out: transitions.scrollDownToUp.out
  },
  symmetric: true
}
```

This configuration automatically creates a transition from '/demo/post' to '/demo/blog' as well.

#### 3. Priority

Transition rules are applied in the order they are defined in the array. This allows you to:

- Place the most important or specific rules at the top.
- Place general rules using wildcards towards the end to ensure more specific rules take precedence.

#### 4. Wildcards

Use * to define general rules that apply to multiple paths:

```typescript
{
  from: '/demo/*',
  to: '*',
  transitions: {
    in: transitions.fade.in,
    out: transitions.fade.out
  }
}
```

#### 5. Default Transition

Define a default transition to be used when no other rules match.

### Considerations and Recommendations

- Prioritize specific rules: Place more specific path rules towards the beginning of the array.
- Utilize symmetry: Use symmetric: true when possible to reduce code duplication.
- Be cautious with wildcards: Pay attention to the order when using wildcards to prevent unexpected behavior.
- Consider performance: Too many complex transition rules can impact performance, so use them only when necessary.
- Maintain consistency: Use consistent transition effects between similar pages for a better user experience.

### Conclusion

SSGOI's new page transition configuration system allows for clear and flexible expression of complex transition logic. This system enables developers to provide rich user experiences in an intuitive and maintainable way.