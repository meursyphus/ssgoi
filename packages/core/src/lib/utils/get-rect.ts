/**
 * Get the relative position of an element to its root container
 * Returns a DOMRect with position relative to the root element
 * 
 * TODO: When both root and el have transforms (e.g., rotate), the relative position
 * might need compensation. Currently using simple bounding rect difference which
 * works for most cases but may be inaccurate for complex 3D transforms.
 * Consider adding transform matrix calculation if needed in the future.
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