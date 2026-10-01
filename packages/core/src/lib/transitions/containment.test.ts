import { describe, expect, it } from "vitest";
import type { PrepareArgs } from "@types";
import { axis } from "./axis";
import { drill } from "./drill";
import { scroll } from "./scroll";
import { sheet } from "./sheet";
import { slide } from "./slide";
import { strip } from "./strip";

function page() {
  return { style: {} as Record<string, string> } as unknown as HTMLElement;
}

// Resolves synchronously, like the core's staged page handles.
function handle(el: HTMLElement) {
  return { then: (resolve: (el: HTMLElement) => void) => resolve(el) };
}

describe("moving page containment", () => {
  it.each([
    ["drill", drill()],
    ["slide", slide()],
    ["axis", axis()],
    ["strip", strip()],
    ["scroll", scroll()],
    ["sheet", sheet({ type: "background-scale" })],
  ])(
    "%s contains layout but never paint, which drops SVG backdrop filters",
    (_name, transition) => {
      for (const direction of ["forward", "backward"] as const) {
        const from = page();
        const to = page();
        transition.prepare?.({
          from: handle(from),
          to: handle(to),
          context: {
            direction,
            positionedParent: { appendChild: () => undefined },
          },
          createElement: page,
        } as unknown as PrepareArgs);
        const contained = [from, to].filter((el) => el.style.contain);
        expect(contained.length).toBeGreaterThan(0);
        for (const el of contained) expect(el.style.contain).toBe("layout");
      }
    },
  );
});
