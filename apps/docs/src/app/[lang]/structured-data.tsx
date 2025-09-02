import { getServerTranslations } from "@/i18n/get-server-translations";

export async function StructuredData({ lang }: { lang: string }) {
  const t = await getServerTranslations("homeStructuredData", lang);
  const headerT = await getServerTranslations("header", lang);

  // WebSite schema with SearchAction and sitelinks
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SSGOI",
    url: "https://ssgoi.dev",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `https://ssgoi.dev/${lang}/docs?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    sameAs: ["https://github.com/MeurSpikyMoon/ssgoi"],
  };

  // SoftwareApplication schema
  const softwareStructuredData = {
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

  // Organization schema with navigation links
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SSGOI",
    url: "https://ssgoi.dev",
    logo: {
      "@type": "ImageObject",
      url: "https://ssgoi.dev/og.png",
    },
    sameAs: ["https://github.com/MeurSpikyMoon/ssgoi"],
  };

  // SiteNavigationElement for better sitelinks
  const navigationStructuredData = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: [headerT("docs"), headerT("blog"), "GitHub"],
    url: [
      `https://ssgoi.dev/${lang}/docs`,
      `https://ssgoi.dev/${lang}/blog`,
      "https://github.com/MeurSpikyMoon/ssgoi",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(navigationStructuredData),
        }}
      />
    </>
  );
}
