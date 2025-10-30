import type { SggoiTransition, SpringConfig } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";

/** Defaults */
const DEFAULT_OUT_SPRING: SpringConfig = { stiffness: 1, damping: 1 };
const DEFAULT_IN_SPRING: SpringConfig = { stiffness: 80, damping: 25 };
const DEFAULT_BACKGROUND = "#000000";
const DEFAULT_SHAPE = "circle" as const;
const DEFAULT_TEXT_DURATION = 1500;

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
  transition: "transform 0.8s ease",
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
  inSpring?: SpringConfig;
  outSpring?: SpringConfig;
  textDuration?: number;
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
      return `polygon(50% ${50 - p}%, ${50 - p}% ${50 + p}%, ${50 + p}% ${50 + p}%)`;
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
    textDuration = DEFAULT_TEXT_DURATION,
    shape = DEFAULT_SHAPE,
    inSpring = DEFAULT_IN_SPRING,
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
          element.style.opacity = String(progress);
        },
        onEnd: () => {
          element.style.opacity = originalOpacity;
        },
      };
    },

    in: (element: HTMLElement) => {
      let overlay: HTMLElement | null = null;
      let viewport: HTMLElement | null = null;
      let wrapper: HTMLElement | null = null;

      const originalBodyOverflow = document.body.style.overflow;

      let cancelled = false;
      const timeouts: number[] = [];
      let rafId: number | null = null;

      let curtainPhaseEnabled = false;

      const createOverlay = () => {
        overlay = document.createElement("div");
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
      };

      const slideAnimation = () =>
        new Promise<void>((resolve) => {
          if (!wrapper || !viewport) return resolve();

          const slides = Array.from(wrapper.children) as HTMLElement[];
          let idx = 0;

          const widths = slides.map((el) => el.getBoundingClientRect().width);

          const updateSlide = () => {
            const currentWidth = widths[idx] ?? 0;
            const prevWidths = sum(widths.slice(0, idx));

            viewport!.style.width = `${currentWidth}px`;

            wrapper!.style.transform = `translateX(-${prevWidths}px)`;
          };

          const step = () => {
            if (cancelled) return resolve();
            if (idx < slides.length - 1) {
              idx++;
              updateSlide();
              const id = window.setTimeout(step, textDuration);
              timeouts.push(id);
            } else {
              resolve();
            }
          };

          updateSlide();
          const id = window.setTimeout(step, textDuration);
          timeouts.push(id);
        });

      const cancelAllTimers = () => {
        cancelled = true;
        timeouts.forEach((id) => clearTimeout(id));
        timeouts.length = 0;
        if (rafId != null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      };

      return {
        spring: inSpring,
        from: 0,
        to: 1,

        prepare: () => {
          document.body.style.overflow = "hidden";
          element.style.opacity = "1";
          createOverlay();
          if (overlay && viewport) {
            overlay.style.clipPath = "none";
            viewport.style.transform = "scale(1)";
          }
        },

        wait: async () => {
          await slideAnimation();
          curtainPhaseEnabled = true;
        },

        tick: (progress) => {
          if (!curtainPhaseEnabled || !overlay || !viewport) return;
          const scale = 1 - progress;
          overlay.style.clipPath = getClipPath(shape, scale);
          viewport.style.transform = `scale(${scale})`;
        },

        onEnd: () => {
          cancelAllTimers();
          overlay?.remove();
          overlay = viewport = wrapper = null;
          document.body.style.overflow = originalBodyOverflow;
        },
      };
    },
  };
};
