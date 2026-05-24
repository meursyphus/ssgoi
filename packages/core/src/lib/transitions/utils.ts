import type { AnyTransitionConfig, SsgoiPathTransition } from "@types";

export type DirectionalTransitionPaths = {
  enter: string;
  exit: string;
};

/**
 * Unified preset configuration schema used by all v6 transition presets.
 *
 * - `TPaths` carries the paths shape (symmetric / directional / ordered).
 * - `TType` is the union of supported `type` discriminators. Use `never`
 *   when the preset has no `type` slot.
 * - `TVariant` is the union of supported `variant` values. Defaults to
 *   `"default"` so single-variant presets expose a stable slot.
 * - `TOptions` is the bag of fine-tuning options. Defaults to `{}` so
 *   presets can stay forward-compatible without exposing knobs yet.
 */
export type PresetConfig<
  TPaths,
  TType extends string = never,
  TVariant extends string = "default",
  TOptions extends object = Record<string, never>,
> = TPaths & {
  type?: TType;
  variant?: TVariant;
  options?: TOptions;
};

export function createSymmetricPathTransitions(
  paths: readonly string[],
  createTransition: () => AnyTransitionConfig,
): SsgoiPathTransition[] {
  const transitions: SsgoiPathTransition[] = [];

  for (let fromIndex = 0; fromIndex < paths.length; fromIndex++) {
    for (let toIndex = fromIndex + 1; toIndex < paths.length; toIndex++) {
      const from = paths[fromIndex];
      const to = paths[toIndex];
      if (!from || !to) continue;
      transitions.push({
        from,
        to,
        transition: createTransition(),
        symmetric: true,
      });
    }
  }

  return transitions;
}

export function createDirectionalPathTransitions(
  paths: DirectionalTransitionPaths,
  createTransition: (direction: "enter" | "exit") => AnyTransitionConfig,
): SsgoiPathTransition[] {
  return [
    {
      from: paths.exit,
      to: paths.enter,
      transition: createTransition("enter"),
    },
    {
      from: paths.enter,
      to: paths.exit,
      transition: createTransition("exit"),
    },
  ];
}

export function createOrderedPathTransitions<TDirection extends string>(
  paths: readonly string[],
  directions: {
    forward: TDirection;
    backward: TDirection;
  },
  createTransition: (direction: TDirection) => AnyTransitionConfig,
): SsgoiPathTransition[] {
  const transitions: SsgoiPathTransition[] = [];

  for (let fromIndex = 0; fromIndex < paths.length; fromIndex++) {
    for (let toIndex = fromIndex + 1; toIndex < paths.length; toIndex++) {
      const from = paths[fromIndex];
      const to = paths[toIndex];
      if (!from || !to) continue;
      transitions.push(
        {
          from,
          to,
          transition: createTransition(directions.forward),
        },
        {
          from: to,
          to: from,
          transition: createTransition(directions.backward),
        },
      );
    }
  }

  return transitions;
}
