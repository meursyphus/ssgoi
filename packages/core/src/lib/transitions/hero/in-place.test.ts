import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Animation } from "../../animation/animation";
import type { SsgoiTransitionContext } from "@types";
import { hero } from "./transition";
import { preserveStyles, stackHeroPages } from "./in-place";

const kebab = (key: string) =>
  key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

/** Inline style that records every property the engine ever writes. */
function style(writes = new Set<string>()): CSSStyleDeclaration {
  const values = new Map<string, string>();
  const priorities = new Map<string, string>();
  const methods = {
    getPropertyValue: (key: string) => values.get(key) ?? "",
    getPropertyPriority: (key: string) => priorities.get(key) ?? "",
    setProperty: (key: string, value: string, priority = "") => {
      writes.add(key);
      if (value === "") {
        values.delete(key);
        priorities.delete(key);
        return;
      }
      values.set(key, value);
      priorities.set(key, priority);
    },
    removeProperty: (key: string) => {
      writes.add(key);
      values.delete(key);
      priorities.delete(key);
    },
    snapshot: () => Object.fromEntries(values),
  };
  return new Proxy(methods, {
    get: (target, key: string) =>
      key in target
        ? target[key as keyof typeof target]
        : methods.getPropertyValue(kebab(key)),
    set: (_target, key: string, value: string) => {
      methods.setProperty(kebab(key), String(value));
      return true;
    },
  }) as unknown as CSSStyleDeclaration;
}
const inline = (el: FakeElement) =>
  (
    el.style as unknown as { snapshot: () => Record<string, string> }
  ).snapshot();

class Rect {
  constructor(
    public left = 0,
    public top = 0,
    public width = 0,
    public height = 0,
  ) {}
  get x() {
    return this.left;
  }
  get y() {
    return this.top;
  }
  get right() {
    return this.left + this.width;
  }
  get bottom() {
    return this.top + this.height;
  }
}

const DEFAULTS: Record<string, string> = {
  position: "static",
  display: "block",
  zIndex: "auto",
  opacity: "1",
  backgroundColor: "rgba(0, 0, 0, 0)",
  objectFit: "fill",
  objectPosition: "50% 50%",
  overflowX: "visible",
  overflowY: "visible",
  paddingTop: "0px",
  paddingRight: "0px",
  paddingBottom: "0px",
  paddingLeft: "0px",
  borderTopWidth: "0px",
  borderRightWidth: "0px",
  borderBottomWidth: "0px",
  borderLeftWidth: "0px",
  borderTopLeftRadius: "0px",
  borderTopRightRadius: "0px",
  borderBottomRightRadius: "0px",
  borderBottomLeftRadius: "0px",
};

