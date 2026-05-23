import type { HeroStrategy, HeroType } from "../types";
import { createStaticChromeStrategy } from "./static";
import { createFadeChromeStrategy } from "./fade";

/**
 * Chrome-handling strategy keyed on `HeroType`. The dispatcher in
 * transition.ts looks the factory up here and assembles it next to the
 * always-on TileStrategy — never branches on the type itself.
 */
export const HERO_CHROME_PROVIDERS: Record<HeroType, () => HeroStrategy> = {
  static: createStaticChromeStrategy,
  fade: createFadeChromeStrategy,
};
