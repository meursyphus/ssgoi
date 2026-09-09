# @ssgoi/react-native

Experimental SSGOI screen transitions for React Native. `fade` and `slide` share the web route matcher, physics integrators, timeline simulation, and motion geometry. Reanimated plays the numerical timelines on the UI thread.

This is a source preview of the first milestone in [#402](https://github.com/meursyphus/ssgoi/issues/402). Start with [`templates/expo`](../../templates/expo) from this checkout; this PR does not publish a package or bump versions.

## Expo Router

The example pins Expo SDK 56.0.21, Expo Router 56.2.20, React Native 0.85.3, React 19.2.3, Reanimated 4.3.1, and Worklets 0.8.3. Expo's standard navigator API is alpha; newer SDKs need separate validation. The Expo peer range is optional and broad so an unused integration does not force router upgrades.

```tsx
// app/_layout.tsx
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react-native";
import { SsgoiRouteBoundary } from "@ssgoi/react-native/expo-router";
import { slide } from "@ssgoi/react-native/view-transitions";

const config = {
  transitions: [{ from: "/posts", to: "/posts/*", transition: slide() }],
} satisfies SsgoiConfig;

export default function Layout() {
  return (
    <Ssgoi config={config}>
      <SsgoiRouteBoundary />
    </Ssgoi>
  );
}
```

Keep page files such as `app/posts/index.tsx` and `app/posts/[id].tsx`, and use `Link`, `router.push()`, `router.replace()`, and `router.back()` from Expo Router normally. The boundary discovers screens from files. It replaces the navigator in that layout; do not wrap an existing `<Stack>` or `<Slot>` inside it. Supply safe-area handling in your app.

`Ssgoi` provides config and selects the native platform. `SsgoiRouteBoundary` has the same name as `@ssgoi/react/nextjs`, but owns an internal Expo navigator and supplies a boundary for each screen. Popped/replaced screens keep their actual React instance and route context until completion. Routes still in the stack remain mounted and retain input and scroll state.

## Configuration

- `transitions`: `on`/`except`, `from`/`to`, `ordered`, `priority`, and `bidirectional` have the same matching semantics as the web.
- Functional rules receive `{ isMobile }`, based on the host width below 768 logical units.
- `middleware(from, to)` rewrites matching paths without changing screen instance identity.
- `fade({ physics })` fades out then in; `slide({ physics })` moves both screens together. Physics are computed in JS once and sent as numeric data to the UI runtime.
- `<Ssgoi reducedMotion="system" | "always" | "never">` defaults to the system setting. Initial preference loading also respects reduced motion.
- `onTransitionError(error)` reports failed animation preparation. The latest screen is revealed and outgoing resources are released even when preparation fails.

Web `TransitionConfig`/`WebAnimation` objects cannot be passed to native config. Explicit `preserveScroll` restoration is rejected; mounted screens retain their native scroll state naturally. There is no automatic restoration for a removed/recreated screen yet.

## Boundary options

Basic usage needs no props. `initialRouteName` selects the initial file-discovered screen, and `style` styles the native host.

`resolve({ pathname, route })` returns `{ id, key? }`, matching the naming used by the web boundary. It receives each screen's own route, including its params and instance key, rather than the currently focused global pathname. `id` is an absolute matching path. `routeKey` overrides the optional resolved key. Keys are scoped by native route instance: a constant `routeKey` never merges two pushed screens or keeps a popped screen alive after exit. Changing the resolved key recreates that route's boundary content; navigation animations follow changes in the active native route key.

## Current scope

The first integration targets one Expo stack on iOS/Android without native headers or modal presentation. It supports push, pop, replace, direct entry, rapid-navigation cleanup, reduced motion, accessibility/touch exclusion of outgoing screens, and cleanup on host resizing or app backgrounding. Preloaded routes are rendered when they become active. A bounded watchdog settles screens that cannot finish layout or playback.

Interactive swipe, predictive-back progress, shared elements, nested-navigator coordination, explicit scroll restoration, Expo Web, and public pause/reverse/debug-host controls are follow-up work. The native header, gesture, and screen options of Expo's built-in Stack are not exposed by this boundary.

## Validation

The shared runtime uses `TransitionView<TTarget, TPayload>`, `Pose<TTarget>`,
`Timeline<TTarget, TStyle>`, and `Animation<TTarget, TStyle>`. Targets are opaque
to core. Web imports retain `HTMLElement` as their default; RN binds each
transition view to a stable `NativeSurfaceHandle` with a real native View ref.
Refs stay on the RN thread while numerical plans cross to the UI runtime.
Native playback uses completion callbacks rather than pretending that the
web's synchronous pose getter can read current UI-thread state.

```sh
pnpm --filter @ssgoi/core build
pnpm --filter @ssgoi/react-native build
pnpm --filter @ssgoi/react-native test:run
SSGOI_TEST_PLATFORM=android pnpm --filter @ssgoi/react-native test:run
node scripts/check-native-isolation.mjs
pnpm --filter ssgoi-expo-template typecheck
pnpm --filter ssgoi-expo-template exec expo export --platform ios --platform android
```

The integration tests use the real Expo Router with native module mocks and a controlled frame clock. They verify React lifetime and routing behavior, not native pixels, UI-thread performance, or physical back gestures. Device/simulator checks remain necessary before treating this preview as production-ready.
