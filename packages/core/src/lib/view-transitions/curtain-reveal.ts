import type { SggoiTransition, SpringConfig } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";

const DEFAULT_OUT_SPRING = { stiffness: 1, damping: 1 };
const DEFAULT_IN_SPRING = { stiffness: 9999, damping: 9999 };
const DEFAULT_BACKGROUND = "#000000";
const DEFAULT_SHAPE = "circle" as const;
const DEFAULT_TEXT_DURATION = 1500;

const DEFAULT_OVERLAY_STYLE = {
  position: "fixed",
  inset: "0",
  width: "100vw",
  height: "100vh",
  zIndex: "9999",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  clipPath: "none",
};

const DEFAULT_VIEWPORT_STYLE = {
  position: "relative",
  display: "inline-block",
  height: "5.5rem",
  overflow: "hidden",
};

const DEFAULT_WRAPPER_STYLE = {
  display: "flex",
  height: "100%",
  willChange: "transform",
  transition: "transform 0.8s ease",
};

const DEFAULT_SLIDE_STYLE = {
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
  /**
   * Background style.
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

export const curtainReveal = (
  options: CurtainRevealOptions,
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
    in: (element: HTMLElement) => {
      let overlay: HTMLElement | null = null;
      let viewport: HTMLElement | null = null;
      let wrapper: HTMLElement | null = null;

      // ===== Overlay 생성 =====
      const createOverlay = () => {
        overlay = document.createElement("div");
        Object.assign(overlay.style, {
          ...DEFAULT_OVERLAY_STYLE,
          background,
        });
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
          Object.assign(slide.style, {
            ...DEFAULT_SLIDE_STYLE,
            ...textStyle,
          });
          wrapper!.appendChild(slide);
        });
      };

      // ===== Slide Animation =====
      const slideAnimation = () =>
        new Promise<void>((resolve) => {
          if (!wrapper || !viewport) return resolve();
          const slides = Array.from(wrapper.children) as HTMLElement[];
          let idx = 0;

          const updateSlide = () => {
            const current = slides[idx];
            if (!current) return;
            const currentWidth = current.getBoundingClientRect().width;
            const prevWidths = slides
              .slice(0, idx)
              .reduce((sum, s) => sum + s.getBoundingClientRect().width, 0);

            viewport!.style.width = `${currentWidth}px`;
            const totalWidth = slides.reduce(
              (sum, s) => sum + s.getBoundingClientRect().width,
              0,
            );
            wrapper!.style.width = `${totalWidth}px`;
            wrapper!.style.transform = `translateX(-${prevWidths}px)`;
          };

          const loop = () => {
            if (idx < slides.length - 1) {
              idx++;
              updateSlide();
              setTimeout(loop, textDuration);
            } else {
              resolve();
            }
          };

          updateSlide();
          setTimeout(loop, textDuration);
        });

      // ===== ClipPath Shape =====
      const getClipPath = (shape: CurtainShape, scale: number) => {
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
      };

      // ===== Curtain Close =====
      const curtainCloseAnimation = () =>
        new Promise<void>((resolve) => {
          if (!overlay || !viewport) return resolve();
          let progress = 0;

          const step = () => {
            progress = Math.min(progress + 0.02, 1);
            const scale = 1 - progress;

            overlay!.style.clipPath = getClipPath(shape, scale);
            viewport!.style.transform = `scale(${scale})`;

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              overlay!.style.display = "none";
              resolve();
            }
          };
          requestAnimationFrame(step);
        });

      return {
        spring: inSpring,
        prepare: () => {
          element.style.opacity = "1";
          createOverlay();
        },
        wait: async () => {
          await slideAnimation();
          await curtainCloseAnimation();
        },
        onEnd: () => {
          if (overlay) {
            overlay.remove();
            overlay = viewport = wrapper = null;
          }
        },
      };
    },
    out: (element, context) => {
      return {
        spring: outSpring,
        prepare: (el) => {
          prepareOutgoing(el, context);
          el.style.opacity = "1";
          element.style.opacity = "0";
        },
        tick: () => {},
        onEnd: () => {},
      };
    },
  };
};
