"use client";

import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { hero, jaemin, jaeminReverse } from "@ssgoi/react/view-transitions";
import "./globals.css";

const ssgoiConfig: SsgoiConfig = {
  transitions: [
    // Use hero transition between main and item detail pages
    {
      from: "/",
      to: "/item/*",
      transition: hero({ spring: { stiffness: 5, damping: 1 } }),
      symmetric: true,
    },
    // Jaemin transition for jaemin demo - forward
    {
      from: "/",
      to: "/jaemin",
      transition: jaemin(),
    },
    // Jaemin reverse transition - backward
    {
      from: "/jaemin",
      to: "/",
      transition: jaeminReverse(),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Ssgoi config={ssgoiConfig}>
          <div
            style={{ position: "relative", minHeight: "100vh", width: "100%" }}
          >
            {children}
          </div>
        </Ssgoi>
      </body>
    </html>
  );
}
