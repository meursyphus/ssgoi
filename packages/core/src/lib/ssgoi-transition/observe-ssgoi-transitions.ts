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

export function observeSsgoiTransitions(
  root: Element,
  ssgoi: SsgoiContext,
): () => void {
  if (!canObserveDom()) return () => {};

  root.setAttribute(ROOT_ATTRIBUTE, "");

  const ownsElement = (element: Element) =>
    element.closest(ROOT_SELECTOR) === root;

  const registerElement = (element: Element) => {
    if (
      !isHTMLElement(element) ||
      !ownsElement(element) ||
      element.closest(CLONE_SELECTOR)
    ) {
      return;
    }

    const path = element.getAttribute(TRANSITION_ATTRIBUTE);
    if (path === null) return;

    ssgoi.register(path, element);
  };

  const scanNode = (node: Node) => {
    if (!isElement(node)) return;

    if (node.matches(TRANSITION_SELECTOR)) {
      registerElement(node);
    }

    for (const element of node.querySelectorAll(TRANSITION_SELECTOR)) {
      registerElement(element);
    }
  };

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        registerElement(mutation.target as Element);
        continue;
      }

      for (const node of mutation.addedNodes) {
        scanNode(node);
      }
    }
  });

  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: [TRANSITION_ATTRIBUTE],
  });
  scanNode(root);

  return () => observer.disconnect();
}
