import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { buildInput, resolveZoom, zoom } from "./transition";
import { withOverride } from "../../transition/define-transition";
import type { ZoomResolved, ZoomType } from "./types";
import { createZoomIn, createZoomOut } from "./zoom-element";

type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

class TestDOMRect {
  readonly x: number;
  readonly y: number;
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
  readonly right: number;
  readonly bottom: number;

  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.left = x;
    this.top = y;
    this.width = width;
    this.height = height;
    this.right = x + width;
    this.bottom = y + height;
  }
}

beforeAll(() => vi.stubGlobal("DOMRect", TestDOMRect));
afterAll(() => vi.unstubAllGlobals());

function rect(left: number, top: number, width: number, height: number): Rect {
  return { left, top, width, height };
}

function style({
  fit = "",
  overflow = "visible",
  radius = "0px",
}: {
  fit?: string;
  overflow?: string;
  radius?: string;
} = {}): CSSStyleDeclaration {
  return {
    objectFit: fit,
    objectPosition: "50% 50%",
    overflowX: overflow,
    overflowY: overflow,
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
    borderBottomRightRadius: radius,
    borderBottomLeftRadius: radius,
  } as CSSStyleDeclaration;
}

function image({
  box,
  fit,
  radius,
  attributes = {},
}: {
  box: Rect;
  fit: string;
  radius?: string;
  attributes?: Record<string, string>;
}): HTMLElement {
  return {
    tagName: "IMG",
    children: [],
    naturalWidth: 1000,
    naturalHeight: 1000,
    offsetWidth: box.width,
    offsetHeight: box.height,
    style: style({ fit, radius }),
    getBoundingClientRect: () => box,
    getAttribute: (name: string) => attributes[name] ?? null,
  } as unknown as HTMLElement;
}

function wrapper({
  box,
  child,
  radius = "16px",
  attributes = {},
}: {
  box: Rect;
  child: HTMLElement;
  radius?: string;
  attributes?: Record<string, string>;
}): HTMLElement {
  return {
    tagName: "DIV",
    children: [child],
    offsetWidth: box.width,
    offsetHeight: box.height,
    style: style({ overflow: "hidden", radius }),
    getBoundingClientRect: () => box,
    getAttribute: (name: string) => attributes[name] ?? null,
  } as unknown as HTMLElement;
}

function page(width = 400, height = 800): HTMLElement {
  return {
    style: style(),
    offsetWidth: width,
    offsetHeight: height,
    getBoundingClientRect: () => rect(0, 0, width, height),
  } as unknown as HTMLElement;
}

function resolvedPair({
  enterFit = "contain",
  enterAttributes,
  exitAttributes,
}: {
  enterFit?: string;
  enterAttributes?: Record<string, string>;
  exitAttributes?: Record<string, string>;
} = {}): ZoomResolved {
  const enterEl = image({
    box: rect(0, 100, 400, 400),
    fit: enterFit,
    radius: "24px",
    attributes: enterAttributes,
  });
  const exitImage = image({
    box: rect(20, 30, 100, 100),
    fit: "cover",
  });
  const exitEl = wrapper({
    box: rect(20, 30, 100, 100),
    child: exitImage,
    attributes: exitAttributes,
  });
  return { mode: "enter", enterEl, exitEl };
}

describe("zoom transition media inference", () => {
  it.each(["enter", "exit"] as const)(
    "preserves a partially visible Airbnb card and its surviving corners on %s",
    (mode) => {
      const enterEl = image({ box: rect(0, 0, 400, 400), fit: "cover" });
      const exitImage = image({ box: rect(320, 280, 144, 144), fit: "cover" });
      const exitEl = wrapper({
        box: rect(320, 280, 144, 144),
        child: exitImage,
      });
      const viewport = wrapper({
        box: rect(0, 260, 400, 220),
        child: exitEl,
        radius: "0px",
      });
      const exitPage = page();
      Object.defineProperty(exitEl, "parentElement", { value: viewport });
      Object.defineProperty(viewport, "parentElement", { value: exitPage });
      const input = buildInput(
        { mode, enterEl, exitEl },
        mode === "enter" ? exitPage : page(),
        mode === "enter" ? page() : exitPage,
        { x: 0, y: 0 },
      );
      expect(input.exitMedia?.window).toEqual(rect(320, 280, 80, 144));
      expect(input.exitMedia?.cornerRadii).toEqual([16, 0, 0, 16]);
      const style = (
        mode === "enter" ? createZoomIn(input) : createZoomOut(input)
      ).animate(0);
      // 64 of the 144 source pixels are hidden; the image keeps its 0.36 scale.
      expect(style.transform).toContain("scale(0.36, 0.36)");
      expect(style.clipPath).toContain("44.44444444444444% 50% 0%");
      expect(style.clipPath).toContain(
        "round 11.11111111111111% 0% 0% 11.11111111111111%",
      );
    },
  );
  it("connects inferred image geometry and wrapper radius to zoom input", () => {
    const input = buildInput(resolvedPair(), page(), page(), { x: 0, y: 0 });

    expect(input.enterMedia?.contentAware).toBe(true);
    expect(input.exitMedia?.contentAware).toBe(true);
    expect(input.exitRadius).toBe(16);
    // A radius on an image region inside the page must not round the whole page.
    expect(input.enterRadius).toBe(0);
  });

  it("keeps content-aware crop geometry on a fractionally sized detail page", () => {
    const pair = resolvedPair();
    const detail = page(400, 878);
    detail.getBoundingClientRect = () => rect(0, 0, 400, 877.75) as DOMRect;
    const input = buildInput(pair, page(), detail, { x: 0, y: 0 });
    expect(input.enterRect.height).toBe(400);
    expect(input.enterMedia?.content.width).toBe(400);
    expect(input.enterMedia?.content.height).toBe(400);
    expect(createZoomIn(input).animate(0).transform).toContain(
      "scale(0.25, 0.25)",
    );
  });

  it("keeps deprecated zero and px radius overrides working", () => {
    const zeroExit = buildInput(
      resolvedPair({ exitAttributes: { "data-zoom-radius": "0" } }),
      page(),
      page(),
      { x: 0, y: 0 },
    );
    const legacyEnter = buildInput(
      resolvedPair({
        enterAttributes: { "data-zoom-radius": "12px" },
      }),
      page(),
      page(),
      { x: 0, y: 0 },
    );

    expect(zeroExit.exitRadius).toBe(0);
    expect(legacyEnter.enterRadius).toBe(12);
  });

  it("atomically omits media geometry when one endpoint is unresolved", () => {
    const input = buildInput(
      resolvedPair({ enterFit: "fill" }),
      page(),
      page(),
      { x: 0, y: 0 },
    );

    expect(input.enterMedia).toBeUndefined();
    expect(input.exitMedia).toBeUndefined();
  });
});

