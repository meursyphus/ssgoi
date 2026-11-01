import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AccessibilityInfo,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { nativePlatform } from "./native-platform.js";
import type { SsgoiFramework } from "./layout-boundary.js";
import type { SsgoiConfig } from "./types.js";

export interface SsgoiProps {
  config: SsgoiConfig;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  reducedMotion?: "system" | "always" | "never";
  /** Report failed preparation; the navigator still reveals the latest screen. */
  onTransitionError?: (error: Error) => void;
  /** Expo Router primitives for SsgoiLayoutBoundary: `{ StackRouter, unstable_integrateWithRouter }`. */
  framework?: SsgoiFramework;
}
type Context = {
  config: SsgoiConfig;
  platform: typeof nativePlatform;
  reducedMotion: boolean;
  onTransitionError?: (error: Error) => void;
  framework?: SsgoiFramework;
};
const SsgoiContext = createContext<Context | null>(null);

export function Ssgoi({
  config,
  children,
  style,
  reducedMotion = "system",
  onTransitionError,
  framework,
}: SsgoiProps) {
  // Respect reduced motion while the asynchronous system preference is loading.
  const [systemReducedMotion, setSystemReducedMotion] = useState(true);
  useEffect(() => {
    if (reducedMotion !== "system") return;
    let disposed = false;
    let changed = false;
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (value) => {
        changed = true;
        setSystemReducedMotion(value);
      },
    );
    void AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (!disposed && !changed) setSystemReducedMotion(value);
      })
      .catch(() => {});
    return () => {
      disposed = true;
      subscription.remove();
    };
  }, [reducedMotion]);
  const context = useMemo(
    () => ({
      config,
      platform: nativePlatform,
      reducedMotion:
        reducedMotion === "always" ||
        (reducedMotion === "system" && systemReducedMotion),
      onTransitionError,
      framework,
    }),
    [config, reducedMotion, systemReducedMotion, onTransitionError, framework],
  );
  return (
    <SsgoiContext.Provider value={context}>
      <View style={[{ flex: 1 }, style]}>{children}</View>
    </SsgoiContext.Provider>
  );
}

export function useSsgoi() {
  const context = useContext(SsgoiContext);
  if (!context)
    throw new Error(
      "SSGOI: render SsgoiLayoutBoundary inside <Ssgoi config={config}>.",
    );
  return context;
}
