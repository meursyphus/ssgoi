"use client";

import Link from "next/link";
import { SsgoiTransition } from "@ssgoi/react";

export default function TextShapeDemo() {
  return (
    <SsgoiTransition id="/text-shape">
      <main
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "red",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Text + Shape Transition Demo
        </h1>
        <Link
          href="/"
          style={{
            padding: "1rem 2rem",
            background: "#667eea",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          홈으로 이동
        </Link>
      </main>
    </SsgoiTransition>
  );
}
