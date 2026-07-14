import { describe, expect, it } from "vitest";
import type { TransitionConfig } from "@types";
import {
  findMatchingTransition,
  matchPath,
  resolveTransitionForPair,
  selectTransition,
} from "./find-matching-transition";

function transition(id: string): TransitionConfig {
  return { animation: (() => id) as unknown as TransitionConfig["animation"] };
}

describe("matchPath", () => {
  it("normalizes query, hash, leading slash, and trailing slash", () => {
    expect(matchPath("posts/1?sort=top#comments", "/posts/*")).toBe(true);
    expect(matchPath("/posts/1/", "posts/:id")).toBe(true);
    expect(matchPath("/", "")).toBe(true);
  });

  it("supports global, prefix, and segment wildcards", () => {
    expect(matchPath("/anything", "*")).toBe(true);
    expect(matchPath("/products/123", "/products/*")).toBe(true);
    expect(matchPath("/products", "/products/*")).toBe(false);
    expect(matchPath("/products/123", "/products/:id")).toBe(true);
    expect(matchPath("/products/123", "/products/[id]")).toBe(true);
    expect(matchPath("/products/123", "/products/{id}")).toBe(true);
    expect(matchPath("/products/123/reviews", "/products/:id")).toBe(false);
  });

  it("supports deep wildcard suffixes that include the prefix path", () => {
    expect(matchPath("/", "/**")).toBe(true);
    expect(matchPath("/products", "/products/**")).toBe(true);
    expect(matchPath("/products/123", "/products/**")).toBe(true);
    expect(matchPath("/products/123/reviews", "/products/**")).toBe(true);
    expect(matchPath("/productivity", "/products/**")).toBe(false);
    expect(matchPath("/products", "/products/*")).toBe(false);
  });
});

describe("findMatchingTransition", () => {
  it("chooses exact matches over wildcard matches", () => {
    const fallback = transition("fallback");
    const exact = transition("exact");

    expect(
      findMatchingTransition("/posts", "/posts/1", [
        { from: "*", to: "*", transition: fallback },
        { from: "/posts", to: "/posts/1", transition: exact },
      ]),
    ).toBe(exact);
  });

  it("chooses the most specific wildcard match", () => {
    const broad = transition("broad");
    const specific = transition("specific");

    expect(
      findMatchingTransition("/demo/google-photos", "/demo/google-photos/p/1", [
        {
          from: "/demo/google-photos/*",
          to: "/demo/google-photos/*",
          transition: broad,
        },
        {
          from: "/demo/google-photos",
          to: "/demo/google-photos/p/*",
          transition: specific,
        },
      ]),
    ).toBe(specific);
  });

  it("chooses an exact match over a deep wildcard that also matches", () => {
    const deep = transition("deep");
    const exact = transition("exact");

    expect(
      findMatchingTransition("/docs/install", "/docs", [
        { from: "/docs/**", to: "/docs/**", transition: deep },
        { from: "/docs/install", to: "/docs", transition: exact },
      ]),
    ).toBe(exact);
  });

  it("keeps config order as the tie-breaker for equal specificity", () => {
    const first = transition("first");
    const second = transition("second");

    expect(
      findMatchingTransition("/profile/1", "/profile/1/reels", [
        { from: "/profile/:id", to: "/profile/:id/reels", transition: first },
        {
          from: "/profile/{id}",
          to: "/profile/{id}/reels",
          transition: second,
        },
      ]),
    ).toBe(first);
  });
});

describe("selectTransition", () => {
  const back = transition("back");
  const forward = transition("forward");
  const pathHit = transition("path");
  const pathTransitions = [{ from: "/a", to: "/b", transition: pathHit }];
  const directionTransitions = new Map<string, TransitionConfig>([
    ["forward", forward],
    ["back", back],
  ]);

  it("lets a resolved token override a matching path pair", () => {
    expect(
      selectTransition({
        from: "/a",
        to: "/b",
        direction: "back",
        pathTransitions,
        directionTransitions,
      }),
    ).toBe(back);
  });

  it("returns opposite transitions for the same pair under opposite tokens", () => {
    const args = {
      from: "/a",
      to: "/b",
      pathTransitions,
      directionTransitions,
    };
    expect(selectTransition({ ...args, direction: "forward" })).toBe(forward);
    expect(selectTransition({ ...args, direction: "back" })).toBe(back);
  });

  it("falls back to path matching when the token is null or undefined", () => {
    const args = {
      from: "/a",
      to: "/b",
      pathTransitions,
      directionTransitions,
    };
    expect(selectTransition({ ...args, direction: null })).toBe(pathHit);
    expect(selectTransition({ ...args, direction: undefined })).toBe(pathHit);
  });

  it("falls back to path matching when the token has no registered entry", () => {
    expect(
      selectTransition({
        from: "/a",
        to: "/b",
        direction: "sideways",
        pathTransitions,
        directionTransitions,
      }),
    ).toBe(pathHit);
  });

  it("returns null when neither a token nor a path matches", () => {
    expect(
      selectTransition({
        from: "/x",
        to: "/y",
        direction: "sideways",
        pathTransitions,
        directionTransitions,
      }),
    ).toBeNull();
  });
});

describe("resolveTransitionForPair", () => {
  const forward = transition("forward");
  const pathHit = transition("path");

  it("calls resolveDirection with the original, pre-middleware pair", () => {
    const seen: Array<{ from: string; to: string }> = [];
    resolveTransitionForPair({
      from: "/raw-from",
      to: "/raw-to",
      middleware: () => ({ from: "/aliased", to: "/aliased" }),
      resolveDirection: (args) => {
        seen.push(args);
        return null;
      },
      pathTransitions: [],
      directionTransitions: new Map(),
    });
    expect(seen).toEqual([{ from: "/raw-from", to: "/raw-to" }]);
  });

  it("matches path entries against the middleware-transformed pair", () => {
    expect(
      resolveTransitionForPair({
        from: "/m-p/1",
        to: "/m-p/2",
        middleware: () => ({ from: "/p", to: "/p/detail" }),
        resolveDirection: () => null,
        pathTransitions: [{ from: "/p", to: "/p/detail", transition: pathHit }],
        directionTransitions: new Map(),
      }),
    ).toBe(pathHit);
  });

  it("lets a resolved token win over the transformed path match", () => {
    expect(
      resolveTransitionForPair({
        from: "/a",
        to: "/b",
        middleware: (from, to) => ({ from, to }),
        resolveDirection: () => "forward",
        pathTransitions: [{ from: "/a", to: "/b", transition: pathHit }],
        directionTransitions: new Map([["forward", forward]]),
      }),
    ).toBe(forward);
  });
});
