import { afterEach, describe, expect, it, vi } from "vitest";
import { createNavigationDirectionTracker } from "./navigation-direction";
import { createNavigationTransitionResolver } from "./navigation-transition";
import { resolveTransitionRule } from "../runtime/resolve-transition-rule";
import type { RouteRule } from "../runtime/types";

function browser(
  modern: boolean,
  initialState: unknown = { __NA: true, tree: "owned" },
) {
  let serial = 0;
  let index = 0;
  const entries = [
    {
      key: "initial",
      index: 0,
      url: "https://app.test/cart",
      state: initialState,
    },
  ];
  const target = {
    location: {
      get href() {
        return entries[index]!.url;
      },
    },
    history: {
      get state() {
        return entries[index]!.state;
      },
      pushState: vi.fn(
        (data: unknown, _unused: string, url?: string | URL | null) => {
          const href = new URL(url ?? entries[index]!.url, entries[index]!.url)
            .href;
          entries.splice(index + 1);
          index++;
          entries.push({
            key: `entry-${++serial}`,
            index,
            url: href,
            state: structuredClone(data),
          });
        },
      ),
      replaceState: vi.fn(
        (data: unknown, _unused: string, url?: string | URL | null) => {
          entries[index] = {
            ...entries[index]!,
            url: new URL(url ?? entries[index]!.url, entries[index]!.url).href,
            state: structuredClone(data),
          };
        },
      ),
      back() {
        if (index > 0) index--;
      },
      forward() {
        if (index + 1 < entries.length) index++;
      },
      go(delta: number) {
        if (index + delta >= 0 && index + delta < entries.length)
          index += delta;
      },
    },
    ...(modern
      ? {
          navigation: {
            get currentEntry() {
              return entries[index];
            },
            entries: () => entries,
          },
        }
      : {}),
  };
  vi.stubGlobal("window", target);
  return target;
}

const slide = { effect: "slide" };
const parallax = { effect: "parallax" };
const rules: RouteRule<typeof slide>[] = [
  {
    from: "/**",
    to: "/shops/*",
    bidirectional: false,
    priority: 10,
    transition: slide,
  },
  { on: "/**", priority: -100, transition: parallax },
];
const cleanups: (() => void)[] = [];
function resolver() {
  const history = createNavigationTransitionResolver<typeof slide>();
  cleanups.push(history.dispose);
  history.connect();
  return {
    ...history,
    select: (from: string, to: string, config = rules) =>
      history.resolve(from, to, (direction) =>
        resolveTransitionRule(from, to, config, direction),
      ),
  };
}

afterEach(() => {
  cleanups.splice(0).forEach((dispose) => dispose());
  vi.unstubAllGlobals();
});

describe.each([true, false])(
  "entry transitions (Navigation API: %s)",
  (modern) => {
    it("reverses the exact entry effect on Back and replays it on Forward", () => {
      const { history } = browser(modern);
      const transitions = resolver();
      history.pushState({ __NA: true }, "", "/shops/one");
      const entry = transitions.select("/cart", "/shops/one");
      expect(entry).toMatchObject({
        transition: slide,
        direction: "forward",
        preserveScroll: { from: true, to: false },
      });
      history.back(); // The entry changes before any router/popstate callback.
      const back = transitions.select("/shops/one", "/cart");
      expect(back).toMatchObject({
        transition: slide,
        direction: "backward",
        preserveScroll: { from: false, to: true },
      });
      history.forward();
      expect(transitions.select("/cart", "/shops/one")).toEqual(entry);
    });

    it("recognizes a restored entry even when the router replaces its state before pairing", () => {
      const { history } = browser(modern);
      const transitions = resolver();
      history.pushState({ __NA: true }, "", "/shops/one");
      transitions.select("/cart", "/shops/one");
      history.back();
      history.replaceState({ __NA: true, tree: "restored" }, "");
      expect(transitions.select("/shops/one", "/cart")).toMatchObject({
        transition: slide,
        direction: "backward",
      });
    });

    it("undoes the original semantic direction rather than forcing every effect backward", () => {
      const { history } = browser(modern);
      const transitions = resolver();
      history.pushState({}, "", "/products/one");
      const entry = transitions.select("/cart", "/products/one", [
        {
          from: "/products/*",
          to: "/cart",
          transition: slide,
        },
      ]);
      expect(entry?.direction).toBe("backward");
      history.back();
      expect(transitions.select("/products/one", "/cart")).toMatchObject({
        transition: slide,
        direction: "forward",
        preserveScroll: { from: true, to: false },
      });
    });

    it("fresh pushes to the same URL rematch instead of reusing a return effect", () => {
      const { history } = browser(modern);
      const transitions = resolver();
      history.pushState({}, "", "/shops/one");
      transitions.select("/cart", "/shops/one");
      history.pushState({}, "", "/cart");
      expect(transitions.select("/shops/one", "/cart")).toMatchObject({
        transition: parallax,
        direction: "forward",
      });
      history.back();
      expect(transitions.select("/cart", "/shops/one")).toMatchObject({
        transition: parallax,
        direction: "backward",
      });
      history.back();
      expect(transitions.select("/shops/one", "/cart")).toMatchObject({
        transition: slide,
        direction: "backward",
      });
    });

    it("the next push after Back does not inherit a consumed backward hint", () => {
      const { history } = browser(modern);
      const transitions = resolver();
      history.pushState({}, "", "/products/one");
      transitions.select("/cart", "/products/one");
      history.back();
      transitions.select("/products/one", "/cart");
      history.pushState({}, "", "/products/one");
      expect(transitions.select("/cart", "/products/one")).toMatchObject({
        direction: "forward",
      });
    });

    it("discards replaced edges and matches a return to an unrecorded pair", () => {
      const { history } = browser(modern);
      const transitions = resolver();
      history.pushState({}, "", "/shops/one");
      transitions.select("/cart", "/shops/one");
      history.replaceState({}, "", "/products/one");
      transitions.select("/shops/one", "/products/one");
      history.back();
      expect(transitions.select("/products/one", "/cart")).toMatchObject({
        transition: parallax,
        direction: "backward",
      });
    });

    it("a push after Back creates a new branch even when it reuses a URL", () => {
      const { history } = browser(modern);
      const transitions = resolver();
      history.pushState({}, "", "/shops/one");
      transitions.select("/cart", "/shops/one");
      history.back();
      transitions.select("/shops/one", "/cart");
      history.pushState({}, "", "/shops/one");
      transitions.select("/cart", "/shops/one", [
        { on: "/**", transition: parallax },
      ]);
      history.back();
      expect(transitions.select("/shops/one", "/cart")).toMatchObject({
        transition: parallax,
        direction: "backward",
      });
    });

    it("no-op back/go calls cannot affect a later explicit navigation", () => {
      const { history } = browser(modern);
      const transitions = resolver();
      history.back();
      history.go(-5);
      history.pushState({}, "", "/products/one");
      expect(transitions.select("/cart", "/products/one")).toMatchObject({
        direction: "forward",
      });
    });

    it("rematches skipped multi-step pairs rather than replaying an unrelated effect", () => {
      const { history } = browser(modern);
      const transitions = resolver();
      history.pushState({}, "", "/products/one");
      transitions.select("/cart", "/products/one");
      history.pushState({}, "", "/shops/one");
      transitions.select("/products/one", "/shops/one");
      history.go(-2);
      expect(transitions.select("/shops/one", "/cart")).toMatchObject({
        transition: parallax,
        direction: "backward",
      });
    });

    it("preserves the selected effect even if the current rule list changes", () => {
      const { history } = browser(modern);
      const transitions = resolver();
      history.pushState({}, "", "/shops/one");
      transitions.select("/cart", "/shops/one");
      history.back();
      expect(transitions.select("/shops/one", "/cart", [])).toMatchObject({
        transition: slide,
        direction: "backward",
      });
    });

    it("records an unmatched entry as no effect, including the return", () => {
      const { history } = browser(modern);
      const transitions = resolver();
      history.pushState({}, "", "/shops/one");
      expect(transitions.select("/cart", "/shops/one", [])).toBeNull();
      history.back();
      expect(transitions.select("/shops/one", "/cart")).toBeNull();
    });

    it("uses the actual predecessor after query-only pushes with no boundary pair", () => {
      const { history } = browser(modern);
      const transitions = resolver();
      history.pushState({}, "", "/cart?filter=one");
      history.pushState({}, "", "/shops/one");
      transitions.select("/cart", "/shops/one");
      history.back();
      expect(transitions.select("/shops/one", "/cart")).toMatchObject({
        transition: slide,
        direction: "backward",
      });
    });
  },
);

