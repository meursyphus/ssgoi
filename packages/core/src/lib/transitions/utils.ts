import type { SggoiTransition, SsgoiTransitionConfig } from "@types";

export type DirectionalTransitionPaths = {
  enter: string;
  exit: string;
};

export function createSymmetricPathTransitions(
  paths: readonly string[],
  createTransition: () => SggoiTransition,
): SsgoiTransitionConfig[] {
  const transitions: SsgoiTransitionConfig[] = [];

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
  createTransition: (direction: "enter" | "exit") => SggoiTransition,
): SsgoiTransitionConfig[] {
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
  createTransition: (direction: TDirection) => SggoiTransition,
): SsgoiTransitionConfig[] {
  const transitions: SsgoiTransitionConfig[] = [];

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
