import { describe, expect, it } from "vitest";
import { createNavigationDetector } from "./navigation-detector-strategy";

describe("createNavigationDetector", () => {
  it("keeps OUT when it follows a stale first-mount IN for the same path", async () => {
    const detector = createNavigationDetector<string>();

    const staleIn = detector.arrive("/posts", "in", "stale-in");

    const out = detector.arrive("/posts", "out", "posts-out");

    await expect(staleIn).resolves.toBeNull();

    const incoming = detector.arrive("/posts/1", "in", "post-in");

    await expect(out).resolves.toEqual({
      from: "/posts",
      to: "/posts/1",
      out: "posts-out",
      in: "post-in",
    });
    await expect(incoming).resolves.toEqual({
      from: "/posts",
      to: "/posts/1",
      out: "posts-out",
      in: "post-in",
    });
  });

  it("locks a matched pair before a later nested IN microtask can run", async () => {
    const detector = createNavigationDetector<string>();

    const outgoing = detector.arrive("/projects", "out", "outer-out");
    const incoming = detector.arrive("/projects/1", "in", "outer-in");

    // Promise reactions for the completed pair have not run yet. A nested
    // Suspense boundary can be discovered in exactly this window.
    const nested = detector.arrive("/projects/1", "in", "nested-in");

    const expected = {
      from: "/projects",
      to: "/projects/1",
      out: "outer-out",
      in: "outer-in",
    };
    await expect(outgoing).resolves.toEqual(expected);
    await expect(incoming).resolves.toEqual(expected);

    detector.cancel(() => true);
    await expect(nested).resolves.toBeNull();
  });

  it("keeps the outermost same-path arrival across observer batches", async () => {
    type Boundary = {
      id: string;
      descendants: Set<string>;
    };
    const detector = createNavigationDetector<Boundary>({
      keepCurrent: ({ current, next }) => current.descendants.has(next.id),
    });
    const outer = {
      id: "outer",
      descendants: new Set(["nested"]),
    };
    const nested = {
      id: "nested",
      descendants: new Set<string>(),
    };

    const incoming = detector.arrive("/projects/1", "in", outer);
    const discardedNested = detector.arrive("/projects/1", "in", nested);
    await expect(discardedNested).resolves.toBeNull();

    const outgoing = detector.arrive("/projects", "out", {
      id: "out",
      descendants: new Set<string>(),
    });

    const pair = await incoming;
    expect(pair?.in).toBe(outer);
    await expect(outgoing).resolves.toBe(pair);
  });

  it("settles a superseded same-side arrival instead of leaking its promise", async () => {
    const detector = createNavigationDetector<string>();

    const first = detector.arrive("/projects/1", "in", "first");
    const second = detector.arrive("/projects/1", "in", "second");

    await expect(first).resolves.toBeNull();
    detector.cancel(() => true);
    await expect(second).resolves.toBeNull();
  });

  it("absorbs late nested sides after a pair instead of shifting the next navigation", async () => {
    type Boundary = {
      id: string;
      descendants: Set<string>;
    };
    const detector = createNavigationDetector<Boundary>({
      keepCurrent: ({ current, next }) =>
        current.id === next.id || current.descendants.has(next.id),
    });
    const listOuter = {
      id: "list-outer",
      descendants: new Set<string>(),
    };
    const lateListInstance = {
      // Activity/streaming can report a separate DOM instance rather than a
      // descendant of the owner that was selected for the completed pair.
      id: "late-list-instance",
      descendants: new Set<string>(),
    };
    const overview = {
      id: "overview",
      descendants: new Set<string>(),
    };

    const listOut = detector.arrive("/projects", "out", listOuter);
    const overviewIn = detector.arrive("/projects/1", "in", overview);
    const firstPair = await overviewIn;
    await expect(listOut).resolves.toBe(firstPair);

    // These callbacks belong to the pair that just completed, but arrive from
    // later observer batches. beta.1 kept them as the next pending OUT/IN.
    await expect(
      detector.arrive("/projects", "out", lateListInstance),
    ).resolves.toBeNull();
    await expect(
      detector.arrive("/projects/1", "in", overview),
    ).resolves.toBeNull();

    const overviewOut = detector.arrive("/projects/1", "out", overview);
    const docs = {
      id: "docs",
      descendants: new Set<string>(),
    };
    const docsIn = detector.arrive("/projects/1/docs", "in", docs);

    const secondPair = await docsIn;
    expect(secondPair).toMatchObject({
      from: "/projects/1",
      to: "/projects/1/docs",
      out: overview,
      in: docs,
    });
    await expect(overviewOut).resolves.toBe(secondPair);
  });

  it("allows a follow-up OUT nested under the previous IN owner", async () => {
    type Boundary = {
      id: string;
      descendants: Set<string>;
    };
    const detector = createNavigationDetector<Boundary>({
      keepCurrent: ({ current, next }) =>
        current.id === next.id || current.descendants.has(next.id),
    });
    const detailOuter = {
      id: "detail-outer",
      descendants: new Set(["detail-content"]),
    };
    const detailContent = {
      id: "detail-content",
      descendants: new Set<string>(),
    };

    const listOut = detector.arrive("/projects", "out", {
      id: "list",
      descendants: new Set<string>(),
    });
    const detailIn = detector.arrive("/projects/1", "in", detailOuter);
    await Promise.all([listOut, detailIn]);

    // This is the opposite side from the matched IN, so it starts a real
    // nested tab navigation and must not be mistaken for a late duplicate.
    const detailOut = detector.arrive("/projects/1", "out", detailContent);
    const docs = {
      id: "docs",
      descendants: new Set<string>(),
    };
    const docsIn = detector.arrive("/projects/1/docs", "in", docs);

    await expect(detailOut).resolves.toMatchObject({
      from: "/projects/1",
      to: "/projects/1/docs",
      out: detailContent,
      in: docs,
    });
    await expect(docsIn).resolves.toMatchObject({
      from: "/projects/1",
      to: "/projects/1/docs",
      out: detailContent,
      in: docs,
    });
  });
});
