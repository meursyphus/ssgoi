import type { MediaFit } from "../media-geometry";

export type HeroEndpoint = "enter" | "exit" | "legacy";

const INFERRED_FIT: Record<HeroEndpoint, MediaFit> = {
  enter: "contain",
  exit: "cover",
  legacy: "contain",
};

/** Compatibility fallback used only with deprecated aspect-ratio markup. */
export function fallbackHeroFit(endpoint: HeroEndpoint): MediaFit {
  return INFERRED_FIT[endpoint];
}
