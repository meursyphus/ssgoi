import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { buildInput, resolveZoom } from "./transition";
import type { ZoomResolved } from "./types";

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
  it("connects inferred image geometry and wrapper radius to zoom input", () => {
    const input = buildInput(resolvedPair(), page(), page(), { x: 0, y: 0 });

    expect(input.enterMedia?.contentAware).toBe(true);
    expect(input.exitMedia?.contentAware).toBe(true);
    expect(input.exitRadius).toBe(16);
    // A radius on an image region inside the page must not round the whole page.
    expect(input.enterRadius).toBe(0);
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
