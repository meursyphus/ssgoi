/**
 * Bottom safe area for mobile demos shown inside a phone mockup.
 *
 * Demo bars pad themselves with `--safe-bottom` (see `pb-safe` & co. in
 * `app/globals.css`). On a real device that is `env(safe-area-inset-bottom)`.
 * Inside an iframe `env()` is always 0, so a mockup that draws a home
 * indicator over the iframe (`ShowcasePhone`, `PhoneFrame`) declares the zone
 * it covers with {@link PHONE_SAFE_BOTTOM_ATTR} on the iframe, and
 * {@link phoneSafeAreaScript} (run by the `/demo` layout before the demo is
 * parsed) copies it into `--frame-safe-bottom` on the demo's `:root`.
 *
 * Other frames (the desktop browser mockup, a cross-origin embed) declare
 * nothing and keep `env()`.
 */

/**
 * Home-indicator zone in the iframe's CSS px: 34pt, the bottom inset of every
 * Face ID iPhone in portrait (390pt-wide 15 and 440pt-wide 16 Pro Max alike).
 */
export const PHONE_SAFE_BOTTOM = 34;

/** iframe attribute a phone mockup uses to declare its bottom inset (px). */
export const PHONE_SAFE_BOTTOM_ATTR = "data-safe-area-bottom";

/**
 * Inline script for the framed demo document. It must run before the demo
 * markup is parsed so the first paint already has the inset, and it writes a
 * `<style>` into `<head>` rather than an attribute on `<html>`: React
 * hydrates `<html>` and would report an attribute it did not render, while it
 * skips nodes it did not render in `<head>`.
 *
 * `window.frameElement` is null at the top level and in a cross-origin
 * parent, so only a same-origin mockup that sets the attribute applies.
 */
export const phoneSafeAreaScript = `(function(){try{var f=window.frameElement;if(!f)return;var v=parseFloat(f.getAttribute(${JSON.stringify(
  PHONE_SAFE_BOTTOM_ATTR,
)}));if(!(v>=0))return;var s=document.createElement("style");s.textContent=":root{--frame-safe-bottom:"+v+"px}";document.head.appendChild(s)}catch(e){}})()`;
