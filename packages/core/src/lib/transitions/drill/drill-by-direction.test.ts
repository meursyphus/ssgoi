import { describe, expect, it } from "vitest";
import type { SsgoiDirectionTransition } from "@types";
import { drillByDirection } from "./index";

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

describe("drillByDirection", () => {
  it("maps forward to enter motion and back to exit motion", async () => {
    const entries = drillByDirection({
      forward: "enter",
      back: "exit",
      type: "slide",
    });

    expect(entries.map((entry) => entry.direction)).toEqual([
      "forward",
      "back",
    ]);
    await expect(incomingStartTransform(entries[0]!)).resolves.toBe(
      "translate3d(100%, 0, 0)",
    );
    await expect(incomingStartTransform(entries[1]!)).resolves.toBe(
      "translate3d(-100%, 0, 0)",
    );
  });

  it("defaults the type to parallax when omitted", async () => {
    const entries = drillByDirection({ forward: "enter", back: "exit" });
    await expect(incomingStartTransform(entries[1]!)).resolves.toBe(
      "translate3d(-20%, 0, 0)",
    );
  });
});
