import { component$ } from "@builder.io/qwik";
import { Link, useLocation, type DocumentHead } from "@builder.io/qwik-city";
import { SsgoiTransition } from "@ssgoi/qwik";
import styles from "./index.module.css";

const colors = [
  { id: 1, color: "#FF6B6B", name: "Coral" },
  { id: 2, color: "#4ECDC4", name: "Turquoise" },
  { id: 3, color: "#45B7D1", name: "Sky Blue" },
  { id: 4, color: "#96CEB4", name: "Sage" },
  { id: 5, color: "#FECA57", name: "Sunflower" },
  { id: 6, color: "#DDA0DD", name: "Plum" },
];

export default component$(() => {
  const location = useLocation();
  const id = Number(location.params.id);
  const item = colors.find((c) => c.id === id);

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <SsgoiTransition id={`/item/${id}`}>
      <div
        class={styles.detailContainer}
        style={{ backgroundColor: item.color }}
        data-hero-key={`color-${item.id}`}
      >
        <Link href="/" class={styles.backButton}>
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
          Back
        </Link>

        <div class={styles.content}>
          <div
            class={styles.colorDisplay}
            style={{ backgroundColor: item.color }}
          />
          <h1 class={styles.colorTitle}>{item.name}</h1>
          <p class={styles.colorValue}>{item.color}</p>

          <div class={styles.colorInfo}>
            <div class={styles.infoCard}>
              <div class={styles.infoLabel}>RGB</div>
              <div class={styles.infoValue}>
                {parseInt(item.color.slice(1, 3), 16)},
                {parseInt(item.color.slice(3, 5), 16)},
                {parseInt(item.color.slice(5, 7), 16)}
              </div>
            </div>
            <div class={styles.infoCard}>
              <div class={styles.infoLabel}>HSL</div>
              <div class={styles.infoValue}>Coming soon</div>
            </div>
          </div>
        </div>
      </div>
    </SsgoiTransition>
  );
});

export const head: DocumentHead = {
  title: "Color Detail - SSGOI Qwik Demo",
  meta: [
    {
      name: "description",
      content: "Color detail page with hero transitions",
    },
  ],
};