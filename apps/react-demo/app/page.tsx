"use client";

import { useState } from "react";
import { SsgoiTransition, transition } from "@ssgoi/react";
import Link from "next/link";
import styles from "./page.module.css";

// Shape container component that maintains size
interface ShapeContainerProps {
  label: string;
  children: React.ReactNode;
}

function ShapeContainer({ label, children }: ShapeContainerProps) {
  return (
    <div className={styles.shapeContainer}>
      <div className={styles.shapeWrapper}>{children}</div>
      <p className={styles.shapeLabel}>{label}</p>
    </div>
  );
}

const colors = [
  { id: 1, color: "#FF6B6B", name: "Coral" },
  { id: 2, color: "#4ECDC4", name: "Turquoise" },
  { id: 3, color: "#45B7D1", name: "Sky Blue" },
  { id: 4, color: "#96CEB4", name: "Sage" },
  { id: 5, color: "#FECA57", name: "Sunflower" },
  { id: 6, color: "#DDA0DD", name: "Plum" },
];

export default function Home() {
  const [showShapes, setShowShapes] = useState(true);
  const [stiffness, setStiffness] = useState(300);
  const [damping, setDamping] = useState(30);

  return (
    <SsgoiTransition id="/">
      <div className={styles.appContainer}>
        <div className={styles.heroSection}>
          <h1 className={styles.appTitle}>SSGOI React Demo</h1>
        </div>

        {/* Hero Transition Section */}
        <div className={styles.heroTransitionSection}>
          <h2 className={styles.sectionTitle}>Hero Transition</h2>
          <div className={styles.colorGrid}>
            {colors.map((item) => (
              <Link
                key={item.id}
                href={`/item/${item.id}`}
                className={styles.colorBox}
                style={{ backgroundColor: item.color }}
                data-hero-key={`color-${item.id}`}
              >
                <span className={styles.colorName}>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Hero Rotate Demo */}
          <div style={{ marginTop: "2rem" }}>
            <h3
              style={{
                fontSize: "1.5rem",
                marginBottom: "1rem",
                color: "#333",
              }}
            >
              Jaemin Transition
            </h3>
            <Link
              href="/jaemin"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "1rem 2rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "1.1rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              🔥 Demo Tunnel Emergence Animation
            </Link>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <h3
              style={{
                fontSize: "1.5rem",
                marginBottom: "1rem",
                color: "#333",
              }}
            >
              Curtain Reveal Transition
            </h3>
            <Link
              href="/curtain-reveal"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
                color: "white",
                padding: "1rem 2rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "1.1rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              🎨 Demo Curtain Reveal Transition
            </Link>
          </div>
        </div>

        {/* DOM Transition Section */}
        <div className={styles.controlsSection}>
          <div className={styles.controls}>
            <div className={styles.speedButtons}>
              <button
                className={`${styles.speedButton} ${stiffness === 100 ? styles.active : ""}`}
                onClick={() => {
                  setStiffness(100);
                  setDamping(20);
                }}
              >
                Smooth
              </button>
              <button
                className={`${styles.speedButton} ${stiffness === 300 ? styles.active : ""}`}
                onClick={() => {
                  setStiffness(300);
                  setDamping(30);
                }}
              >
                Normal
              </button>
              <button
                className={`${styles.speedButton} ${stiffness === 500 ? styles.active : ""}`}
                onClick={() => {
                  setStiffness(500);
                  setDamping(40);
                }}
              >
                Fast
              </button>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Stiffness</label>
              <input
                type="number"
                className={styles.controlInput}
                value={stiffness}
                onChange={(e) => setStiffness(Number(e.target.value))}
                min="1"
                max="1000"
              />
              <span className={styles.controlValue}>(1-1000)</span>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Damping</label>
              <input
                type="number"
                className={styles.controlInput}
                value={damping}
                onChange={(e) => setDamping(Number(e.target.value))}
                min="0"
                max="100"
              />
              <span className={styles.controlValue}>(0-100)</span>
            </div>
          </div>
        </div>

        <div className={styles.toggleSection}>
          <button
            onClick={() => setShowShapes(!showShapes)}
            className={styles.toggleButton}
          >
            {showShapes ? "Hide Elements" : "Show Elements"}
          </button>
        </div>

        <div className={styles.examplesSection}>
          <h2 className={styles.sectionTitle}>DOM Transition</h2>
          <div className={styles.shapesGrid}>
            <ShapeContainer label="Fade">
              {showShapes && (
                <div
                  ref={transition({
                    key: "fade",
                    in: (element) => ({
                      spring: { stiffness, damping },
                      tick: (progress) => {
                        element.style.opacity = progress.toString();
                      },
                    }),
                    out: (element) => ({
                      spring: { stiffness, damping },
                      tick: (progress) => {
                        element.style.opacity = progress.toString();
                      },
                    }),
                  })}
                  className={`${styles.shape} ${styles.circle}`}
                />
              )}
            </ShapeContainer>

            <ShapeContainer label="Scale + Rotate">
              {showShapes && (
                <div
                  ref={transition({
                    key: "scale-rotate",
                    in: (element) => ({
                      spring: { stiffness, damping },

                      css: (progress) => ({
                        transform: `scale(${progress}) rotate(${progress * 360}deg)`,
                        opacity: progress.toString(),
                      }),
                    }),
                    out: (element) => ({
                      spring: { stiffness, damping },
                      css: (progress) => ({
                        transform: `scale(${progress}) rotate(${progress * 360}deg)`,
                        opacity: progress.toString(),
                      }),
                    }),
                  })}
                  className={`${styles.shape} ${styles.triangle}`}
                />
              )}
            </ShapeContainer>

            <ShapeContainer label="Slide In">
              {showShapes && (
                <div
                  ref={transition({
                    key: "slide-in",
                    in: (element) => ({
                      spring: { stiffness, damping },
                      css: (progress) => ({
                        transform: `translateX(${(1 - progress) * -100}px)`,
                        opacity: progress.toString(),
                      }),
                    }),
                    out: (element) => ({
                      spring: { stiffness, damping },
                      css: (progress) => ({
                        transform: `translateX(${(1 - progress) * -100}px)`,
                        opacity: progress.toString(),
                      }),
                    }),
                  })}
                  className={`${styles.shape} ${styles.square}`}
                />
              )}
            </ShapeContainer>

            <ShapeContainer label="Bounce Scale">
              {showShapes && (
                <div
                  ref={transition({
                    key: "bounce-scale",
                    in: (element) => ({
                      spring: {
                        stiffness: stiffness * 0.8,
                        damping: damping * 0.7,
                      },
                      tick: (progress) => {
                        const scale = 0.5 + progress * 0.5;
                        element.style.transform = `scale(${scale})`;
                        element.style.opacity = progress.toString();
                      },
                    }),
                    out: (element) => ({
                      spring: { stiffness, damping },
                      tick: (progress) => {
                        const scale = 0.5 + progress * 0.5;
                        element.style.transform = `scale(${scale})`;
                        element.style.opacity = progress.toString();
                      },
                    }),
                  })}
                  className={`${styles.shape} ${styles.pentagon}`}
                />
              )}
            </ShapeContainer>
          </div>
        </div>
      </div>
    </SsgoiTransition>
  );
}
