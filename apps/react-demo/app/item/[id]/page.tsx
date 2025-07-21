"use client";

import { SsgoiTransition } from "@ssgoi/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./page.module.css";

const colors = [
  { id: 1, color: "#FF6B6B", name: "Red" },
  { id: 2, color: "#4ECDC4", name: "Teal" },
  { id: 3, color: "#45B7D1", name: "Blue" },
  { id: 4, color: "#96CEB4", name: "Green" },
  { id: 5, color: "#FECA57", name: "Yellow" },
  { id: 6, color: "#DDA0DD", name: "Plum" },
];

export default function ItemDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const item = colors.find((c) => c.id === id);

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <SsgoiTransition id={`/item/${id}`}>
      <div 
        className={styles.container}
        style={{ backgroundColor: item.color }}
        data-hero-key={`color-${item.id}`}
      >
        <Link href="/" className={styles.backButton}>
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </Link>
        
        <div className={styles.content}>
          <h1 className={styles.title}>{item.name}</h1>
          <p className={styles.colorValue}>{item.color}</p>
        </div>
      </div>
    </SsgoiTransition>
  );
}