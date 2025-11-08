import type {
  SggoiTransition,
  SpringConfig,
  MultiSpringConfig,
} from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";

/** Defaults */
const DEFAULT_OUT_SPRING: SpringConfig = { stiffness: 1, damping: 1 };
const DEFAULT_TEXT_SPRING: SpringConfig = { stiffness: 15, damping: 6 };
const DEFAULT_SHAPE_SPRING: SpringConfig = { stiffness: 15, damping: 10 };
const DEFAULT_BACKGROUND = "#000000";
const DEFAULT_SHAPE = "circle" as const;
const CURTAIN_REVEAL_OVERLAY_ID = "CURTAIN_REVEAL_OVERLAY_ID";

const DEFAULT_OVERLAY_STYLE: Partial<CSSStyleDeclaration> = {
  position: "fixed",
  inset: "0",
  width: "100vw",
  height: "100%",
  zIndex: "9999",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};
const DEFAULT_VIEWPORT_STYLE: Partial<CSSStyleDeclaration> = {
  position: "relative",
  display: "inline-block",
  height: "5.5rem",
  overflow: "hidden",
};
const DEFAULT_WRAPPER_STYLE: Partial<CSSStyleDeclaration> = {
  display: "flex",
  height: "100%",
  willChange: "transform",
};
const DEFAULT_SLIDE_STYLE: Partial<CSSStyleDeclaration> = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
  fontSize: "5.5rem",
  fontWeight: "900",
  letterSpacing: "0.02em",
  color: "#FFFFFF",
};

//magic Numbers
const OUT_OPACITY_OFFSET = 0.4;

type CurtainShape = "circle" | "square" | "triangle";

interface CurtainRevealOptions {
  /** Background style.
   *
   * Supports both:
   * - Solid colors (e.g., `"#000000"`, `"rgb(255, 0, 0)"`)
   * - CSS gradients (e.g., `"linear-gradient(to right, #000, #fff)"`)
   */
  background?: string;
  texts?: string[];
  shape?: CurtainShape;
  textSpring?: SpringConfig;
  shapeSpring?: SpringConfig;
  outSpring?: SpringConfig;
  textStyle?: Partial<CSSStyleDeclaration>;
}

function getClipPath(shape: CurtainShape, scale: number): string {
  switch (shape) {
    case "circle":
      return `circle(${scale * 100}% at 50% 50%)`;
    case "square":
      return `inset(${(1 - scale) * 50}% round ${10 * scale}%)`;
    case "triangle": {
      const p = scale * 100;
      return `polygon(50% ${50 - p}%, ${50 - p}% ${50 + p}%, ${
        50 + p
      }% ${50 + p}%)`;
    }
  }
}

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

export const curtainReveal = (
  options: CurtainRevealOptions = {},
): SggoiTransition => {
  const {
    background = DEFAULT_BACKGROUND,
    texts = [],
    shape = DEFAULT_SHAPE,
    textSpring = DEFAULT_TEXT_SPRING,
    shapeSpring = DEFAULT_SHAPE_SPRING,
    outSpring = DEFAULT_OUT_SPRING,
    textStyle = {},
  } = options;

  return {
    out: (element, context) => {
      const originalOpacity = element.style.opacity;

      return {
        spring: outSpring,
        from: 1,
        to: 0,
        prepare: (el) => {
          prepareOutgoing(el, context);
          el.style.opacity = "1";
        },
        tick: (progress) => {
          const opacityProgress = Math.max(0, progress - OUT_OPACITY_OFFSET);
          element.style.opacity = String(opacityProgress);
        },
        onEnd: () => {
          element.style.opacity = originalOpacity;
        },
      };
    },

    in: (element: HTMLElement): MultiSpringConfig => {
      let overlay: HTMLElement | null = null;
      let viewport: HTMLElement | null = null;
      let wrapper: HTMLElement | null = null;

      const originalBodyOverflow = document.body.style.overflow;
      const prevCurtainRevealOverlay = document.getElementById(
        CURTAIN_REVEAL_OVERLAY_ID,
      );

      let widths: number[] = [];

      const createOverlay = () => {
        overlay = document.createElement("div");
        overlay.id = CURTAIN_REVEAL_OVERLAY_ID;
        Object.assign(overlay.style, DEFAULT_OVERLAY_STYLE, { background });
        document.body.appendChild(overlay);

        viewport = document.createElement("div");
        Object.assign(viewport.style, DEFAULT_VIEWPORT_STYLE);
        overlay.appendChild(viewport);

        wrapper = document.createElement("div");
        Object.assign(wrapper.style, DEFAULT_WRAPPER_STYLE);
        viewport.appendChild(wrapper);

        texts.forEach((t) => {
          const slide = document.createElement("div");
          slide.textContent = t;
          Object.assign(slide.style, DEFAULT_SLIDE_STYLE, textStyle);
          wrapper!.appendChild(slide);
        });

        widths = Array.from(wrapper.children).map(
          (el) => (el as HTMLElement).getBoundingClientRect().width,
        );
      };



      const springs = [];

      // Spring 1~N: Text slide animation (one spring per text)
      if (texts.length > 0) {
        texts.forEach((_, idx) => {
          springs.push({
            from: 0,
            to: 1,
            spring: textSpring,
            tick: (progress: number) => {
              if (!viewport || !wrapper) return;

              const from = sum(widths.slice(0, idx));
              const to = sum(widths.slice(0, idx + 1));
              const offset = from + (to - from) * progress;

              wrapper.style.transform = `translateX(-${offset}px)`;
            },
          });
        });
      }

      // Spring 2: Shape reveal animation
      springs.push({
        from: 0,
        to: 1,
        spring: shapeSpring,
        tick: (progress: number) => {
          if (!overlay || !viewport) return;

          const scale = 1 - progress;
          overlay.style.clipPath = getClipPath(shape, scale);
          viewport.style.transform = `scale(${scale})`;
        },
      });

      return {
        springs,
        schedule: "wait",

        prepare: () => {
          document.body.style.overflow = "hidden";
          element.style.opacity = "1";
          prevCurtainRevealOverlay?.remove();

          createOverlay();
          if (overlay && viewport) {
            overlay.style.clipPath = "none";
            viewport.style.transform = "scale(1)";
          }
        },

        onStart: () => {},

        onEnd: () => {
          overlay?.remove();
          overlay = viewport = wrapper = null;
          document.body.style.overflow = originalBodyOverflow;
        },
      };
    },
  };
};
