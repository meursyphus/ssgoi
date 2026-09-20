import { describe, expect, it, vi } from "vitest";
import { isScrollLocked, lockScroll } from "./scroll-lock";
import { getScrollingElement } from "./get-scrolling-element";

function fixture(root = false, gutter = "auto", supportsGutter = true) {
  const values = new Map<string, [string, string]>();
  const style = {
    getPropertyValue: (key: string) => values.get(key)?.[0] ?? "",
    getPropertyPriority: (key: string) => values.get(key)?.[1] ?? "",
    setProperty: (key: string, value: string, priority = "") =>
      values.set(key, [value, priority]),
    removeProperty: (key: string) => values.delete(key),
  };
  const document = Object.assign(new EventTarget(), {
    documentElement: null as unknown,
    defaultView: {
      innerWidth: 1000,
      CSS: { supports: () => supportsGutter },
      getComputedStyle: () => ({
        scrollbarGutter: gutter,
        borderLeftWidth: "2px",
        borderRightWidth: "2px",
        paddingRight: "8px",
      }),
    },
  });
  const element = Object.assign(new EventTarget(), {
    style,
    ownerDocument: document,
    clientWidth: 980,
    offsetWidth: 1004,
    scrollTop: 420,
    scrollLeft: 25,
  }) as unknown as HTMLElement;
  if (root) document.documentElement = element;
  return { element, style, target: root ? document : element };
}

function wheel(target: EventTarget, ctrlKey = false) {
  const event = Object.assign(new Event("wheel", { cancelable: true }), {
    ctrlKey,
  });
  target.dispatchEvent(event);
  return event.defaultPrevented;
}

describe("transition scroll lock", () => {
  it("keeps a locked custom container discoverable by nested providers", () => {
    const { element } = fixture();
    vi.stubGlobal("window", {
      getComputedStyle: () => ({ overflowX: "hidden", overflowY: "hidden" }),
    });
    vi.stubGlobal("document", { body: {}, documentElement: {} });
    const release = lockScroll(element);
    try {
      expect(
        getScrollingElement({ parentElement: element } as HTMLElement),
      ).toBe(element);
    } finally {
      release();
      vi.unstubAllGlobals();
    }
  });

  it("blocks page keys while preserving text editing and button activation", () => {
    const { element } = fixture();
    const release = lockScroll(element);
    const key = (name: string, selector = "") => {
      const event = Object.assign(new Event("keydown", { cancelable: true }), {
        key: name,
        composedPath: () => [
          {
            matches: (query: string) => query.includes(selector) && !!selector,
          },
        ],
      });
      element.dispatchEvent(event);
      return event.defaultPrevented;
    };
    expect(key("End")).toBe(true);
    expect(key("PageDown")).toBe(true);
    expect(key("ArrowDown", "textarea")).toBe(false);
    expect(key(" ", "button")).toBe(false);
    expect(key("Escape")).toBe(false);
    release();
    expect(key("End")).toBe(false);
  });

  it.each([false, true])(
    "locks input and preserves coordinates, root=%s",
    (root) => {
      const { element, style, target } = fixture(root);
      const release = lockScroll(element);
      expect(isScrollLocked(element)).toBe(true);
      expect(style.getPropertyValue("overflow-y")).toBe("hidden");
      expect(style.getPropertyValue("scrollbar-gutter")).toBe("stable");
      expect([element.scrollLeft, element.scrollTop]).toEqual([25, 420]);
      expect(wheel(target)).toBe(true);
      expect(wheel(target, true)).toBe(false);
      const touch = Object.assign(
        new Event("touchmove", { cancelable: true }),
        { touches: [{}] },
      );
      target.dispatchEvent(touch);
      expect(touch.defaultPrevented).toBe(true);
      // A restored IN offset must survive unlock instead of reverting to OUT.
      element.scrollTop = 120;
      release();
      expect(element.scrollTop).toBe(120);
      expect(isScrollLocked(element)).toBe(false);
      expect(style.getPropertyValue("overflow-y")).toBe("");
      expect(wheel(target)).toBe(false);
    },
  );

  it("only restores after the last owner releases, even out of order", () => {
    const { element, style, target } = fixture();
    style.setProperty("overflow-y", "scroll", "important");
    style.setProperty("color", "red");
    const first = lockScroll(element);
    const second = lockScroll(element);
    first();
    first();
    expect(wheel(target)).toBe(true);
    expect(style.getPropertyValue("overflow-y")).toBe("hidden");
    style.setProperty("color", "blue");
    second();
    expect(style.getPropertyValue("overflow-y")).toBe("scroll");
    expect(style.getPropertyPriority("overflow-y")).toBe("important");
    expect(style.getPropertyValue("color")).toBe("blue");
  });

  it("preserves application style updates and existing two-sided gutters", () => {
    const { element, style } = fixture(false, "stable both-edges");
    style.setProperty("scrollbar-gutter", "stable both-edges");
    const release = lockScroll(element);
    style.setProperty("overflow-y", "clip");
    release();
    expect(style.getPropertyValue("overflow-y")).toBe("clip");
    expect(style.getPropertyValue("scrollbar-gutter")).toBe(
      "stable both-edges",
    );
  });

  it("compensates classic scrollbars on older browsers", () => {
    const { element, style } = fixture(true, "auto", false);
    style.setProperty("padding-right", "8px", "important");
    const release = lockScroll(element);
    expect(style.getPropertyValue("padding-right")).toBe("28px");
    release();
    expect(style.getPropertyValue("padding-right")).toBe("8px");
    expect(style.getPropertyPriority("padding-right")).toBe("important");
  });

  it("keeps independent scroll containers independent", () => {
    const first = fixture();
    const second = fixture();
    const release = lockScroll(first.element);
    expect(wheel(second.target)).toBe(false);
    const spy = vi.spyOn(first.target, "removeEventListener");
    release();
    expect(spy).toHaveBeenCalledTimes(3);
  });
});
