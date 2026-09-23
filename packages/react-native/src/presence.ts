export {
  createPresence,
  reconcilePresence,
  settlePresence,
} from "@ssgoi/core/runtime";
export type Screen<T> = import("@ssgoi/core/runtime").TransitionView<
  import("./native-surface-handle.js").NativeSurfaceHandle,
  T
>;
