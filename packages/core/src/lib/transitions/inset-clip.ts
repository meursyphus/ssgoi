import type { MediaInsets } from "./media-geometry";

/**
 * Serialize against the full clipping element's border box, not the inset
 * window. Percentages preserve the same geometry as pixel lengths, but avoid
 * Chromium painting smaller pixel-valued inset/radius lengths while an
 * animation is running on a high-DPI display (pausing paints them correctly).
 * See tests/browser/rounded-clip.html for a running vs paused reproduction.
 */
export function insetClipPath(
  box: { width: number; height: number },
  insets: MediaInsets,
  radii: readonly { x: number; y: number }[],
): string {
  const percent = (value: number, size: number): string =>
    `${size > 0 ? (value / size) * 100 : 0}%`;
  const offsets = [
    percent(insets.top, box.height),
    percent(insets.right, box.width),
    percent(insets.bottom, box.height),
    percent(insets.left, box.width),
  ].join(" ");
  const rx = radii.map((radius) => percent(radius.x, box.width)).join(" ");
  const ry = radii.map((radius) => percent(radius.y, box.height)).join(" ");
  return `inset(${offsets} round ${rx} / ${ry})`;
}
