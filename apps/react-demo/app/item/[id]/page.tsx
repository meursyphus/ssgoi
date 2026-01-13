import { SsgoiTransition } from "@ssgoi/react";
import { BackButton } from "../../components/BackButton";
import styles from "./page.module.css";

const colors = [
  { id: 1, color: "#FF6B6B", name: "Coral" },
  { id: 2, color: "#4ECDC4", name: "Turquoise" },
  { id: 3, color: "#45B7D1", name: "Sky Blue" },
  { id: 4, color: "#96CEB4", name: "Sage" },
  { id: 5, color: "#FECA57", name: "Sunflower" },
  { id: 6, color: "#DDA0DD", name: "Plum" },
];

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = await params;
  const id = Number(resolved.id);
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
        <BackButton className={styles.backButton} />

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
