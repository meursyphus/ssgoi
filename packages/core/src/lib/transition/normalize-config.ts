import type {
  TransitionConfig,
  MultiSpringConfig,
  SingleSpringConfig,
} from "../types";
import { isMultiSpring } from "../types";

/**
 * Normalizes any TransitionConfig to MultiSpringConfig
 *
 * This allows unified handling through AnimationScheduler,
 * reducing code duplication between single and multi-spring paths.
 *
 * Supports both sync and async configs (Promise).
 *
 * @param config - Single or multi spring config (or Promise of it)
 * @param element - Target element for css animations
 * @returns Promise<MultiSpringConfig>
 */
export async function normalizeToMultiSpring(
  config: TransitionConfig | Promise<TransitionConfig>,
  element: HTMLElement,
): Promise<MultiSpringConfig> {
  const resolved = await config;

  // Already multi-spring, return as-is
  if (isMultiSpring(resolved)) {
    return resolved;
  }

  const singleConfig = resolved as SingleSpringConfig;

  return {
    prepare: singleConfig.prepare,
    wait: singleConfig.wait,
    onStart: singleConfig.onStart,
    onEnd: singleConfig.onEnd,
    springs: [
      {
        from: singleConfig.from,
        to: singleConfig.to,
        spring: singleConfig.spring,
        tick: singleConfig.tick,
        css: singleConfig.css
          ? { element, style: singleConfig.css }
          : undefined,
      },
    ],
    schedule: "wait",
  };
}
