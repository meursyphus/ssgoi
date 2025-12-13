import { component$, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { SsgoiTransition, transition } from "@ssgoi/qwik";

const colors = [
  { id: 1, color: "#FF6B6B", name: "Coral" },
  { id: 2, color: "#4ECDC4", name: "Turquoise" },
  { id: 3, color: "#45B7D1", name: "Sky Blue" },
  { id: 4, color: "#96CEB4", name: "Sage" },
  { id: 5, color: "#FECA57", name: "Sunflower" },
  { id: 6, color: "#DDA0DD", name: "Plum" },
];

export default component$(() => {
  const showShapes = useSignal(true);
  const stiffness = useSignal(300);
  const damping = useSignal(30);

  return (
    <SsgoiTransition id="/">
      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          SSGOI Qwik Demo
        </h1>

        {/* Hero Transition Section */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Hero Transition
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "1rem",
            }}
          >
            {colors.map((item) => (
              <Link
                key={item.id}
                href={`/item/${item.id}`}
                style={{
                  backgroundColor: item.color,
                  padding: "2rem",
                  borderRadius: "12px",
                  textDecoration: "none",
                  color: "white",
                  fontWeight: "600",
                  textAlign: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                data-hero-key={`color-${item.id}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </section>

        {/* DOM Transition Section */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            DOM Transition
          </h2>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <label>
              Stiffness:
              <input
                type="number"
                value={stiffness.value}
                onInput$={(e) =>
                  (stiffness.value = Number(
                    (e.target as HTMLInputElement).value,
                  ))
                }
                style={{ width: "80px", marginLeft: "0.5rem" }}
              />
            </label>
            <label>
              Damping:
              <input
                type="number"
                value={damping.value}
                onInput$={(e) =>
                  (damping.value = Number((e.target as HTMLInputElement).value))
                }
                style={{ width: "80px", marginLeft: "0.5rem" }}
              />
            </label>
          </div>

          <button
            onClick$={() => (showShapes.value = !showShapes.value)}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              background: "#667eea",
              color: "white",
              cursor: "pointer",
              marginBottom: "1rem",
            }}
          >
            {showShapes.value ? "Hide Elements" : "Show Elements"}
          </button>

          <div
            style={{
              display: "flex",
              gap: "2rem",
              justifyContent: "center",
              minHeight: "150px",
              alignItems: "center",
            }}
          >
            {showShapes.value && (
              <>
                <div
                  ref={transition({
                    key: "fade",
                    in: (element) => ({
                      spring: {
                        stiffness: stiffness.value,
                        damping: damping.value,
                      },
                      tick: (progress) => {
                        element.style.opacity = progress.toString();
                      },
                    }),
                    out: (element) => ({
                      spring: {
                        stiffness: stiffness.value,
                        damping: damping.value,
                      },
                      tick: (progress) => {
                        element.style.opacity = progress.toString();
                      },
                    }),
                  })}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                />
                <div
                  ref={transition({
                    key: "scale-rotate",
                    in: (element) => ({
                      spring: {
                        stiffness: stiffness.value,
                        damping: damping.value,
                      },
                      css: (progress) => ({
                        transform: `scale(${progress}) rotate(${progress * 360}deg)`,
                        opacity: progress.toString(),
                      }),
                    }),
                    out: (element) => ({
                      spring: {
                        stiffness: stiffness.value,
                        damping: damping.value,
                      },
                      css: (progress) => ({
                        transform: `scale(${progress}) rotate(${progress * 360}deg)`,
                        opacity: progress.toString(),
                      }),
                    }),
                  })}
                  style={{
                    width: "80px",
                    height: "80px",
                    background:
                      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                  }}
                />
              </>
            )}
          </div>
        </section>
      </div>
    </SsgoiTransition>
  );
});
