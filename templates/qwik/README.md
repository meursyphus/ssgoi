# SSGOI Qwik Template

This template demonstrates SSGOI page transitions with Qwik City SSR.

```bash
pnpm install
pnpm dev
```

Qwik pages mark their own transition boundary with `data-ssgoi-transition`.
The root layout calls `useSsgoi(ref, { config$ })` directly because Qwik
serializes component state and SSGOI configs contain transition functions.

Keep the marker on each Qwik City page. A keyed wrapper around the layout
`<Slot />` is not a safe route boundary: Qwik moves the projected slot into the
new wrapper before updating its routed content, so the incoming id can briefly
contain the outgoing page. The navigation interception API that could stage the
unmount is currently experimental, so this template deliberately keeps the
page-owned boundary pattern.
