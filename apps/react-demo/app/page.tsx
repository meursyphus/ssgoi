"use client";

import { SsgoiTransition, transition } from "@ssgoi/react";
import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

const colors = [
  { id: 1, color: "#FF6B6B", name: "Red" },
  { id: 2, color: "#4ECDC4", name: "Teal" },
  { id: 3, color: "#45B7D1", name: "Blue" },
  { id: 4, color: "#96CEB4", name: "Green" },
  { id: 5, color: "#FECA57", name: "Yellow" },
  { id: 6, color: "#DDA0DD", name: "Plum" },
];

export default function Home() {
  const [showElement, setShowElement] = useState(false);

  return (
    <SsgoiTransition id="/">
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>SSGOI Demo</h1>
          <p className={styles.subtitle}>Spring transitions with state memory</p>
        </header>

        <section className={styles.transitionDemo}>
          <h2 className={styles.sectionTitle}>DOM Transition</h2>
          <div className={styles.buttonGroup}>
            <button
              onClick={() => setShowElement(true)}
              className={styles.button}
            >
              Show Element
            </button>
            <button
              onClick={() => setShowElement(false)}
              className={styles.button}
            >
              Hide Element
            </button>
          </div>
          
          {showElement && (
            <div
              {...transition({
                translate: { from: "0 -20px", to: "0 0" },
                opacity: { from: 0, to: 1 },
                scale: { from: 0.8, to: 1 },
              })}
              className={styles.animatedBox}
            >
              <div className={styles.shape} />
              <div className={styles.shape} />
              <div className={styles.shape} />
            </div>
          )}
        </section>

        <section className={styles.heroDemo}>
          <h2 className={styles.sectionTitle}>Hero View Transition</h2>
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
        </section>
      </div>
    </SsgoiTransition>
  );
}
