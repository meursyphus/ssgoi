import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SSGOI - Beautiful Page Transitions for Modern Web Apps",
  description:
    "SSGOI is a powerful page transition library that brings native app-like animations to the web. Create smooth, spring-based transitions with state preservation across all frameworks.",
  keywords:
    "page transitions, animation library, react transitions, vue transitions, svelte transitions, spring animations, view transitions, web animations, ssgoi",
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "SSGOI - Beautiful Page Transitions for Modern Web Apps",
    description:
      "Create stunning page transitions with SSGOI. Native app-like animations, state preservation, and framework-agnostic design. Works with React, Vue, Svelte, and more.",
    type: "website",
    url: "https://ssgoi.dev",
    siteName: "SSGOI",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "SSGOI - Page Transition Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SSGOI - Beautiful Page Transitions for Modern Web Apps",
    description:
      "Create stunning page transitions with SSGOI. Native app-like animations, state preservation, and framework-agnostic design.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
