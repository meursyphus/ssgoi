import type { SsgoiContext } from "@types";

const ROOT_ATTRIBUTE = "data-ssgoi-root";
const ROOT_SELECTOR = `[${ROOT_ATTRIBUTE}]`;
const TRANSITION_ATTRIBUTE = "data-ssgoi-transition";
const TRANSITION_SELECTOR = `[${TRANSITION_ATTRIBUTE}]`;
const CLONE_SELECTOR = "[data-ssgoi-clone]";

function canObserveDom(): boolean {
  return (
    typeof MutationObserver !== "undefined" &&
    typeof HTMLElement !== "undefined" &&
    typeof Node !== "undefined"
  );
}

function isElement(node: Node): node is Element {
  return node.nodeType === Node.ELEMENT_NODE;
}

function isHTMLElement(element: Element): element is HTMLElement {
  return element instanceof HTMLElement;
}

function getElementDepth(element: HTMLElement): number {
  let depth = 0;
  let parent = element.parentElement;
  while (parent) {
    depth++;
    parent = parent.parentElement;
  }
  return depth;
}

export function registerTransitionBatch(
  elements: ReadonlySet<HTMLElement>,
  ssgoi: SsgoiContext,
  mountedElements: ReadonlySet<HTMLElement> = elements,
): void {
  // Parent watches must exist before child watches so a later subtree removal
  // can promote the outer changed boundary reliably.
  const ordered = Array.from(elements).sort(
    (a, b) => getElementDepth(a) - getElementDepth(b),
  );

  for (const element of ordered) {
    const path = element.getAttribute(TRANSITION_ATTRIBUTE);
    if (path === null) continue;

    let ancestor = element.parentElement;
    let nestedInBatch = false;
    while (ancestor) {
      if (mountedElements.has(ancestor)) {
        nestedInBatch = true;
        break;
      }
      ancestor = ancestor.parentElement;
    }

    ssgoi.register(path, element, { enter: !nestedInBatch });
  }
}

export function observeSsgoiTransitions(
  root: Element,
  ssgoi: SsgoiContext,
): () => void {
  if (!canObserveDom()) return () => {};

  root.setAttribute(ROOT_ATTRIBUTE, "");

  const ownsElement = (element: Element) =>
    element.closest(ROOT_SELECTOR) === root;

  const getTransitionElement = (element: Element): HTMLElement | null => {
    if (
      !isHTMLElement(element) ||
      !ownsElement(element) ||
      element.closest(CLONE_SELECTOR)
    ) {
      return null;
    }

    const path = element.getAttribute(TRANSITION_ATTRIBUTE);
    if (path === null) return null;

    return element;
  };

  const collectNode = (node: Node, elements: Set<HTMLElement>) => {
    if (!isElement(node)) return;

    if (node.matches(TRANSITION_SELECTOR)) {
      const element = getTransitionElement(node);
      if (element) elements.add(element);
    }

    for (const element of node.querySelectorAll(TRANSITION_SELECTOR)) {
      const transitionElement = getTransitionElement(element);
      if (transitionElement) elements.add(transitionElement);
    }
  };

  const observer = new MutationObserver((mutations) => {
    const elements = new Set<HTMLElement>();
    const mountedElements = new Set<HTMLElement>();

    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        const element = getTransitionElement(mutation.target as Element);
        if (element) elements.add(element);
        continue;
      }

      for (const node of mutation.addedNodes) {
        collectNode(node, mountedElements);
      }
    }

    for (const element of mountedElements) elements.add(element);
    registerTransitionBatch(elements, ssgoi, mountedElements);
  });

  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: [TRANSITION_ATTRIBUTE],
  });
  const initialElements = new Set<HTMLElement>();
  collectNode(root, initialElements);
  registerTransitionBatch(initialElements, ssgoi);

  return () => {
    observer.disconnect();
    ssgoi.disconnect?.();
  };
}
