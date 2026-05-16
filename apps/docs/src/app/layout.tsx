import type { Metadata } from "next";
import Script from "next/script";
import { DocsSsgoiProvider } from "@/components/docs-ssgoi-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ssgoi.dev"),
  title: "SSGOI — Native page transitions on the web",
  description: "Router-agnostic page transitions. Built on Web Animations API.",
  manifest: "/manifest.json",
  openGraph: {
    title: "SSGOI — Native page transitions on the web",
    description:
      "Router-agnostic page transitions. Built on Web Animations API.",
    images: ["/og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="relative z-0 min-h-full">
        <DocsSsgoiProvider>{children}</DocsSsgoiProvider>
      </body>
    </html>
  );
}
