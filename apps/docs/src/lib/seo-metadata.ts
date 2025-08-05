import { Metadata } from "next";

interface SEOMetadataOptions {
  title?: string;
  description?: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  type?: "website" | "article";
  url?: string;
  locale?: string;
  siteName?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    expirationTime?: string;
    authors?: string[];
    section?: string;
    tags?: string[];
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

export function createSEOMetadata(options: SEOMetadataOptions): Metadata {
  const {
    title = "SSGOI - Universal Page Transition Library",
    description = "Bring native app-like transitions to your web applications with SSGOI. Works across all modern browsers.",
    image = DEFAULT_METADATA.image,
    type = "website",
    url,
    locale = "en_US",
    siteName = DEFAULT_METADATA.siteName,
    publishedTime,
    modifiedTime,
    authors,
    tags,
    article,
  } = options;

  // Ensure image URL is absolute
  const imageUrl = image.url.startsWith("http") 
    ? image.url 
    : `${DEFAULT_METADATA.baseUrl}${image.url}`;

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      type,
      siteName,
      locale,
      images: [
        {
          url: imageUrl,
          width: image.width || DEFAULT_METADATA.image.width,
          height: image.height || DEFAULT_METADATA.image.height,
          alt: image.alt || DEFAULT_METADATA.image.alt,
        },
      ],
    },
    twitter: {
      card: DEFAULT_METADATA.twitterCard,
      title,
      description,
      images: [imageUrl],
    },
    // LinkedIn uses Open Graph tags, but we can add extra metadata
    other: {
      "og:image:width": String(image.width || DEFAULT_METADATA.image.width),
      "og:image:height": String(image.height || DEFAULT_METADATA.image.height),
      "og:image:type": "image/png",
      "article:publisher": DEFAULT_METADATA.siteName,
    },
  };

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