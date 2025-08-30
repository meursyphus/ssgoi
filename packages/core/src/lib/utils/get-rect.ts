/**
 * Get the relative position of an element to its root container
 * Returns a DOMRect with position relative to the root element
 */
export function getRect(root: HTMLElement, el: HTMLElement): DOMRect {
  const rootRect = root.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();

  return new DOMRect(
    elRect.left - rootRect.left,
    elRect.top - rootRect.top,
    elRect.width,
    elRect.height
  );
}