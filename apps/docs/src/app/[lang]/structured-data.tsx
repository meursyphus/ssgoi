import { getServerTranslations } from "@/i18n/get-server-translations";

export async function StructuredData({ lang }: { lang: string }) {
  const t = await getServerTranslations("homeStructuredData", lang);
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SSGOI",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description: t("app.description"),
    url: "https://ssgoi.dev",
    author: {
      "@type": "Person",
      name: "MeurSyphus",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "1",
    },
    softwareVersion: "1.0.0",
    keywords: t("app.keywords"),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}