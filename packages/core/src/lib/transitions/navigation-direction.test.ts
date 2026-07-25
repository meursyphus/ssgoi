import { describe, expect, it } from "vitest";
import type {
  AnyTransitionConfig,
  CreateElement,
  NavigationDirection,
  SsgoiTransitionContext,
} from "@types";
import { drill } from "./drill/transition";
import { sheet } from "./sheet/transition";
import { slide } from "./slide/transition";
import { scroll } from "./scroll/transition";
import { axis } from "./axis/transition";
import { Z_BACKGROUND, Z_FOREGROUND } from "./stacking";

function element(): HTMLElement {
  return {
    style: {},
  } as unknown as HTMLElement;
}

function context(direction: NavigationDirection): SsgoiTransitionContext {
  const root = element();
  return {
    direction,
    scrollOffset: { x: 0, y: 0 },
    from: { scroll: { x: 0, y: 0 } },
    to: { scroll: { x: 0, y: 0 } },
    scrollingElement: root,
    positionedParent: root,
  };
}

async function prepare(
  config: AnyTransitionConfig,
  direction: NavigationDirection,
): Promise<{ from: HTMLElement; to: HTMLElement }> {
  const from = element();
  const to = element();
  config.prepare?.({
    from: Promise.resolve(from),
    to: Promise.resolve(to),
    context: context(direction),
    createElement: (() => element()) as unknown as CreateElement,
  });
  await Promise.resolve();
  return { from, to };
}

describe("semantic navigation direction", () => {
  it("maps forward/backward to drill enter/exit", async () => {
    const forward = await prepare(drill(), "forward");
    const backward = await prepare(drill(), "backward");

    expect(forward.to.style.transform).toBe("translate3d(100%, 0, 0)");
    expect(forward.from.style.zIndex).toBe(Z_BACKGROUND);
    expect(backward.to.style.transform).toBe("translate3d(-20%, 0, 0)");
    expect(backward.from.style.zIndex).toBe(Z_FOREGROUND);
  });

  it("maps forward/backward to sheet open/close stacking", async () => {
    const forward = await prepare(sheet(), "forward");
    const backward = await prepare(sheet(), "backward");

    expect(forward.to.style.zIndex).toBe(Z_FOREGROUND);
    expect(forward.from.style.zIndex).toBe(Z_BACKGROUND);
    expect(backward.from.style.zIndex).toBe(Z_FOREGROUND);
    expect(backward.to.style.zIndex).toBe(Z_BACKGROUND);
  });

  it("maps direction to horizontal, vertical, and shared-axis motion", async () => {
    const slideForward = await prepare(slide(), "forward");
    const slideBackward = await prepare(slide(), "backward");
    expect(slideForward.to.style.transform).toBe("translate3d(100%, 0, 0)");
    expect(slideBackward.to.style.transform).toBe("translate3d(-100%, 0, 0)");

    const scrollForward = await prepare(scroll(), "forward");
    const scrollBackward = await prepare(scroll(), "backward");
    expect(scrollForward.to.style.zIndex).toBe(Z_FOREGROUND);
    expect(scrollBackward.to.style.zIndex).toBe(Z_BACKGROUND);

    const axisForward = await prepare(
      axis({ type: "x", feel: "snappy" }),
      "forward",
    );
    const axisBackward = await prepare(
      axis({ type: "x", feel: "snappy" }),
      "backward",
    );
    expect(axisForward.to.style.transform).toBe("translate3d(8px, 0, 0)");
    expect(axisBackward.to.style.transform).toBe("translate3d(-8px, 0, 0)");
  });

  it("keeps non-directional scroll moving forward", async () => {
    const backward = await prepare(scroll({ directional: false }), "backward");
    expect(backward.to.style.zIndex).toBe(Z_FOREGROUND);
  });
});
