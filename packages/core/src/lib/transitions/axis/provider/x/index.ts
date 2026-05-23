import { createSnappyXProvider } from "./snappy";
import { createFluidXProvider } from "./fluid";
import type { AxisFeel, AxisProvider } from "../../types";

// X axis has two UX flavors — sibling providers selected by `feel`.
//   - snappy: KakaoTalk-style. Tight, fast, parallel cross-fade, 8 px slide.
//   - fluid:  Flutter SharedAxisTransition. Relaxed, fade-through, 30 px slide.
//
// Other feel values in AxisFeel (e.g. directional/non-directional, which only
// y uses) are absent here — resolveAxisProvider falls back to `snappy`.
export const X_PROVIDERS: { snappy: AxisProvider } & Partial<
  Record<AxisFeel, AxisProvider>
> = {
  snappy: createSnappyXProvider(),
  fluid: createFluidXProvider(),
};