function keyedElement(attribute: string, value: string): HTMLElement {
  return {
    getAttribute: (name: string) => (name === attribute ? value : null),
  } as unknown as HTMLElement;
}

function keyedPage(
  enter: HTMLElement[] = [],
  exit: HTMLElement[] = [],
): HTMLElement {
  return {
    querySelectorAll: (selector: string) =>
      selector.includes("enter") ? enter : exit,
  } as unknown as HTMLElement;
}

describe("zoom semantic direction", () => {
  it("uses forward for exit-key to enter-key geometry", () => {
    const exit = keyedElement("data-zoom-exit-key", "photo");
    const enter = keyedElement("data-zoom-enter-key", "photo");

    expect(
      resolveZoom(keyedPage([], [exit]), keyedPage([enter]), "forward"),
    ).toEqual({ mode: "enter", enterEl: enter, exitEl: exit });
    expect(
      resolveZoom(keyedPage([], [exit]), keyedPage([enter]), "backward"),
    ).toBeNull();
  });

  it("uses backward for enter-key to exit-key geometry", () => {
    const enter = keyedElement("data-zoom-enter-key", "photo");
    const exit = keyedElement("data-zoom-exit-key", "photo");

    expect(
      resolveZoom(keyedPage([enter]), keyedPage([], [exit]), "backward"),
    ).toEqual({ mode: "exit", enterEl: enter, exitEl: exit });
  });
});

function previewTransition(
  type: ZoomType = "static",
  observe?: (direction: "forward" | "backward") => void,
) {
  const pair = resolvedPair({
    enterAttributes: { "data-zoom-enter-key": "photo" },
    exitAttributes: { "data-zoom-exit-key": "photo" },
  });
  pair.exitEl.style.opacity = "0.8";
  const other = image({ box: rect(130, 30, 100, 100), fit: "cover" });
  other.style.opacity = "1";
  const list = Object.assign(page(), keyedPage([], [pair.exitEl, other]));
  const detail = Object.assign(page(), keyedPage([pair.enterEl]));
  const config = withOverride(zoom({ type, variant: "default" }), {
    forward: ({ context }) => observe?.(context.direction),
    backward: ({ context }) => observe?.(context.direction),
  });
  return {
    preview: pair.exitEl,
    other,
    create(direction: "forward" | "backward", coreDirection = direction) {
      return config.animation({
        from: direction === "forward" ? list : detail,
        to: direction === "forward" ? detail : list,
        context: {
          direction: coreDirection,
          scrollOffset: { x: 0, y: 0 },
        } as Parameters<typeof config.animation>[0]["context"],
      });
    },
  };
}

describe.each<ZoomType>(["static", "expand", "blur"])(
  "zoom %s preview compositing",
  (type) => {
    it.each(["forward", "backward"] as const)(
      "paints the shared visual only once on %s and restores the original opacity",
      (direction) => {
        const { preview, other, create } = previewTransition(type);
        const animation = create(direction);
        expect(preview.style.opacity).toBe("0");
        expect(other.style.opacity).toBe("1");
        expect(preview.getBoundingClientRect()).toEqual(rect(20, 30, 100, 100));
        animation.complete();
        expect(preview.style.opacity).toBe("0.8");
        expect(other.style.opacity).toBe("1");
      },
    );

    it("keeps a reused preview hidden when a new navigation interrupts the previous run", () => {
      const { preview, create } = previewTransition(type);
      const outgoing = create("forward");
      const incoming = create("backward");
      outgoing.complete();
      expect(preview.style.opacity).toBe("0");
      incoming.complete();
      expect(preview.style.opacity).toBe("0.8");
    });
  },
);

describe("zoom consumes the authoritative core direction", () => {
  it("does not reinterpret endpoint roles as a different direction", () => {
    const observed: string[] = [];
    const { create, preview } = previewTransition("static", (direction) =>
      observed.push(direction),
    );
    // Physical pages have detail -> list roles, but the core supplied forward.
    // Keep the existing no-match behavior instead of silently choosing backward.
    const animation = create("backward", "forward");
    expect(observed).toEqual(["forward"]);
    expect(animation.getTimeline()).toEqual([]);
    expect(preview.style.opacity).toBe("0.8");
    animation.complete();
  });
});
