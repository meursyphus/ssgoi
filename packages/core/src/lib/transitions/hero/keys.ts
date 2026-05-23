/**
 * Shared hero attribute keys. Lives in its own module so both the dispatcher
 * (transition.ts) and the chrome providers can consume them without creating
 * an import cycle through provider/index.ts.
 */

export const HERO_ENTER_KEY = "data-hero-enter-key";
export const HERO_EXIT_KEY = "data-hero-exit-key";
export const HERO_LEGACY_KEY = "data-hero-key";

/** CSS selector matching any hero-keyed element. */
export const HERO_ANY_KEY_SELECTOR = `[${HERO_ENTER_KEY}],[${HERO_EXIT_KEY}],[${HERO_LEGACY_KEY}]`;

/** True if `el` itself carries any hero key. */
export function isHeroKeyed(el: HTMLElement): boolean {
  return (
    el.hasAttribute(HERO_ENTER_KEY) ||
    el.hasAttribute(HERO_EXIT_KEY) ||
    el.hasAttribute(HERO_LEGACY_KEY)
  );
}

/** True if `el` is hero-keyed or contains any hero-keyed descendant. */
export function isOrContainsHeroKey(el: HTMLElement): boolean {
  if (isHeroKeyed(el)) return true;
  return el.querySelector(HERO_ANY_KEY_SELECTOR) !== null;
}
