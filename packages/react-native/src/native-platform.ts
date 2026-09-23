import {
  createPageMotionPlan,
  resolveTransitionRule,
  type NavigationDirection,
  type PageMotionPlan,
} from "@ssgoi/core/runtime";
import type { SsgoiConfig } from "./types.js";

/** Selected internally by the native provider; the application never assembles drivers. */
export const nativePlatform = {
  prepare(
    config: SsgoiConfig,
    from: string,
    to: string,
    direction: NavigationDirection,
    width: number,
  ): PageMotionPlan | null {
    const paths = config.middleware?.(from, to) ?? { from, to };
    const rules =
      typeof config.transitions === "function"
        ? config.transitions({ isMobile: width > 0 && width < 768 })
        : (config.transitions ?? []);
    if (rules.some((rule) => rule.preserveScroll !== undefined)) {
      throw new Error(
        "SSGOI: explicit preserveScroll restoration is not supported on React Native yet.",
      );
    }
    const match = resolveTransitionRule(paths.from, paths.to, rules, direction);
    if (!match) return null;
    const transition = match.transition;
    if (
      transition?.platform !== "ssgoi-native" ||
      (transition.kind !== "fade" && transition.kind !== "slide")
    ) {
      throw new Error(
        "SSGOI: use fade/slide from @ssgoi/react-native/view-transitions in native config.",
      );
    }
    return createPageMotionPlan(
      transition.kind,
      match.direction,
      transition.physics,
    );
  },
};
