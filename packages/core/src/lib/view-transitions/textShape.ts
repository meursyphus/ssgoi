import type { SggoiTransition, SpringConfig } from "../types";

type HexColor = `#${string}`;

interface TextShapeOptions {
  bgColor?: HexColor;
  textColor?: HexColor;
  texts?: string[];
  shape?: "circle" | "square" | "triangle";
  spring?: Partial<SpringConfig>;
  textDuration?: number;
}

export const textShape = ({
  bgColor = "#000000",
  textColor = "#FFFFFF",
  texts = [],
  textDuration = 1500,
  shape = "circle",
  spring: springOptions = {},
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
      // ===== Overlay =====
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.inset = "0";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.backgroundColor = bgColor;
      overlay.style.zIndex = "9999";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.overflow = "hidden";
      overlay.style.clipPath = "none";
      document.body.appendChild(overlay);

      // ===== Viewport (항상 현재 텍스트만 보이게) =====
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

      // ===== Slides =====
      const slides: HTMLDivElement[] = [];
      texts.forEach((t) => {
        const slide = document.createElement("div");
        slide.textContent = t;
        slide.style.display = "inline-flex";
        slide.style.alignItems = "center";
        slide.style.justifyContent = "center";
        slide.style.whiteSpace = "nowrap";
        slide.style.fontSize = "4rem";
        slide.style.fontWeight = "900";
        slide.style.letterSpacing = "0.02em";
        slide.style.color = textColor;
        wrapper.appendChild(slide);
        slides.push(slide);
      });

      // ===== 슬라이드 전환 로직 =====
      let idx = 0;

      const updateSlide = () => {
        console.log("TEST UPDATE SLIDE", idx);

        const current = slides[idx];
        if (!current) return;

        // 현재 텍스트 width
        const currentWidth = current.getBoundingClientRect().width;

        // === 핵심: 이전 슬라이드들의 width 합산 ===
        const prevWidths = slides
          .slice(0, idx)
          .reduce((sum, slide) => sum + slide.getBoundingClientRect().width, 0);

        console.log(
          "TEST currentWidth",
          currentWidth,
          "prevWidths",
          prevWidths,
        );

        // viewport는 현재 슬라이드의 width로 맞춤
        viewport.style.width = `${currentWidth}px`;

        // wrapper 총 width는 모든 슬라이드 합으로 맞춤
        const totalWidth = slides.reduce(
          (sum, slide) => sum + slide.getBoundingClientRect().width,
          0,
        );
        wrapper.style.width = `${totalWidth}px`;

        // wrapper 이동: 이전 요소들의 총합
        wrapper.style.transform = `translateX(-${prevWidths}px)`;
      };

      const showNext = () => {
        if (idx < slides.length - 1) {
          idx++;
          updateSlide();
          setTimeout(showNext, textDuration);
        } else {
          // 마지막 텍스트 후 shape 축소 시작
          startShapeClose();
        }
      };

      const startShapeClose = () => {
        let progress = 0;
        const step = () => {
          progress += 0.02; // 속도 조절 가능
          const scale = 1 - progress;

          if (shape === "circle") {
            overlay.style.clipPath = `circle(${scale * 100}% at 50% 50%)`;
          } else if (shape === "square") {
            overlay.style.clipPath = `inset(${(1 - scale) * 50}% round ${
              10 * scale
            }%)`;
          } else {
            const p = scale * 100;
            overlay.style.clipPath = `polygon(50% ${50 - p}%, ${
              50 - p
            }% ${50 + p}%, ${50 + p}% ${50 + p}%)`;
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

      // 초기화 + 시작
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
