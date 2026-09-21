import { describe, expect, it, vi } from "vitest";
import { isScrollLocked, lockScroll } from "./scroll-lock";

function fixture(root = false) {
  const document = Object.assign(new EventTarget(), {
    documentElement: null as unknown,
  });
  const element = Object.assign(new EventTarget(), {
    ownerDocument: document,
    scrollTop: 420,
    scrollLeft: 25,
  }) as unknown as HTMLElement;
  // CSS and geometry must not be read or changed, even for custom scrollbars.
  for (const key of ["style", "clientWidth", "offsetWidth"]) {
    Object.defineProperty(element, key, {
      get() {
        throw new Error(`Unexpected ${key} access`);
      },
    });
  }
  if (root) document.documentElement = element;
  return { element, target: root ? document : element };
}

function wheel(target: EventTarget, ctrlKey = false, cancelable = true) {
  const event = Object.assign(new Event("wheel", { cancelable }), { ctrlKey });
  target.dispatchEvent(event);
  return event.defaultPrevented;
}

function touch(target: EventTarget, fingers = 1) {
  const event = Object.assign(new Event("touchmove", { cancelable: true }), {
    touches: Array(fingers).fill({}),
  });
  target.dispatchEvent(event);
  return event.defaultPrevented;
}

describe("transition input scroll lock", () => {
  it.each([false, true])(
    "blocks scroll input without touching CSS or geometry, root=%s",
    (root) => {
      const { element, target } = fixture(root);
      const release = lockScroll(element);
      expect(isScrollLocked(element)).toBe(true);
      expect([element.scrollLeft, element.scrollTop]).toEqual([25, 420]);
      expect(wheel(target)).toBe(true);
      expect(touch(target)).toBe(true);
      // IN restoration must survive unlock instead of reverting to OUT.
      element.scrollTop = 120;
      release();
      expect(element.scrollTop).toBe(120);
      expect(isScrollLocked(element)).toBe(false);
      expect(wheel(target)).toBe(false);
      expect(touch(target)).toBe(false);
    },
  );

  it("preserves zoom gestures and ignores non-cancelable input", () => {
    const { element, target } = fixture();
    const release = lockScroll(element);
    expect(wheel(target, true)).toBe(false);
    expect(wheel(target, false, false)).toBe(false);
    expect(touch(target, 2)).toBe(false);
    release();
  });

  it("leaves taps and pointer interaction available", () => {
    const { element, target } = fixture();
    const release = lockScroll(element);
    for (const type of ["touchstart", "touchend", "pointerdown", "click"]) {
      const event = new Event(type, { cancelable: true });
      target.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    }
    release();
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

  it("releases only the final owner's listeners, even out of order", () => {
    const { element, target } = fixture();
    const first = lockScroll(element);
    const second = lockScroll(element);
    first();
    first();
    expect(wheel(target)).toBe(true);
    second();
    expect(wheel(target)).toBe(false);
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
