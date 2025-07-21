"use client";

import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { fade, hero } from "@ssgoi/react/view-transitions";
import "./globals.css";

const ssgoiConfig: SsgoiConfig = {
  transitions: [
    // Use hero transition between main and item detail pages
    { from: "/", to: "/item/*", transition: hero() },
    { from: "/item/*", to: "/", transition: hero() }
  ],
  defaultTransition: {
    in: async (element) => {
      return {
        spring: { stiffness: 300, damping: 150 },
        tick: (progress) => {
          element.style.opacity = progress.toString();
          element.style.transform = `translateY(${(1 - progress) * 20}px) scale(${0.98 + progress * 0.02})`;
        },
      };
    },
    out: async (element) => {
      return {
        spring: { stiffness: 300, damping: 150 },
        tick: (progress) => {
          element.style.opacity = progress.toString();
          element.style.transform = `translateY(${(1 - progress) * -20}px) scale(${0.98 + progress * 0.02})`;
        },
        prepare: (element) => {
          element.style.position = "absolute";
          element.style.width = "100%";
          element.style.top = "0";
          element.style.left = "0";
          element.style.margin = "0";
          element.style.padding = "0";
          element.style.boxSizing = "border-box";
        },
      };
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Ssgoi config={ssgoiConfig}>{children}</Ssgoi>
      </body>
    </html>
  );
}
