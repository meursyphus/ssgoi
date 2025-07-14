"use client";

import { Ssgoi, type SsgoiConfig } from "@meursyphus/ssgoi-react";
import Link from "next/link";
import { fade } from "./transitions";

const ssgoiConfig: SsgoiConfig = {
  transitions: [],
  defaultTransition: {
    in: async (element) => {
      return {
        spring: { stiffness: 300, damping: 150 },
        tick: (progress) => {
          element.style.opacity = progress.toString();
        },
      };
    },
    out: async (element) => {
      element.style.position = "absolute";
      element.style.width = "100%";
      element.style.top = "0";
      element.style.left = "0";
      element.style.margin = "0";
      element.style.padding = "0";
      element.style.boxSizing = "border-box";
      return {
        spring: { stiffness: 300, damping: 150 },
        tick: (progress) => {
          element.style.opacity = progress.toString();
        },
      };
    },
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", padding: "20px" }}>
      <nav style={{ marginBottom: "40px" }}>
        <Link href="/demo" style={{ marginRight: "20px" }}>
          Home
        </Link>
        <Link href="/demo/about" style={{ marginRight: "20px" }}>
          About
        </Link>
        <Link href="/demo/contact">Contact</Link>
      </nav>
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          background: "red",
        }}
      >
        <Ssgoi config={ssgoiConfig}>{children}</Ssgoi>
      </div>
    </div>
  );
}
