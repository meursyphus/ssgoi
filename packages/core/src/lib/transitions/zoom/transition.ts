import type { SggoiTransition } from "@types";
import { getRect, prepareOutgoing } from "@utils";
import { ZOOM_PROVIDERS } from "./providers";
import type {
  ZoomAnimationHandlers,
  ZoomAnimationInput,
  ZoomOptions,
  ZoomProvider,
} from "./types";

export type { ZoomOptions, ZoomType } from "./types";

const DEFAULT_TIMEOUT = 300;

function findSingleByAttribute(
  node: HTMLElement,
  attribute: string,
): HTMLElement | null {
  const elements = node.querySelectorAll(`[${attribute}]`);

  if (elements.length !== 1) {
    return null;
  }

  return elements[0] as HTMLElement;
}

function findByAttributeValue(
  node: HTMLElement,
  attribute: string,
  value: string,
): HTMLElement | null {
  const elements = node.querySelectorAll(`[${attribute}]`);

  for (const element of elements) {
    if (element.getAttribute(attribute) === value) {
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
  const { enterAttribute, exitAttribute } = provider;
  const fromEnter = findSingleByAttribute(fromNode, enterAttribute);
  const toEnter = findSingleByAttribute(toNode, enterAttribute);

  let enterEl: HTMLElement | null = null;
  let exitEl: HTMLElement | null = null;
  let mode: "enter" | "exit" | null = null;

  if (!fromEnter && toEnter) {
    const key = toEnter.getAttribute(enterAttribute);
    if (!key) return null;

    enterEl = toEnter;
    exitEl = findByAttributeValue(fromNode, exitAttribute, key);
    mode = "enter";
  } else if (fromEnter && !toEnter) {
    const key = fromEnter.getAttribute(enterAttribute);
    if (!key) return null;

    enterEl = fromEnter;
    exitEl = findByAttributeValue(toNode, exitAttribute, key);
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
    const inConfig = provider.in?.(input);
    const outConfig = provider.backgroundOut?.(input);

    if (inConfig) {
      toNode.style.transformOrigin = inConfig.transformOrigin;
    }
    if (outConfig) {
      fromNode.style.transformOrigin = outConfig.transformOrigin;
    }

    return {
      mode,
      inAnimation: inConfig?.animate,
      outAnimation: outConfig?.animate,
      shouldPreserveOutgoingPosition: !outConfig,
    };
  }

  const inConfig = provider.backgroundIn?.(input);
  const outConfig = provider.out?.(input);

  if (inConfig) {
    toNode.style.transformOrigin = inConfig.transformOrigin;
  }
  if (outConfig) {
    fromNode.style.transformOrigin = outConfig.transformOrigin;
  }

  return {
    mode,
    inAnimation: inConfig?.animate,
    outAnimation: outConfig?.animate,
    shouldPreserveOutgoingPosition: !outConfig,
  };
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
          if (handlers?.shouldPreserveOutgoingPosition) {
            prepareOutgoing(element);
          } else {
            prepareOutgoing(element, context);
            element.style.zIndex = "-1";
          }
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
