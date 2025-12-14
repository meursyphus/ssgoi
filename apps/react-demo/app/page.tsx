"use client";

import { useState } from "react";
import { SsgoiTransition, transition, TransitionScope } from "@ssgoi/react";
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

  // TransitionScope demo states
  const [showScopeContainer, setShowScopeContainer] = useState(true);
  const [showLocalChild, setShowLocalChild] = useState(true);
  const [showGlobalChild, setShowGlobalChild] = useState(true);

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

        {/* TransitionScope Demo Section */}
        <div className={styles.examplesSection}>
          <h2 className={styles.sectionTitle}>TransitionScope Demo</h2>
          <p style={{ color: "#666", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            <strong>Local scope:</strong> Skip animation when
            mounting/unmounting with parent scope.
            <br />
            <strong>Global scope (default):</strong> Always run animation.
          </p>

          <div className={styles.controls} style={{ marginBottom: "1.5rem" }}>
            <button
              className={styles.toggleButton}
              onClick={() => setShowScopeContainer(!showScopeContainer)}
              style={{ marginRight: "0.5rem" }}
            >
              {showScopeContainer
                ? "Hide Scope Container"
                : "Show Scope Container"}
            </button>
            <button
              className={styles.toggleButton}
              onClick={() => setShowLocalChild(!showLocalChild)}
              style={{ marginRight: "0.5rem" }}
              disabled={!showScopeContainer}
            >
              {showLocalChild ? "Hide Local Child" : "Show Local Child"}
            </button>
            <button
              className={styles.toggleButton}
              onClick={() => setShowGlobalChild(!showGlobalChild)}
              disabled={!showScopeContainer}
            >
              {showGlobalChild ? "Hide Global Child" : "Show Global Child"}
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "2rem",
              justifyContent: "center",
              minHeight: "200px",
              alignItems: "center",
            }}
          >
            {showScopeContainer && (
              <TransitionScope>
                <div
                  style={{
                    padding: "2rem",
                    border: "2px dashed #ccc",
                    borderRadius: "12px",
                    display: "flex",
                    gap: "1.5rem",
                    background: "#fafafa",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        marginBottom: "0.5rem",
                        fontWeight: 600,
                        color: "#333",
                      }}
                    >
                      Local Scope
                    </p>
                    {showLocalChild && (
                      <div
                        ref={transition({
                          scope: "local",
                          in: (element) => ({
                            spring: { stiffness: 300, damping: 25 },
                            css: (progress) => ({
                              opacity: progress,
                              transform: `scale(${0.5 + progress * 0.5})`,
                            }),
                          }),
                          out: (element) => ({
                            spring: { stiffness: 300, damping: 25 },
                            css: (progress) => ({
                              opacity: progress,
                              transform: `scale(${0.5 + progress * 0.5})`,
                            }),
                          }),
                        })}
                        style={{
                          width: "80px",
                          height: "80px",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          borderRadius: "12px",
                        }}
                      />
                    )}
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#888",
                        marginTop: "0.5rem",
                      }}
                    >
                      Skips when scope unmounts
                    </p>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        marginBottom: "0.5rem",
                        fontWeight: 600,
                        color: "#333",
                      }}
                    >
                      Global Scope
                    </p>
                    {showGlobalChild && (
                      <div
                        ref={transition({
                          // scope: "global" is default
                          in: (element) => ({
                            spring: { stiffness: 300, damping: 25 },
                            css: (progress) => ({
                              opacity: progress,
                              transform: `scale(${0.5 + progress * 0.5})`,
                            }),
                          }),
                          out: (element) => ({
                            spring: { stiffness: 300, damping: 25 },
                            css: (progress) => ({
                              opacity: progress,
                              transform: `scale(${0.5 + progress * 0.5})`,
                            }),
                          }),
                        })}
                        style={{
                          width: "80px",
                          height: "80px",
                          background:
                            "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                          borderRadius: "12px",
                        }}
                      />
                    )}
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#888",
                        marginTop: "0.5rem",
                      }}
                    >
                      Always animates
                    </p>
                  </div>
                </div>
              </TransitionScope>
            )}
          </div>

          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              background: "#f0f0f0",
              borderRadius: "8px",
              fontSize: "0.9rem",
              color: "#555",
            }}
          >
            <strong>Test scenarios:</strong>
            <ul style={{ margin: "0.5rem 0 0 1.5rem", lineHeight: 1.8 }}>
              <li>
                <strong>Toggle individual children:</strong> Both should animate
                (scope is stable)
              </li>
              <li>
                <strong>Toggle Scope Container:</strong> Local child should NOT
                animate, Global child should animate
              </li>
            </ul>
          </div>
        </div>
      </div>
    </SsgoiTransition>
  );
}
