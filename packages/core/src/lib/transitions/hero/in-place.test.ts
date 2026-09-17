import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  fitHeroImage,
  hideHeroVisual,
  heroVisualOpacity,
  markHeroTransitioning,
  preserveStyles,
  stackHeroPages,
} from "./in-place";

function style(): CSSStyleDeclaration {
  const values = new Map<string, string>();
  const priorities = new Map<string, string>();
  const methods = {
    getPropertyValue: (key: string) => values.get(key) ?? "",
    getPropertyPriority: (key: string) => priorities.get(key) ?? "",
    setProperty: (key: string, value: string, priority = "") => {
      values.set(key, value);
      priorities.set(key, priority);
    },
    removeProperty: (key: string) => {
      values.delete(key);
      priorities.delete(key);
    },
  };
  const name = (key: string) =>
    key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return new Proxy(methods, {
    get: (target, key: string) =>
      key in target
        ? target[key as keyof typeof target]
        : methods.getPropertyValue(name(key)),
    set: (_target, key: string, value: string) => {
      methods.setProperty(name(key), value);
      return true;
    },
  }) as unknown as CSSStyleDeclaration;
}

class Element {
  style = style();
  attributes = new Map<string, string>();
  parentElement: Element | null = null;
  children: Element[] = [];
  computed = {
    opacity: "1",
    position: "static",
    display: "block",
    boxSizing: "border-box",
    width: "640px",
    height: "360px",
    margin: "0px",
    flex: "0 1 auto",
    alignSelf: "auto",
    gridArea: "auto",
    order: "0",
    verticalAlign: "baseline",
  };
  constructor(public tagName = "DIV") {}
  getAttribute(name: string) {
    return this.attributes.get(name) ?? null;
  }
  setAttribute(name: string, value: string) {
    this.attributes.set(name, value);
  }
  removeAttribute(name: string) {
    this.attributes.delete(name);
  }
  before(node: Element) {
    node.parentElement = this.parentElement;
    this.parentElement!.children.splice(
      this.parentElement!.children.indexOf(this),
      0,
      node,
    );
  }
  remove() {
    this.parentElement!.children.splice(
      this.parentElement!.children.indexOf(this),
      1,
    );
    this.parentElement = null;
  }
}
const dom = (el: Element) => el as unknown as HTMLElement;
const box = { left: 0, top: 0, width: 640, height: 360 };

beforeEach(() => {
  vi.stubGlobal("getComputedStyle", (el: Element) => el.computed);
  vi.stubGlobal("document", {
    createElement: (tag: string) => new Element(tag.toUpperCase()),
  });
});
afterEach(() => vi.unstubAllGlobals());

describe("in-page hero lifecycle", () => {
  it.each([true, false])(
    "restores hidden endpoints after the final overlapping run (old first: %s)",
    (oldFirst) => {
      const image = new Element("IMG");
      image.style.setProperty("opacity", "0.7", "important");
      image.computed.opacity = "0.7";
      const old = hideHeroVisual(dom(image));
      image.computed.opacity = "0";
      const next = hideHeroVisual(dom(image));
      expect(heroVisualOpacity(dom(image))).toBe("0.7");
      const first = oldFirst ? old : next;
      const last = oldFirst ? next : old;
      first();
      first();
      expect(image.style.opacity).toBe("0");
      last();
      expect(image.style.opacity).toBe("0.7");
      expect(image.style.getPropertyPriority("opacity")).toBe("important");
    },
  );

  it("reserves layout with an empty placeholder and retains the same real image and parent", () => {
    const parent = new Element();
    parent.style.overflow = "hidden";
    const image = new Element("IMG");
    image.style.width = "100%";
    image.style.objectFit = "cover";
    image.parentElement = parent;
    parent.children.push(image);
    const restore = fitHeroImage(dom(image), { ...box, height: 480 }, box);

    expect(parent.children).toHaveLength(2);
    expect(parent.children[1]).toBe(image);
    expect(image.parentElement).toBe(parent);
    expect(parent.children[0]!.tagName).toBe("SPAN");
    expect(parent.children[0]!.style.height).toBe("360px");
    expect(image.style.height).toBe("480px");
    expect(image.style.position).toBe("absolute");
    expect(image.style.objectFit).toBe("cover");
    expect(parent.style.overflow).toBe("hidden");
    restore();
    expect(parent.children).toEqual([image]);
    expect(image.style.width).toBe("100%");
    expect(image.style.height).toBe("");
    expect(image.style.position).toBe("");
  });

  it("does not insert a flow placeholder for an already-positioned image", () => {
    const image = new Element("IMG");
    image.computed.position = "absolute";
    image.style.position = "absolute";
    const restore = fitHeroImage(dom(image), box, box);
    expect(image.parentElement).toBeNull();
    restore();
    expect(image.style.position).toBe("absolute");
  });

  it("restores authored properties and priorities without changing unrelated CSS", () => {
    const image = new Element("IMG");
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

  it.each([null, "authored"])(
    "restores the caller hook's previous value %s",
    (previous) => {
      const image = new Element("IMG");
      if (previous !== null)
        image.setAttribute("data-hero-transitioning", previous);
      const restore = markHeroTransitioning(dom(image));
      expect(image.getAttribute("data-hero-transitioning")).toBe("");
      restore();
      expect(image.getAttribute("data-hero-transitioning")).toBe(previous);
    },
  );

  it("stacks the destination page above the positioned outgoing page and restores both", () => {
    const from = new Element(),
      to = new Element();
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
