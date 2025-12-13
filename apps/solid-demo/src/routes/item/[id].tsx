import { useParams, A } from "@solidjs/router";
import { SsgoiTransition } from "@ssgoi/solid";
import "./[id].css";

const colors = [
  { id: 1, color: "#FF6B6B", name: "Coral" },
  { id: 2, color: "#4ECDC4", name: "Turquoise" },
  { id: 3, color: "#45B7D1", name: "Sky Blue" },
  { id: 4, color: "#96CEB4", name: "Sage" },
  { id: 5, color: "#FECA57", name: "Sunflower" },
  { id: 6, color: "#DDA0DD", name: "Plum" },
];

export default function ItemDetail() {
  const params = useParams();
  const id = () => Number(params.id);
  const item = () => colors.find((c) => c.id === id());

  return (
    <SsgoiTransition id={`/item/${id()}`}>
      {item() ? (
        <div
          class="detail-container"
          style={{ "background-color": item()!.color }}
          data-hero-key={`color-${item()!.id}`}
        >
          <A href="/" class="back-button">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clip-rule="evenodd"
              />
            </svg>
            Back
          </A>

          <div class="content">
            <div
              class="color-display"
              style={{ "background-color": item()!.color }}
            />
            <h1 class="color-title">{item()!.name}</h1>
            <p class="color-value">{item()!.color}</p>

            <div class="color-info">
              <div class="info-card">
                <div class="info-label">RGB</div>
                <div class="info-value">
                  {parseInt(item()!.color.slice(1, 3), 16)},
                  {parseInt(item()!.color.slice(3, 5), 16)},
                  {parseInt(item()!.color.slice(5, 7), 16)}
                </div>
              </div>
              <div class="info-card">
                <div class="info-label">HSL</div>
                <div class="info-value">Coming soon</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Item not found</div>
      )}
    </SsgoiTransition>
  );
}
