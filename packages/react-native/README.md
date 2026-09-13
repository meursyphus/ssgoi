# @ssgoi/react-native

Experimental React Native rendering and playback for SSGOI. This package owns
`Ssgoi`, native transition types, and the `/view-transitions` presets. It does
not depend on Expo Router.

For file-based Expo Router navigation, install [`@ssgoi/expo-router`](../expo-router/README.md).
That package re-exports the native API and adds `SsgoiRouteBoundary`, so an Expo
application needs only one SSGOI package in its dependencies.

Native support currently targets React Native 0.85.3, React 19.2.3,
Reanimated 4.3.1, and Worklets 0.8.3. See the Expo adapter guide for the tested
integration baseline, limitations, and device verification steps.

```sh
pnpm --filter @ssgoi/react-native... build
pnpm --filter @ssgoi/react-native test:run
```
