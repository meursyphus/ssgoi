import type { Metadata } from "next";
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
      <body className="min-h-full">{children}</body>
    </html>
  );
}
