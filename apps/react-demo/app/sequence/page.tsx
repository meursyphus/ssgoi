"use client";

import { useState } from "react";
import styles from "./page.module.css";

import { transition, withSequence, sequence } from "@ssgoi/react";
import { colors } from "../../constants";
import Link from "next/link";

export default function SequencePage() {
  const [stiffness] = useState(300);
  const [damping] = useState(30);
  const [showStaggerList, setShowStaggerList] = useState(true);
  return (
    <>
      {/* Sequence Transition Section */}
      <div className={styles.staggerSection}>
        <h2 className={styles.sectionTitle}>Sequence Transitions</h2>

        <div className={styles.toggleSection}>
          <Link href="/">
            <button className={styles.toggleButton}>Back</button>
          </Link>
          <button
            onClick={() => setShowStaggerList(!showStaggerList)}
            className={styles.toggleButton}
          >
            {showStaggerList ? "Hide List" : "Show List"}
          </button>
        </div>

        {showStaggerList && (
          <div style={{ marginTop: "2rem" }}>
            <h3 className={styles.subTitle}>Reverse Stagger</h3>
            <div
              ref={transition(
                withSequence(
                  {
                    in: (element) => ({
                      spring: { stiffness, damping },
                      tick: (progress) => {
                        element.style.opacity = progress.toString();
                        element.style.transform = `translateY(${(1 - progress) * 20}px)`;
                      },
                    }),
                    out: (element) => ({
                      spring: { stiffness, damping },
                      tick: (progress) => {
                        element.style.opacity = progress.toString();
                        element.style.transform = `translateY(${(1 - progress) * -20}px)`;
                      },
                    }),
                  },
                  sequence.basic(100), // 100ms delay between each item
                ),
              )}
              className={styles.staggerContainer}
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className={styles.staggerItem}
                  style={{
                    backgroundColor: colors[index % colors.length].color,
                  }}
                >
                  <span className={styles.staggerItemText}>
                    Item {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reverse Stagger Example */}
        {showStaggerList && (
          <div style={{ marginTop: "2rem" }}>
            <h3 className={styles.subTitle}>Reverse Stagger</h3>
            <div
              ref={transition(
                withSequence(
                  {
                    in: (element) => ({
                      spring: { stiffness, damping },
                      tick: (progress) => {
                        element.style.opacity = progress.toString();
                        element.style.transform = `scale(${0.5 + progress * 0.5})`;
                      },
                    }),
                    out: (element) => ({
                      spring: { stiffness, damping },
                      tick: (progress) => {
                        element.style.opacity = progress.toString();
                        element.style.transform = `scale(${0.5 + progress * 0.5})`;
                      },
                    }),
                  },
                  sequence.reverse(80), // Reverse order with 80ms delay
                ),
              )}
              className={styles.staggerContainer}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`reverse-${index}`}
                  className={`${styles.staggerItem} ${styles.staggerItemCircle}`}
                  style={{
                    backgroundColor: colors[(index + 2) % colors.length].color,
                  }}
                >
                  <span className={styles.staggerItemText}>{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wave Stagger Example */}
        {showStaggerList && (
          <div style={{ marginTop: "2rem" }}>
            <h3 className={styles.subTitle}>Wave Stagger</h3>
            <div
              ref={transition(
                withSequence(
                  {
                    in: (element) => ({
                      spring: { stiffness, damping },
                      tick: (progress) => {
                        element.style.opacity = progress.toString();
                        element.style.transform = `translateY(${(1 - progress) * 30}px) rotate(${progress * 360}deg)`;
                      },
                    }),
                    out: (element) => ({
                      spring: { stiffness, damping },
                      tick: (progress) => {
                        element.style.opacity = progress.toString();
                        element.style.transform = `translateY(${(1 - progress) * -30}px) rotate(${progress * -360}deg)`;
                      },
                    }),
                  },
                  sequence.wave(60, 300), // Wave pattern with 60ms base delay and 300ms amplitude
                ),
              )}
              className={styles.staggerContainer}
            >
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={`wave-${index}`}
                  className={`${styles.staggerItem} ${styles.staggerItemSmall}`}
                  style={{
                    backgroundColor: colors[(index + 4) % colors.length].color,
                  }}
                >
                  <span className={styles.staggerItemText}>{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exponential Stagger Example */}
        {showStaggerList && (
          <div style={{ marginTop: "2rem" }}>
            <h3 className={styles.subTitle}>Exponential Stagger</h3>
            <div
              ref={transition(
                withSequence(
                  {
                    in: (element) => ({
                      spring: { stiffness, damping },
                      tick: (progress) => {
                        element.style.opacity = progress.toString();
                        element.style.transform = `translateX(${(1 - progress) * -40}px) scale(${0.85 + progress * 0.15})`;
                      },
                    }),
                    out: (element) => ({
                      spring: { stiffness, damping },
                      tick: (progress) => {
                        element.style.opacity = progress.toString();
                        element.style.transform = `translateX(${(1 - progress) * 60}px) scale(${0.85 + progress * 0.15})`;
                      },
                    }),
                  },
                  sequence.exponential(70, 1.45), // Growing delay with exponential curve
                ),
              )}
              className={styles.staggerContainer}
            >
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={`expo-${index}`}
                  className={styles.staggerItem}
                  style={{
                    backgroundColor: colors[(index + 3) % colors.length].color,
                  }}
                >
                  <span className={styles.staggerItemText}>{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
