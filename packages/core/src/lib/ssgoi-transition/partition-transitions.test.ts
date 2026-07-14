import { describe, expect, it } from "vitest";
import type { AnyTransitionConfig } from "@types";
import { partitionTransitions } from "./create-ssgoi-transition-context";
import { processSymmetricTransitions } from "./process-symmetric-transitions";

function config(id: string): AnyTransitionConfig {
  return {
    animation: (() => id) as unknown as AnyTransitionConfig["animation"],
  };
}

describe("partitionTransitions", () => {
  it("splits path entries from direction entries", () => {
    const path = { from: "/a", to: "/b", transition: config("path") };
    const dir = { direction: "back", transition: config("back") };

    const { pathEntries, directionTransitions } = partitionTransitions([
      path,
      dir,
    ]);

    expect(pathEntries).toEqual([path]);
    expect(directionTransitions.get("back")).toBe(dir.transition);
  });

  it("keeps the first-declared entry on a duplicate token", () => {
    const first = config("first");
    const second = config("second");

    const { directionTransitions } = partitionTransitions([
      { direction: "back", transition: first },
      { direction: "back", transition: second },
    ]);

    expect(directionTransitions.get("back")).toBe(first);
  });

  it("excludes direction entries from symmetric processing", () => {
    const symPath = {
      from: "/a",
      to: "/b",
      transition: config("path"),
      symmetric: true,
    };
    const dir = { direction: "forward", transition: config("forward") };

    const { pathEntries, directionTransitions } = partitionTransitions([
      symPath,
      dir,
    ]);
    const processed = processSymmetricTransitions(pathEntries);

    // Only the path entry is reversed; the direction entry never reaches
    // symmetric processing (it has no from/to to reverse).
    expect(processed).toHaveLength(2);
    expect(processed).toContainEqual({
      from: "/b",
      to: "/a",
      transition: symPath.transition,
    });
    expect(directionTransitions.get("forward")).toBe(dir.transition);
  });
});
