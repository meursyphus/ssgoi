# SSGOI + Expo Router

Source preview for `@ssgoi/react-native`, using the file-based `SsgoiRouteBoundary` integration.

From the repository root:

```sh
pnpm install
pnpm --filter @ssgoi/core build
pnpm --filter @ssgoi/react-native build
pnpm --filter ssgoi-expo-template start
```

Use a compatible Expo Go SDK 56 build or a development build matching this template. React Native 0.85.3, Reanimated 4.3.1, and Worklets 0.8.3 are pinned. Newer Expo Go/SDK versions are not part of this preview's compatibility claim. The app contains no SSGOI custom native module.

`app/_layout.tsx` owns the provider, config, and boundary. No `.Screen` list is needed. The app supplies safe-area insets and screen backgrounds.

Try these on both iOS and Android:

1. Scroll the story list, open a story, and go back. The list should retain its position.
2. Write a note, push the next story, and go back. The original note should remain.
3. Replace a story. The outgoing screen should remain visible through its animation, then unmount.
4. Open the fade page and go back. The two fade phases should run in sequence.
5. Open a detail link directly. No outgoing screen should appear; the Back button can return to the list.
6. Enable system reduced motion, rotate the device, and background/restore the app during navigation. The active screen should remain usable.
7. Exercise ordinary Android back. Interactive swipe and predictive-back progress are outside this MVP.

The Jest tests and Hermes exports do not replace this device check. See the [package README](../../packages/react-native/README.md) for scope, boundary options, and unsupported features.
