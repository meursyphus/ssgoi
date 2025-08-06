# Contributing to SSGOI

Thank you for contributing to SSGOI! This guide will help you set up the project and understand the development process.

## 1. Getting Started

### Development Environment Requirements

- **Node.js**: 18.0.0 or higher
- **pnpm**: 10.13.1 (specified version for this project)
  ```bash
  # Install pnpm
  npm install -g pnpm@10.13.1
  ```

### Clone and Setup

```bash
# Clone the repository
git clone https://github.com/meursyphus/ssgoi.git
cd ssgoi

# Install dependencies
pnpm install
```

## 2. Project Structure

SSGOI is a monorepo using pnpm workspaces.

```
ssgoi/
├── packages/          # Core library packages
│   ├── core/         # Animation engine and core logic
│   ├── react/        # React bindings
│   └── svelte/       # Svelte bindings
├── apps/             # Applications
│   ├── docs/         # Documentation site (Next.js)
│   ├── react-demo/   # React demo app
│   └── svelte-demo/  # Svelte demo app
└── [config files]    # Root configuration files
```

### `/packages` - Core Libraries

- **`@ssgoi/core`**: Framework-agnostic animation engine
  - Spring physics-based animations
  - Transition definitions and management
  - View transition implementations

- **`@ssgoi/react`**: Bindings for React/Next.js
  - React components (`<Ssgoi>`, `<SsgoiTransition>`)
  - React Hook (`transition()`)
  - Re-exports from core package

- **`@ssgoi/svelte`**: Bindings for Svelte/SvelteKit
  - Svelte components
  - Svelte-specific transition functions
  - Re-exports from core package

### `/apps` - Demos and Documentation

- **`docs`**: Official documentation site (https://ssgoi.dev)
  - Built with Next.js
  - Multi-language support (en, ko, ja, zh)
  - MDX documentation and blog

- **`react-demo`**: React demo application
  - Uses Next.js App Router
  - Real-world usage examples

- **`svelte-demo`**: Svelte demo application
  - Built with SvelteKit
  - Examples in Svelte environment

## 3. Development Workflow

### Building Packages

```bash
# Build all packages
pnpm init

# Build specific packages
pnpm core:build    # Build @ssgoi/core
pnpm react:build   # Build @ssgoi/react
pnpm svelte:build  # Build @ssgoi/svelte

# Watch mode (auto-build during development)
pnpm core:watch
pnpm react:watch
pnpm svelte:watch
```

### Running Demo Apps

#### React Demo

```bash
pnpm react-demo
# Available at http://localhost:3000
```

#### Svelte Demo

```bash
pnpm svelte-demo
# Available at http://localhost:5174
```

### Running Documentation Site

```bash
pnpm docs
# Available at http://localhost:3000
```

> **Note**: Both the React demo and documentation site use port 3000. Run only one at a time.

### Testing and Linting

```bash
# Lint all packages
pnpm lint

# Format code
pnpm format
```

---

## Need Help?

- **Discord**: Join the [SSGOI Discord channel](https://discord.gg/9gSSWQbvX4)
- **Blog**: Check out more information at [ssgoi.dev/blog](https://ssgoi.dev/blog)
- **Author**: Contact meursyphus directly on Discord

Thank you for contributing to the project! 🚀