describe("history observation lifetime", () => {
  it("does not touch the browser while constructing a render-time context", () => {
    const { history } = browser(false);
    const push = history.pushState;
    const transitions = createNavigationTransitionResolver();
    expect(history.pushState).toBe(push);
    expect(history.replaceState).not.toHaveBeenCalled();
    transitions.dispose();
  });

  it("uses native entry identities without patching history or its state", () => {
    const { history } = browser(true);
    const original = { ...history };
    resolver();
    expect(history.pushState).toBe(original.pushState);
    expect(history.replaceState).toBe(original.replaceState);
    expect(history.replaceState).not.toHaveBeenCalled();
  });

  it("shares legacy wrappers, preserves router fields and cleans up the last subscriber", () => {
    const { history } = browser(false);
    const push = history.pushState,
      replace = history.replaceState,
      back = history.back;
    const first = resolver(),
      wrapped = history.pushState;
    const second = resolver();
    expect(history.pushState).toBe(wrapped);
    expect(history.back).toBe(back);
    expect(history.state).toMatchObject({ __NA: true, tree: "owned" });
    history.pushState({ __NA: true, custom: 42 }, "", "/shops/one");
    expect(history.state).toMatchObject({ __NA: true, custom: 42 });
    expect(first.select("/cart", "/shops/one")).toEqual(
      second.select("/cart", "/shops/one"),
    );
    first.dispose();
    expect(history.pushState).toBe(wrapped);
    second.dispose();
    expect(history.pushState).toBe(push);
    expect(history.replaceState).toBe(replace);
  });

  it("keeps an outer router wrapper intact and leaves its captured wrapper inert", () => {
    const { history } = browser(false);
    const transitions = resolver();
    const captured = history.pushState;
    const outer = (...args: Parameters<typeof captured>) =>
      captured.apply(history, args);
    history.pushState = outer as typeof history.pushState;
    transitions.dispose();
    expect(history.pushState).toBe(outer);
    history.pushState({ custom: "after dispose" }, "", "/other");
    expect(history.state).toEqual({ custom: "after dispose" });
  });

  it.each([42, "opaque", ["array"]])(
    "does not reshape unsupported legacy state: %s",
    (state) => {
      const { history } = browser(false, state);
      const transitions = resolver();
      expect(history.state).toEqual(state);
      history.pushState(state, "", "/other");
      expect(history.state).toEqual(state);
      expect(transitions.select("/cart", "/other")).toMatchObject({
        direction: "forward",
      });
    },
  );

  it("works without a browser", () => {
    const tracker = createNavigationDirectionTracker();
    expect(tracker.resolve("/a", "/b")).toMatchObject({
      kind: "unknown",
      direction: "forward",
    });
    tracker.dispose();
  });
});
