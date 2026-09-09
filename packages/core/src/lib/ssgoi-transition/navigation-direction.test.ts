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
    vi.stubGlobal("window", {
      addEventListener: (_name: string, listener: () => void) => {
        popListener = listener;
      },
      removeEventListener: vi.fn(),
    });

    const tracker = createNavigationDirectionTracker();
    expect(tracker.resolve("/", "/posts")).toBe("forward");
    popListener?.();
    expect(tracker.resolve("/posts", "/some-known-by-router")).toBe("backward");
    tracker.dispose();
  });
});
