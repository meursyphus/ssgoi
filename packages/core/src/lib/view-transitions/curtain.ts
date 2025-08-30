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

  // Convert staggerDelay from ms to normalized value (0-1)
  const staggerFactor = staggerDelay / 1000;

  let outAnimationComplete: Promise<void>;
  let resolveOutAnimation: (() => void) | null = null;
  let curtainContainer: HTMLElement | null = null;
  let blinds: HTMLElement[] = [];

  const createCurtainBlinds = (element: HTMLElement, initiallyHidden = false) => {
    // Ensure parent has position relative/absolute for absolute positioning
    const parentStyle = window.getComputedStyle(element);
    if (parentStyle.position === 'static') {
      element.style.position = 'relative';
    }
    
    curtainContainer = document.createElement('div');
    curtainContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `;

    blinds = [];
    for (let i = 0; i < blindCount; i++) {
      const blind = document.createElement('div');
      
      if (direction === 'horizontal') {
        const blindHeight = 100 / blindCount;
        blind.style.cssText = `
          position: absolute;
          top: ${blindHeight * i}%;
          left: 0;
          width: 100%;
          height: ${blindHeight}%;
          background: ${curtainColor};
          transform: scaleX(${initiallyHidden ? 0 : 1});
          transform-origin: left center;
          transition: none;
        `;
      } else {
        const blindWidth = 100 / blindCount;
        blind.style.cssText = `
          position: absolute;
          top: 0;
          left: ${blindWidth * i}%;
          width: ${blindWidth}%;
          height: 100%;
          background: ${curtainColor};
          transform: scaleY(${initiallyHidden ? 0 : 1});
          transform-origin: top center;
          transition: none;
        `;
      }
      
      blinds.push(blind);
      curtainContainer.appendChild(blind);
    }
    
    element.appendChild(curtainContainer);
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

      createCurtainBlinds(element, true); // Start with hidden blinds

      return {
        spring: outSpring,
        prepare: prepareOutgoing,
        tick: (progress) => {
          blinds.forEach((blind, index) => {
            // Calculate when each blind should start appearing
            const blindDelay = (index / blindCount) * (1 - staggerFactor);
            const blindDuration = (1 / blindCount) + staggerFactor;
            
            // Calculate individual blind progress
            const blindProgress = Math.max(0, Math.min(1, 
              (progress - blindDelay) / blindDuration
            ));
            
            if (direction === 'horizontal') {
              blind.style.transform = `scaleX(${blindProgress})`;
            } else {
              blind.style.transform = `scaleY(${blindProgress})`;
            }
          });

          // Don't change opacity during curtain close
        },
        onEnd: () => {
          // Keep curtain in place after OUT completes
          // It will be removed when IN animation ends
          if (resolveOutAnimation) {
            resolveOutAnimation();
          }
        },
      };
    },
    in: (element) => {
      // Don't create new blinds, use existing ones from OUT animation if they exist
      if (!curtainContainer) {
        createCurtainBlinds(element, false); // Create fully visible curtain if no OUT animation
      }

      return {
        spring: inSpring,
        prepare: (element) => {
          element.style.opacity = "1"; // Content is already visible but hidden by curtain
          
          // Ensure all blinds are fully visible at start
          if (blinds.length > 0) {
            blinds.forEach((blind) => {
              if (direction === 'horizontal') {
                blind.style.transform = 'scaleX(1)';
              } else {
                blind.style.transform = 'scaleY(1)';
              }
            });
          }
        },
        wait: async () => {
          if (outAnimationComplete) {
            await outAnimationComplete;
            await sleep(transitionDelay);
          }
        },
        tick: (progress) => {
          blinds.forEach((blind, index) => {
            // Blinds disappear from last to first (right to left)
            const reverseIndex = blinds.length - 1 - index;
            const blindDelay = (reverseIndex / blindCount) * (1 - staggerFactor);
            const blindDuration = (1 / blindCount) + staggerFactor;
            
            // Calculate individual blind progress for opening
            const blindProgress = Math.max(0, Math.min(1, 
              (progress - blindDelay) / blindDuration
            ));
            
            // Blinds slide away as curtain opens
            if (direction === 'horizontal') {
              blind.style.transform = `scaleX(${1 - blindProgress})`;
            } else {
              blind.style.transform = `scaleY(${1 - blindProgress})`;
            }
          });

          // Content is already visible, just hidden by curtain
        },
        onEnd: () => {
          // Clean up curtain elements after IN animation completes
          removeCurtainBlinds();
        },
      };
    },
  };
};