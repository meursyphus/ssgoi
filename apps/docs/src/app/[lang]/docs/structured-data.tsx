import { getServerTranslations } from "@/i18n/get-server-translations";

interface DocNavigationLink {
  title: string;
  path: string;
}

export async function DocsStructuredData({
  title,
  description,
  url,
  lang,
  breadcrumbs,
  prevDoc,
  nextDoc,
}: {
  title: string;
  description?: string;
  url: string;
  lang: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  prevDoc?: DocNavigationLink | null;
  nextDoc?: DocNavigationLink | null;
}) {
  const t = await getServerTranslations("docsStructuredData", lang);
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description: description || `${t("defaultDescription")} ${title}`,
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
      name: t("siteName"),
      url: "https://ssgoi.dev",
    },
  };

  // BreadcrumbList schema
  const breadcrumbSchema = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@id": crumb.url,
        name: crumb.name
      }
    }))
  } : null;

  // Related pages schema
  const relatedPages = [];
  if (prevDoc) {
    relatedPages.push({
      "@type": "TechArticle",
      headline: prevDoc.title,
      url: `https://ssgoi.dev/${lang}/docs/${prevDoc.path}`,
      position: "previous"
    });
  }
  if (nextDoc) {
    relatedPages.push({
      "@type": "TechArticle",
      headline: nextDoc.title,
      url: `https://ssgoi.dev/${lang}/docs/${nextDoc.path}`,
      position: "next"
    });
  }

  const relatedPagesSchema = relatedPages.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Related Documentation",
    itemListElement: relatedPages.map((page, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: page
    }))
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {relatedPagesSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(relatedPagesSchema) }}
        />
      )}
    </>
  );
}