import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import TranslationsProvider from "@/i18n/translations-provider";
import { getServerTranslations } from "@/i18n";
import { NavigationProvider } from "@/contexts/navigation-context";

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
  const t = await getServerTranslations("metadata", lang);
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("og.title"),
      description: t("og.description"),
      siteName: t("og.siteName"),
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "SSGOI - Page Transition Library",
        },
      ],
    },
    twitter: {
      title: t("twitter.title"),
      description: t("twitter.description"),
      images: ["/og.png"],
    },
  };
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
          <NavigationProvider navigation={null}>
            <div className="relative min-h-screen">
              <Header />
              <main>{children}</main>
            </div>
          </NavigationProvider>
        </TranslationsProvider>
      </body>
    </html>
  );
}
