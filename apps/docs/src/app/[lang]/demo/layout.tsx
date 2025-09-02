import React from "react";
import DemoWrapper from "./demo-wrapper";
import { Metadata } from "next";
import { SsgoiTransition } from "@ssgoi/react";

export const metadata: Metadata = {
  title: "Demo - SSGOI",
  description:
    "Experience beautiful page transitions with SSGOI. Interactive demo showcasing smooth animations and native app-like transitions for modern web applications.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "SSGOI Demo - Beautiful Page Transitions",
    description:
      "Try out SSGOI's smooth page transitions with our interactive demo. See hero animations, slide effects, and more.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SSGOI Demo - Beautiful Page Transitions",
    description:
      "Try out SSGOI's smooth page transitions with our interactive demo. See hero animations, slide effects, and more.",
    images: ["/og.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SsgoiTransition id="/ssgoi/demo">
      <DemoWrapper>{children}</DemoWrapper>
    </SsgoiTransition>
  );
}
