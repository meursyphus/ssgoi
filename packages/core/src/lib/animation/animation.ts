import { Animation as RuntimeAnimation } from "../runtime/animation";
import type { StyleObject } from "../runtime/motion-state";

/** Web-compatible default; platform-neutral consumers use @ssgoi/core/runtime. */
export abstract class Animation<
  TTarget = HTMLElement,
  TStyle = StyleObject,
> extends RuntimeAnimation<TTarget, TStyle> {}
