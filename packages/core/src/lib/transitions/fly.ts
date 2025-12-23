import type {
  SpringConfig,
  StyleObject,
  Transition,
  TransitionKey,
} from "../types";

interface FlyOptions {
  x?: number | string;
  y?: number | string;
  opacity?: number;
  spring?: Partial<SpringConfig>;
  key?: TransitionKey;
}

export const fly = (options: FlyOptions = {}): Transition => {
  const { x = 0, y = -100, opacity = 0, spring: springOption, key } = options;

  const spring: SpringConfig = {
    stiffness: springOption?.stiffness ?? 400,
    damping: springOption?.damping ?? 35,
    doubleSpring: springOption?.doubleSpring ?? false,
  };

  const getCss = (progress: number): StyleObject => {
    const multiplier = 1 - progress;

    let xOffset: string;
    let yOffset: string;

    if (typeof x === "number") {
      xOffset = `${multiplier * x}px`;
    } else {
      xOffset = `calc(${x} * ${multiplier})`;
    }

    if (typeof y === "number") {
      yOffset = `${multiplier * y}px`;
    } else {
      yOffset = `calc(${y} * ${multiplier})`;
    }

    return {
      transform: `translate3d(${xOffset}, ${yOffset}, 0)`,
      opacity: opacity + (1 - opacity) * progress,
    };
  };

  const applyStyle = (element: HTMLElement, style: StyleObject): void => {
    for (const [k, value] of Object.entries(style)) {
      (element.style as unknown as Record<string, string>)[k] =
        typeof value === "number" ? String(value) : value;
    }
  };

  return {
    in: (element) => ({
      spring,
      css: getCss,
      update: (progress: number) => applyStyle(element, getCss(progress)),
    }),
    out: (element) => ({
      spring,
      css: getCss,
      update: (progress: number) => applyStyle(element, getCss(progress)),
    }),
    ...(key && { key }),
  };
};
