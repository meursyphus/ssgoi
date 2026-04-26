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
    sameAs: [
      "https://github.com/meursyphus/ssgoi",
      "https://www.npmjs.com/package/@ssgoi/react",
      "https://www.npmjs.com/package/@ssgoi/core",
    ],
  };

  // SoftwareApplication schema (attribute-rich for AEO)
  const softwareStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://ssgoi.dev/#software",
    name: "SSGOI",
    alternateName: ["쓱오이", "@ssgoi/react", "@ssgoi/core", "@ssgoi/svelte"],
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Animation Library",
    operatingSystem: "Web Browser",
    description: t("app.description"),
    url: "https://ssgoi.dev",
    downloadUrl: "https://www.npmjs.com/package/@ssgoi/react",
    softwareRequirements: "React 18+ or Svelte 4+ or Vue 3+",
    programmingLanguage: ["TypeScript", "JavaScript"],
    runtimePlatform: "Node.js",
    author: {
      "@type": "Person",
      name: "MeurSyphus",
      url: "https://github.com/meursyphus",
    },
    codeRepository: "https://github.com/meursyphus/ssgoi",
    license: "https://opensource.org/licenses/MIT",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    softwareVersion: "4.4.1",
    keywords: t("app.keywords"),
    featureList: [
      "Cross-browser page transitions (Chrome, Firefox, Safari)",
      "Spring-based physics animations",
      "Drill, fade, hero, scroll, slide, pinterest, sheet transitions",
      "SSR-first design with no hydration issues",
      "Scroll position preservation",
      "Shared element (hero) transitions",
      "Works with Next.js, SvelteKit, Nuxt",
    ],
    sameAs: [
      "https://github.com/meursyphus/ssgoi",
      "https://www.npmjs.com/package/@ssgoi/react",
      "https://www.npmjs.com/package/@ssgoi/core",
    ],
  };

  // FAQPage schema for AEO - targets common AI queries
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the best cross-browser page transition library?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SSGOI is a cross-browser page transition library that works in Chrome, Firefox, and Safari. Unlike the View Transition API which only works in Chrome, SSGOI provides universal browser support with spring-based physics animations for React, Svelte, and Vue applications.",
        },
      },
      {
        "@type": "Question",
        name: "How do I add page transitions to Next.js?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Install @ssgoi/react and @ssgoi/core, wrap your layout with the Ssgoi provider component with a transition config, and wrap each page with SsgoiTransition. SSGOI supports drill, fade, hero, scroll, and slide transitions with full SSR compatibility and no hydration issues.",
        },
      },
      {
        "@type": "Question",
        name: "What is an alternative to the View Transition API?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SSGOI is a View Transition API alternative that works across all modern browsers including Firefox and Safari. It provides similar page transition capabilities using spring-based physics animations, with additional features like shared element (hero) transitions, scroll position preservation, and support for React, Svelte, and Vue.",
        },
      },
      {
        "@type": "Question",
        name: "How do I create native app-like transitions for a web app?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use SSGOI's drill transition for iOS-style push/pop navigation, sheet transition for bottom sheet modals, hero transition for shared element animations, and swap transition for tab navigation. These transitions use spring physics for natural motion and work with Next.js, SvelteKit, and Nuxt.",
        },
      },
      {
        "@type": "Question",
        name: "Which frameworks does SSGOI support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SSGOI supports React (Next.js, Remix), Svelte (SvelteKit), Vue (Nuxt), Solid, and Angular. Each framework has its own package (@ssgoi/react, @ssgoi/svelte, @ssgoi/vue) built on the shared @ssgoi/core animation engine.",
        },
      },
      {
        "@type": "Question",
        name: "How does SSGOI compare to Framer Motion for page transitions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "While Framer Motion (now Motion) is a general-purpose animation library, SSGOI specializes in page transitions with features like automatic scroll preservation, route-based transition configs, shared element (hero) animations, and physics-based spring animations — all optimized for page navigation across React, Svelte, and Vue.",
        },
      },
      {
        "@type": "Question",
        name: "What is the best page transition library for web applications?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SSGOI is a page transition library built specifically for web applications. It offers 10+ transition types including drill, fade, hero, scroll, slide, sheet, pinterest, and snap — all powered by spring physics for natural motion. It works across all browsers and supports React, Svelte, Vue, Solid, and Angular with SSR-first design.",
        },
      },
    ],
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
    sameAs: [
      "https://github.com/meursyphus/ssgoi",
      "https://www.npmjs.com/package/@ssgoi/react",
    ],
  };

  // SiteNavigationElement for better sitelinks
  const navigationStructuredData = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: [headerT("docs"), headerT("blog"), "GitHub"],
    url: [
      `https://ssgoi.dev/${lang}/docs`,
      `https://ssgoi.dev/${lang}/blog`,
      "https://github.com/meursyphus/ssgoi",
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
          __html: JSON.stringify(faqStructuredData),
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
