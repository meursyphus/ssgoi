import {
  PHONE_SAFE_BOTTOM,
  PHONE_SAFE_BOTTOM_ATTR,
} from "@/lib/phone-safe-area";

/**
 * Props for a phone mockup's demo iframe: declares the home-indicator zone
 * the mockup draws over, which the framed demo reads into `--safe-bottom`
 * (see `lib/phone-safe-area.ts`).
 */
export const phoneSafeAreaFrameProps = {
  [PHONE_SAFE_BOTTOM_ATTR]: String(PHONE_SAFE_BOTTOM),
};

/**
 * iPhone-style home indicator over a phone mockup's screen, inside the
 * `PHONE_SAFE_BOTTOM` zone the framed demo keeps its bars out of.
 *
 * Sizes are the iPhone's (a 5pt bar 8pt above the edge, about a third of the
 * screen wide) in the iframe's CSS px, times `scale` when the mockup scales
 * its iframe down. A difference blend turns the white bar dark over light
 * content and light over dark content, like the adaptive system indicator
 * (a backdrop-filter threshold would be closer on mid-tone colors, but WebKit
 * does not sample iframe content for backdrop-filter).
 */
export function PhoneHomeIndicator({ scale = 1 }: { scale?: number }) {
  return (
    <div
      aria-hidden
      data-home-indicator=""
      className="pointer-events-none absolute left-1/2 z-10 w-[34%] -translate-x-1/2 rounded-full bg-white/90 mix-blend-difference"
      style={{ bottom: 8 * scale, height: Math.max(5 * scale, 2) }}
    />
  );
}
