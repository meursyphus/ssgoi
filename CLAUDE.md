# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SSGOI (상태를 기억하는 스프링 트랜지션) is a powerful page transition library for React and Svelte applications that remembers animation state for smooth transitions. The key feature is maintaining velocity and position during animation direction changes (in → out) for seamless transitions.

## Commands

### Development
- `pnpm start` - Build core library and start docs dev server (recommended for development)
- `pnpm docs:dev` - Run documentation site only
- `pnpm dev:all` - Run all packages in development mode in parallel

### Package-specific development
- `pnpm core:dev` - Develop @ssgoi/core
- `pnpm react:dev` - Develop React bindings
- `pnpm svelte:dev` - Develop Svelte bindings
- `pnpm react-demo:dev` - Run React demo app
- `pnpm svelte-demo:dev` - Run Svelte demo app

### Building
- `pnpm build:all` - Build all packages
- `pnpm core:build` - Build core library
- `pnpm react:build` - Build React bindings
- `pnpm svelte:build` - Build Svelte bindings
- `pnpm docs:build` - Build documentation site

### Code Quality
- `pnpm lint` - Run ESLint across all packages
- `pnpm format` - Format code across all packages

## Architecture

### Monorepo Structure
```
/packages/
  /core - Core animation engine with spring physics
  /react - React bindings (@ssgoi/react)
  /svelte - Svelte bindings (@ssgoi/svelte)
  /deprecated - Legacy Svelte version

/apps/
  /docs - Next.js documentation site (i18n: Korean/English)
  /react-demo - React/Next.js demo application
  /svelte-demo - Svelte/SvelteKit demo application
  /legacy-docs - Legacy documentation

/content/ - MDX documentation content
```

### Core Concepts

1. **Spring Physics Engine**: All animations use spring physics with configurable stiffness and damping
2. **State Preservation**: Animations remember current velocity/position when direction changes
3. **Context-based Management**: React uses Provider pattern (Ssgoi component), Svelte uses action-based API
4. **Route Matching**: Supports pattern-based transition configuration with wildcards

### Key Components

**React:**
- `Ssgoi`: Provider component managing transition context
- `SsgoiTransition`: Wrapper component for animating content
- `transition`: Function for individual element transitions

**Svelte:**
- `use:transition`: Action directive for applying transitions

### Animation System

- **Progress Direction**: 
  - `in`: 0 → 1 (element appearing)
  - `out`: 1 → 0 (element disappearing)
- **Spring Configuration**:
  - `stiffness`: 1-1000 (higher = faster)
  - `damping`: 0-100 (higher = less oscillation)

## Development Guidelines

1. **File Naming**: Always use lowercase for new files (e.g., `userprofile.tsx`, not `UserProfile.tsx`)
2. **Framework Conventions**: Follow existing patterns in each package
3. **TypeScript**: Strict mode is enabled - ensure proper typing
4. **Documentation**: Update MDX files in `/content/` for new features
5. **Internationalization**: Documentation supports Korean (primary) and English

## Important Notes

- No testing framework is currently set up - consider manual testing in demo apps
- When modifying core animations, test in both React and Svelte environments
- Documentation uses Tailwind CSS v4 with PostCSS
- All packages use Vite for building except documentation (Next.js)