/** Temporary inert copies; they never count as the anchor's neighbours. */
const isTransient = (el: Element): boolean =>
  el.hasAttribute("inert") && el.getAttribute("aria-hidden") === "true";

function neighbour(
  anchor: Element,
  step: "previousElementSibling" | "nextElementSibling",
): Element | null {
  let node = anchor[step];
  while (node && isTransient(node)) node = node[step];
  return node ?? null;
}

/**
 * Insert an out-of-flow node (a temporary copy) next to `anchor` without
 * moving anything. An absolutely or fixed positioned node takes no space, but
 * structural selectors still count it: `:first-child`, `* + *` (Tailwind v3
 * `space-y-*`) or `:not(:last-child)` (Tailwind v4 `space-y-*`) spacing can
 * move the anchor or its siblings. Try each side in order and keep the first
 * that leaves the anchor, its parent and its neighbours where they were; if
 * every side moves something, keep the one that moves it least.
 */
export function insertBeside<Side extends string>(
  anchor: Element,
  node: Element,
  sides: ReadonlyArray<readonly [Side, (node: Element) => void]>,
): Side {
  const parent = anchor.parentElement;
  const watched = [
    anchor,
    parent,
    neighbour(anchor, "previousElementSibling"),
    neighbour(anchor, "nextElementSibling"),
    parent?.firstElementChild,
    parent?.lastElementChild,
  ].filter((el): el is Element => el != null && el !== node);
  const read = () =>
    watched.flatMap((el) => {
      const rect = el.getBoundingClientRect();
      return [rect.left, rect.top, rect.width, rect.height];
    });
  const rest = read();
  const shift = () =>
    Math.max(0, ...read().map((value, i) => Math.abs(value - rest[i]!)));

  let best: { side: Side; shift: number; insert: (node: Element) => void } = {
    side: sides[0]![0],
    shift: Infinity,
    insert: sides[0]![1],
  };
  for (const [side, insert] of sides) {
    insert(node);
    const moved = shift();
    if (moved < 0.01) return side;
    if (moved < best.shift) best = { side, shift: moved, insert };
  }
  best.insert(node);
  return best.side;
}
