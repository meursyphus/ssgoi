import { describe, expect, it, vi } from "vitest";
import type {
  AnimationFactoryArgs,
  AnyTransitionConfig,
  NavigationDirection,
  SsgoiTransitionContext,
} from "@types";
import { Animation } from "../animation/animation";
import { MultiAnimation } from "../animation/multi-animation";
import { WebAnimation } from "../animation/web-animation";
import { InertiaIntegrator, SpringIntegrator } from "../animation/integrator";
import { snappy, swift } from "./presets";
import {
  labelByIdentity,
  resolveOverride,
  withOverride,
} from "./with-override";

const el = (ssgoiId?: string): HTMLElement =>
  ({ dataset: ssgoiId ? { ssgoiId } : {} }) as unknown as HTMLElement;

const base = new SpringIntegrator({ stiffness: 100, damping: 10 });

function track(element: HTMLElement): WebAnimation {
  return new WebAnimation({ element, integrator: base, style: () => ({}) });
}

function context(direction: NavigationDirection): SsgoiTransitionContext {
  return { direction } as SsgoiTransitionContext;
}

function args(
  from: HTMLElement,
  to: HTMLElement,
  direction: NavigationDirection = "forward",
): AnimationFactoryArgs<object> {
  return { from, to, context: context(direction) };
}

function preset(build: () => Animation): AnyTransitionConfig {
  return { animation: () => build() };
}

describe("labelByIdentity", () => {
  it("labels from → out, to → in, *-overlay → overlay, others → shared", () => {
    const from = el();
    const to = el();
    const overlay = el("sheet-overlay");
    const clone = el();
    const anim = new MultiAnimation([
      track(from),
      track(to),
      track(overlay),
      track(clone),
    ]);

    labelByIdentity(anim, from, to);

    expect(anim.tracks().map((t) => t.label)).toEqual([
      "out",
      "in",
      "overlay",
      "shared",
    ]);
  });

  it("reads data-ssgoi-id through getAttribute when dataset is absent", () => {
    const from = el();
    const to = el();
    const overlay = {
      getAttribute: (name: string) =>
        name === "data-ssgoi-id" ? "zoom-overlay" : null,
    } as unknown as HTMLElement;
    const anim = new MultiAnimation([track(overlay)]);

    labelByIdentity(anim, from, to);

    expect(anim.select("overlay")).toHaveLength(1);
  });

  it("nested composites inherit out / in from their index (blind)", () => {
    const from = el();
    const to = el();
    const outStrips = new MultiAnimation([track(el()), track(el())]);
    const inStrips = new MultiAnimation([track(el()), track(el())]);
    const anim = new MultiAnimation([outStrips, inStrips], {
      mode: "sequence",
    });

    labelByIdentity(anim, from, to);

    expect(anim.select("out")).toHaveLength(2);
    expect(anim.select("in")).toHaveLength(2);
    expect(anim.select("shared")).toHaveLength(0);
  });
});

describe("MultiAnimation.set / startAt", () => {
  it("patches only the labelled tracks when not coupled", () => {
    const from = el();
    const to = el();
    const anim = new MultiAnimation([track(from), track(to)]);
    labelByIdentity(anim, from, to);

    anim.set("in", { integrator: snappy });

    expect(anim.select("in")[0]!.integrator).toBe(snappy);
    expect(anim.select("out")[0]!.integrator).toBe(base);
  });

  it("patches every track when coupled, whatever the label", () => {
    const from = el();
    const to = el();
    const anim = new MultiAnimation([track(from), track(to), track(el())]);
    labelByIdentity(anim, from, to);
    anim.coupled = true;

    anim.set("in", { integrator: swift });

    for (const t of anim.tracks()) expect(t.integrator).toBe(swift);
  });

  it("normalizes a PhysicsOptions leaf into an integrator instance", () => {
    const from = el();
    const to = el();
    const anim = new MultiAnimation([track(from), track(to)]);
    labelByIdentity(anim, from, to);

    anim
      .set("in", { integrator: { spring: { stiffness: 400, damping: 30 } } })
      .set("out", {
        integrator: { inertia: { acceleration: 150, resistance: 1.5 } },
      });

    const inn = anim.select("in")[0]!.integrator as SpringIntegrator;
    expect(inn).toBeInstanceOf(SpringIntegrator);
    expect(inn.stiffness).toBe(400);
    expect(anim.select("out")[0]!.integrator).toBeInstanceOf(InertiaIntegrator);
  });

  it("ignores unknown labels and exposes startAt for replacement", () => {
    const anim = new MultiAnimation([track(el()), track(el())], {
      mode: "sequence",
    });
    expect(anim.startAt).toEqual([0, 1]);

    expect(() => anim.set("nope", { integrator: snappy })).not.toThrow();
    anim.startAt = [0, 0.3];

    expect(anim.startAt).toEqual([0, 0.3]);
  });
});

