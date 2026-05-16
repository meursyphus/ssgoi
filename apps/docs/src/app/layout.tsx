import type { Metadata } from "next";
import Script from "next/script";
import { DocsSsgoiProvider } from "@/components/docs-ssgoi-provider";
import "./globals.css";

const SITE_URL = "https://ssgoi.dev";
const SITE_NAME = "SSGOI";
const TITLE = "SSGOI — Native page transitions on the web";
const DESCRIPTION =
  "Router-agnostic page transitions for React, Svelte, Vue, Solid, and Angular. Built on the Web Animations API with spring physics and state preservation.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | SSGOI",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "page transitions",
    "view transitions",
    "web animations api",
    "spring animation",
    "react transitions",
    "svelte transitions",
    "vue transitions",
    "solid transitions",
    "angular transitions",
    "ssgoi",
  ],
  authors: [{ name: "MeurSyphus", url: "https://github.com/MeurSyphus" }],
  creator: "MeurSyphus",
  publisher: "SSGOI",
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 512,
        height: 279,
        alt: "SSGOI — Native page transitions on the web",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
    creator: "@ssgoi",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="relative z-0 min-h-full">
        <DocsSsgoiProvider>{children}</DocsSsgoiProvider>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}
