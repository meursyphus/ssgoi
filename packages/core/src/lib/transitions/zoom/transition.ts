import type { SggoiTransition } from "@types";
import { getRect, prepareOutgoing } from "@utils";
import { ZOOM_PROVIDERS } from "./provider";
import type {
  ZoomAnimationHandlers,
  ZoomAnimationInput,
  ZoomOptions,
  ZoomProvider,
} from "./types";

export type { ZoomOptions, ZoomType } from "./types";

const DEFAULT_TIMEOUT = 300;
const ZOOM_ENTER_KEY = "data-zoom-enter-key";
const ZOOM_EXIT_KEY = "data-zoom-exit-key";

function findZoomEnter(node: HTMLElement): HTMLElement | null {
  const elements = node.querySelectorAll(`[${ZOOM_ENTER_KEY}]`);

  if (elements.length !== 1) {
    return null;
  }

  return elements[0] as HTMLElement;
}

function findZoomExit(node: HTMLElement, key: string): HTMLElement | null {
  const elements = node.querySelectorAll(`[${ZOOM_EXIT_KEY}]`);

  for (const element of elements) {
    if (element.getAttribute(ZOOM_EXIT_KEY) === key) {
      return element as HTMLElement;
    }
  }

  return null;
}

function createAnimationHandlers(
  fromNode: HTMLElement,
  toNode: HTMLElement,
  scrollOffset: { x: number; y: number },
  provider: ZoomProvider,
): ZoomAnimationHandlers | null {
  const fromEnter = findZoomEnter(fromNode);
  const toEnter = findZoomEnter(toNode);

  let enterEl: HTMLElement | null = null;
  let exitEl: HTMLElement | null = null;
  let mode: "enter" | "exit" | null = null;

  if (!fromEnter && toEnter) {
    const key = toEnter.getAttribute(ZOOM_ENTER_KEY);
    if (!key) return null;

    enterEl = toEnter;
    exitEl = findZoomExit(fromNode, key);
    mode = "enter";
  } else if (fromEnter && !toEnter) {
    const key = fromEnter.getAttribute(ZOOM_ENTER_KEY);
    if (!key) return null;

    enterEl = fromEnter;
    exitEl = findZoomExit(toNode, key);
    mode = "exit";
  }

  if (!enterEl || !exitEl || !mode) {
    return null;
  }

  const input: ZoomAnimationInput = {
    enterRect: getRect(mode === "enter" ? toNode : fromNode, enterEl),
    exitRect: getRect(mode === "enter" ? fromNode : toNode, exitEl),
    pageRect:
      mode === "enter"
        ? toNode.getBoundingClientRect()
        : fromNode.getBoundingClientRect(),
    scrollOffset,
  };

  if (mode === "enter") {
    const inConfig = provider.in(input);
    const outConfig = provider.backgroundOut(input);

    if (inConfig) {
      toNode.style.transformOrigin = inConfig.transformOrigin;
    }
    if (outConfig) {
      fromNode.style.transformOrigin = outConfig.transformOrigin;
    }

    return {
      mode,
      inAnimation: inConfig.animate,
      outAnimation: outConfig.animate,
    };
  }

  const inConfig = provider.backgroundIn(input);
  const outConfig = provider.out(input);

  if (inConfig) {
    toNode.style.transformOrigin = inConfig.transformOrigin;
  }
  if (outConfig) {
    fromNode.style.transformOrigin = outConfig.transformOrigin;
  }

  return {
    mode,
    inAnimation: inConfig.animate,
    outAnimation: outConfig.animate,
  };
}

function detectOutgoingMode(element: HTMLElement): "enter" | "exit" {
  return findZoomEnter(element) ? "exit" : "enter";
}

function getOutgoingZIndex(mode: "enter" | "exit"): string {
  return mode === "enter" ? "-1" : "100";
}

export const zoom = (options: ZoomOptions): SggoiTransition => {
  const provider = ZOOM_PROVIDERS[options.type];
  const physicsOptions = provider.physics;
  const timeout = options.timeout ?? DEFAULT_TIMEOUT;

  let fromNode: HTMLElement | null = null;
  let resolver: ((value: boolean) => void) | null = null;
  let handlers: ZoomAnimationHandlers | null = null;
  let resolveHandlers: (() => void) | null = null;

  return {
    in: async (element, { scrollOffset }) => {
      const toNode = element;

      const hasFromNode = await new Promise<boolean>((resolve) => {
        if (fromNode) {
          resolve(true);
          return;
        }

        resolver = resolve;
        setTimeout(() => {
          resolver = null;
          resolve(false);
        }, timeout);
      });

      if (!hasFromNode || !fromNode) {
        resolveHandlers?.();
        resolveHandlers = null;
        fromNode = null;
        return {
          physics: physicsOptions,
          css: () => ({}),
        };
      }

      handlers = createAnimationHandlers(
        fromNode,
        toNode,
        scrollOffset,
        provider,
      );

      resolveHandlers?.();
      resolveHandlers = null;

      if (!handlers) {
        fromNode = null;
        return {
          physics: physicsOptions,
          css: () => ({}),
        };
      }

      fromNode = null;

      return {
        physics: physicsOptions,
        prepare: () => {
          element.style.willChange = "transform, clip-path, opacity";
          element.style.backfaceVisibility = "hidden";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
        },
        css: (progress) => handlers?.inAnimation?.(progress) ?? {},
        onEnd: () => {
          element.style.willChange = "auto";
          element.style.backfaceVisibility = "";
          element.style.transformOrigin = "";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "";
        },
      };
    },
    out: async (element, context) => {
      const handlersReady = new Promise<void>((resolve) => {
        resolveHandlers = resolve;
      });

      return {
        physics: physicsOptions,
        prepare: () => {
          const outgoingMode = detectOutgoingMode(element);

          prepareOutgoing(element, context);
          element.style.zIndex = getOutgoingZIndex(outgoingMode);
          element.style.willChange = "transform, clip-path, opacity";
          element.style.backfaceVisibility = "hidden";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";

          fromNode = element;
          if (resolver) {
            resolver(true);
            resolver = null;
          }
        },
        wait: async () => {
          await handlersReady;
        },
        css: (progress) => handlers?.outAnimation?.(progress) ?? {},
        onEnd: () => {
          element.style.willChange = "auto";
          element.style.backfaceVisibility = "";
          element.style.transformOrigin = "";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "";
        },
      };
    },
  };
};
