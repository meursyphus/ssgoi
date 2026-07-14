import { describe, expect, it, vi } from "vitest";
import type { AnyTransitionConfig, SsgoiTransitionEntry } from "@types";
import {
  buildTransitionRegistry,
  resolveTransitionForPair,
} from "./resolve-transition";

function transition(id: string): AnyTransitionConfig {
  return {
    animation: (() => id) as unknown as AnyTransitionConfig["animation"],
  };
}

describe("buildTransitionRegistry", () => {
  it("prepares path and direction selectors while preserving declaration order", () => {
    const firstDirection = transition("first-direction");
    const secondDirection = transition("second-direction");
    const symmetricPath = {
      from: "/a",
      to: "/b",
      transition: transition("path"),
      symmetric: true,
    };

    const registry = buildTransitionRegistry([
      [symmetricPath, { direction: "back", transition: firstDirection }],
      { direction: "back", transition: secondDirection },
    ]);

    expect(registry.pathTransitions).toEqual([
      symmetricPath,
      {
        from: "/b",
        to: "/a",
        transition: symmetricPath.transition,
      },
    ]);
    expect(registry.directionTransitions.get("back")).toBe(firstDirection);
  });

  it("keeps a path entry with extra direction metadata on the legacy path", () => {
    const pathWithMetadata = {
      from: "/a",
      to: "/b",
      transition: transition("path"),
      direction: "application-metadata",
    };
    const entries: readonly SsgoiTransitionEntry[] = [pathWithMetadata];

    const registry = buildTransitionRegistry(entries);

    expect(registry.pathTransitions).toEqual([pathWithMetadata]);
    expect(registry.directionTransitions).toEqual(new Map());
  });
});

describe("resolveTransitionForPair", () => {
  const path = transition("path");
  const forward = transition("forward");

  it("preserves middleware-before-transitions order when no resolver is configured", () => {
    const calls: string[] = [];

    const result = resolveTransitionForPair({
      from: "/raw-from",
      to: "/raw-to",
      middleware: () => {
        calls.push("middleware");
        return { from: "/a", to: "/b" };
      },
      getRegistry: () => {
        calls.push("transitions");
        return buildTransitionRegistry([
          { from: "/a", to: "/b", transition: path },
        ]);
      },
    });

    expect(result).toBe(path);
    expect(calls).toEqual(["middleware", "transitions"]);
  });

  it("resolves direction once before middleware, then resolves transitions", () => {
    const calls: string[] = [];
    const resolveDirection = vi.fn(
      (args: { from: string; to: string }): string => {
        calls.push(`direction:${args.from}->${args.to}`);
        return "forward";
      },
    );

    const result = resolveTransitionForPair({
      from: "/raw-from",
      to: "/raw-to",
      resolveDirection,
      middleware: () => {
        calls.push("middleware");
        return { from: "/a", to: "/b" };
      },
      getRegistry: () => {
        calls.push("transitions");
        return buildTransitionRegistry([
          { from: "/a", to: "/b", transition: path },
          { direction: "forward", transition: forward },
        ]);
      },
    });

    expect(result).toBe(forward);
    expect(resolveDirection).toHaveBeenCalledOnce();
    expect(calls).toEqual([
      "direction:/raw-from->/raw-to",
      "middleware",
      "transitions",
    ]);
  });

  it("falls back to the normalized path for null and unregistered tokens", () => {
    const getRegistry = () =>
      buildTransitionRegistry([{ from: "/a", to: "/b", transition: path }]);
    const baseArgs = {
      from: "/raw-from",
      to: "/raw-to",
      middleware: () => ({ from: "/a", to: "/b" }),
      getRegistry,
    };

    expect(
      resolveTransitionForPair({
        ...baseArgs,
        resolveDirection: () => null,
      }),
    ).toBe(path);
    expect(
      resolveTransitionForPair({
        ...baseArgs,
        resolveDirection: () => "unregistered",
      }),
    ).toBe(path);
  });

  it("selects opposite transitions for the same pair under opposite tokens", () => {
    const back = transition("back");
    const getRegistry = () =>
      buildTransitionRegistry([
        { direction: "forward", transition: forward },
        { direction: "back", transition: back },
      ]);
    const baseArgs = {
      from: "/a",
      to: "/b",
      middleware: (from: string, to: string) => ({ from, to }),
      getRegistry,
    };

    expect(
      resolveTransitionForPair({
        ...baseArgs,
        resolveDirection: () => "forward",
      }),
    ).toBe(forward);
    expect(
      resolveTransitionForPair({
        ...baseArgs,
        resolveDirection: () => "back",
      }),
    ).toBe(back);
  });

  it("returns null when neither a direction nor a path matches", () => {
    expect(
      resolveTransitionForPair({
        from: "/a",
        to: "/b",
        middleware: (from, to) => ({ from, to }),
        resolveDirection: () => "unregistered",
        getRegistry: () => buildTransitionRegistry([]),
      }),
    ).toBeNull();
  });
});
