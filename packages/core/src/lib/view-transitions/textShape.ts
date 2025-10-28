import type { SggoiTransition, SpringConfig } from "../types";

interface TextShapeOptions {
  bgColor?: string;
  texts?: string[];
  shape?: "circle" | "square" | "triangle";
  spring?: Partial<SpringConfig>;
  textDuration?: number;
  textStyle?: Partial<CSSStyleDeclaration>;
}

export const textShape = ({
  bgColor = "#000000",
  texts = [],
  textDuration = 1500,
  shape = "circle",
  spring: springOptions = {},
  textStyle = {},
}: TextShapeOptions): SggoiTransition => {
  const spring: SpringConfig = {
    stiffness: springOptions?.stiffness ?? 70,
    damping: springOptions?.damping ?? 30,
  };

  return {
    out: async (element) => ({
      spring,
      from: 1,
      to: 0,
      tick: (p) => {
        element.style.opacity = String(p);
      },
      onEnd: () => {
        element.style.opacity = "1";
      },
    }),

    in: async (element) => {
      // ===== Overlay Layer =====
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.inset = "0";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.background = bgColor;
      overlay.style.zIndex = "9999";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.overflow = "hidden";
      overlay.style.clipPath = "none";
      document.body.appendChild(overlay);

      // ===== Viewport (only shows the current text) =====
      const viewport = document.createElement("div");
      viewport.style.position = "relative";
      viewport.style.display = "inline-block";
      viewport.style.height = "5.5rem";
      viewport.style.overflow = "hidden";
      overlay.appendChild(viewport);

      // ===== Wrapper =====
      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.height = "100%";
      wrapper.style.willChange = "transform";
      wrapper.style.transition = "transform 0.8s ease";
      viewport.appendChild(wrapper);

      // ===== Slides (text items) =====
      const slides: HTMLDivElement[] = [];
      texts.forEach((t) => {
        const slide = document.createElement("div");
        slide.textContent = t;
        // text basic style
        slide.style.display = "inline-flex";
        slide.style.alignItems = "center";
        slide.style.justifyContent = "center";
        slide.style.whiteSpace = "nowrap";
        slide.style.fontSize = "5.5rem";
        slide.style.fontWeight = "900";
        slide.style.letterSpacing = "0.02em";
        slide.style.color = "#FFFFFF";

        //custom style override
        Object.assign(slide.style, textStyle);

        wrapper.appendChild(slide);
        slides.push(slide);
      });

      // ===== Slide transition logic =====
      let idx = 0;

      const updateSlide = () => {
        const current = slides[idx];
        if (!current) return;

        const currentWidth = current.getBoundingClientRect().width;

        // === Sum of all previous slides width ===
        const prevWidths = slides
          .slice(0, idx)
          .reduce((sum, slide) => sum + slide.getBoundingClientRect().width, 0);

        // Match viewport width with current slide width
        viewport.style.width = `${currentWidth}px`;

        // Wrapper total width = sum of all slides width
        const totalWidth = slides.reduce(
          (sum, slide) => sum + slide.getBoundingClientRect().width,
          0,
        );
        wrapper.style.width = `${totalWidth}px`;

        // Shift wrapper to show only the current slide
        wrapper.style.transform = `translateX(-${prevWidths}px)`;
      };

      const showNext = () => {
        if (idx < slides.length - 1) {
          idx++;
          updateSlide();
          setTimeout(showNext, textDuration);
        } else {
          // After the last text, start closing the shape
          startShapeClose();
        }
      };

      const startShapeClose = () => {
        let progress = 0;
        const step = () => {
          progress += 0.02; // Speed control
          const scale = 1 - progress;

          switch (shape) {
            case "circle":
              overlay.style.clipPath = `circle(${scale * 100}% at 50% 50%)`;
              break;
            case "square":
              overlay.style.clipPath = `inset(${(1 - scale) * 50}% round ${
                10 * scale
              }%)`;
              break;
            case "triangle": {
              const p = scale * 100;
              overlay.style.clipPath = `polygon(50% ${50 - p}%, ${
                50 - p
              }% ${50 + p}%, ${50 + p}% ${50 + p}%)`;
              break;
            }
            default:
              overlay.style.clipPath = `circle(${scale * 100}% at 50% 50%)`;
          }

          viewport.style.transform = `scale(${scale})`;

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            overlay.remove();
            element.style.opacity = "1";
          }
        };
        requestAnimationFrame(step);
      };

      // Initialize & start
      updateSlide();
      setTimeout(showNext, textDuration);

      return {
        spring,
        from: 0,
        to: 1,
        prepare: () => {
          element.style.opacity = "1";
        },
      };
    },
  };
};
