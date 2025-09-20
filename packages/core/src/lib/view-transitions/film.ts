import type {
  SggoiTransition,
  SggoiTransitionContext,
  SpringConfig,
} from "../types";
import { prepareOutgoing } from "../utils";
import { getRect } from "../utils/get-rect";
// import { prepareOutgoing } from "../utils/prepare-outgoing";

// Default spring configuration for smooth, cinematic motion
const DEFAULT_SPRING: SpringConfig = {
  stiffness: 10, // Lower stiffness for smoother motion
  damping: 5, // Lower damping for more fluid movement
};

// Stage timing configuration (30% - 40% - 30%)
const STAGE_1_END = 0.2; // Stage 1: 0 ~ 0.3 (30%)
const STAGE_2_END = 0.82; // Stage 2: 0.3 ~ 0.7 (40%)
// Stage 3: 0.7 ~ 1.0 (30%)

interface FilmOptions {
  spring?: SpringConfig;
  scale?: number; // Scale factor (default: 0.9)
}

/**
 * Calculate the visible viewport rect for film transition
 * Returns the area where the transition will be visible
 */
function getFilmRect(context: SggoiTransitionContext) {
  const containerRect = getRect(document.body, context.positionedParent);
  const scrollY = context.scroll.y;

  return {
    top: scrollY,
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
          prepareOutgoing(element);
          applyFilmTransformOrigin(element, rect);
          applyFilmClip(element, rect);
        },
        onEnd: () => {
          // Clean up styles after animation
          element.style.clipPath = "";
          element.style.transformOrigin = "";
        },
        tick: (_progress) => {
          // OUT: _progress는 1 → 0으로 진행
          const progress = 1 - _progress; // 0 → 1로 변환하여 작업

          // Stage 1 (0 ~ 0.3): 1 → scale로 축소
          if (progress < STAGE_1_END) {
            const stage1Progress = mapProgress(progress, 0, STAGE_1_END);
            const currentScale = 1 - (1 - scale) * stage1Progress; // 1 → scale
            element.style.transform = `scale(${currentScale})`;
          }
          // Stage 2 (0.3 ~ 0.7): scale 유지하며 위로 이동
          else if (progress < STAGE_2_END) {
            const stage2Progress = mapProgress(
              progress,
              STAGE_1_END,
              STAGE_2_END,
            );

            const translateY = -rect.height * stage2Progress; // 0 → -height
            element.style.transform = `translateY(${translateY}px) scale(${scale})`;
          }
          // Stage 3 (0.7 ~ 1.0): scale → 1로 확대하며 위에 유지
          else {
            const stage3Progress = mapProgress(progress, STAGE_2_END, 1.0);
            const currentScale = scale + (1 - scale) * stage3Progress; // scale → 1
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

          element.style.transform = `translateY(${rect.height}px) scale(${scale})`;
        },
        onEnd: () => {
          // Clean up styles after animation
          element.style.clipPath = "";
          element.style.transformOrigin = "";
        },
        tick: (progress) => {
          // IN: progress는 0 → 1로 진행
          // Stage 1 (0 ~ 0.3): 대기 (화면 밖, 안 보임)
          if (progress < STAGE_1_END) {
            // 초기 위치 유지 (화면 아래)
            element.style.transform = `translateY(${rect.height}px) scale(${scale})`;
            element.style.opacity = "0";
          }
          // Stage 2 (0.3 ~ 0.7): 아래에서 위로 올라옴
          else if (progress < STAGE_2_END) {
            const stage2Progress = mapProgress(
              progress,
              STAGE_1_END,
              STAGE_2_END,
            );
            const translateY = rect.height * (1 - stage2Progress); // height → 0
            element.style.transform = `translateY(${translateY}px) scale(${scale})`;
            element.style.opacity = "1";
          }
          // Stage 3 (0.7 ~ 1.0): 제자리에서 scale 확대
          else {
            const stage3Progress = mapProgress(progress, STAGE_2_END, 1.0);
            const currentScale = scale + (1 - scale) * stage3Progress; // scale → 1
            element.style.transform = `scale(${currentScale})`;
            element.style.opacity = "1";
          }
        },
      };
    },
  };
};
