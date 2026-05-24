import type { PhysicsOptions } from "@types";
import type { HeroVariant } from "../../types";
import { createDefaultVariantProvider } from "./default";
import { createSmoothVariantProvider } from "./smooth";

/**
 * Physics provider keyed on `HeroVariant`. The dispatcher in transition.ts
 * looks the factory up here so swapping variants never needs an `if/switch`
 * on the variant name. Each provider returns a single `PhysicsOptions` that
 * is shared by every strategy in the same transition — keeping the tile,
 * chrome, and any future contributor locked to one spring.
 */
export const HERO_VARIANT_PROVIDERS: Record<HeroVariant, () => PhysicsOptions> =
  {
    default: createDefaultVariantProvider,
    smooth: createSmoothVariantProvider,
  };
