import { component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { SsgoiTransition } from "@ssgoi/qwik";

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
        style={{
          backgroundColor: item.color,
          minHeight: "100vh",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        data-hero-key={`color-${item.id}`}
      >
        <Link
          href="/"
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            padding: "0.5rem 1rem",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "8px",
            color: "white",
            textDecoration: "none",
          }}
        >
          ← Back
        </Link>

        <h1 style={{ fontSize: "3rem", color: "white", marginBottom: "1rem" }}>
          {item.name}
        </h1>
        <p style={{ fontSize: "1.5rem", color: "rgba(255,255,255,0.8)" }}>
          {item.color}
        </p>
      </div>
    </SsgoiTransition>
  );
});
