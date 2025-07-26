import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ssgoi.dev"),
  title: "SSGOI - Beautiful Page Transitions for Modern Web Apps",
  description:
    "SSGOI is a powerful page transition library that brings native app-like animations to the web. Create smooth, spring-based transitions with state preservation across all frameworks.",
  keywords:
    "page transitions, animation library, react transitions, vue transitions, svelte transitions, spring animations, view transitions, web animations, ssgoi",
  authors: [{ name: "MeurSyphus" }],
  creator: "MeurSyphus",
  publisher: "SSGOI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-precomposed.png",
    },
  },
  manifest: "/manifest.json",
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
    locale: "en_US",
    images: [
      {
        url: "https://ssgoi.dev/og.png",
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
    images: ["https://ssgoi.dev/og.png"],
    creator: "@ssgoi",
  },
  alternates: {
    canonical: "https://ssgoi.dev",
    languages: {
      "en-US": "https://ssgoi.dev/en",
      "ko-KR": "https://ssgoi.dev/ko",
      "ja-JP": "https://ssgoi.dev/ja",
      "zh-CN": "https://ssgoi.dev/zh",
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
