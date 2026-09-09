import { afterEach, describe, expect, it, vi } from "vitest";
import { createNavigationDirectionTracker } from "./navigation-direction";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("navigation direction tracker", () => {
  it("keeps an explicit navigation to the previous path forward", () => {
    const tracker = createNavigationDirectionTracker();
    expect(tracker.resolve("/", "/posts")).toBe("forward");
    expect(tracker.resolve("/posts", "/posts/1")).toBe("forward");
    expect(tracker.resolve("/posts/1", "/posts")).toBe("forward");
    tracker.dispose();
  });

  it("uses popstate as a backward hint for the next paired navigation", () => {
    let popListener: (() => void) | undefined;
    const addEventListener = vi.fn(
      (_name: string, listener: () => void, _capture: boolean) => {
        popListener = listener;
      },
    );
    const removeEventListener = vi.fn();
    const back = vi.fn();
    const forward = vi.fn();
    const go = vi.fn();
    const history = { back, forward, go };
    vi.stubGlobal("window", {
      addEventListener,
      removeEventListener,
      history,
    });

    const tracker = createNavigationDirectionTracker();
    expect(addEventListener).toHaveBeenCalledWith(
      "popstate",
      expect.any(Function),
      true,
    );
    expect(tracker.resolve("/", "/posts")).toBe("forward");
    popListener?.();
    expect(tracker.resolve("/posts", "/some-known-by-router")).toBe("backward");
    tracker.dispose();
    expect(removeEventListener).toHaveBeenCalledWith(
      "popstate",
      popListener,
      true,
    );
    expect(history).toEqual({ back, forward, go });
  });

  it("marks history traversal before popstate and ignores its late duplicate", () => {
    let popListener: (() => void) | undefined;
    const back = vi.fn();
    const forward = vi.fn();
    const go = vi.fn();
    const history = { back, forward, go };
    vi.stubGlobal("window", {
      addEventListener: (
        _name: string,
        listener: () => void,
        _capture: boolean,
      ) => {
        popListener = listener;
      },
      removeEventListener: vi.fn(),
      history,
    });

    const tracker = createNavigationDirectionTracker();
    history.back();
    expect(back).toHaveBeenCalledOnce();
    expect(tracker.resolve("/cart", "/products/1")).toBe("backward");
    popListener?.();
    expect(tracker.resolve("/products/1", "/cart")).toBe("forward");

    history.forward();
    expect(forward).toHaveBeenCalledOnce();
    expect(tracker.resolve("/products/1", "/cart")).toBe("forward");
    popListener?.();

    history.go(-2);
    expect(go).toHaveBeenCalledWith(-2);
    expect(tracker.resolve("/cart", "/")).toBe("backward");
    tracker.dispose();
    expect(history).toEqual({ back, forward, go });
  });
});
