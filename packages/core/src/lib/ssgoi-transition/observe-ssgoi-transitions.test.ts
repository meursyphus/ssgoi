import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SsgoiContext } from "@types";
import { observeSsgoiTransitions } from "./observe-ssgoi-transitions";

const createFakeRoot = (): Element => {
  const root = {
    nodeType: 1,
    setAttribute: vi.fn(),
    matches: () => false,
    querySelectorAll: () => [],
    closest: () => root,
  };
  return root as unknown as Element;
};

const createFakeContext = () => {
  const context: SsgoiContext = {
    register: vi.fn(),
    refFor: vi.fn(),
    start: vi.fn(),
    destroy: vi.fn(),
  };
  return context;
};

describe("observeSsgoiTransitions context lifecycle", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "MutationObserver",
      class {
        observe = vi.fn();
        disconnect = vi.fn();
      },
    );
    vi.stubGlobal("HTMLElement", class {});
    vi.stubGlobal("Node", { ELEMENT_NODE: 1 });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("arms the context on observe and releases it in the cleanup", () => {
    const context = createFakeContext();
    const cleanup = observeSsgoiTransitions(createFakeRoot(), context);

    expect(context.start).toHaveBeenCalledTimes(1);
    expect(context.destroy).not.toHaveBeenCalled();

    cleanup();
    expect(context.destroy).toHaveBeenCalledTimes(1);
  });

  it("stays symmetric across remount cycles (HMR / strict mode)", () => {
    const context = createFakeContext();

    const first = observeSsgoiTransitions(createFakeRoot(), context);
    first();
    const second = observeSsgoiTransitions(createFakeRoot(), context);
    second();

    expect(context.start).toHaveBeenCalledTimes(2);
    expect(context.destroy).toHaveBeenCalledTimes(2);
  });

  it("touches nothing when the DOM cannot be observed (SSR)", () => {
    vi.stubGlobal("MutationObserver", undefined);
    const context = createFakeContext();

    const cleanup = observeSsgoiTransitions(createFakeRoot(), context);
    cleanup();

    expect(context.start).not.toHaveBeenCalled();
    expect(context.destroy).not.toHaveBeenCalled();
  });
});
