import type { SggoiTransition, SpringConfig } from "../types";

interface TextShapeOptions {
  color?: string;
  texts?: string[];
  textDuration?: number;
  shape?: "circle" | "square" | "triangle";
  spring?: Partial<SpringConfig>;
}

export const textShape = (options: TextShapeOptions = {}): SggoiTransition => {
  const color = options.color ?? "#000000";
  const texts = options.texts ?? ["Hello", "World"];
  const textDuration = options.textDuration ?? 1500;
  const shape = options.shape ?? "circle";
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? 70,
    damping: options.spring?.damping ?? 30,
  };

  return {
    out: async (element) => ({
      spring,
      from: 1,
      to: 0,
      tick: (progress) => {
        element.style.opacity = String(progress);
      },
      onEnd: () => {
        element.style.opacity = "1";
      },
    }),

    in: async (element) => {
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.backgroundColor = color;
      overlay.style.zIndex = "9999";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.overflow = "hidden";
      overlay.style.clipPath = "none";
      document.body.appendChild(overlay);

      const container = document.createElement("div");
      container.style.position = "relative";
      container.style.width = "100%";
      container.style.height = "3rem";
      container.style.display = "flex";
      container.style.alignItems = "center";
      container.style.justifyContent = "center";
      container.style.overflow = "hidden";
      overlay.appendChild(container);

      const textEls: HTMLSpanElement[] = texts.map((t, i) => {
        const span = document.createElement("span");
        span.textContent = t;
        span.style.position = "absolute";
        span.style.fontSize = "2rem";
        span.style.color = "#fff";
        span.style.whiteSpace = "nowrap";
        span.style.transition = "transform 0.8s ease";
        span.style.transform = i === 0 ? "translateX(0%)" : "translateX(100%)";
        container.appendChild(span);
        return span;
      });

      let idx = 0;
      const showNext = () => {
        if (idx < textEls.length - 1) {
          const current = textEls[idx]!;
          const next = textEls[idx + 1]!;

          next.style.transform = "translateX(100%)";

          requestAnimationFrame(() => {
            current.style.transform = "translateX(-100%)";
            next.style.transform = "translateX(0%)";
          });

          idx++;
          setTimeout(showNext, textDuration);
        }
      };

      setTimeout(showNext, textDuration);

      return {
        spring,
        from: 0,
        to: 1,
        prepare: () => {
          element.style.opacity = "1";
        },
        tick: (progress) => {
          if (
            progress >= 0.7 &&
            textEls.length > 0 &&
            idx >= texts.length - 1
          ) {
            const scale = 1 - (progress - 0.7) / 0.3;

            if (shape === "circle") {
              overlay.style.clipPath = `circle(${scale * 100}% at 50% 50%)`;
            } else if (shape === "square") {
              overlay.style.clipPath = `inset(${(1 - scale) * 50}% round ${10 * scale}%)`;
            } else {
              const p = scale * 100;
              overlay.style.clipPath = `polygon(50% ${50 - p}%, ${50 - p}% ${50 + p}%, ${50 + p}% ${50 + p}%)`;
            }

            container.style.transform = `scale(${scale})`;
          }
        },
        onEnd: () => {
          overlay.remove();
          element.style.opacity = "1";
        },
      };
    },
  };
};
