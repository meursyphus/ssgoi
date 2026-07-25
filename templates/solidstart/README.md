# SSGOI + SolidStart Template

This template demonstrates SSGOI page transitions with SolidStart SSR.

```bash
pnpm install
pnpm dev
```

SolidStart routes are wrapped once with `SsgoiTransitionBoundary`, so individual
page components do not set `data-ssgoi-transition`. The boundary uses Solid's
keyed `<Show>` to dispose the outgoing route owner before mounting the incoming
one.

Keep the boundary inside `<Suspense>` so lazy route content is ready before
SSGOI observes the incoming marker:

```tsx
<Ssgoi config={config}>
  <Suspense>
    <SsgoiTransitionBoundary>{props.children}</SsgoiTransitionBoundary>
  </Suspense>
</Ssgoi>
```

Nested providers use the same component. The outer boundary maps
`/products/*` to `/products`, while the nested boundary uses the full pathname.
