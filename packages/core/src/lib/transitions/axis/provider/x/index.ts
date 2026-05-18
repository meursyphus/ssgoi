import { createSnappyXProvider } from "./snappy";
import { createFluidXProvider } from "./fluid";
import type { AxisFeel, AxisProvider } from "../../types";

// X axis has two UX flavors — they are sibling providers selected by `feel`.
//   - snappy: KakaoTalk-style. Tight, fast, parallel cross-fade, 8 px slide.
//   - fluid:  Flutter SharedAxisTransition. Relaxed, fade-through, 30 px slide.
export const X_PROVIDERS: Record<AxisFeel, AxisProvider> = {
  snappy: createSnappyXProvider(),
  fluid: createFluidXProvider(),
};
