# Ssgoi Core

TypeScript vanilla library for smooth page transitions.

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build the library
pnpm build

# Preview the build
pnpm preview
```

## Usage

```typescript
import { createTransition } from '@ssgoi/core'

createTransition({
  from: element1,
  to: element2,
  options: {
    duration: 1000,
    easing: 'ease-in-out'
  }
})
```