/** Just enough DOM for Hero's measurement, crossfade copy, and cleanup. */
class FakeElement {
  writes = new Set<string>();
  style = style(this.writes);
  attrs = new Map<string, string>();
  parentElement: FakeElement | null = null;
  children: FakeElement[] = [];
  bounds = new Rect();
  computed: Record<string, string> = { ...DEFAULTS };
  naturalWidth = 0;
  naturalHeight = 0;
  currentSrc = "";
  scrollLeft = 0;
  scrollTop = 0;
  constructor(public tagName = "DIV") {}
  get attributes() {
    return [...this.attrs].map(([name, value]) => ({ name, value }));
  }
  getAttribute(name: string) {
    return this.attrs.get(name) ?? null;
  }
  setAttribute(name: string, value: string) {
    this.attrs.set(name, value);
  }
  removeAttribute(name: string) {
    this.attrs.delete(name);
  }
  hasAttribute(name: string) {
    return this.attrs.has(name);
  }
  append(...nodes: FakeElement[]) {
    for (const node of nodes) {
      node.parentElement = this;
      this.children.push(node);
    }
  }
  before(node: FakeElement) {
    node.remove();
    const siblings = this.parentElement!.children;
    siblings.splice(siblings.indexOf(this), 0, node);
    node.parentElement = this.parentElement;
  }
  after(node: FakeElement) {
    node.remove();
    const siblings = this.parentElement!.children;
    siblings.splice(siblings.indexOf(this) + 1, 0, node);
    node.parentElement = this.parentElement;
  }
  private sibling(offset: number): FakeElement | null {
    const siblings = this.parentElement?.children ?? [];
    return siblings[siblings.indexOf(this) + offset] ?? null;
  }
  get previousElementSibling(): FakeElement | null {
    return this.sibling(-1);
  }
  get nextElementSibling(): FakeElement | null {
    return this.sibling(1);
  }
  remove() {
    const siblings = this.parentElement?.children;
    if (siblings?.includes(this)) siblings.splice(siblings.indexOf(this), 1);
    this.parentElement = null;
  }
  contains(node: FakeElement): boolean {
    return node === this || this.children.some((child) => child.contains(node));
  }
  cloneNode(): FakeElement {
    const clone = new FakeElement(this.tagName);
    clone.attrs = new Map(this.attrs);
    clone.computed = { ...this.computed };
    clone.naturalWidth = this.naturalWidth;
    clone.naturalHeight = this.naturalHeight;
    clone.append(...this.children.map((child) => child.cloneNode()));
    return clone;
  }
  /** Copies are absolutely positioned at the top left of the image's parent. */
  getBoundingClientRect(): Rect {
    if (!this.hasAttribute("data-ssgoi-crossfade")) return this.bounds;
    const origin = this.parentElement!.getBoundingClientRect();
    return new Rect(
      origin.left,
      origin.top,
      Number.parseFloat(this.style.width),
      Number.parseFloat(this.style.height),
    );
  }
  get offsetWidth() {
    return this.getBoundingClientRect().width;
  }
  get offsetHeight() {
    return this.getBoundingClientRect().height;
  }
  get clientWidth() {
    return this.offsetWidth;
  }
  get clientHeight() {
    return this.offsetHeight;
  }
  querySelectorAll(selector: string): FakeElement[] {
    const [, name, value] = /^\[([^=\]]+)(?:="([^"]*)")?\]$/.exec(selector)!;
    return this.children.flatMap((child) => [
      ...(child.hasAttribute(name!) &&
      (value === undefined || child.getAttribute(name!) === value)
        ? [child]
        : []),
      ...child.querySelectorAll(selector),
    ]);
  }
  querySelector(selector: string) {
    return this.querySelectorAll(selector)[0] ?? null;
  }
}
const dom = (el: FakeElement) => el as unknown as HTMLElement;

function computedStyle(el: FakeElement) {
  const read = (key: string) =>
    el.style.getPropertyValue(kebab(key)) || el.computed[key] || "";
  const names = Object.keys(el.computed).map(kebab);
  return new Proxy(
    {
      [Symbol.iterator]: () => names[Symbol.iterator](),
      length: names.length,
      getPropertyValue: (name: string) =>
        read(name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())),
    },
    {
      get: (target, key) =>
        typeof key === "symbol" || key in target
          ? target[key as keyof typeof target]
          : read(key),
    },
  );
}

