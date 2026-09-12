import { describe, expect, expectTypeOf, it, vi } from "vitest";
import type {
  AnimationFactoryArgs,
  NavigationDirection,
  PrepareArgs,
  SsgoiTransitionContext,
} from "@types";
import { Animation } from "../animation/animation";
import { MultiAnimation } from "../animation/multi-animation";
import { WebAnimation } from "../animation/web-animation";
import { SpringIntegrator } from "../animation/integrator";
import { defineTransition } from "../transition/define-transition";
import { withOverride } from "./with-override";

const element = (): HTMLElement => ({ style: {} }) as HTMLElement;
const original = new SpringIntegrator({ stiffness: 300, damping: 30 });
const replacement = new SpringIntegrator({ stiffness: 400, damping: 35 });
const track = (target = element()) =>
  new WebAnimation({
    element: target,
    integrator: original,
    style: () => ({}),
  });
function context(direction: NavigationDirection): SsgoiTransitionContext {
  const root = element();
  return {
    direction,
    scrollOffset: { x: 0, y: 0 },
    from: { scroll: { x: 0, y: 0 } },
    to: { scroll: { x: 0, y: 0 } },
    scrollingElement: root,
    positionedParent: root,
  };
}
function args(
  direction: NavigationDirection = "forward",
): AnimationFactoryArgs<object> {
  return { from: element(), to: element(), context: context(direction) };
}
function preparation(input: AnimationFactoryArgs<object>): PrepareArgs {
  return {
    ...input,
    from: Promise.resolve(input.from),
    to: Promise.resolve(input.to),
    createElement: () => element() as HTMLDivElement,
  };
}

describe("named animation editing", () => {
  it("infers registered names and edits only the selected child", () => {
    const outgoing = track(),
      incoming = track();
    const animation = new MultiAnimation({ out: outgoing, in: incoming });
    expectTypeOf(animation).toEqualTypeOf<MultiAnimation<"out" | "in">>();
    animation.select("in").set({ integrator: replacement });
    expect(incoming.integrator).toBe(replacement);
    expect(outgoing.integrator).toBe(original);
    expect(animation.select("in")).toBe(incoming);
    expect(() => {
      // @ts-expect-error This preset does not register an overlay.
      animation.select("overlay");
    }).toThrow("Unknown animation child");
  });
  it("edits an explicitly selected nested group or the entire composite", () => {
    const first = track(),
      second = track(),
      other = track();
    const shared = new MultiAnimation([first, second]);
    const animation = new MultiAnimation({ shared, in: other });
    animation.select("shared").set({ integrator: replacement });
    expect(first.integrator).toBe(replacement);
    expect(second.integrator).toBe(replacement);
    expect(other.integrator).toBe(original);
    animation.set({ integrator: original });
    expect(
      animation.tracks().every((child) => child.integrator === original),
    ).toBe(true);
  });
});

