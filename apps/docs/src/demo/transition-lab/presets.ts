export const TRANSITION_LAB_PRESETS = [
  "axis-y",
  "axis-z",
  "scroll-directional",
  "scroll-non-directional",
  "blind-horizontal",
  "blind-vertical",
  "hero-static-default",
  "hero-static-smooth",
  "hero-fade-smooth",
  "zoom-static-fade",
  "zoom-expand-fade",
  "zoom-blur-default",
  "film-orange",
] as const;

export type TransitionLabPreset = (typeof TRANSITION_LAB_PRESETS)[number];
export type TransitionLabSide = "a" | "b";

const PRESET_SET: ReadonlySet<string> = new Set(TRANSITION_LAB_PRESETS);

export function isTransitionLabPreset(
  value: string,
): value is TransitionLabPreset {
  return PRESET_SET.has(value);
}

export function isTransitionLabSide(value: string): value is TransitionLabSide {
  return value === "a" || value === "b";
}
