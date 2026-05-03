import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/layout/header";
import { ConsoleWelcome } from "@/components/console-welcome";
import { createSEOMetadata } from "@/lib/seo-metadata";
import { SsgoiProvider } from "@/components/layout/ssgoi";
import { StructuredData } from "./structured-data";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  return createSEOMetadata({});
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <StructuredData />
        <ConsoleWelcome />
        <Header />
        <main className="relative z-0 overflow-hidden">
          <SsgoiProvider>{children}</SsgoiProvider>
        </main>
        <Analytics />
      </body>
    </html>
  );
}