describe("resolveOverride", () => {
  it("serves a bare function to both directions", () => {
    const fn = vi.fn();
    expect(resolveOverride(fn, "forward")).toBe(fn);
    expect(resolveOverride(fn, "backward")).toBe(fn);
  });

  it("picks the matching direction from an object", () => {
    const forward = vi.fn();
    expect(resolveOverride({ forward }, "forward")).toBe(forward);
    expect(resolveOverride({ forward }, "backward")).toBeUndefined();
  });
});

describe("withOverride", () => {
  it("returns the config untouched when there is nothing to apply", () => {
    const config = preset(() => new MultiAnimation([]));
    expect(withOverride(config, undefined)).toBe(config);
    expect(withOverride(config, vi.fn(), { labels: false })).toBe(config);
  });

  it("labels the built composite, marks coupling, then runs the override", () => {
    const from = el();
    const to = el();
    const built = new MultiAnimation([track(from), track(to)]);
    const override = vi.fn((anim: MultiAnimation) => {
      anim.set("in", { integrator: snappy });
      anim.startAt = [0, 0.4];
    });

    const wrapped = withOverride(
      preset(() => built),
      override,
      { coupled: false },
    );
    const result = wrapped.animation(args(from, to));

    expect(result).toBe(built);
    expect(override).toHaveBeenCalledWith(built, expect.anything());
    expect(built.coupled).toBe(false);
    expect(built.select("in")[0]!.integrator).toBe(snappy);
    expect(built.select("out")[0]!.integrator).toBe(base);
    expect(built.startAt).toEqual([0, 0.4]);
  });

  it("runs only the callback for the current navigation direction", () => {
    const from = el();
    const to = el();
    const forward = vi.fn();
    const backward = vi.fn();
    const wrapped = withOverride(
      preset(() => new MultiAnimation([track(from), track(to)])),
      { forward, backward },
    );

    wrapped.animation(args(from, to, "backward"));

    expect(forward).not.toHaveBeenCalled();
    expect(backward).toHaveBeenCalledTimes(1);
  });

  it("propagates coupled to the composite", () => {
    const from = el();
    const to = el();
    const built = new MultiAnimation([track(from), track(to)]);
    const wrapped = withOverride(
      preset(() => built),
      (anim) => anim.set("out", { integrator: swift }),
      { coupled: true },
    );

    wrapped.animation(args(from, to));

    expect(built.coupled).toBe(true);
    for (const t of built.tracks()) expect(t.integrator).toBe(swift);
  });

  it("passes non-composite animations through without calling the override", () => {
    const from = el();
    const to = el();
    const single = track(from);
    const override = vi.fn();
    const wrapped = withOverride(
      preset(() => single),
      override,
    );

    expect(wrapped.animation(args(from, to))).toBe(single);
    expect(override).not.toHaveBeenCalled();
  });

  it("keeps prepare from the wrapped config", () => {
    const prepare = vi.fn(() => ({}));
    const wrapped = withOverride(
      { prepare, animation: () => new MultiAnimation([]) },
      vi.fn(),
    );
    expect(wrapped.prepare).toBe(prepare);
  });
});
