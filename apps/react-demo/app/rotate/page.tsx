"use client";

import { SsgoiTransition } from "@ssgoi/react";
import Link from "next/link";

export default function RotatePage() {
  return (
    <SsgoiTransition id="/rotate">
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Hero Rotate Demo
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            marginBottom: "3rem",
            textAlign: "center",
            maxWidth: "600px",
            lineHeight: "1.6",
          }}
        >
          This page demonstrates the enhanced hero rotate transition with
          dramatic tunnel emergence effect and staggered timing phases:
        </p>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            padding: "2rem",
            borderRadius: "12px",
            marginBottom: "3rem",
            backdropFilter: "blur(10px)",
          }}
        >
          <ul
            style={{
              listStyle: "none",
              padding: "0",
              margin: "0",
            }}
          >
            <li style={{ marginBottom: "1rem" }}>
              ✨ Previous page fades out smoothly
            </li>
            <li style={{ marginBottom: "1rem" }}>
              🔥 Page emerges from tiny dot with 45° rotation
            </li>
            <li style={{ marginBottom: "1rem" }}>
              📈 Ultra-slow scaling growth (0-70%)
            </li>
            <li style={{ marginBottom: "1rem" }}>
              🔄 Rotation starts at 70% progress
            </li>
            <li style={{ marginBottom: "1rem" }}>
              ⚡ Final dramatic expansion with glow effect (80-100%)
            </li>
          </ul>
        </div>

        <Link
          href="/"
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            color: "white",
            padding: "1rem 2rem",
            borderRadius: "8px",
            textDecoration: "none",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            transition: "all 0.2s ease",
            fontSize: "1.1rem",
            fontWeight: "600",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          ← Back to Home
        </Link>
      </div>
    </SsgoiTransition>
  );
}
