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
  border?: {
    color?: string; // Border color (default: white)
  };
}

/**
 * Calculate the visible viewport rect for film transition
 * Returns the area where the transition will be visible
 */
function getFilmRect(context: SggoiTransitionContext) {
  const containerRect = getRect(document.body, context.positionedParent);
  const top = context.scroll.y;

  return {
    top,
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

function applyFlimTranslate(
  element: HTMLElement,
  rect: ReturnType<typeof getFilmRect>,
) {
  element.style.transform = `translateY(${-rect.top}px)`;
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

/**
 * Helper function to update border positions
 */
function updateBorders(
  borderElements: CornerBorders,
  offsetX: number,
  offsetY: number,
) {
  borderElements.topLeft.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  borderElements.topRight.style.transform = `translate(${-offsetX}px, ${offsetY}px)`;
  borderElements.bottomLeft.style.transform = `translate(${offsetX}px, ${-offsetY}px)`;
  borderElements.bottomRight.style.transform = `translate(${-offsetX}px, ${-offsetY}px)`;
}

interface CornerBorders extends Iterable<HTMLElement> {
  topLeft: HTMLElement;
  topRight: HTMLElement;
  bottomLeft: HTMLElement;
  bottomRight: HTMLElement;
}

/**
 * Create corner border elements (ㄴ ㄱ shapes)
 */
function createCornerBorders(
  color: string = "white",
  rect: ReturnType<typeof getFilmRect>,
): CornerBorders {
  const borderWidth = 2;
  const borderLength = 10;

  // Top-left corner
  const topLeft = document.createElement("div");
  topLeft.style.position = "fixed";
  topLeft.style.pointerEvents = "none";
  topLeft.style.zIndex = "9999";
  topLeft.style.top = `${rect.top - borderWidth}px`;
  topLeft.style.left = `${rect.left - borderWidth}px`;
  topLeft.style.width = `${borderLength}px`;
  topLeft.style.height = `${borderLength}px`;
  // Horizontal line
  const topLeftH = document.createElement("div");
  topLeftH.style.position = "absolute";
  topLeftH.style.width = `${borderLength}px`;
  topLeftH.style.height = `${borderWidth}px`;
  topLeftH.style.backgroundColor = color;
  topLeftH.style.top = "0";
  topLeftH.style.left = "0";
  // Vertical line
  const topLeftV = document.createElement("div");
  topLeftV.style.position = "absolute";
  topLeftV.style.width = `${borderWidth}px`;
  topLeftV.style.height = `${borderLength}px`;
  topLeftV.style.backgroundColor = color;
  topLeftV.style.top = "0";
  topLeftV.style.left = "0";
  topLeft.appendChild(topLeftH);
  topLeft.appendChild(topLeftV);

  // Top-right corner
  const topRight = document.createElement("div");
  topRight.style.position = "fixed";
  topRight.style.pointerEvents = "none";
  topRight.style.zIndex = "9999";
  topRight.style.top = `${rect.top - borderWidth}px`;
  topRight.style.left = `${rect.left + rect.width - borderLength + borderWidth}px`;
  topRight.style.width = `${borderLength}px`;
  topRight.style.height = `${borderLength}px`;
  // Horizontal line
  const topRightH = document.createElement("div");
  topRightH.style.position = "absolute";
  topRightH.style.width = `${borderLength}px`;
  topRightH.style.height = `${borderWidth}px`;
  topRightH.style.backgroundColor = color;
  topRightH.style.top = "0";
  topRightH.style.right = "0";
  // Vertical line
  const topRightV = document.createElement("div");
  topRightV.style.position = "absolute";
  topRightV.style.width = `${borderWidth}px`;
  topRightV.style.height = `${borderLength}px`;
  topRightV.style.backgroundColor = color;
  topRightV.style.top = "0";
  topRightV.style.right = "0";
  topRight.appendChild(topRightH);
  topRight.appendChild(topRightV);

  // Bottom-left corner
  const bottomLeft = document.createElement("div");
  bottomLeft.style.position = "fixed";
  bottomLeft.style.pointerEvents = "none";
  bottomLeft.style.zIndex = "9999";
  bottomLeft.style.top = `${rect.top + rect.height - borderLength + borderWidth}px`;
  bottomLeft.style.left = `${rect.left - borderWidth}px`;
  bottomLeft.style.width = `${borderLength}px`;
  bottomLeft.style.height = `${borderLength}px`;
  // Horizontal line
  const bottomLeftH = document.createElement("div");
  bottomLeftH.style.position = "absolute";
  bottomLeftH.style.width = `${borderLength}px`;
  bottomLeftH.style.height = `${borderWidth}px`;
  bottomLeftH.style.backgroundColor = color;
  bottomLeftH.style.bottom = "0";
  bottomLeftH.style.left = "0";
  // Vertical line
  const bottomLeftV = document.createElement("div");
  bottomLeftV.style.position = "absolute";
  bottomLeftV.style.width = `${borderWidth}px`;
  bottomLeftV.style.height = `${borderLength}px`;
  bottomLeftV.style.backgroundColor = color;
  bottomLeftV.style.bottom = "0";
  bottomLeftV.style.left = "0";
  bottomLeft.appendChild(bottomLeftH);
  bottomLeft.appendChild(bottomLeftV);

  // Bottom-right corner
  const bottomRight = document.createElement("div");
  bottomRight.style.position = "fixed";
  bottomRight.style.pointerEvents = "none";
  bottomRight.style.zIndex = "9999";
  bottomRight.style.top = `${rect.top + rect.height - borderLength + borderWidth}px`;
  bottomRight.style.left = `${rect.left + rect.width - borderLength + borderWidth}px`;
  bottomRight.style.width = `${borderLength}px`;
  bottomRight.style.height = `${borderLength}px`;
  // Horizontal line
  const bottomRightH = document.createElement("div");
  bottomRightH.style.position = "absolute";
  bottomRightH.style.width = `${borderLength}px`;
  bottomRightH.style.height = `${borderWidth}px`;
  bottomRightH.style.backgroundColor = color;
  bottomRightH.style.bottom = "0";
  bottomRightH.style.right = "0";
  // Vertical line
  const bottomRightV = document.createElement("div");
  bottomRightV.style.position = "absolute";
  bottomRightV.style.width = `${borderWidth}px`;
  bottomRightV.style.height = `${borderLength}px`;
  bottomRightV.style.backgroundColor = color;
  bottomRightV.style.bottom = "0";
  bottomRightV.style.right = "0";
  bottomRight.appendChild(bottomRightH);
  bottomRight.appendChild(bottomRightV);

  return {
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    *[Symbol.iterator]() {
      yield topLeft;
      yield topRight;
      yield bottomLeft;
      yield bottomRight;
    },
  };
}

export const film = (options?: FilmOptions): SggoiTransition => {
  const spring = options?.spring ?? DEFAULT_SPRING;
  const scale = options?.scale ?? 0.92;
  const borderColor = options?.border?.color ?? "white";

  return {
    out: async (element, context) => {
      // 나가는 화면 애니메이션
      const rect = getFilmRect(context);
      const containerRect = getRect(document.body, context.positionedParent);

      // Create border elements before return
      const borderElements = createCornerBorders(borderColor, {
        ...rect,
        top: containerRect.top,
      });

      return {
        spring,
        prepare: () => {
          prepareOutgoing(element);
          applyFilmTransformOrigin(element, rect);
          applyFilmClip(element, rect);
          applyFlimTranslate(element, rect);

          // Add border elements to positionedParent with transition
          for (const border of borderElements) {
            context.positionedParent.appendChild(border);
            border.style.transition = "transform 0.1s ease-out";
          }
        },
        onEnd: () => {
          // Clean up styles after animation
          element.style.clipPath = "";
          element.style.transformOrigin = "";

          // Remove border elements from positionedParent
          setTimeout(() => {
            for (const border of borderElements) {
              context.positionedParent.removeChild(border);
            }
          }, 1000);
        },
        tick: (_progress) => {
          // OUT: _progress는 1 → 0으로 진행
          const progress = 1 - _progress; // 0 → 1로 변환하여 작업

          // Stage 1 (0 ~ 0.3): 1 → scale로 축소
          if (progress < STAGE_1_END) {
            const stage1Progress = mapProgress(progress, 0, STAGE_1_END);
            const currentScale = 1 - (1 - scale) * stage1Progress; // 1 → scale
            element.style.transform = `translateY(${-rect.top}px) scale(${currentScale})`;

            // Calculate how much the element has shrunk
            const offsetX = (rect.width - rect.width * currentScale) / 2;
            const offsetY = (rect.height - rect.height * currentScale) / 2;

            updateBorders(borderElements, offsetX, offsetY);
          }
          // Stage 2 (0.3 ~ 0.7): scale 유지하며 위로 이동
          else if (progress < STAGE_2_END) {
            const stage2Progress = mapProgress(
              progress,
              STAGE_1_END,
              STAGE_2_END,
            );

            const translateY = -rect.top - rect.height * stage2Progress; // 0 → -height
            element.style.transform = `translateY(${translateY}px) scale(${scale})`;

            // Borders stay at their final Stage 1 position (no update needed)
          }
          // Stage 3 (0.7 ~ 1.0): scale → 1로 확대하며 위에 유지
          else {
            const stage3Progress = mapProgress(progress, STAGE_2_END, 1.0);
            const currentScale = scale + (1 - scale) * stage3Progress; // scale → 1
            element.style.transform = `translateY(${-rect.top - rect.height}px) scale(${currentScale})`;

            // Calculate current offset
            const offsetX = (rect.width - rect.width * currentScale) / 2;
            const offsetY = (rect.height - rect.height * currentScale) / 2;

            updateBorders(borderElements, offsetX, offsetY);
          }
        },
      };
    },

    in: async (element, context) => {
      // 들어오는 화면 애니메이션
      // 1. 컨테이너 크기 계산
      // 2. 초기 위치 설정 (화면 아래, 작은 크기)

      const rect = getFilmRect(context);

      // No borders for IN animation

      return {
        spring,
        prepare: () => {
          applyFilmTransformOrigin(element, rect);
          applyFilmClip(element, rect);
          element.style.transform = `translateY(${-rect.top + rect.height}px) scale(${scale})`;
        },
        onEnd: () => {
          // Clean up styles after animation
          element.style.clipPath = "";
          element.style.transformOrigin = "";
          element.style.transform = "";
        },
        tick: (progress) => {
          // IN: progress는 0 → 1로 진행
          // Stage 1 (0 ~ 0.3): 대기 (화면 밖, 안 보임)
          if (progress < STAGE_1_END) {
            // 초기 위치 유지 (화면 아래)
            element.style.transform = `translateY(${-rect.top + rect.height}px) scale(${scale})`;
            element.style.opacity = "0";
          }
          // Stage 2 (0.3 ~ 0.7): 아래에서 위로 올라옴
          else if (progress < STAGE_2_END) {
            const stage2Progress = mapProgress(
              progress,
              STAGE_1_END,
              STAGE_2_END,
            );
            const translateY = -rect.top + rect.height * (1 - stage2Progress); // height → 0
            element.style.transform = `translateY(${translateY}px) scale(${scale})`;
            element.style.opacity = "1";
          }
          // Stage 3 (0.7 ~ 1.0): 제자리에서 scale 확대
          else {
            const stage3Progress = mapProgress(progress, STAGE_2_END, 1.0);
            const currentScale = scale + (1 - scale) * stage3Progress; // scale → 1
            element.style.transform = `translateY(${-rect.top}px) scale(${currentScale})`;
            element.style.opacity = "1";
          }
        },
      };
    },
  };
};
