import type { Metadata } from "next";

export const SITE_URL = "https://ssgoi.dev";
export const SITE_NAME = "SSGOI";
export const SITE_TITLE = "SSGOI — Native page transitions on the web";
export const SITE_DESCRIPTION =
  "Router-agnostic page transitions for React, Svelte, Vue, Solid, and Angular. Built on the Web Animations API with spring physics and state preservation.";

/** The single shared social-preview image. Referenced by every page's OG + Twitter card. */
export const OG_IMAGE = {
  url: "/og.png",
  width: 512,
  height: 279,
  alt: SITE_TITLE,
};

/**
 * Build a complete openGraph object. Always includes the shared image so it
 * survives Next's shallow per-segment metadata merge (a page that defines its
 * own `openGraph` replaces the parent's entirely — including any image).
 * Omit `title`/`description` to let Next inherit them from the page metadata.
 */
export function buildOpenGraph(params: {
  path: string;
  title?: string;
  description?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}): NonNullable<Metadata["openGraph"]> {
  return {
    type: params.type ?? "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: params.path,
    title: params.title,
    description: params.description,
    images: [OG_IMAGE],
    publishedTime: params.publishedTime,
    modifiedTime: params.modifiedTime,
    authors: params.authors,
    tags: params.tags,
  } as NonNullable<Metadata["openGraph"]>;
}

/** Shared Twitter card config. Pages omit `twitter` and inherit this from the root layout. */
export const twitterMeta: NonNullable<Metadata["twitter"]> = {
  card: "summary_large_image",
  creator: "@ssgoi",
  images: [OG_IMAGE.url],
};

export const GITHUB_URL = "https://github.com/meursyphus/ssgoi";
export const NPM_URL = "https://www.npmjs.com/package/@ssgoi/react";
export const AUTHOR = {
  name: "MeurSyphus",
  url: "https://github.com/MeurSyphus",
};

type Schema = Record<string, unknown>;

export const organizationSchema: Schema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/ssgoi-logo.png`,
  sameAs: [GITHUB_URL, NPM_URL],
};

export const websiteSchema: Schema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
};

export const softwareApplicationSchema: Schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  softwareRequirements: "React, Svelte, Vue, Solid, or Angular",
  author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
  license: "https://opensource.org/licenses/MIT",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  sameAs: [GITHUB_URL, NPM_URL],
};

type Crumb = { name: string; path: string };

export function breadcrumbSchema(crumbs: Crumb[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}

type QA = { question: string; answer: string };

export function faqSchema(qas: QA[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qas.map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: { "@type": "Answer", text: qa.answer },
    })),
  };
}
