export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SSGOI",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description:
      "A powerful page transition library that brings native app-like animations to the web. Create smooth, spring-based transitions with state preservation across all frameworks.",
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
    keywords: [
      "page transitions",
      "animation library",
      "react transitions",
      "vue transitions",
      "svelte transitions",
      "spring animations",
      "view transitions",
      "web animations",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function DocsStructuredData({
  title,
  description,
  url,
  lang,
}: {
  title: string;
  description?: string;
  url: string;
  lang: string;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description: description || `Documentation for ${title}`,
    url: url,
    author: {
      "@type": "Person",
      name: "MeurSyphus",
    },
    publisher: {
      "@type": "Organization",
      name: "SSGOI",
      logo: {
        "@type": "ImageObject",
        url: "https://ssgoi.dev/og.png",
      },
    },
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString(),
    inLanguage: lang,
    isPartOf: {
      "@type": "WebSite",
      name: "SSGOI Documentation",
      url: "https://ssgoi.dev",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}