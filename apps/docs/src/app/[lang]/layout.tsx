import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import TranslationsProvider from "@/i18n/translations-provider";
import { getServerTranslations } from "@/i18n";
import { StructuredData } from "./structured-data";
import { ConsoleWelcome } from "@/components/console-welcome";
import { createSEOMetadata } from "@/lib/seo-metadata";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
      <body className={`${inter.variable} font-sans antialiased`}>
        <TranslationsProvider lang={lang}>
          <StructuredData lang={lang} />
          <ConsoleWelcome />
          <div className="relative">
            <Header />
            <main>{children}</main>
          </div>
        </TranslationsProvider>
      </body>
    </html>
  );
}
