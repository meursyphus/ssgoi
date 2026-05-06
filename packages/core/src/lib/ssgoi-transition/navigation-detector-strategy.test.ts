import { describe, expect, it } from "vitest";
import { createNavigationDetector } from "./navigation-detector-strategy";

describe("createNavigationDetector", () => {
  it("keeps OUT when it follows a stale first-mount IN for the same path", async () => {
    const detector = createNavigationDetector();

    detector.trigger("/posts", "in");
    const staleIn = detector.get("in");

    detector.trigger("/posts", "out");
    const out = detector.get("out");

    await expect(staleIn).resolves.toBeNull();

    detector.trigger("/posts/1", "in");
    const incoming = detector.get("in");

    await expect(out).resolves.toEqual({
      from: "/posts",
      to: "/posts/1",
    });
    await expect(incoming).resolves.toEqual({
      from: "/posts",
      to: "/posts/1",
    });
  });
});