describe("defineTransition and overrides", () => {
  it("infers each direction's prepared data and concrete return independently", async () => {
    const forward = vi.fn(),
      backward = vi.fn();
    const transition = defineTransition(
      {
        forward: {
          prepare: async () => ({ overlay: "forward-overlay" }),
          animation({ overlay, from, to }) {
            expectTypeOf(overlay).toEqualTypeOf<string>();
            expect(overlay).toBe("forward-overlay");
            return new MultiAnimation({ out: track(from), in: track(to) });
          },
        },
        backward: {
          prepare: () => ({ restore: 42 }),
          animation({ restore, from }) {
            expectTypeOf(restore).toEqualTypeOf<number>();
            expect(restore).toBe(42);
            return track(from);
          },
        },
      },
      {
        override: {
          forward({ animation }) {
            expectTypeOf(animation).toEqualTypeOf<
              MultiAnimation<"out" | "in">
            >();
            animation.select("in").set({ integrator: replacement });
            forward();
          },
          backward({ animation }) {
            expectTypeOf(animation).toEqualTypeOf<WebAnimation>();
            animation.set({ integrator: replacement });
            backward();
          },
        },
      },
    );
    for (const direction of ["forward", "backward"] as const) {
      const input = args(direction);
      const prepared = await transition.prepare!(preparation(input));
      const result: Animation = transition.animation({ ...input, ...prepared });
      expect(result).toBeInstanceOf(Animation);
    }
    expect(forward).toHaveBeenCalledTimes(1);
    expect(backward).toHaveBeenCalledTimes(1);
  });
  it("uses the core's chosen direction and identical context throughout", async () => {
    const events: string[] = [];
    const input = args("backward");
    const transition = defineTransition(
      {
        forward: {
          prepare: () => {
            throw new Error("wrong prepare");
          },
          animation: () => {
            throw new Error("wrong animation");
          },
        },
        backward: {
          prepare({ context }) {
            expect(context).toBe(input.context);
            expect(context.direction).toBe("backward");
            events.push("prepare");
            return { value: 12 };
          },
          animation({ value, context }) {
            expect(value).toBe(12);
            expect(context).toBe(input.context);
            events.push("animation");
            return track();
          },
        },
      },
      {
        override: {
          backward({ animation, context }) {
            expect(animation).toBeInstanceOf(WebAnimation);
            expect(context).toBe(input.context);
            expect(context.direction).toBe("backward");
            events.push("override");
          },
        },
      },
    );
    const prepared = await transition.prepare!(preparation(input));
    transition.animation({ ...input, ...prepared });
    expect(events).toEqual(["prepare", "animation", "override"]);
    expect(input.context.direction).toBe("backward");
  });
  it("keeps overlapping preparations attached to their own direction", async () => {
    let release!: (value: { value: string }) => void;
    const calls: string[] = [];
    const transition = defineTransition({
      forward: {
        prepare: () =>
          new Promise<{ value: string }>((resolve) => {
            release = resolve;
          }),
        animation({ value }) {
          calls.push(`forward:${value}`);
          return track();
        },
      },
      backward: {
        prepare: () => ({ value: 42 }),
        animation({ value }) {
          calls.push(`backward:${value}`);
          return track();
        },
      },
    });
    const f = args("forward"),
      b = args("backward");
    const pending = transition.prepare!(preparation(f));
    const backwardData = await transition.prepare!(preparation(b));
    transition.animation({ ...b, ...backwardData });
    release({ value: "first-run" });
    const forwardData = await pending;
    transition.animation({ ...f, ...forwardData });
    expect(calls).toEqual(["backward:42", "forward:first-run"]);
  });
  it("preserves synchronous preparation and only constructs the selected direction", () => {
    const prepare = vi.fn(() => ({}));
    const forward = vi.fn(() => track()),
      backward = vi.fn(() => track());
    const transition = defineTransition({
      forward: { prepare, animation: forward },
      backward: { animation: backward },
    });
    const input = args();
    const data = transition.prepare!(preparation(input));
    expect(prepare).toHaveBeenCalledTimes(1);
    expect(data).not.toBeInstanceOf(Promise);
    expect(forward).not.toHaveBeenCalled();
    transition.animation({ ...input, ...data });
    expect(forward).toHaveBeenCalledTimes(1);
    expect(backward).not.toHaveBeenCalled();
  });
  it("wraps reusable definitions without mutation and chains overrides", () => {
    const calls: string[] = [];
    const base = defineTransition({
      forward: { animation: () => track() },
      backward: { animation: () => track() },
    });
    const first = withOverride(base, {
      forward: ({ animation }) => {
        animation.set({ integrator: replacement });
        calls.push("first");
      },
    });
    const second = withOverride(first, {
      forward: ({ animation }) => {
        expect(animation.integrator).toBe(replacement);
        calls.push("second");
      },
    });
    expect(withOverride(base, undefined)).toBe(base);
    expect(base.animation(args()).integrator).toBe(original);
    second.animation(args());
    expect(calls).toEqual(["first", "second"]);
  });
});
