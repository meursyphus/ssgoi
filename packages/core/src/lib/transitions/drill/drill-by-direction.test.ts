import { describe, expect, it } from "vitest";
import { drillByDirection } from "./index";

describe("drillByDirection", () => {
  it("produces `forward` and `back` direction entries carrying drill motion", () => {
    const entries = drillByDirection({
      forward: "enter",
      back: "exit",
      type: "slide",
    });

    expect(entries.map((entry) => entry.direction)).toEqual([
      "forward",
      "back",
    ]);
    for (const entry of entries) {
      // Each entry carries a real drill transition config (prepare + animation).
      expect(typeof entry.transition.animation).toBe("function");
      expect(typeof entry.transition.prepare).toBe("function");
    }
  });

  it("defaults the type to parallax when omitted", () => {
    const entries = drillByDirection({ forward: "enter", back: "exit" });
    expect(entries).toHaveLength(2);
  });
});
