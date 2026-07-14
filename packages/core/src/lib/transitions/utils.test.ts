import { describe, expect, it, vi } from "vitest";
import type { AnyTransitionConfig } from "@types";
import { createDirectionalTransitions } from "./utils";

function config(id: string): AnyTransitionConfig {
  return {
    animation: (() => id) as unknown as AnyTransitionConfig["animation"],
  };
}

describe("createDirectionalTransitions", () => {
  it("maps each token to a direction entry, invoking the factory once per token with the mapped direction", () => {
    const factory = vi.fn((direction: "enter" | "exit") => config(direction));

    const entries = createDirectionalTransitions(
      { forward: "enter", back: "exit" },
      factory,
    );

    expect(entries).toHaveLength(2);
    expect(entries.map((entry) => entry.direction)).toEqual([
      "forward",
      "back",
    ]);
    expect(factory).toHaveBeenCalledTimes(2);
    expect(factory).toHaveBeenNthCalledWith(1, "enter");
    expect(factory).toHaveBeenNthCalledWith(2, "exit");
    // token → factory-output wiring is preserved in declaration order
    expect(entries[0]!.transition).toBe(factory.mock.results[0]!.value);
    expect(entries[1]!.transition).toBe(factory.mock.results[1]!.value);
  });
});
