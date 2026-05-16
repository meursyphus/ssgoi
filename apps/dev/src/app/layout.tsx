import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ssgoi dev",
  description: "Mobile transition / animation playground for ssgoi.",
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
