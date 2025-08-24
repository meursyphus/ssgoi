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

export function BlogListStructuredData({
  posts,
  lang,
}: {
  posts: Array<{
    slug: string;
    title: string;
    description?: string;
    date?: string;
    author?: string;
    thumbnail?: string;
  }>;
  lang: string;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "SSGOI Blog",
    description: "Latest updates, tutorials, and insights about SSGOI page transition library",
    url: `https://ssgoi.dev/${lang}/blog`,
    inLanguage: lang,
    publisher: {
      "@type": "Organization",
      name: "SSGOI",
      logo: {
        "@type": "ImageObject",
        url: "https://ssgoi.dev/og.png",
      },
    },
    blogPost: posts.map(post => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: `https://ssgoi.dev/${lang}/blog/${post.slug}`,
      datePublished: post.date,
      author: {
        "@type": "Person",
        name: post.author || "MeurSyphus",
      },
      image: post.thumbnail,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function BlogPostStructuredData({
  post,
  lang,
}: {
  post: {
    slug: string;
    title: string;
    description?: string;
    date?: string;
    author?: string;
    thumbnail?: string;
    tags?: string[];
  };
  lang: string;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || `Read about ${post.title} on SSGOI Blog`,
    url: `https://ssgoi.dev/${lang}/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author || "MeurSyphus",
    },
    publisher: {
      "@type": "Organization",
      name: "SSGOI",
      logo: {
        "@type": "ImageObject",
        url: "https://ssgoi.dev/og.png",
      },
    },
    image: post.thumbnail ? {
      "@type": "ImageObject",
      url: post.thumbnail,
    } : undefined,
    keywords: post.tags?.join(", "),
    inLanguage: lang,
    isPartOf: {
      "@type": "Blog",
      name: "SSGOI Blog",
      url: `https://ssgoi.dev/${lang}/blog`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}