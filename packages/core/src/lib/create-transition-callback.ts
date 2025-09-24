import type {
  Transition,
  TransitionCallback,
  SequenceConfig,
  TransitionConfig,
} from "./types";
import { Animator } from "./animator";
import {
  createDefaultStrategy,
  type StrategyContext,
  type TransitionStrategy,
  type TransitionConfigs,
} from "./transition-strategy";

export function createTransitionCallback<TAnimationValue = number>(
  getTransition: () => Transition<undefined, TAnimationValue>,
  options?: {
    onCleanupEnd?: () => void;
    strategy?: (
      context: StrategyContext<TAnimationValue>,
    ) => TransitionStrategy<TAnimationValue>;
    sequenceConfig?: SequenceConfig;
    baseKey?: string | symbol;
  },
): TransitionCallback {
  // Combined state: tracks both animation instance and direction
  let currentAnimation: {
    animator: Animator<TAnimationValue>;
    direction: "in" | "out";
  } | null = null;
  let currentClone: HTMLElement | null = null; // Track current clone element
  let parentRef: Element | null = null;
  let nextSiblingRef: Element | null = null;

  // Create context for strategy
  const context: StrategyContext<TAnimationValue> = {
    get currentAnimation() {
      return currentAnimation;
    },
  };

  // Create strategy upfront for closure
  const strategy =
    options?.strategy?.(context) ||
    createDefaultStrategy<TAnimationValue>(context);

  const runEntrance = async (element: HTMLElement) => {
    if (currentClone) {
      currentClone.remove();
      currentClone = null;
    }
    const transition = getTransition();
    const configs: TransitionConfigs<TAnimationValue> = {
      in: transition.in && Promise.resolve(transition.in(element)),
      out: transition.out && Promise.resolve(transition.out(element)),
    };

    const setup = await strategy.runIn(configs);
    if (!setup.config) {
      return;
    }

    setup.config.prepare?.(element);

    // Wait if configured
    if (setup.config.wait) {
      await setup.config.wait();
    }

    const animator = Animator.fromState(setup.state, {
      from: setup.from,
      to: setup.to,
      spring: setup.config.spring,
      onStart: setup.config.onStart,
      onUpdate: setup.config.tick,
      onComplete: () => {
        currentAnimation = null;
        setup.config?.onEnd?.();
      },
    });

    currentAnimation = { animator, direction: "in" };

    if (setup.direction === "forward") {
      animator.forward();
    } else {
      animator.backward();
    }
  };

  const runExitTransition = async (element: HTMLElement) => {
    currentClone = element;

    const transition = getTransition();

    const configs: TransitionConfigs<TAnimationValue> = {
      in: transition.in && Promise.resolve(transition.in(element)),
      out: transition.out && Promise.resolve(transition.out(element)),
    };

    const setup = await strategy.runOut(configs);
    if (!setup.config) {
      return;
    }

    setup.config.prepare?.(element);

    insertClone();

    // Wait if configured
    if (setup.config.wait) {
      await setup.config.wait();
    }

    const animator = Animator.fromState(setup.state, {
      from: setup.from,
      to: setup.to,
      spring: setup.config.spring,
      onStart: setup.config.onStart,
      onUpdate: setup.config.tick,
      onComplete: () => {
        setup.config?.onEnd?.();
        if (currentClone) {
          currentClone.remove();
          currentClone = null;
        }
        currentAnimation = null;
        options?.onCleanupEnd?.();
      },
    });

    currentAnimation = { animator, direction: "out" };

    if (setup.direction === "forward") {
      animator.forward();
    } else {
      animator.backward();
    }

    function insertClone() {
      if (!parentRef || !currentClone) return;

      if (nextSiblingRef && parentRef.contains(nextSiblingRef)) {
        parentRef.insertBefore(currentClone, nextSiblingRef);
      } else {
        parentRef.appendChild(currentClone);
      }
    }
  };

  return (element: HTMLElement | null) => {
    if (!element) return;

    // Handle sequence transitions
    if (options?.sequenceConfig) {
      return applySequenceTransition(
        element,
        getTransition,
        options.sequenceConfig,
        options.baseKey || "sequence",
        options,
      );
    }

    // Handle regular single-element transition
    parentRef = element.parentElement;
    nextSiblingRef = element.nextElementSibling;

    runEntrance(element);

    return () => {
      const cloned = element.cloneNode(true) as HTMLElement;
      runExitTransition(cloned);
    };
  };
}

/**
 * Calculate delay for sequence effect
 */
function calculateSequenceDelay(
  index: number,
  total: number,
  config: SequenceConfig,
): number {
  const baseDelay = config.delay || 50; // Default 50ms
  const direction = config.direction || "normal";

  if (config.delayFn) {
    return config.delayFn(index, total);
  }

  const actualIndex = direction === "reverse" ? total - 1 - index : index;
  return actualIndex * baseDelay;
}

/**
 * Apply sequence transition to child elements
 */
