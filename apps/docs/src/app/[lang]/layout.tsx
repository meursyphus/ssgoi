import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Header } from "@/components/layout/header";
import TranslationsProvider from "@/i18n/translations-provider";
import { StructuredData } from "./structured-data";
import { ConsoleWelcome } from "@/components/console-welcome";
import { createSEOMetadata } from "@/lib/seo-metadata";
import { SsgoiProvider } from "@/components/layout/ssgoi";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  return createSEOMetadata({}, lang);
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <TranslationsProvider lang={lang}>
          <StructuredData lang={lang} />
          <ConsoleWelcome />

          <Header />
          <main className="relative z-0 overflow-hidden">
            <SsgoiProvider>{children}</SsgoiProvider>
          </main>
        </TranslationsProvider>
      </body>
    </html>
  );
}