/** Where a transformed, clipped element's visible window lands on screen. */
function visibleWindow(el: FakeElement) {
  const box = el.getBoundingClientRect();
  const [, tx, ty, sx, sy] = /translate\((.+)px, (.+)px\) scale\((.+), (.+)\)/
    .exec(el.style.transform)!
    .map(Number);
  const [top, right, bottom, left] = /inset\((\S+)% (\S+)% (\S+)% (\S+)%/
    .exec(el.style.clipPath)!
    .slice(1)
    .map(Number);
  const cx = box.left + box.width / 2;
  const cy = box.top + box.height / 2;
  const x = (value: number) => cx + sx! * (value - cx) + tx!;
  const y = (value: number) => cy + sy! * (value - cy) + ty!;
  const x0 = x(box.left + (left! / 100) * box.width);
  const x1 = x(box.left + box.width - (right! / 100) * box.width);
  const y0 = y(box.top + (top! / 100) * box.height);
  const y1 = y(box.top + box.height - (bottom! / 100) * box.height);
  return { left: x0, top: y0, width: x1 - x0, height: y1 - y0 };
}

beforeEach(() => {
  vi.stubGlobal("DOMRect", Rect);
  vi.stubGlobal("HTMLElement", FakeElement);
  vi.stubGlobal("getComputedStyle", computedStyle);
  vi.stubGlobal("document", {
    createElement: () => {
      throw new Error("Hero must not create placeholders or wrappers");
    },
  });
});
afterEach(() => vi.unstubAllGlobals());

const LAYOUT = {
  position: "",
  inset: "0px",
  width: "100%",
  height: "100%",
  margin: "0px 0px 12px",
  flex: "0 0 auto",
  "object-fit": "cover",
};
const PAINT = [
  "transform",
  "transform-origin",
  "clip-path",
  "border-radius",
  "will-change",
  "opacity",
];

async function enter({
  position,
  width,
  height,
  type,
  firstChildMargin = 0,
}: {
  position: string;
  width: number;
  height: number;
  type: "static" | "fade";
  /** Like `* + *` spacing: the image moves when it stops being first. */
  firstChildMargin?: number;
}) {
  const root = new FakeElement(),
    from = new FakeElement(),
    to = new FakeElement(),
    frame = new FakeElement(),
    source = new FakeElement("IMG"),
    image = new FakeElement("IMG"),
    caption = new FakeElement("P");
  root.bounds = new Rect(0, 0, 800, 800);
  from.bounds = to.bounds = root.bounds;
  source.bounds = new Rect(20, 20, 160, 120);
  frame.bounds = new Rect(80, 40, 640, 360);
  Object.defineProperty(image, "bounds", {
    get: () =>
      new Rect(
        80,
        40 + (frame.children[0] === image ? 0 : firstChildMargin),
        640,
        360,
      ),
  });
  caption.bounds = new Rect(80, 412, 640, 40);
  source.naturalWidth = image.naturalWidth = width;
  source.naturalHeight = image.naturalHeight = height;
  source.computed.objectFit = image.computed.objectFit = "cover";
  source.setAttribute("data-hero-exit-key", "photo");
  image.setAttribute("data-hero-enter-key", "photo");
  image.computed.position = position;
  for (const [key, value] of Object.entries({ ...LAYOUT, position }))
    if (value) image.style.setProperty(key, value);
  frame.style.overflow = "hidden";
  frame.computed.position = "relative";
  frame.computed.overflowX = frame.computed.overflowY = "hidden";
  frame.computed.borderTopLeftRadius =
    frame.computed.borderTopRightRadius =
    frame.computed.borderBottomRightRadius =
    frame.computed.borderBottomLeftRadius =
      "24px";
  root.append(from, to);
  from.append(source);
  to.append(frame, caption);
  frame.append(image);
  image.writes.clear();
  frame.writes.clear();
  caption.writes.clear();
  const authored = inline(image);
  const context = {
    direction: "forward",
    positionedParent: dom(root),
    scrollOffset: { x: 0, y: 0 },
  } as SsgoiTransitionContext;
  const config = hero({ type, variant: "default" });
  const prepared = await config.prepare!({
    from: Promise.resolve(dom(from)),
    to: Promise.resolve(dom(to)),
    context,
    createElement: () => {
      throw new Error("Hero must not create transition elements");
    },
  });
  const animation: Animation = config.animation({
    from: dom(from),
    to: dom(to),
    context,
    ...prepared,
  });
  return { animation, authored, frame, image, caption, source };
}

describe("in-page hero lifecycle", () => {
  it.each(
    ["static", "absolute"].flatMap((position) =>
      [
        [1600, 900],
        [1200, 1200],
        [800, 1200],
        [2400, 600],
      ].map(([width, height]) => ({ position, width, height })),
    ),
  )(
    "animates the $position image in its own box at $width × $height",
    async ({ position, width, height }) => {
      const { animation, authored, frame, image, caption, source } =
        await enter({
          position,
          width: width!,
          height: height!,
          type: "static",
        });

      // Same image, same parent, authored layout untouched; the only other
      // child is the inert crossfade copy of the source, painted below it.
      expect(image.parentElement).toBe(frame);
      expect(frame.children).toHaveLength(2);
      const [copy] = frame.children;
      expect(frame.children[1]).toBe(image);
      expect(copy!.getAttribute("data-ssgoi-crossfade")).toBe("");
      expect(copy!.getAttribute("aria-hidden")).toBe("true");
      // The opaque copy below shows the source; the real image fades in over
      // it, so the copy also covers what the image cannot paint itself.
      expect(copy!.style.opacity).toBe("1");
      expect(image.style.opacity).toBe("0");
      expect([...image.writes].every((key) => PAINT.includes(key))).toBe(true);
      for (const [key, value] of Object.entries(authored))
        expect(image.style.getPropertyValue(key)).toBe(value);
      // No transition-state attribute: only the authored key remains.
      expect([...image.attrs.keys()]).toEqual(["data-hero-enter-key"]);
      expect([...frame.writes, ...caption.writes]).toEqual([]);

      // At t=0 the real image and the copy show exactly the source window.
      for (const visual of [image, copy!]) {
        const shown = visibleWindow(visual);
        expect(shown.left).toBeCloseTo(source.bounds.left, 6);
        expect(shown.top).toBeCloseTo(source.bounds.top, 6);
        expect(shown.width).toBeCloseTo(source.bounds.width, 6);
        expect(shown.height).toBeCloseTo(source.bounds.height, 6);
      }

      animation.complete();
      expect(frame.children).toEqual([image]);
      expect(inline(image)).toEqual(authored);
      expect([...image.writes].every((key) => PAINT.includes(key))).toBe(true);
      expect([...frame.writes, ...caption.writes]).toEqual([]);
    },
  );

  it("fades sibling content without touching the image's layout or frame", async () => {
    const { animation, authored, frame, image, caption } = await enter({
      position: "static",
      width: 800,
      height: 1200,
      type: "fade",
    });
    expect(caption.style.opacity).toBe("0");
    expect([...image.writes].every((key) => PAINT.includes(key))).toBe(true);
    expect([...frame.writes]).toEqual([]);
    animation.complete();
    expect(caption.style.opacity).toBe("");
    expect(inline(image)).toEqual(authored);
    expect(frame.children).toEqual([image]);
  });

  it("puts the copy above the image when placing it below would move the image", async () => {
    const { animation, authored, frame, image, source } = await enter({
      position: "static",
      width: 1600,
      height: 900,
      type: "static",
      firstChildMargin: 16,
    });
    const [first, copy] = frame.children;
    expect(first).toBe(image);
    expect(copy!.getAttribute("data-ssgoi-crossfade")).toBe("");
    expect(image.getBoundingClientRect().top).toBe(40);
    // Above, the copy fades out over the real image, which stays opaque.
    expect(copy!.style.opacity).toBe("1");
    expect(image.style.opacity).toBe("1");
    for (const visual of [image, copy!]) {
      const shown = visibleWindow(visual);
      expect(shown.left).toBeCloseTo(source.bounds.left, 6);
      expect(shown.top).toBeCloseTo(source.bounds.top, 6);
      expect(shown.width).toBeCloseTo(source.bounds.width, 6);
      expect(shown.height).toBeCloseTo(source.bounds.height, 6);
    }
    animation.complete();
    expect(frame.children).toEqual([image]);
    expect(inline(image)).toEqual(authored);
  });

  it("restores authored properties and priorities without changing unrelated CSS", () => {
    const image = new FakeElement("IMG");
    image.style.setProperty("transform", "translateX(2px)", "important");
    image.style.overflow = "hidden";
    const restore = preserveStyles(dom(image), ["transform", "clip-path"]);
    image.style.transform = "scale(2)";
    image.style.clipPath = "inset(20%)";
    restore();
    expect(image.style.transform).toBe("translateX(2px)");
    expect(image.style.getPropertyPriority("transform")).toBe("important");
    expect(image.style.clipPath).toBe("");
    expect(image.style.overflow).toBe("hidden");
  });

  it("stacks the destination page above the positioned outgoing page and restores both", () => {
    const from = new FakeElement(),
      to = new FakeElement();
    from.style.zIndex = "10";
    const restore = stackHeroPages(dom(from), dom(to));
    expect([from.style.zIndex, to.style.zIndex, to.style.position]).toEqual([
      "0",
      "2",
      "relative",
    ]);
    restore();
    expect([from.style.zIndex, to.style.zIndex, to.style.position]).toEqual([
      "10",
      "",
      "",
    ]);
  });
});
