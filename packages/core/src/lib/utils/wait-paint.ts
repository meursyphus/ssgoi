/**
 * Waits across two animation frame callbacks.
 *
 * This gives style changes made before the first callback a rendering
 * opportunity before code resumes in the second callback. Since rAF callbacks
 * run before paint and the web platform has no post-presentation callback, this
 * is a scheduling barrier rather than proof that pixels reached the screen.
 *
 * In the future, this could be replaced with a native presentation API if one
 * becomes available.
 *
 * @param _element - The element to wait for (reserved for future API usage)
 * @returns A promise that resolves from the second animation frame callback
 */

export function waitPaint(_element?: Element): Promise<void> {
  // The element parameter is reserved for a future element-scoped presentation API.
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}
