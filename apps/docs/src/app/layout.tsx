import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { DocsSsgoiProvider } from "@/components/docs-ssgoi-provider";
import { JsonLd } from "@/components/json-ld";
import { StateProvider } from "@/lib/state";
import {
  SITE_DESCRIPTION as DESCRIPTION,
  SITE_NAME,
  SITE_TITLE as TITLE,
  SITE_URL,
  buildOpenGraph,
  organizationSchema,
  twitterMeta,
  websiteSchema,
} from "@/lib/seo";
import "./globals.css";

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
    "qwik transitions",
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
  openGraph: buildOpenGraph({
    path: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
  }),
  twitter: twitterMeta,
  category: "technology",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="relative z-0 min-h-full">
        <JsonLd data={[organizationSchema, websiteSchema]} />
        <StateProvider>
          <DocsSsgoiProvider>{children}</DocsSsgoiProvider>
        </StateProvider>
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
