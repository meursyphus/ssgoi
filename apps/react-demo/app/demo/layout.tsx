"use client";

import { Ssgoi, type SsgoiConfig } from "@meursyphus/ssgoi-react";
import Link from "next/link";
import { fade } from "./transitions";

const ssgoiConfig: SsgoiConfig = {
  transitions: [],
  defaultTransition: fade(),
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
      <div style={{ position: "relative" }}>
        <Ssgoi config={ssgoiConfig}>{children}</Ssgoi>
      </div>
    </div>
  );
}
