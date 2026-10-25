import { noChange } from "lit";
import { AsyncDirective } from "lit/async-directive.js";
import { directive, PartType } from "lit/directive.js";
import type { ElementPart, PartInfo } from "lit/directive.js";
import type { Animation } from "@ssgoi/core";

/** Create a fresh core animation for each connected element lifecycle. */
export type AnimationFactory = (element: HTMLElement) => Animation;

class AnimateDirective extends AsyncDirective {
  private element: HTMLElement | undefined;
  private factory: AnimationFactory | undefined;
  private animation: Animation | undefined;
  private generation = 0;

  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error(
        "animate() must be used in an element expression: <div ${animate(factory)}>",
      );
    }
  }

  render(_factory: AnimationFactory): typeof noChange {
    return noChange;
  }

  override update(
    part: ElementPart,
    [factory]: [AnimationFactory],
  ): typeof noChange {
    if (!(part.element instanceof HTMLElement)) {
      throw new Error("animate() requires an HTML element");
    }
    if (this.element !== part.element || this.factory !== factory) {
      this.stop();
      this.element = part.element;
      this.factory = factory;
      this.start();
    }
    return noChange;
  }

  override disconnected(): void {
    this.stop();
  }

  override reconnected(): void {
    this.start();
  }

  private start(): void {
    const generation = ++this.generation;
    // Element expressions run before the node and its children are committed.
    // Defer measurement/playback until the synchronous Lit render has finished.
    queueMicrotask(() => {
      if (
        generation !== this.generation ||
        !this.isConnected ||
        !this.element?.isConnected ||
        !this.factory
      )
        return;
      this.animation = this.factory(this.element);
      this.animation.play();
    });
  }

  private stop(): void {
    ++this.generation;
    const animation = this.animation;
    this.animation = undefined;
    animation?.cancel({ reason: "disposed", owns: () => true });
  }
}

/** Play on mount/reconnection; cancel on removal or factory identity changes. */
export const animate = directive(AnimateDirective);
