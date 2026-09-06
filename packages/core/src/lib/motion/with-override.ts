import type {
  AnimationFactoryArgs,
  AnyTransitionConfig,
  NavigationDirection,
  Override,
  OverrideFn,
} from "@types";
import { MultiAnimation } from "../animation/multi-animation";
import { WebAnimation } from "../animation/web-animation";

export interface WithOverrideOptions {
  /**
   * Every track in the preset shares one physics (drill, slide, sheet,
   * zoom). `set(anyLabel, …)` then patches all tracks so the geometric
   * coupling between them can't be broken by a partial override.
   */
  coupled?: boolean;
  /**
   * `false` for presets whose tracks are pre-baked into keyframes (film):
   * swapping an integrator there has no meaning, so the override is ignored.
   */
  labels?: boolean;
}

/**
 * Wrap a preset's `TransitionConfig` so a user override can retune it.
 *
 * The transition implementation is untouched. After it builds its
 * `MultiAnimation`, every `WebAnimation` gets a role label from element
 * identity — `from` is `"out"`, `to` is `"in"`, a dispatcher-created
 * `*-overlay` element is `"overlay"`, anything else (hero clones) is
 * `"shared"` — and the override for the current navigation direction runs
 * before the dispatcher starts playback.
 */
export function withOverride(
  config: AnyTransitionConfig,
  override: Override | undefined,
  options: WithOverrideOptions = {},
): AnyTransitionConfig {
  if (!override || options.labels === false) return config;

  return {
    ...config,
    animation: (args: AnimationFactoryArgs<object>) => {
      const animation = config.animation(args);
      if (!(animation instanceof MultiAnimation)) return animation;

      labelByIdentity(animation, args.from, args.to);
      animation.coupled = options.coupled ?? false;

      const fn = resolveOverride(override, args.context.direction);
      fn?.(animation, args.context);
      return animation;
    },
  };
}

/** Pick the callback for a direction; a bare function serves both. */
export function resolveOverride(
  override: Override,
  direction: NavigationDirection,
): OverrideFn | undefined {
  return typeof override === "function" ? override : override[direction];
}

/**
 * Label every track of a composite by element identity. Nested composites
 * (blind's out/in phases) inherit `"out"` / `"in"` from their index so
 * their created strip elements resolve to the phase they belong to.
 */
export function labelByIdentity(
  animation: MultiAnimation,
  from: HTMLElement,
  to: HTMLElement,
  inherited?: string,
): void {
  animation.children.forEach((child, index) => {
    if (child instanceof WebAnimation) {
      child.label = labelFor(child.element, from, to, inherited);
    } else if (child instanceof MultiAnimation) {
      const next = index === 0 ? "out" : index === 1 ? "in" : inherited;
      labelByIdentity(child, from, to, next);
    }
  });
}

function labelFor(
  element: HTMLElement,
  from: HTMLElement,
  to: HTMLElement,
  inherited: string | undefined,
): string {
  if (element === from) return "out";
  if (element === to) return "in";
  const id = readSsgoiId(element);
  if (id !== undefined && id.endsWith("-overlay")) return "overlay";
  return inherited ?? "shared";
}

function readSsgoiId(element: HTMLElement): string | undefined {
  const dataset = (element as { dataset?: DOMStringMap }).dataset;
  if (dataset && typeof dataset.ssgoiId === "string") return dataset.ssgoiId;
  const getAttribute = (
    element as { getAttribute?: (name: string) => string | null }
  ).getAttribute;
  if (typeof getAttribute === "function") {
    return getAttribute.call(element, "data-ssgoi-id") ?? undefined;
  }
  return undefined;
}
