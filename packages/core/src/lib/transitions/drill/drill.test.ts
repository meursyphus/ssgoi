import { describe, expect, it } from "vitest";
import type { SsgoiDirectionTransition, SsgoiPathTransition } from "@types";
import { drill } from "./index";

async function incomingStartTransform(
  entry: SsgoiDirectionTransition,
): Promise<string> {
  const from = { style: {} } as HTMLElement;
  const to = { style: {} } as HTMLElement;

  entry.transition.prepare?.({
    from: Promise.resolve(from),
    to: Promise.resolve(to),
    context: {} as never,
    createElement: (() => ({ style: {} })) as never,
  });
  await Promise.resolve();

  return to.style.transform;
}

describe("drill", () => {
  it("maps custom direction tokens to drill motions", async () => {
    const entries = drill({
      directions: {
        push: "enter",
        pop: "exit",
      },
      type: "slide",
    });

    expect(entries.map((entry) => entry.direction)).toEqual(["push", "pop"]);
    await expect(incomingStartTransform(entries[0]!)).resolves.toBe(
      "translate3d(100%, 0, 0)",
    );
    await expect(incomingStartTransform(entries[1]!)).resolves.toBe(
      "translate3d(-100%, 0, 0)",
    );
  });

  it("defaults direction-selected drill motions to parallax", async () => {
    const entries = drill({
      directions: { forward: "enter", back: "exit" },
    });

    await expect(incomingStartTransform(entries[1]!)).resolves.toBe(
      "translate3d(-20%, 0, 0)",
    );
  });

  it("keeps path-selected drill calls unchanged", () => {
    const entries: SsgoiPathTransition[] = drill({
      enter: "/detail",
      exit: "/",
      type: "slide",
    });

    expect(entries.map(({ from, to }) => ({ from, to }))).toEqual([
      { from: "/", to: "/detail" },
      { from: "/detail", to: "/" },
    ]);
  });
});
