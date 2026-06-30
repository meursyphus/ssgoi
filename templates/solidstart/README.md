# SSGOI + SolidStart Template

This template demonstrates SSGOI page transitions with SolidStart SSR.

```bash
pnpm install
pnpm dev
```

SolidStart pages mark their own transition boundary with `data-ssgoi-transition`, matching the SvelteKit, Nuxt, and Qwik template pattern. The root app wraps file routes once with `<Ssgoi>`, while every route page provides the stable transition id that the config matches.
