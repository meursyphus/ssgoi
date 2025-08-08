import { component$, useSignal } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { SsgoiTransition, useTransition } from "@ssgoi/qwik";
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

// Individual shape components with transitions
interface AnimatedShapeProps {
  type: 'fade' | 'scale' | 'slide' | 'rotate' | 'blur' | 'bounce';
  stiffness: number;
  damping: number;
}

const AnimatedShape = component$<AnimatedShapeProps>(({ type, stiffness, damping }) => {
  let elementRef;
  
  if (type === 'fade') {
    elementRef = useTransition({
      key: "fade",
      in: (element) => ({
        spring: { stiffness, damping },
        tick: (progress) => {
          element.style.opacity = progress.toString();
        }
      }),
      out: (element) => ({
        spring: { stiffness, damping },
        tick: (progress) => {
          element.style.opacity = (1 - progress).toString();
        }
      })
    });
  } else if (type === 'scale') {
    elementRef = useTransition({
      key: "scale",
      in: (element) => ({
        spring: { stiffness, damping },
        tick: (progress) => {
          element.style.transform = `scale(${progress})`;
        }
      }),
      out: (element) => ({
        spring: { stiffness, damping },
        tick: (progress) => {
          element.style.transform = `scale(${1 - progress})`;
        }
      })
    });
  } else if (type === 'slide') {
    elementRef = useTransition({
      key: "slide",
      in: (element) => ({
        spring: { stiffness, damping },
        tick: (progress) => {
          element.style.transform = `translateY(${100 - progress * 100}%)`;
          element.style.opacity = progress.toString();
        }
      }),
      out: (element) => ({
        spring: { stiffness, damping },
        tick: (progress) => {
          element.style.transform = `translateY(${progress * 100}%)`;
          element.style.opacity = (1 - progress).toString();
        }
      })
    });
  } else if (type === 'rotate') {
    elementRef = useTransition({
      key: "rotate",
      in: (element) => ({
        spring: { stiffness, damping },
        tick: (progress) => {
          element.style.transform = `rotate(${360 - progress * 360}deg) scale(${progress})`;
          element.style.opacity = progress.toString();
        }
      }),
      out: (element) => ({
        spring: { stiffness, damping },
        tick: (progress) => {
          element.style.transform = `rotate(${progress * 360}deg) scale(${1 - progress})`;
          element.style.opacity = (1 - progress).toString();
        }
      })
    });
  } else if (type === 'blur') {
    elementRef = useTransition({
      key: "blur",
      in: (element) => ({
        spring: { stiffness, damping },
        tick: (progress) => {
          element.style.filter = `blur(${10 - progress * 10}px)`;
          element.style.opacity = progress.toString();
        }
      }),
      out: (element) => ({
        spring: { stiffness, damping },
        tick: (progress) => {
          element.style.filter = `blur(${progress * 10}px)`;
          element.style.opacity = (1 - progress).toString();
        }
      })
    });
  } else {
    // bounce
    elementRef = useTransition({
      key: "bounce",
      in: (element) => ({
        spring: { stiffness: 200, damping: 10 },
        tick: (progress) => {
          const bounce = 1 + Math.sin(progress * Math.PI) * 0.3;
          element.style.transform = `scale(${progress * bounce})`;
        }
      }),
      out: (element) => ({
        spring: { stiffness: 200, damping: 10 },
        tick: (progress) => {
          element.style.transform = `scale(${1 - progress})`;
        }
      })
    });
  }
  
  // Map transition types to shape styles
  const shapeClass = {
    fade: styles.circle,
    scale: styles.square,
    slide: styles.triangle,
    rotate: styles.hexagon,
    blur: styles.star,
    bounce: styles.diamond
  }[type] || styles.circle;
  
  return (
    <div
      ref={elementRef}
      class={[styles.shape, shapeClass].join(' ')}
    />
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
                class={[styles.speedButton, stiffness.value === 100 ? styles.active : ""]}
                onClick$={() => {
                  stiffness.value = 100;
                  damping.value = 20;
                }}
              >
                Smooth
              </button>
              <button
                class={[styles.speedButton, stiffness.value === 300 ? styles.active : ""]}
                onClick$={() => {
                  stiffness.value = 300;
                  damping.value = 30;
                }}
              >
                Normal
              </button>
              <button
                class={[styles.speedButton, stiffness.value === 500 ? styles.active : ""]}
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
                onInput$={(e) => stiffness.value = Number((e.target as HTMLInputElement).value)}
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
                onInput$={(e) => damping.value = Number((e.target as HTMLInputElement).value)}
                min="0"
                max="100"
              />
              <span class={styles.controlValue}>(0-100)</span>
            </div>
          </div>
        </div>

        <div class={styles.toggleSection}>
          <button
            onClick$={() => showShapes.value = !showShapes.value}
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
                <AnimatedShape type="fade" stiffness={stiffness.value} damping={damping.value} />
              )}
            </ShapeContainer>

            <ShapeContainer label="Scale">
              {showShapes.value && (
                <AnimatedShape type="scale" stiffness={stiffness.value} damping={damping.value} />
              )}
            </ShapeContainer>

            <ShapeContainer label="Slide">
              {showShapes.value && (
                <AnimatedShape type="slide" stiffness={stiffness.value} damping={damping.value} />
              )}
            </ShapeContainer>
            
            <ShapeContainer label="Rotate">
              {showShapes.value && (
                <AnimatedShape type="rotate" stiffness={stiffness.value} damping={damping.value} />
              )}
            </ShapeContainer>
            
            <ShapeContainer label="Blur">
              {showShapes.value && (
                <AnimatedShape type="blur" stiffness={stiffness.value} damping={damping.value} />
              )}
            </ShapeContainer>
            
            <ShapeContainer label="Bounce">
              {showShapes.value && (
                <AnimatedShape type="bounce" stiffness={stiffness.value} damping={damping.value} />
              )}
            </ShapeContainer>

            <ShapeContainer label="Bounce Scale">
              {showShapes.value && (
                <div
                  ref={transition({
                    key: "bounce-scale",
                    in: (element) => ({
                      spring: {
                        stiffness: stiffness.value * 0.8,
                        damping: damping.value * 0.7,
                      },
                      tick: (progress) => {
                        const scale = 0.5 + progress * 0.5;
                        element.style.transform = `scale(${scale})`;
                        element.style.opacity = progress.toString();
                      },
                    }),
                    out: (element) => ({
                      spring: { stiffness: stiffness.value, damping: damping.value },
                      tick: (progress) => {
                        const scale = 0.5 + progress * 0.5;
                        element.style.transform = `scale(${scale})`;
                        element.style.opacity = progress.toString();
                      },
                    }),
                  })}
                  class={[styles.shape, styles.pentagon]}
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