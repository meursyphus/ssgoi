import type {
  AnyTransitionConfig,
  SsgoiDirectionTransition,
  SsgoiPathTransition,
} from "@types";

export type DirectionalTransitionPaths = {
  enter: string;
  exit: string;
};

/**
 * Maps application direction tokens to the motion directions understood by a
 * preset. The keys are matched against `SsgoiConfig.resolveDirection`.
 */
export type DirectionTransitionMap<TMotionDirection extends string> = Readonly<
  Record<string, TMotionDirection>
>;

export type DirectionTransitionSelector<TMotionDirection extends string> = {
  directions: DirectionTransitionMap<TMotionDirection>;
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

/**
 * Builds direction entries (no paths) from a preset's motion factory.
 *
 * `directionMap` maps each app-facing TOKEN — what
 * `SsgoiConfig.resolveDirection` returns — to the MOTION DIRECTION argument the
 * factory understands. e.g.
 * `{ forward: "enter", back: "exit" }` yields entries keyed `"forward"` /
 * `"back"`, each carrying the config the factory produced for `"enter"` /
 * `"exit"`. The factory is invoked once per token.
 */
export function createDirectionalTransitions<TMotionDirection extends string>(
  directionMap: DirectionTransitionMap<TMotionDirection>,
  createTransition: (direction: TMotionDirection) => AnyTransitionConfig,
): SsgoiDirectionTransition[] {
  return Object.entries(directionMap).map(
    ([directionToken, motionDirection]) => ({
      direction: directionToken,
      transition: createTransition(motionDirection),
    }),
  );
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
