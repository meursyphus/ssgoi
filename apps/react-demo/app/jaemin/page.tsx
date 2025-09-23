"use client";

import { SsgoiTransition } from "@ssgoi/react";
import Link from "next/link";

export default function RotatePage() {
  // Generate content sections for scrolling test
  const features = [
    {
      icon: "🔥",
      title: "Entry Phase (0-5%)",
      description:
        "Page emerges from tiny dot with 45° rotation. The element starts at scale 0.01 and maintains full rotation angle.",
      details:
        "This phase creates the initial 'portal' effect where the new page appears to emerge from a single point in space.",
    },
    {
      icon: "📈",
      title: "Trans Phase (5-80%)",
      description:
        "Ultra-slow scaling growth using nonic easing curve. The page gradually grows while maintaining rotation.",
      details:
        "This extended phase allows users to perceive the transition and builds anticipation for the final reveal.",
    },
    {
      icon: "⚡",
      title: "Emergence Phase (80-100%)",
      description:
        "Final dramatic expansion with glow effects, border radius changes, and rotation completion.",
      details:
        "The climactic phase where all visual effects combine to create a dramatic reveal of the final page.",
    },
  ];

  const technicalSpecs = [
    {
      label: "Spring Physics",
      value: "stiffness: 50, damping: 30",
      description: "Carefully tuned for cinematic timing",
    },
    {
      label: "Initial Rotation",
      value: "45 degrees",
      description: "Optimized angle for visual impact",
    },
    {
      label: "Scale Range",
      value: "0.01 → 1.0",
      description: "100x scaling for dramatic effect",
    },
    {
      label: "Performance",
      value: "60fps on modern devices",
      description: "CSS transforms for optimal performance",
    },
  ];

  return (
    <SsgoiTransition id="/jaemin">
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          color: "white",
          padding: "2rem",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "4rem",
            maxWidth: "800px",
            margin: "0 auto 4rem",
          }}
        >
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: "bold",
              marginBottom: "1.5rem",
              background: "linear-gradient(45deg, #ffffff, #f093fb, #667eea)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Jaemin Transition
          </h1>
          <p
            style={{
              fontSize: "1.3rem",
              marginBottom: "2rem",
              opacity: 0.9,
              lineHeight: "1.6",
            }}
          >
            Experience dramatic tunnel emergence with three-phase animation
            timing. This page demonstrates the transition performance with
            complex layouts and extensive content.
          </p>
          <div
            style={{
              display: "inline-block",
              background: "rgba(255, 255, 255, 0.1)",
              padding: "1rem 2rem",
              borderRadius: "50px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            Created by Jaemin ✨
          </div>
        </div>

        {/* Animation Phases */}
        <div style={{ maxWidth: "1000px", margin: "0 auto 4rem" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              textAlign: "center",
              marginBottom: "3rem",
            }}
          >
            Animation Phases
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {features.map((feature, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "2rem",
                  borderRadius: "16px",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    marginBottom: "1rem",
                    opacity: 0.9,
                    lineHeight: "1.5",
                  }}
                >
                  {feature.description}
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    opacity: 0.7,
                    fontStyle: "italic",
                  }}
                >
                  {feature.details}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Specifications */}
        <div style={{ maxWidth: "800px", margin: "0 auto 4rem" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              textAlign: "center",
              marginBottom: "3rem",
            }}
          >
            Technical Specifications
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {technicalSpecs.map((spec, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(0, 0, 0, 0.2)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.9rem",
                    opacity: 0.7,
                    marginBottom: "0.5rem",
                  }}
                >
                  {spec.label}
                </div>
                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                  }}
                >
                  {spec.value}
                </div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                  {spec.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Test Section */}
        <div style={{ maxWidth: "1000px", margin: "0 auto 4rem" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              textAlign: "center",
              marginBottom: "3rem",
            }}
          >
            Performance Testing
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                style={{
                  background: `linear-gradient(135deg, hsl(${i * 60 + 200}, 70%, 60%), hsl(${i * 60 + 260}, 70%, 60%))`,
                  padding: "2rem",
                  borderRadius: "16px",
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    right: "0",
                    bottom: "0",
                    background: "rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(1px)",
                  }}
                />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>
                    Test Component {i + 1}
                  </h3>
                  <p style={{ marginBottom: "1rem", opacity: 0.9 }}>
                    This component tests transition performance with gradient
                    backgrounds, multiple layers, and complex visual effects.
                  </p>
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                  >
                    {["CSS", "Transform", "Gradient", "Blur"].map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: "0.3rem 0.8rem",
                          background: "rgba(255, 255, 255, 0.2)",
                          borderRadius: "20px",
                          fontSize: "0.8rem",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Long Content Section */}
        <div style={{ maxWidth: "800px", margin: "0 auto 4rem" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              textAlign: "center",
              marginBottom: "3rem",
            }}
          >
            Extensive Content Test
          </h2>
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              style={{
                marginBottom: "3rem",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "2rem",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.8rem",
                  marginBottom: "1rem",
                  color: "#f093fb",
                }}
              >
                Content Block {i + 1}
              </h3>
              <p
                style={{
                  marginBottom: "1.5rem",
                  lineHeight: "1.7",
                  opacity: 0.9,
                }}
              >
                This is extensive content designed to test the Jaemin transition
                with complex layouts. The transition maintains smooth 60fps
                performance even with multiple DOM elements, gradients, backdrop
                filters, and nested components. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua.
              </p>
              <div
                style={{
                  height: "150px",
                  background: `linear-gradient(45deg, hsl(${i * 40 + 180}, 70%, 50%), hsl(${i * 40 + 240}, 70%, 50%))`,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                Visual Element {i + 1}
              </div>
              <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                Additional content to increase page complexity and DOM element
                count. The Jaemin transition handles this extensive content
                smoothly.
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: "4rem",
            padding: "3rem 2rem",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            maxWidth: "600px",
            margin: "4rem auto 0",
          }}
        >
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            Performance Test Complete ✅
          </h2>
          <p style={{ marginBottom: "2rem", opacity: 0.9, lineHeight: "1.6" }}>
            This page demonstrates the Jaemin transition working smoothly with
            extensive content, multiple visual effects, and complex DOM
            structures.
          </p>
          <Link
            href="/"
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
              padding: "1rem 2rem",
              borderRadius: "12px",
              textDecoration: "none",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              transition: "all 0.3s ease",
              fontSize: "1.1rem",
              fontWeight: "600",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
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
