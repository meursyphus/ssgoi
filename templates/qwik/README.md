# SSGOI Qwik Template

This template demonstrates SSGOI page transitions with Qwik City SSR.

```bash
pnpm install
pnpm dev
```

Qwik pages mark their own transition boundary with `data-ssgoi-transition`, matching the SvelteKit and Nuxt template pattern. The root layout calls `useSsgoi(ref, { config$ })` directly because Qwik serializes component state and SSGOI configs contain transition functions.
