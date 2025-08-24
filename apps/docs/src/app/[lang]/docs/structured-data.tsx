import { getServerTranslations } from "@/i18n/get-server-translations";

export async function DocsStructuredData({
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}