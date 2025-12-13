import { createSignal } from "solid-js";
import { A } from "@solidjs/router";
import { SsgoiTransition, transition } from "@ssgoi/solid";
import "./index.css";

const colors = [
  { id: 1, color: "#FF6B6B", name: "Coral" },
  { id: 2, color: "#4ECDC4", name: "Turquoise" },
  { id: 3, color: "#45B7D1", name: "Sky Blue" },
  { id: 4, color: "#96CEB4", name: "Sage" },
  { id: 5, color: "#FECA57", name: "Sunflower" },
  { id: 6, color: "#DDA0DD", name: "Plum" },
];

export default function Home() {
  const [showShapes, setShowShapes] = createSignal(true);
  const [stiffness, setStiffness] = createSignal(300);
  const [damping, setDamping] = createSignal(30);

  return (
    <SsgoiTransition id="/">
      <div class="app-container">
        <div class="hero-section">
          <h1 class="app-title">SSGOI Solid Demo</h1>
        </div>

        {/* Hero Transition Section */}
        <div class="hero-transition-section">
          <h2 class="section-title">Hero Transition</h2>
          <div class="color-grid">
            {colors.map((item) => (
              <A
                href={`/item/${item.id}`}
                class="color-box"
                style={{ "background-color": item.color }}
                data-hero-key={`color-${item.id}`}
              >
                <span class="color-name">{item.name}</span>
              </A>
            ))}
          </div>
        </div>

        {/* DOM Transition Section */}
        <div class="controls-section">
          <div class="controls">
            <div class="speed-buttons">
              <button
                class={`speed-button ${stiffness() === 100 ? "active" : ""}`}
                onClick={() => {
                  setStiffness(100);
                  setDamping(20);
                }}
              >
                Smooth
              </button>
              <button
                class={`speed-button ${stiffness() === 300 ? "active" : ""}`}
                onClick={() => {
                  setStiffness(300);
                  setDamping(30);
                }}
              >
                Normal
              </button>
              <button
                class={`speed-button ${stiffness() === 500 ? "active" : ""}`}
                onClick={() => {
                  setStiffness(500);
                  setDamping(40);
                }}
              >
                Fast
              </button>
            </div>

            <div class="control-group">
              <label class="control-label">Stiffness</label>
              <input
                type="number"
                class="control-input"
                value={stiffness()}
                onInput={(e) => setStiffness(Number(e.currentTarget.value))}
                min="1"
                max="1000"
              />
              <span class="control-value">(1-1000)</span>
            </div>

            <div class="control-group">
              <label class="control-label">Damping</label>
              <input
                type="number"
                class="control-input"
                value={damping()}
                onInput={(e) => setDamping(Number(e.currentTarget.value))}
                min="0"
                max="100"
              />
              <span class="control-value">(0-100)</span>
            </div>
          </div>
        </div>

        <div class="toggle-section">
          <button
            onClick={() => setShowShapes(!showShapes())}
            class="toggle-button"
          >
            {showShapes() ? "Hide Elements" : "Show Elements"}
          </button>
        </div>

        <div class="examples-section">
          <h2 class="section-title">DOM Transition</h2>
          <div class="shapes-grid">
            {/* Fade */}
            <div class="shape-container">
              <div class="shape-wrapper">
                {showShapes() && (
                  <div
                    ref={transition({
                      key: "fade",
                      in: (element) => ({
                        spring: { stiffness: stiffness(), damping: damping() },
                        tick: (progress) => {
                          element.style.opacity = progress.toString();
                        },
                      }),
                      out: (element) => ({
                        spring: { stiffness: stiffness(), damping: damping() },
                        tick: (progress) => {
                          element.style.opacity = progress.toString();
                        },
                      }),
                    })}
                    class="shape circle"
                  />
                )}
              </div>
              <p class="shape-label">Fade</p>
            </div>

            {/* Scale + Rotate */}
            <div class="shape-container">
              <div class="shape-wrapper">
                {showShapes() && (
                  <div
                    ref={transition({
                      key: "scale-rotate",
                      in: (element) => ({
                        spring: { stiffness: stiffness(), damping: damping() },
                        css: (progress) => ({
                          transform: `scale(${progress}) rotate(${progress * 360}deg)`,
                          opacity: progress.toString(),
                        }),
                      }),
                      out: (element) => ({
                        spring: { stiffness: stiffness(), damping: damping() },
                        css: (progress) => ({
                          transform: `scale(${progress}) rotate(${progress * 360}deg)`,
                          opacity: progress.toString(),
                        }),
                      }),
                    })}
                    class="shape triangle"
                  />
                )}
              </div>
              <p class="shape-label">Scale + Rotate</p>
            </div>

            {/* Slide In */}
            <div class="shape-container">
              <div class="shape-wrapper">
                {showShapes() && (
                  <div
                    ref={transition({
                      key: "slide-in",
                      in: (element) => ({
                        spring: { stiffness: stiffness(), damping: damping() },
                        css: (progress) => ({
                          transform: `translateX(${(1 - progress) * -100}px)`,
                          opacity: progress.toString(),
                        }),
                      }),
                      out: (element) => ({
                        spring: { stiffness: stiffness(), damping: damping() },
                        css: (progress) => ({
                          transform: `translateX(${(1 - progress) * -100}px)`,
                          opacity: progress.toString(),
                        }),
                      }),
                    })}
                    class="shape square"
                  />
                )}
              </div>
              <p class="shape-label">Slide In</p>
            </div>

            {/* Bounce Scale */}
            <div class="shape-container">
              <div class="shape-wrapper">
                {showShapes() && (
                  <div
                    ref={transition({
                      key: "bounce-scale",
                      in: (element) => ({
                        spring: {
                          stiffness: stiffness() * 0.8,
                          damping: damping() * 0.7,
                        },
                        tick: (progress) => {
                          const scale = 0.5 + progress * 0.5;
                          element.style.transform = `scale(${scale})`;
                          element.style.opacity = progress.toString();
                        },
                      }),
                      out: (element) => ({
                        spring: { stiffness: stiffness(), damping: damping() },
                        tick: (progress) => {
                          const scale = 0.5 + progress * 0.5;
                          element.style.transform = `scale(${scale})`;
                          element.style.opacity = progress.toString();
                        },
                      }),
                    })}
                    class="shape pentagon"
                  />
                )}
              </div>
              <p class="shape-label">Bounce Scale</p>
            </div>
          </div>
        </div>
      </div>
    </SsgoiTransition>
  );
}
