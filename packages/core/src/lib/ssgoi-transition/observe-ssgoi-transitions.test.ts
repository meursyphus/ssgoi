import { describe, expect, it, vi } from "vitest";
import type { SsgoiContext } from "@types";
import { registerTransitionBatch } from "./observe-ssgoi-transitions";

type FakeElement = {
  parentElement: FakeElement | null;
  getAttribute(name: string): string | null;
};

function element(path: string, parentElement: FakeElement | null = null) {
  return {
    parentElement,
    getAttribute: (name: string) =>
      name === "data-ssgoi-transition" ? path : null,
  } satisfies FakeElement;
}

describe("registerTransitionBatch", () => {
  it("registers parents first and emits only the outer entering boundary", () => {
    const outer = element("/products/all");
    const inner = element("/products/all", outer);
    const register = vi.fn();
    const context = { register } as unknown as SsgoiContext;

    registerTransitionBatch(
      new Set([
        inner as unknown as HTMLElement,
        outer as unknown as HTMLElement,
      ]),
      context,
    );

    expect(register.mock.calls).toEqual([
      ["/products/all", outer, { enter: true }],
      ["/products/all", inner, { enter: false }],
    ]);
  });

  it("emits a child when its existing parent is not part of the batch", () => {
    const parent = element("/products/all");
    const child = element("/products/fashion", parent);
    const register = vi.fn();
    const context = { register } as unknown as SsgoiContext;

    registerTransitionBatch(
      new Set([child as unknown as HTMLElement]),
      context,
    );

    expect(register).toHaveBeenCalledWith("/products/fashion", child, {
      enter: true,
    });
  });

  it("ignores an existing parent's attribute update when a child mounts", () => {
    const parent = element("/products/fashion");
    const child = element("/products/fashion", parent);
    const register = vi.fn();
    const context = { register } as unknown as SsgoiContext;

    registerTransitionBatch(
      new Set([
        parent as unknown as HTMLElement,
        child as unknown as HTMLElement,
      ]),
      context,
      new Set([child as unknown as HTMLElement]),
    );

    expect(register).toHaveBeenCalledWith("/products/fashion", child, {
      enter: true,
    });
  });
});
