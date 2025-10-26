"use client";

import Link from "next/link";
import { SsgoiTransition } from "@ssgoi/react";

export default function TextShapeDemo() {
  const features = [
    {
      icon: "📝",
      title: "Text Slide Phase",
      description:
        "Multiple text strings appear sequentially in the center of the screen.",
      details:
        "A viewport masks the wrapper so that only the current text is visible, sliding horizontally as each new text appears.",
    },
    {
      icon: "⭕",
      title: "Shape Closing Phase",
      description:
        "After the final text, the overlay closes with a shape-based animation.",
      details:
        "Clip-path is animated into circle, square, or triangle forms, collapsing the overlay dramatically.",
    },
    {
      icon: "⚙️",
      title: "Physics Smoothness",
      description:
        "Spring physics (stiffness, damping) ensure smooth transitions.",
      details:
        "Animations run at 60fps using requestAnimationFrame and CSS transforms.",
    },
  ];

  const technicalSpecs = [
    {
      label: "Supported Shapes",
      value: "circle | square | triangle",
      description: "Closing animation types based on CSS clip-path.",
    },
    {
      label: "Text Duration",
      value: "1500ms (default)",
      description: "Duration each text stays before moving to the next.",
    },
    {
      label: "Spring Config",
      value: "stiffness: 70, damping: 30",
      description: "Physics tuning for natural animation feel.",
    },
    {
      label: "Custom Styling",
      value: "textStyle option",
      description: "Override font size, color, letter-spacing, etc.",
    },
  ];

  return (
    <SsgoiTransition id="/text-shape">
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #ff4e50 0%, #f9d423 50%, #e1f5c4 100%)",
          color: "#fff",
          padding: "2rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            margin: "0 auto 4rem",
            maxWidth: "800px",
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              marginBottom: "1.5rem",
              background: "linear-gradient(45deg, #fff, #f9d423, #ff4e50)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Text + Shape Transition
          </h1>
          <p style={{ fontSize: "1.2rem", opacity: 0.9, lineHeight: "1.6" }}>
            This demo shows a cinematic page transition: sequential text slides
            followed by a dramatic shape-based closing animation.
          </p>
        </div>

        {/* Animation Phases */}
        <div style={{ maxWidth: "1000px", margin: "0 auto 4rem" }}>
          <h2
            style={{
              fontSize: "2rem",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            Transition Phases
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  padding: "1.5rem",
                  borderRadius: "16px",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                  {f.icon}
                </div>
                <h3 style={{ marginBottom: "0.5rem" }}>{f.title}</h3>
                <p style={{ opacity: 0.9, marginBottom: "0.5rem" }}>
                  {f.description}
                </p>
                <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>{f.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Specs */}
        <div style={{ maxWidth: "800px", margin: "0 auto 4rem" }}>
          <h2
            style={{
              fontSize: "2rem",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            Technical Specifications
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {technicalSpecs.map((spec, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(0,0,0,0.3)",
                  padding: "1rem",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                  {spec.label}
                </div>
                <div
                  style={{
                    fontWeight: "600",
                    marginBottom: "0.3rem",
                  }}
                >
                  {spec.value}
                </div>
                <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                  {spec.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: "4rem",
            padding: "2rem",
            background: "rgba(0,0,0,0.2)",
            borderRadius: "16px",
            backdropFilter: "blur(8px)",
            maxWidth: "600px",
            margin: "4rem auto 0",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Demo Complete ✅
          </h2>
          <p style={{ marginBottom: "1.5rem", opacity: 0.9 }}>
            The Text + Shape transition blends sequential storytelling with
            shape-driven closure for a unique immersive effect.
          </p>
          <Link
            href="/"
            style={{
              background: "rgba(255,255,255,0.25)",
              color: "white",
              padding: "0.8rem 1.5rem",
              borderRadius: "10px",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.3)",
              transition: "all 0.3s ease",
              fontSize: "1rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.4)";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.25)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </SsgoiTransition>
  );
}
