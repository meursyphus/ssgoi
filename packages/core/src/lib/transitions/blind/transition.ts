import type { PhysicsOptions, TransitionConfig } from "@types";
import {
  Animation,
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";

const DEFAULT_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 200, damping: 22 },
};
const DEFAULT_BLIND_COUNT = 10;
const DEFAULT_DIRECTION = "horizontal" as const;
const DEFAULT_BLIND_COLOR = "#000000";

export interface BlindOptions {
  physics?: PhysicsOptions;
  blindCount?: number;
  direction?: "horizontal" | "vertical";
  blindColor?: string;
}

function makeBlinds(
  host: HTMLElement,
  count: number,
  direction: "horizontal" | "vertical",
  color: string,
  initial: "hidden" | "closed",
  origin: "left" | "right",
): { container: HTMLDivElement; blinds: HTMLDivElement[] } {
  const parentStyle = window.getComputedStyle(host);
  if (parentStyle.position === "static") {
    host.style.position = "relative";
  }

  const container = document.createElement("div");
  container.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  `;

  const blinds: HTMLDivElement[] = [];
  for (let i = 0; i < count; i++) {
    const blind = document.createElement("div");
    if (direction === "horizontal") {
      const size = 100 / count;
      blind.style.cssText = `
        position: absolute;
        top: ${size * i}%;
        left: 0;
        width: 100%;
        height: calc(${size}% + 1px);
        background: ${color};
        transform: scaleX(${initial === "hidden" ? 0 : 1});
        transform-origin: ${origin} center;
        will-change: transform;
      `;
    } else {
      const size = 100 / count;
      blind.style.cssText = `
        position: absolute;
        top: 0;
        left: ${size * i}%;
        width: calc(${size}% + 1px);
        height: 100%;
        background: ${color};
        transform: scaleY(${initial === "hidden" ? 0 : 1});
        transform-origin: ${origin === "left" ? "top" : "bottom"} center;
        will-change: transform;
      `;
    }
    blinds.push(blind);
    container.appendChild(blind);
  }

  host.appendChild(container);
  return { container, blinds };
}

type BlindExtras = {
  fromBlinds: HTMLDivElement[];
  fromContainer: HTMLDivElement;
  toBlinds: HTMLDivElement[];
  toContainer: HTMLDivElement;
};

export const blind = (
  options: BlindOptions = {},
): TransitionConfig<BlindExtras> => {
  const blindCount = options.blindCount ?? DEFAULT_BLIND_COUNT;
  const direction = options.direction ?? DEFAULT_DIRECTION;
  const blindColor = options.blindColor ?? DEFAULT_BLIND_COLOR;
  const physicsOptions = options.physics ?? DEFAULT_PHYSICS;

  return {
    prepare: async ({ from, to }): Promise<BlindExtras> => {
      const fromEl = await from;
      const toEl = await to;
      fromEl.style.zIndex = "1000";
      const fromData = makeBlinds(
        fromEl,
        blindCount,
        direction,
        blindColor,
        "hidden",
        "left",
      );
      toEl.style.position = "relative";
      toEl.style.zIndex = "0";
      const toData = makeBlinds(
        toEl,
        blindCount,
        direction,
        blindColor,
        "closed",
        "right",
      );
      return {
        fromBlinds: fromData.blinds,
        fromContainer: fromData.container,
        toBlinds: toData.blinds,
        toContainer: toData.container,
      };
    },
    animation: ({ fromBlinds, fromContainer, toBlinds, toContainer }) => {
      // OUT: each blind grows in (t: 0 → 1). IN: each blind shrinks out
      // (`u`: 1 → 0). Default (0, 1) bounds for both.
      const out: Animation[] = fromBlinds.map(
        (b) =>
          new WebAnimation({
            element: b,
            integrator: IntegratorProvider.from(physicsOptions),
            style: (t) => ({
              transform:
                direction === "horizontal" ? `scaleX(${t})` : `scaleY(${t})`,
            }),
          }),
      );

      const inAnims: Animation[] = toBlinds.map(
        (b, i) =>
          new WebAnimation({
            element: b,
            integrator: IntegratorProvider.from(physicsOptions),
            style: (_t, u) => ({
              transform:
                direction === "horizontal" ? `scaleX(${u})` : `scaleY(${u})`,
            }),
            onComplete:
              i === toBlinds.length - 1
                ? () => {
                    toContainer.remove();
                    fromContainer.remove();
                  }
                : undefined,
          }),
      );

      const outPhase = new MultiAnimation(out, { mode: "parallel" });
      const inPhase = new MultiAnimation(inAnims, { mode: "parallel" });

      return new MultiAnimation([outPhase, inPhase], { mode: "sequence" });
    },
  };
};
