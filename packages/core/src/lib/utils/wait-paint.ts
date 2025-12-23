/**
 * Waits for the browser to complete a paint cycle.
 *
 * This ensures that any style changes have been applied and the element
 * has been painted to the screen before starting animations.
 *
 * Currently uses double requestAnimationFrame as a reliable cross-browser
 * approach. In the future, this could be replaced with a native API when
 * available (e.g., a proposed `element.waitForPaint()` or similar).
 *
 * @param _element - The element to wait for (reserved for future API usage)
 * @returns A promise that resolves after the paint cycle completes
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function waitPaint(_element?: Element): Promise<void> {
  // TODO: When a native paint-waiting API becomes available (e.g., element.waitForPaint()),
  // we can use the _element parameter to leverage that API for more accurate timing.
  // For now, we use double requestAnimationFrame which works reliably across all browsers.
  return new Promise((resolve) => {
    resolve();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}
