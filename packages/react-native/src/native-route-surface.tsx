import type { ReactNode } from "react";
import { StyleSheet, type LayoutChangeEvent } from "react-native";
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";
import {
  interpolateFrame,
  pageMotionStyle,
  type PageMotionPlan,
} from "@ssgoi/core/runtime";
import type { PlaybackState } from "./playback.js";
import type { NativeSurfaceHandle } from "./native-surface-handle.js";

export interface NativeRouteSurfaceProps {
  target: NativeSurfaceHandle;
  children: ReactNode;
  active: boolean;
  side: "in" | "out" | null;
  id: number;
  width: number;
  plan: PageMotionPlan | null;
  playback: SharedValue<PlaybackState>;
  onLayout: (event: LayoutChangeEvent) => void;
}

export function NativeRouteSurface({
  target,
  children,
  active,
  side,
  id,
  width,
  plan,
  playback,
  onLayout,
}: NativeRouteSurfaceProps) {
  const animatedStyle = useAnimatedStyle(() => {
    if (!side || !plan)
      return { opacity: active ? 1 : 0, transform: [{ translateX: 0 }] };
    const clock = playback.value;
    // New screens get their starting pose even before the layout effect installs the clock.
    const elapsed = clock.id === id ? clock.elapsed : 0;
    const track = side === "in" ? plan.in : plan.out;
    const progress =
      elapsed >= track.offset + track.duration
        ? 1
        : interpolateFrame(track.frames, Math.max(0, elapsed - track.offset))
            .position;
    const pose = pageMotionStyle(plan.kind, side, plan.direction, progress);
    return {
      opacity: Math.max(0, Math.min(1, pose.opacity)),
      transform: [{ translateX: pose.x * width }],
    };
  }, [active, side, id, width, plan]);
  const visible = active || (side !== null && plan !== null);
  return (
    <Animated.View
      ref={target.ref}
      collapsable={false}
      onLayout={onLayout}
      pointerEvents={active ? "auto" : "none"}
      accessibilityElementsHidden={!active}
      importantForAccessibility={active ? "auto" : "no-hide-descendants"}
      style={[
        StyleSheet.absoluteFill,
        { display: visible ? "flex" : "none", zIndex: side === "in" ? 1 : 0 },
        animatedStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
}
