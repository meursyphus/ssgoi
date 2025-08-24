import { Metadata } from "next";
import { getServerTranslations } from "@/i18n/get-server-translations";

interface SEOMetadataOptions {
  title?: string;
  description?: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  images?: Array<{
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  }>;
  type?: "website" | "article";
  url?: string;
  locale?: string;
  siteName?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  keywords?: string[];
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    expirationTime?: string;
    authors?: string[];
    section?: string;
    tags?: string[];
  };
  robots?: {
    index?: boolean;
    follow?: boolean;
    googleBot?: {
      index?: boolean;
      follow?: boolean;
    };
  };
  canonical?: string;
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
}

const DEFAULT_METADATA = {
  siteName: "SSGOI",
  image: {
    url: "/og.png",
    width: 1200,
    height: 630,
    alt: "SSGOI - Universal Page Transition Library",
  },
  twitterCard: "summary_large_image" as const,
  baseUrl: "https://ssgoi.dev",
};

export async function createSEOMetadata(options: SEOMetadataOptions = {}, lang: string = "en"): Promise<Metadata> {
  const {
    title,
    description,
    image = DEFAULT_METADATA.image,
    images,
    type = "website",
    url,
    locale,
    siteName,
    publishedTime,
    modifiedTime,
    authors,
    tags,
    keywords,
    article,
    robots,
    canonical,
    alternates,
  } = options;

  // Get translations for default values
  const t = await getServerTranslations("metadata", lang);
  
  // Use provided values or fall back to translated defaults
  const finalTitle = title || t("title");
  const finalDescription = description || t("description");
  const finalSiteName = siteName || t("og.siteName");
  const finalLocale = locale || getLocaleFromLang(lang);
  const finalKeywords = keywords || (t("keywords") as unknown as string[]);

  // Prepare images array
  const ogImages = images || [image];
  const processedImages = ogImages.map(img => ({
    url: img.url.startsWith("http") ? img.url : `${DEFAULT_METADATA.baseUrl}${img.url}`,
    width: img.width || DEFAULT_METADATA.image.width,
    height: img.height || DEFAULT_METADATA.image.height,
    alt: img.alt || DEFAULT_METADATA.image.alt,
  }));

  const metadata: Metadata = {
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      type,
      siteName: finalSiteName,
      locale: finalLocale,
      images: processedImages,
    },
    twitter: {
      card: DEFAULT_METADATA.twitterCard,
      title: finalTitle,
      description: finalDescription,
      images: processedImages.map(img => img.url),
    },
    // LinkedIn uses Open Graph tags, but we can add extra metadata
    other: {
      "og:image:width": String(processedImages[0].width),
      "og:image:height": String(processedImages[0].height),
      "og:image:type": "image/png",
      "article:publisher": DEFAULT_METADATA.siteName,
    },
  };

  // Add robots metadata if provided
  if (robots) {
    metadata.robots = robots;
  }

  // Add alternates if provided
  if (alternates) {
    metadata.alternates = alternates;
  } else if (canonical) {
    metadata.alternates = { canonical };
  }

  // Add URL if provided
  if (url) {
    metadata.openGraph!.url = url.startsWith("http") 
      ? url 
      : `${DEFAULT_METADATA.baseUrl}${url}`;
  }

  // Add article-specific metadata to other tags
  if (type === "article") {
    const articleData = article || {
      publishedTime,
      modifiedTime,
      authors,
      tags,
    };
    
    // Add article metadata to other tags for platforms that support it
    if (articleData.publishedTime) {
      metadata.other!["article:published_time"] = articleData.publishedTime;
    }
    if (articleData.modifiedTime) {
      metadata.other!["article:modified_time"] = articleData.modifiedTime;
    }
    if (articleData.expirationTime) {
      metadata.other!["article:expiration_time"] = articleData.expirationTime;
    }
    if (articleData.authors && articleData.authors.length > 0) {
      articleData.authors.forEach((author, index) => {
        metadata.other![`article:author:${index}`] = author;
      });
    }
    if (articleData.section) {
      metadata.other!["article:section"] = articleData.section;
    }
    if (articleData.tags && articleData.tags.length > 0) {
      metadata.other!["article:tag"] = articleData.tags.join(",");
    }
  }

  return metadata;
}

// Helper function to get locale from language
function getLocaleFromLang(lang: string): string {
  const localeMap: Record<string, string> = {
    en: "en_US",
    ko: "ko_KR",
    ja: "ja_JP",
    zh: "zh_CN",
  };
  return localeMap[lang] || "en_US";
}

// Language-specific metadata helpers
export const LOCALE_METADATA = {
  en: {
    locale: "en_US",
    siteName: "SSGOI Documentation",
  },
  ko: {
    locale: "ko_KR",
    siteName: "SSGOI 문서",
  },
  ja: {
    locale: "ja_JP",
    siteName: "SSGOIドキュメント",
  },
  zh: {
    locale: "zh_CN",
    siteName: "SSGOI 文档",
  },
} as const;

export function getLocaleMetadata(lang: string) {
  return LOCALE_METADATA[lang as keyof typeof LOCALE_METADATA] || LOCALE_METADATA.en;
}