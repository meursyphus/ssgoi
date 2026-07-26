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
    const enter = resolve("/profile", "/post/1", [rule]);
    const leave = resolve("/post/1", "/profile", [rule]);

    expect(enter?.direction).toBe("forward");
    expect(enter?.preserveScroll).toEqual({ from: true, to: false });
    expect(leave?.direction).toBe("backward");
    expect(leave?.preserveScroll).toEqual({ from: false, to: true });
  });

  it("uses semantic history only when both endpoints are members", () => {
    const result = resolve("/post/1", "/post/2", [rule], "backward");

    expect(result?.direction).toBe("backward");
    expect(result?.preserveScroll).toEqual({ from: false, to: false });
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

    const forward = resolve("/", "/profile", rules);
    const backward = resolve("/profile", "/search", rules);

    expect(forward?.direction).toBe("forward");
    expect(forward?.preserveScroll).toEqual({ from: true, to: true });
    expect(backward?.direction).toBe("backward");
    expect(backward?.preserveScroll).toEqual({ from: true, to: true });
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

    const forward = resolve("/gallery", "/photo/1", rules);
    const backward = resolve("/photo/1", "/search", rules);

    expect(forward?.direction).toBe("forward");
    expect(forward?.preserveScroll).toEqual({ from: true, to: false });
    expect(backward?.direction).toBe("backward");
    expect(backward?.preserveScroll).toEqual({ from: false, to: true });
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

describe("scroll preservation policy", () => {
  const effect = transition("effect");

  it("maps an explicit on override to enter, leave, and in-scope history", () => {
    const rules: SsgoiTransitionRule[] = [
      {
        on: "/posts/**",
        except: "/posts",
        transition: effect,
        preserveScroll: { from: false, to: true },
      },
    ];

    expect(resolve("/posts", "/posts/1", rules)?.preserveScroll).toEqual({
      from: false,
      to: true,
    });
    expect(resolve("/posts/1", "/posts", rules)?.preserveScroll).toEqual({
      from: true,
      to: false,
    });
    expect(resolve("/posts/1", "/posts/2", rules)?.preserveScroll).toEqual({
      from: true,
      to: true,
    });
  });

  it("maps asymmetric pair and ordered overrides through backward navigation", () => {
    const rules: SsgoiTransitionRule[] = [
      {
        from: "/gallery",
        to: "/photo/:id",
        transition: effect,
        preserveScroll: { from: false, to: true },
      },
      {
        ordered: ["/tabs/a", "/tabs/b"],
        transition: effect,
        preserveScroll: { from: true, to: false },
      },
    ];

    expect(resolve("/gallery", "/photo/1", rules)?.preserveScroll).toEqual({
      from: false,
      to: true,
    });
    expect(resolve("/photo/1", "/gallery", rules)?.preserveScroll).toEqual({
      from: true,
      to: false,
    });
    expect(resolve("/tabs/a", "/tabs/b", rules)?.preserveScroll).toEqual({
      from: true,
      to: false,
    });
    expect(resolve("/tabs/b", "/tabs/a", rules)?.preserveScroll).toEqual({
      from: false,
      to: true,
    });
  });
});
