import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ssgoi.meursyphus.dev"),
  title: "SSGOI Documentation",
  description:
    "A powerful spring-based animation framework for modern web applications with state preservation",
  keywords: "react, svelte, animation, spring, transition, documentation",
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
    title: "SSGOI Documentation",
    description:
      "Learn how to use SSGOI for smooth, spring-based animations in your web apps.",
    type: "website",
    url: "https://ssgoi.meursyphus.dev",
    siteName: "SSGOI",
  },
  twitter: {
    card: "summary_large_image",
    title: "SSGOI Documentation",
    description:
      "Learn how to use SSGOI for smooth, spring-based animations in your web apps.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
