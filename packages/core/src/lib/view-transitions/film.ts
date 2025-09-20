 
import type { SggoiTransition, SggoiTransitionContext, SpringConfig } from "../types";
import { getRect } from "../utils/get-rect";
// import { prepareOutgoing } from "../utils/prepare-outgoing";

// Default spring configuration for smooth, cinematic motion
const DEFAULT_SPRING: SpringConfig = {
  stiffness: 100,  // Lower stiffness for smoother motion
  damping: 20,      // Lower damping for more fluid movement
};

interface FilmOptions {
  spring?: SpringConfig;
  scale?: number;  // Scale factor (default: 0.9)
}

/**
 * Calculate the visible viewport rect for film transition
 * Returns the area where the transition will be visible
 */
function getFilmRect(context: SggoiTransitionContext) {
  const containerRect = getRect(document.body, context.positionedParent);
  const scrollY = context.scroll.y;

  return {
    top: containerRect.top + scrollY,
    left: 0,
    width: containerRect.width,
    height: window.innerHeight - containerRect.top,
  };
}

/**
 * Set transform-origin to the center of film rect
 */
function applyFilmTransformOrigin(
  element: HTMLElement,
  rect: ReturnType<typeof getFilmRect>,
) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  element.style.transformOrigin = `${centerX}px ${centerY}px`;
}

/**
 * Apply clipPath to limit element visibility to film rect
 * Common prepare function for both in and out transitions
 */
function applyFilmClip(
  element: HTMLElement,
  rect: ReturnType<typeof getFilmRect>,
) {
  element.style.clipPath = `polygon(
    ${rect.left}px ${rect.top}px,
    ${rect.left + rect.width}px ${rect.top}px,
    ${rect.left + rect.width}px ${rect.top + rect.height}px,
    ${rect.left}px ${rect.top + rect.height}px
  )`;
}

/**
 * Map progress value from one range to another
 * e.g., mapProgress(0.2, 0, 0.4) = 0.5 (maps 0.2 in range 0-0.4 to 0.5 in range 0-1)
 */
function mapProgress(progress: number, start: number, end: number): number {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

export const film = (options?: FilmOptions): SggoiTransition => {
  const spring = options?.spring ?? DEFAULT_SPRING;
  const scale = options?.scale ?? 0.9;

  return {
    out: async (element, context) => {
      // 나가는 화면 애니메이션
      const rect = getFilmRect(context);

      return {
        spring,
        prepare: () => {
          applyFilmTransformOrigin(element, rect);
          applyFilmClip(element, rect);
        },
        onEnd: () => {
          // Clean up styles after animation
          element.style.clipPath = '';
          element.style.transformOrigin = '';
        },
        tick: (progress) => {
          // OUT: progress는 1 → 0으로 진행
          // Stage 1 (1.0 ~ 0.6): 축소
          if (progress > 0.6) {
            const stage1Progress = mapProgress(progress, 0.6, 1.0);
            const currentScale = scale + (1 - scale) * stage1Progress; // scale → 1
            element.style.transform = `scale(${currentScale})`;
          }
          // Stage 2 (0.6 ~ 0.4): 위로 이동
          else if (progress > 0.4) {
            const stage2Progress = mapProgress(progress, 0.4, 0.6);
            const translateY = -rect.height * (1 - stage2Progress); // 0 → -height
            element.style.transform = `translateY(${translateY}px) scale(${scale})`;
          }
          // Stage 3 (0.4 ~ 0): 다시 확대하면서 나감
          else {
            const stage3Progress = mapProgress(progress, 0, 0.4);
            const currentScale = scale + (1 - scale) * (1 - stage3Progress); // scale → 1
            element.style.transform = `translateY(${-rect.height}px) scale(${currentScale})`;
          }
        },
      };
    },

    in: async (element, context) => {
      // 들어오는 화면 애니메이션
      // 1. 컨테이너 크기 계산
      // 2. 초기 위치 설정 (화면 아래, 작은 크기)

      const rect = getFilmRect(context);

      return {
        spring,
        prepare: () => {
          applyFilmTransformOrigin(element, rect);
          applyFilmClip(element, rect);
          // 초기 위치: 화면 아래에 위치
          element.style.transform = `translateY(${rect.height}px) scale(${scale})`;
        },
        onEnd: () => {
          // Clean up styles after animation
          element.style.clipPath = '';
          element.style.transformOrigin = '';
        },
        tick: (progress) => {
          // IN: progress는 0 → 1로 진행
          // Stage 1 (0 ~ 0.4): 대기
          if (progress < 0.4) {
            // 초기 위치 유지
            element.style.transform = `translateY(${rect.height}px) scale(${scale})`;
          }
          // Stage 2 (0.4 ~ 0.6): 프레임 간격 통과
          else if (progress < 0.6) {
            // 여전히 대기 (간격 연출)
            element.style.transform = `translateY(${rect.height}px) scale(${scale})`;
          }
          // Stage 3 (0.6 ~ 1.0): 아래에서 올라오며 확대
          else {
            const stage3Progress = mapProgress(progress, 0.6, 1.0);
            const translateY = rect.height * (1 - stage3Progress); // height → 0
            const currentScale = scale + (1 - scale) * stage3Progress; // scale → 1
            element.style.transform = `translateY(${translateY}px) scale(${currentScale})`;
          }
        },
      };
    },
  };
};
