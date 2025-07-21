"use client";

import { SsgoiTransition } from "@ssgoi/react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";

const colors = [
  { id: 1, color: "#FF6B6B", name: "Coral" },
  { id: 2, color: "#4ECDC4", name: "Turquoise" },
  { id: 3, color: "#45B7D1", name: "Sky Blue" },
  { id: 4, color: "#96CEB4", name: "Sage" },
  { id: 5, color: "#FECA57", name: "Sunflower" },
  { id: 6, color: "#DDA0DD", name: "Plum" },
];

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const item = colors.find((c) => c.id === id);

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <SsgoiTransition id={`/item/${id}`}>
      <div
        className={styles.detailContainer}
        style={{ backgroundColor: item.color }}
        data-hero-key={`color-${item.id}`}
      >
        <button onClick={() => router.back()} className={styles.backButton}>
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>

        <div className={styles.content}>
          <div
            className={styles.colorDisplay}
            style={{ backgroundColor: item.color }}
          />
          <h1 className={styles.colorTitle}>{item.name}</h1>
          <p className={styles.colorValue}>{item.color}</p>

          <div className={styles.colorInfo}>
            <div className={styles.infoCard}>
              <div className={styles.infoLabel}>RGB</div>
              <div className={styles.infoValue}>
                {parseInt(item.color.slice(1, 3), 16)},
                {parseInt(item.color.slice(3, 5), 16)},
                {parseInt(item.color.slice(5, 7), 16)}
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoLabel}>HSL</div>
              <div className={styles.infoValue}>Coming soon</div>
            </div>
          </div>
        </div>
      </div>
    </SsgoiTransition>
  );
}
