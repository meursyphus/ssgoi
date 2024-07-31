# SSGOI - Svelte Smooth Go Transition Library

SSGOI (쓱고이) is a powerful and easy-to-use page transition library for Svelte and SvelteKit applications. Make your pages go "쓱!" (swoosh) like a model on a digital catwalk!

## What's in a name?

SSGOI combines two fantastic ideas:
- "쓱" (sseuk): A Korean onomatopoeia for a quick, smooth movement - just like our page transitions!
- "すごい" (sugoi): Japanese for "amazing" - because that's what your users will say when they see these transitions!

## Features

- 🚀 Simple setup for complex page transitions
- 🎨 Various built-in transition effects
- 📱 Dynamic transitions based on runtime conditions
- 🔧 Create custom transition effects
- 🔒 TypeScript support for type safety

## Installation

```bash
npm install ssgoi
```

## Basic Usage

1. Create a transition configuration:

```typescript
// src/lib/transitionConfig.ts
import { createTransitionConfig, transitions } from 'ssgoi';

const transitionConfig = createTransitionConfig({
  '/': {
    '*': transitions.fade
  },
  '/blog': {
    '/post/:id': transitions.slide,
    '*': transitions.fade
  },
  '*': {
    '*': transitions.fade
  }
});

export default transitionConfig;
```

2. Apply the PageTransition component in your layout:

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { PageTransition } from 'ssgoi';
  import transitionConfig from '$lib/transitionConfig';
</script>

<PageTransition {transitionConfig}>
  <slot />
</PageTransition>
```

## Advanced Features

### Dynamic Transitions

Apply different transitions based on runtime conditions:

```typescript
import { createTransitionConfig, transitions } from 'ssgoi';

const transitionConfig = createTransitionConfig({
  '/blog': {
    '/post/:id': () => {
      return window.innerWidth < 768 ? transitions.fade : transitions.slide;
    },
  }
});
```

### Custom Transition Effects

Create your own transition effects:

```typescript
import { type Transition } from 'ssgoi';

const customTransition: Transition = {
  in: (node, params) => {
    // Entry transition logic
    return {
      duration: 300,
      css: t => `opacity: ${t}; transform: scale(${t})`
    };
  },
  out: (node, params) => {
    // Exit transition logic
    return {
      duration: 300,
      css: t => `opacity: ${t}; transform: scale(${1-t})`
    };
  }
};
```

## Documentation

For more detailed usage and API documentation, please refer to our [official documentation](https://ssgoi-docs.example.com).

## Contributing

We welcome bug reports, feature requests, and pull requests! Before contributing, please read our [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.