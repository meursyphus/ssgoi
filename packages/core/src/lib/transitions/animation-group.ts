import { MultiAnimation, WebAnimation, type Animation } from "../animation";
import type { MultiAnimationOptions } from "../animation";

/** Providers contribute semantic groups while retaining authored track order. */
export type AnimationContributions<Name extends string> = Partial<
  Record<Name, readonly Animation[]>
>;

export function animationGroup<Name extends string>(
  groups: Record<Name, Animation | readonly Animation[]>,
  options: MultiAnimationOptions = {},
): MultiAnimation<Name> {
  const children = Object.fromEntries(
    Object.entries(groups).map(([name, value]) => {
      const animations = value as Animation | readonly Animation[];
      return [
        name,
        Array.isArray(animations)
          ? animations.length === 1
            ? animations[0]!
            : new MultiAnimation(animations)
          : animations,
      ];
    }),
  ) as Record<Name, Animation>;
  return new MultiAnimation(children, options);
}

/** Keep inline cleanup authoritative when a reused page is shown again. */
export function releaseFillOnComplete(animation: WebAnimation): void {
  const previous = animation.onComplete;
  animation.onComplete = () => {
    previous?.();
    animation.releaseFill();
  };
}
