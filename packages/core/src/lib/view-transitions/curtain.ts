import type { SpringConfig, SggoiTransition } from "../types";
import { prepareOutgoing, sleep } from "../utils";

const DEFAULT_OUT_SPRING = { stiffness: 400, damping: 25 };
const DEFAULT_IN_SPRING = { stiffness: 300, damping: 22 };
const DEFAULT_TRANSITION_DELAY = 50;
const DEFAULT_BLIND_COUNT = 10;
const DEFAULT_DIRECTION = 'horizontal' as const;
const DEFAULT_CURTAIN_COLOR = '#000000';

interface CurtainOptions {
  inSpring?: SpringConfig;
  outSpring?: SpringConfig;
  transitionDelay?: number;
  blindCount?: number;
  direction?: 'horizontal' | 'vertical';
  staggerDelay?: number;
  curtainColor?: string;
}

export const curtain = (options: CurtainOptions = {}): SggoiTransition => {
  const {
    inSpring = DEFAULT_IN_SPRING,
    outSpring = DEFAULT_OUT_SPRING,
    transitionDelay = DEFAULT_TRANSITION_DELAY,
    blindCount = DEFAULT_BLIND_COUNT,
    direction = DEFAULT_DIRECTION,
    staggerDelay = 30,
    curtainColor = DEFAULT_CURTAIN_COLOR,
  } = options;

  let outAnimationComplete: Promise<void>;
  let resolveOutAnimation: (() => void) | null = null;
  let curtainContainer: HTMLElement | null = null;
  let blinds: HTMLElement[] = [];

  const createCurtainBlinds = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    
    curtainContainer = document.createElement('div');
    curtainContainer.style.cssText = `
      position: fixed;
      top: ${rect.top}px;
      left: ${rect.left}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `;

    blinds = [];
    for (let i = 0; i < blindCount; i++) {
      const blind = document.createElement('div');
      
      if (direction === 'horizontal') {
        const blindHeight = rect.height / blindCount;
        blind.style.cssText = `
          position: absolute;
          top: ${blindHeight * i}px;
          left: 0;
          width: 100%;
          height: ${blindHeight}px;
          background: ${curtainColor};
          transform: scaleX(0);
          transform-origin: left center;
        `;
      } else {
        const blindWidth = rect.width / blindCount;
        blind.style.cssText = `
          position: absolute;
          top: 0;
          left: ${blindWidth * i}px;
          width: ${blindWidth}px;
          height: 100%;
          background: ${curtainColor};
          transform: scaleY(0);
          transform-origin: top center;
        `;
      }
      
      blinds.push(blind);
      curtainContainer.appendChild(blind);
    }
    
    document.body.appendChild(curtainContainer);
  };

  const removeCurtainBlinds = () => {
    if (curtainContainer) {
      curtainContainer.remove();
      curtainContainer = null;
      blinds = [];
    }
  };

  return {
    out: (element) => {
      outAnimationComplete = new Promise((resolve) => {
        resolveOutAnimation = resolve;
      });

      createCurtainBlinds(element);

      return {
        spring: outSpring,
        prepare: prepareOutgoing,
        tick: (progress) => {
          blinds.forEach((blind, index) => {
            const staggeredProgress = Math.max(0, Math.min(1, 
              (progress * (1 + staggerDelay * blindCount / 1000) - (index * staggerDelay / 1000))
            ));
            
            if (direction === 'horizontal') {
              blind.style.transform = `scaleX(${staggeredProgress})`;
            } else {
              blind.style.transform = `scaleY(${staggeredProgress})`;
            }
          });

          element.style.opacity = (1 - progress).toString();
        },
        onEnd: () => {
          setTimeout(() => {
            removeCurtainBlinds();
          }, 100);
          
          if (resolveOutAnimation) {
            resolveOutAnimation();
          }
        },
      };
    },
    in: (element) => {
      createCurtainBlinds(element);

      return {
        spring: inSpring,
        prepare: (element) => {
          element.style.opacity = "0";
          
          // Start with blinds fully closed
          blinds.forEach((blind) => {
            if (direction === 'horizontal') {
              blind.style.transform = 'scaleX(1)';
            } else {
              blind.style.transform = 'scaleY(1)';
            }
          });
        },
        wait: async () => {
          if (outAnimationComplete) {
            await outAnimationComplete;
            await sleep(transitionDelay);
          }
        },
        tick: (progress) => {
          blinds.forEach((blind, index) => {
            const reverseIndex = blinds.length - 1 - index;
            const staggeredProgress = Math.max(0, Math.min(1, 
              (progress * (1 + staggerDelay * blindCount / 1000) - (reverseIndex * staggerDelay / 1000))
            ));
            
            // Blinds open from right to left (or bottom to top)
            if (direction === 'horizontal') {
              blind.style.transform = `scaleX(${1 - staggeredProgress})`;
            } else {
              blind.style.transform = `scaleY(${1 - staggeredProgress})`;
            }
          });

          element.style.opacity = progress.toString();
        },
        onEnd: () => {
          removeCurtainBlinds();
        },
      };
    },
  };
};