function applySequenceTransition<TAnimationValue>(
  parentElement: HTMLElement,
  getTransition: () => Transition<undefined, TAnimationValue>,
  sequenceConfig: SequenceConfig,
  _baseKey: string | symbol,
  parentOptions?: {
    onCleanupEnd?: () => void;
    strategy?: (
      context: StrategyContext<TAnimationValue>,
    ) => TransitionStrategy<TAnimationValue>;
  },
): () => void {
  const children = Array.from(parentElement.children) as HTMLElement[];

  const hostParent = parentElement.parentElement;
  const nextSibling = parentElement.nextElementSibling;

  const resolveTransitionConfig = async (
    configSource:
      | Transition<undefined, TAnimationValue>["in"]
      | Transition<undefined, TAnimationValue>["out"],
    node: HTMLElement,
  ): Promise<TransitionConfig<TAnimationValue> | undefined> => {
    if (!configSource) return undefined;
    const value =
      typeof configSource === "function" ? configSource(node) : configSource;
    if (value && typeof value === "object" && "then" in value) {
      return (await value) as TransitionConfig<TAnimationValue>;
    }
    return value as TransitionConfig<TAnimationValue>;
  };

  const playTransition = async (
    node: HTMLElement,
    config: TransitionConfig<TAnimationValue>,
    direction: "in" | "out",
  ) => {
    config.prepare?.(node);

    if (config.wait) {
      await config.wait();
    }

    config.onStart?.();

    if (config.tick && config.spring) {
      const duration = 500;
      const startTime = performance.now();

      await new Promise<void>((resolve) => {
        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          const value = direction === "in" ? easedProgress : 1 - easedProgress;

          config.tick?.(value as TAnimationValue);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            config.onEnd?.();
            resolve();
          }
        };

        requestAnimationFrame(animate);
      });
    } else {
      config.onEnd?.();
    }
  };

  // Run entrance animations for all children with sequence timing
  children.forEach((child, index) => {
    const delay = calculateSequenceDelay(
      index,
      children.length,
      sequenceConfig,
    );

    // Apply entrance transition with delay
    const startEntrance = async () => {
      try {
        const transition = getTransition();
        const config = await resolveTransitionConfig(transition.in, child);
        if (!config) return;
        await playTransition(child, config, "in");
      } catch (error) {
        console.error("⚠️ Sequence entrance error", error);
      }
    };

    if (delay > 0) {
      setTimeout(() => {
        void startEntrance();
      }, delay);
    } else {
      void startEntrance();
    }
  });

  // Return cleanup function that handles sequence exit animation
  return () => {
    const exitPromises: Promise<void>[] = [];

    const clone = parentElement.cloneNode(true) as HTMLElement;
    const hasHostParent = !!hostParent;

    let insertionParent: Element | null = hostParent;
    let insertionSibling: Element | null = nextSibling;

    const fallbackParent =
      hostParent?.parentElement ?? parentElement.parentElement;
    const fallbackSibling =
      hostParent?.nextElementSibling ?? parentElement.nextElementSibling;

    const ensureClonePlacement = () => {
      if (!insertionParent && fallbackParent) {
        insertionParent = fallbackParent;
        insertionSibling = fallbackSibling;
      }

      if (insertionParent) {
        if (insertionSibling && insertionParent.contains(insertionSibling)) {
          insertionParent.insertBefore(clone, insertionSibling);
        } else {
          insertionParent.appendChild(clone);
        }
      } else if (fallbackParent) {
        fallbackParent.appendChild(clone);
      }
    };

    ensureClonePlacement();

    const keepCloneConnected = () => {
      if (!clone.isConnected && fallbackParent) {
        if (fallbackSibling && fallbackParent.contains(fallbackSibling)) {
          fallbackParent.insertBefore(clone, fallbackSibling);
        } else {
          fallbackParent.appendChild(clone);
        }
      }
    };

    queueMicrotask(keepCloneConnected);
    requestAnimationFrame(() => keepCloneConnected());

    const targetChildren = hasHostParent
      ? (Array.from(clone.children) as HTMLElement[])
      : children;

    targetChildren.forEach((child, index) => {
      const delay = calculateSequenceDelay(
        index,
        targetChildren.length,
        sequenceConfig,
      );

      const exitPromise = new Promise<void>((resolve) => {
        const startExit = async () => {
          try {
            const transition = getTransition();
            const config = await resolveTransitionConfig(transition.out, child);

            if (!config) {
              resolve();
              return;
            }

            await playTransition(child, config, "out");
            resolve();
          } catch (error) {
            console.error("⚠️ Sequence exit error", error);
            resolve();
          }
        };

        if (delay > 0) {
          setTimeout(() => {
            void startExit();
          }, delay);
        } else {
          void startExit();
        }
      });

      exitPromises.push(exitPromise);
    });

    Promise.all(exitPromises)
      .catch((error) => {
        console.error("⚠️ Sequence exit coordination error", error);
      })
      .finally(() => {
        if (clone.isConnected) {
          clone.remove();
        }
        parentOptions?.onCleanupEnd?.();
      });
  };
}
