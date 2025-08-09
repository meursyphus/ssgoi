import { component$, useSignal } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { SsgoiTransition, transition } from "@ssgoi/qwik";
import styles from "./index.module.css";

// Shape container component that maintains size
interface ShapeContainerProps {
  label: string;
}

const ShapeContainer = component$<ShapeContainerProps>(({ label }) => {
  return (
    <div class={styles.shapeContainer}>
      <div class={styles.shapeWrapper}>
        <slot />
      </div>
      <p class={styles.shapeLabel}>{label}</p>
    </div>
  );
});

const colors = [
  { id: 1, color: "#FF6B6B", name: "Coral" },
  { id: 2, color: "#4ECDC4", name: "Turquoise" },
  { id: 3, color: "#45B7D1", name: "Sky Blue" },
  { id: 4, color: "#96CEB4", name: "Sage" },
  { id: 5, color: "#FECA57", name: "Sunflower" },
  { id: 6, color: "#DDA0DD", name: "Plum" },
];

export default component$(() => {
  const showShapes = useSignal(true);
  const stiffness = useSignal(300);
  const damping = useSignal(30);

  return (
    <SsgoiTransition id="/">
      <div class={styles.appContainer}>
        <div class={styles.heroSection}>
          <h1 class={styles.appTitle}>SSGOI Qwik Demo</h1>
        </div>

        {/* Hero Transition Section */}
        <div class={styles.heroTransitionSection}>
          <h2 class={styles.sectionTitle}>Hero Transition</h2>
          <div class={styles.colorGrid}>
            {colors.map((item) => (
              <Link
                key={item.id}
                href={`/item/${item.id}`}
                class={styles.colorBox}
                style={{ backgroundColor: item.color }}
                data-hero-key={`color-${item.id}`}
              >
                <span class={styles.colorName}>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* DOM Transition Section */}
        <div class={styles.controlsSection}>
          <div class={styles.controls}>
            <div class={styles.speedButtons}>
              <button
                class={[
                  styles.speedButton,
                  stiffness.value === 100 ? styles.active : "",
                ]}
                onClick$={() => {
                  stiffness.value = 100;
                  damping.value = 20;
                }}
              >
                Smooth
              </button>
              <button
                class={[
                  styles.speedButton,
                  stiffness.value === 300 ? styles.active : "",
                ]}
                onClick$={() => {
                  stiffness.value = 300;
                  damping.value = 30;
                }}
              >
                Normal
              </button>
              <button
                class={[
                  styles.speedButton,
                  stiffness.value === 500 ? styles.active : "",
                ]}
                onClick$={() => {
                  stiffness.value = 500;
                  damping.value = 40;
                }}
              >
                Fast
              </button>
            </div>

            <div class={styles.controlGroup}>
              <label class={styles.controlLabel}>Stiffness</label>
              <input
                type="number"
                class={styles.controlInput}
                value={stiffness.value}
                onInput$={(e) =>
                  (stiffness.value = Number(
                    (e.target as HTMLInputElement).value
                  ))
                }
                min="1"
                max="1000"
              />
              <span class={styles.controlValue}>(1-1000)</span>
            </div>

            <div class={styles.controlGroup}>
              <label class={styles.controlLabel}>Damping</label>
              <input
                type="number"
                class={styles.controlInput}
                value={damping.value}
                onInput$={(e) =>
                  (damping.value = Number((e.target as HTMLInputElement).value))
                }
                min="0"
                max="100"
              />
              <span class={styles.controlValue}>(0-100)</span>
            </div>
          </div>
        </div>

        <div class={styles.toggleSection}>
          <button
            onClick$={() => (showShapes.value = !showShapes.value)}
            class={styles.toggleButton}
          >
            {showShapes.value ? "Hide Elements" : "Show Elements"}
          </button>
        </div>

        <div class={styles.examplesSection}>
          <h2 class={styles.sectionTitle}>DOM Transition</h2>
          <div class={styles.shapesGrid}>
            <ShapeContainer label="Fade">
              {showShapes.value && (
                <div
                  ref={transition({
                    key: "fade",
                    in: (element) => ({
                      spring: { stiffness: stiffness.value, damping: damping.value },
                      tick: (progress) => {
                        element.style.opacity = progress.toString();
                      },
                    }),
                    out: (element) => ({
                      spring: { stiffness: stiffness.value, damping: damping.value },
                      tick: (progress) => {
                        element.style.opacity = progress.toString();
                      },
                    }),
                  })}
                  class={`${styles.shape} ${styles.circle}`}
                />
              )}
            </ShapeContainer>

            <ShapeContainer label="Scale + Rotate">
              {showShapes.value && (
                <div
                  ref={transition<{ scale: number; rotate: number }>({
                    key: "scale-rotate",
                    in: (element) => ({
                      spring: { stiffness: stiffness.value, damping: damping.value },
                      from: { scale: 0, rotate: 0 },
                      to: { scale: 1, rotate: 360 },
                      tick: (progress) => {
                        element.style.transform = `scale(${progress.scale}) rotate(${progress.rotate}deg)`;
                        element.style.opacity = progress.scale.toString();
                      },
                    }),
                    out: (element) => ({
                      spring: { stiffness: stiffness.value, damping: damping.value },
                      from: { scale: 1, rotate: 360 },
                      to: { scale: 0, rotate: 0 },
                      tick: (progress) => {
                        element.style.transform = `scale(${progress.scale}) rotate(${progress.rotate}deg)`;
                        element.style.opacity = progress.scale.toString();
                      },
                    }),
                  })}
                  class={`${styles.shape} ${styles.triangle}`}
                />
              )}
            </ShapeContainer>

            <ShapeContainer label="Slide In">
              {showShapes.value && (
                <div
                  ref={transition({
                    key: "slide",
                    in: (element) => ({
                      spring: { stiffness: stiffness.value, damping: damping.value },
                      tick: (progress) => {
                        element.style.transform = `translateX(${
                          (1 - progress) * -100
                        }px)`;
                        element.style.opacity = progress.toString();
                      },
                    }),
                    out: (element) => ({
                      spring: { stiffness: stiffness.value, damping: damping.value },
                      tick: (progress) => {
                        element.style.transform = `translateX(${
                          (1 - progress) * 100
                        }px)`;
                        element.style.opacity = progress.toString();
                      },
                    }),
                  })}
                  class={`${styles.shape} ${styles.square}`}
                />
              )}
            </ShapeContainer>

            <ShapeContainer label="Blur">
              {showShapes.value && (
                <div
                  ref={transition({
                    key: "blur",
                    in: (element) => ({
                      spring: { stiffness: stiffness.value, damping: damping.value },
                      tick: (progress) => {
                        element.style.filter = `blur(${10 - progress * 10}px)`;
                        element.style.opacity = progress.toString();
                      },
                    }),
                    out: (element) => ({
                      spring: { stiffness: stiffness.value, damping: damping.value },
                      tick: (progress) => {
                        element.style.filter = `blur(${progress * 10}px)`;
                        element.style.opacity = progress.toString();
                      },
                    }),
                  })}
                  class={`${styles.shape} ${styles.hexagon}`}
                />
              )}
            </ShapeContainer>

            <ShapeContainer label="Bounce">
              {showShapes.value && (
                <div
                  ref={transition({
                    key: "bounce",
                    in: (element) => ({
                      spring: { stiffness: 200, damping: 10 },
                      tick: (progress) => {
                        const bounce = 1 + Math.sin(progress * Math.PI) * 0.3;
                        element.style.transform = `scale(${progress * bounce})`;
                      },
                    }),
                    out: (element) => ({
                      spring: { stiffness: 200, damping: 10 },
                      tick: (progress) => {
                        const bounce = 1 + Math.sin(progress * Math.PI) * 0.3;
                        element.style.transform = `scale(${progress * bounce})`;
                      },
                    }),
                  })}
                  class={`${styles.shape} ${styles.diamond}`}
                />
              )}
            </ShapeContainer>

            <ShapeContainer label="Fly">
              {showShapes.value && (
                <div
                  ref={transition<{ x: number; y: number; scale: number }>({
                    key: "fly",
                    in: (element) => ({
                      spring: { stiffness: stiffness.value * 0.8, damping: damping.value * 0.7 },
                      from: { x: -100, y: -100, scale: 0 },
                      to: { x: 0, y: 0, scale: 1 },
                      tick: (progress) => {
                        element.style.transform = `translate(${progress.x}px, ${progress.y}px) scale(${progress.scale})`;
                        element.style.opacity = progress.scale.toString();
                      },
                    }),
                    out: (element) => ({
                      spring: { stiffness: stiffness.value, damping: damping.value },
                      from: { x: 0, y: 0, scale: 1 },
                      to: { x: 100, y: -100, scale: 0 },
                      tick: (progress) => {
                        element.style.transform = `translate(${progress.x}px, ${progress.y}px) scale(${progress.scale})`;
                        element.style.opacity = progress.scale.toString();
                      },
                    }),
                  })}
                  class={`${styles.shape} ${styles.star}`}
                />
              )}
            </ShapeContainer>
          </div>
        </div>
      </div>
    </SsgoiTransition>
  );
});

export const head: DocumentHead = {
  title: "SSGOI Qwik Demo",
  meta: [
    {
      name: "description",
      content: "SSGOI Qwik demo app showcasing page transitions",
    },
  ],
};