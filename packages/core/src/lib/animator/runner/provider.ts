/**
 * Runner Provider
 *
 * Static class that selects appropriate animation runner based on options.
 * Returns runner function for tick-based or CSS-based animation.
 */

import { runTickAnimation, type TickRunnerOptions } from "./tick-runner";
import { runCssAnimation, type CssRunnerOptions } from "./css-runner";
import type { AnimationControls, StyleObject } from "./types";

export type RunnerOptions = {
  tick?: (value: number) => void;
  css?: {
    element: HTMLElement;
    style: (progress: number) => StyleObject;
  };
};

export type Runner = (
  options: TickRunnerOptions | CssRunnerOptions,
) => AnimationControls;

export class RunnerProvider {
  /**
   * Get appropriate runner based on animation mode
   *
   * @param options Animation mode options (tick or css)
   * @returns Runner function or null if no animation mode specified
   * @throws Error if both tick and css are provided
   */
  static from(
    options: RunnerOptions,
  ): { runner: Runner; mode: "tick" | "css" } | null {
    const { tick, css } = options;

    if (tick && css) {
      throw new Error("Cannot use both 'tick' and 'css' options together");
    }

    if (css) {
      return {
        runner: runCssAnimation as Runner,
        mode: "css",
      };
    }

    if (tick) {
      return {
        runner: runTickAnimation as Runner,
        mode: "tick",
      };
    }

    return null;
  }
}
