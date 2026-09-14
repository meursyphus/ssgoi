/** Select disjoint sibling subtrees without dimming shared visuals or their ancestors. */
export function collectContentTargets(
  page: HTMLElement,
  sharedElements: HTMLElement[],
): HTMLElement[] {
  const visuals = new Set(sharedElements);
  const ancestors = new Set<HTMLElement>();
  for (const visual of visuals) {
    let current = visual.parentElement;
    while (current && current !== page) {
      ancestors.add(current);
      current = current.parentElement;
    }
  }

  const targets: HTMLElement[] = [];
  const visit = (node: HTMLElement): void => {
    if (
      visuals.has(node) ||
      node.getAttribute?.("data-hero-placeholder") != null
    )
      return;
    if (node !== page && !ancestors.has(node)) {
      targets.push(node);
      return;
    }
    for (const child of Array.from(node.children)) {
      if (child instanceof HTMLElement) visit(child);
    }
  };
  visit(page);
  return targets;
}
