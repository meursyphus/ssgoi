import type { RefObject } from "react";
import type { View } from "react-native";

/** Owned by React on the RN thread. Never serialize this ref into a UI worklet. */
export interface NativeSurfaceHandle {
  readonly key: string;
  readonly ref: RefObject<View | null>;
}
