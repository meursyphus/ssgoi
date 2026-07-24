import { describe, expect, it } from "vitest";
import type { SsgoiTransitionRule, TransitionConfig } from "@types";
import { resolveTransitionRule } from "./resolve-transition-rule";

function transition(id: string): TransitionConfig {
  return { animation: (() => id) as unknown as TransitionConfig["animation"] };
}

function resolve(
  from: string,
  to: string,
  rules: readonly SsgoiTransitionRule[],
  historyDirection: "forward" | "backward" = "forward",
) {
  return resolveTransitionRule(from, to, rules, historyDirection);
}

describe("on rules", () => {
  const drill = transition("drill");
  const rule: SsgoiTransitionRule = {
    on: "/**",
    except: ["/", "/search", "/profile"],
    transition: drill,
  };

  it("uses the route-family boundary for enter and leave", () => {
    expect(resolve("/profile", "/post/1", [rule])?.direction).toBe("forward");
    expect(resolve("/post/1", "/profile", [rule])?.direction).toBe("backward");
  });

  it("uses semantic history only when both endpoints are members", () => {
    expect(resolve("/post/1", "/post/2", [rule], "backward")?.direction).toBe(
      "backward",
    );
  });

  it("does not trigger when neither endpoint belongs to the scope", () => {
    expect(resolve("/", "/profile", [rule])).toBeNull();
  });
});

describe("ordered and pair rules", () => {
  it("requires both ordered endpoints and maps index to direction", () => {
    const effect = transition("slide");
    const rules: SsgoiTransitionRule[] = [
      { ordered: ["/", "/search", "/profile"], transition: effect },
    ];

    expect(resolve("/", "/profile", rules)?.direction).toBe("forward");
    expect(resolve("/profile", "/search", rules)?.direction).toBe("backward");
    expect(resolve("/profile", "/post/1", rules)).toBeNull();
  });

  it("supports patterns and arrays on both sides of a pair", () => {
    const effect = transition("zoom");
    const rules: SsgoiTransitionRule[] = [
      {
        from: ["/gallery", "/search"],
        to: "/photo/:id",
        transition: effect,
      },
    ];

    expect(resolve("/gallery", "/photo/1", rules)?.direction).toBe("forward");
    expect(resolve("/photo/1", "/search", rules)?.direction).toBe("backward");
  });

  it("can disable the reverse pair", () => {
    const effect = transition("zoom");
    const rules: SsgoiTransitionRule[] = [
      {
        from: "/gallery",
        to: "/photo/:id",
        bidirectional: false,
        transition: effect,
      },
    ];

    expect(resolve("/photo/1", "/gallery", rules)).toBeNull();
  });
});

describe("competition", () => {
  it("orders candidates by priority, specificity, then declaration order", () => {
    const fallback = transition("fallback");
    const specific = transition("specific");
    const priority = transition("priority");

    const rules: SsgoiTransitionRule[] = [
      { on: "/**", transition: fallback },
      { on: "/posts/:id", transition: specific },
      { priority: 1, on: "/posts/**", transition: priority },
    ];
    expect(resolve("/search", "/posts/1", rules)?.transition).toBe(priority);

    const noPriority = rules.slice(0, 2);
    expect(resolve("/search", "/posts/1", noPriority)?.transition).toBe(
      specific,
    );

    expect(
      resolve("/a", "/b", [
        { on: "/**", transition: fallback },
        { on: "/**", transition: specific },
      ])?.transition,
    ).toBe(fallback);
  });
});
