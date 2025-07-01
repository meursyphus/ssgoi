# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SSGOI (쓱고이) is a page transition library for Svelte and SvelteKit applications. The name combines Korean "쓱" (sseuk - smooth movement) and Japanese "すごい" (sugoi - amazing), reflecting its goal of creating smooth, beautiful page transitions with minimal configuration.

This is a monorepo using npm workspaces with two main packages:
- `packages/ssgoi/` - The core library (npm package)
- `packages/docs/` - Documentation website (https://ssgoi.pages.dev)

## Key Commands

### Development
```bash
# Start development (builds library and runs docs dev server)
npm start

# Run only docs dev server
npm run docs:dev

# Run library dev server (in packages/ssgoi)
cd packages/ssgoi && npm run dev
```

### Building
```bash
# Build the ssgoi library
npm run build

# Build documentation site
npm run docs:build

# Prepare library for npm publishing (in packages/ssgoi)
cd packages/ssgoi && npm run package
```

### Code Quality
```bash
# Run linting (in packages/ssgoi)
cd packages/ssgoi && npm run lint

# Format code (in packages/ssgoi)
cd packages/ssgoi && npm run format
```

## Architecture

### Core Library Structure (`packages/ssgoi/src/lib/`)

1. **Main Components**:
   - `Ssgoi.svelte` - Provider component that sets up the transition context
   - `PageTransition.svelte` - Wrapper component that applies transitions to page content

2. **Transition System**:
   - Built-in transitions in `transition/` directory: fade, scroll, hero, pinterest, ripple, none
   - Each transition exports a function conforming to the `TransitionOption` type
   - Transitions can be synchronous or asynchronous

3. **Context Management**:
   - `context/config.svelte.ts` - Global configuration state
   - `context/page-transition.svelte.ts` - Current page transition state
   - `context/scroll.svelte.ts` - Scroll position history
   - `context/hero.svelte.ts` - Hero transition element tracking

4. **Type System**:
   - All transitions implement the `TransitionOption` interface
   - Strong TypeScript support with exported types for custom transitions

### Documentation Structure (`packages/docs/`)

- Built with SvelteKit and MDsveX for markdown processing
- Posts in `src/posts/` with frontmatter metadata
- Deployed to Cloudflare Pages
- Uses Tailwind CSS for styling

## Development Guidelines

### Language Requirements

- **All commits and pull requests must be written in English**
- This ensures consistency and accessibility for the international community
- Korean can be used in comments within code where helpful for local context

### When Modifying Core Library

1. All new features should maintain backward compatibility
2. Export new public APIs from `src/lib/index.ts`
3. Update TypeScript types in appropriate files
4. Follow the existing pattern for context management using Svelte 5 runes

### When Adding Transitions

1. Create new file in `packages/ssgoi/src/lib/transition/`
2. Export a function that implements `TransitionOption` interface
3. Add export to `packages/ssgoi/src/lib/transition/index.ts`
4. Document the transition in the docs site

### When Updating Documentation

1. Add/update markdown files in `packages/docs/src/posts/`
2. Include proper frontmatter (title, description, order, group)
3. Use interactive examples where possible
4. Maintain the engaging, humorous tone while being informative

## Testing

Currently, there is no test suite. When implementing tests:
- Consider using Vitest for unit tests
- Use Playwright for e2e testing of transitions
- Test both the library and documentation site

## Important Technical Details

- Requires Svelte 5 as peer dependency
- Uses Svelte 5's new runes system (`$state`, `$effect`)
- Transitions receive `{ container, previousContainer, previousUrl, currentUrl }`
- Custom transitions can be created by implementing the `TransitionOption` interface
- The library adds data attributes for styling: `data-ssgoi`, `data-page-transition`, `data-ssgoi-container`

## Common Development Tasks

### Adding a New Transition
1. Create the transition file in `packages/ssgoi/src/lib/transition/`
2. Export from the transition index
3. Add documentation with examples
4. Consider performance implications

### Debugging Transitions
- Check browser console for errors
- Verify `PageTransition` component wraps the content
- Ensure `Ssgoi` provider is at the app root
- Use `transition: 'none'` to isolate issues

### Updating Dependencies
- Run updates from the root directory
- Test both packages after updates
- Pay special attention to Svelte/SvelteKit version compatibility